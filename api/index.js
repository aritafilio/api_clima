require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '100kb' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(['/login','/register'], authLimiter);

const users = []; // { email, passwordHash }

const { PORT=3001, JWT_SECRET, JWT_EXPIRES='1h', OPENWEATHER_API_KEY } = process.env;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET in .env');

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isValidPassword = (p) => typeof p === 'string' && p.length >= 6;

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!isValidEmail(email) || !isValidPassword(password)) {
      return res.status(400).json({ error: 'Email o contraseña inválidos' });
    }
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'Usuario ya existe' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ email, passwordHash });
    return res.status(201).json({ message: 'Usuario creado' });
  } catch {
    return res.status(500).json({ error: 'Error al registrar' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Credenciales inválidas' });
  const token = createToken({ email });
  return res.json({ token, user: { email } });
});

app.get('/me', authMiddleware, (req, res) => {
  res.json({ email: req.user.email });
});

app.get('/weather', authMiddleware, async (req, res) => {
  try {
    const city = String(req.query.q || 'Tehuacan');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;
    const { data } = await axios.get(url, { timeout: 8000 });
    res.json({
      name: data?.name,
      temp: data?.main?.temp,
      desc: data?.weather?.[0]?.description
    });
  } catch (e) {
    const status = e?.response?.status || 500;
    res.status(status).json({ error: 'Fallo al consultar clima' });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
