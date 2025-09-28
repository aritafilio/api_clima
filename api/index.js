require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '100kb' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(['/login','/register'], authLimiter);


const users = [];

const { PORT=3001, JWT_SECRET, JWT_EXPIRES='1h', OPENWEATHER_API_KEY, CRYPTO_SECRET_KEY } = process.env;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET in .env');
if (!CRYPTO_SECRET_KEY) throw new Error('Missing CRYPTO_SECRET_KEY in .env (32 bytes hex)');

// ===== Funciones de cifrado =====
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(CRYPTO_SECRET_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(CRYPTO_SECRET_KEY, 'hex'), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Descifra todos los campos sensibles en el token
    req.user = { email: decrypt(decoded.email), additionalData: decoded.additionalData || {} };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}


const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isValidPassword = (p) => typeof p === 'string' && p.length >= 6;


app.post('/register', async (req, res) => {
  try {
    const { email, password, additionalData={} } = req.body || {};
    if (!isValidEmail(email) || !isValidPassword(password)) {
      return res.status(400).json({ error: 'Email o contraseña inválidos' });
    }
    if (users.find(u => decrypt(u.email) === email)) {
      return res.status(409).json({ error: 'Usuario ya existe' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const encryptedEmail = encrypt(email);

    // Cifrar todos los campos adicionales si existen
    const encryptedAdditionalData = {};
    for (const key in additionalData) {
      encryptedAdditionalData[key] = encrypt(String(additionalData[key]));
    }

    users.push({ email: encryptedEmail, passwordHash, additionalData: encryptedAdditionalData });
    return res.status(201).json({ message: 'Usuario creado' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al registrar' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => decrypt(u.email) === email);
  if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Credenciales inválidas' });

  // Crear token con email cifrado y datos adicionales cifrados
  const tokenPayload = { email: encrypt(email), additionalData: user.additionalData };
  const token = createToken(tokenPayload);

  // Descifrar los datos antes de enviarlos al cliente
  const decryptedData = {};
  for (const key in user.additionalData) {
    decryptedData[key] = decrypt(user.additionalData[key]);
  }

  return res.json({ token, user: { email, additionalData: decryptedData } });
});

app.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
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
