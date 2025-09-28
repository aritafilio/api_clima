<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f8111109a (encriptacion)
// Reemplaza Firebase por JWT propio
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

const TOKEN_KEY = 'app.token';
const USER_KEY = 'app.user';

function _saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const u = localStorage.getItem(USER_KEY);
  return u ? JSON.parse(u) : null;
}

export async function registerUser(email, password) {
  try {
    await axios.post(`${API_BASE}/register`, { email, password });
    const { data } = await axios.post(`${API_BASE}/login`, { email, password });
    if (data?.token) {
      _saveSession(data.token, data.user);
      _notify();
      return { success: true, user: data.user };
    }
    return { success: false, error: 'No se recibió token' };
  } catch (error) {
    return { success: false, error: error?.response?.data?.error || 'Error al registrar' };
  }
}

export async function loginUser(email, password) {
  try {
    const { data } = await axios.post(`${API_BASE}/login`, { email, password });
    if (data?.token) {
      _saveSession(data.token, data.user);
      _notify();
      return { success: true, user: data.user };
    }
    return { success: false, error: 'No se recibió token' };
  } catch (error) {
    return { success: false, error: error?.response?.data?.error || 'Error de login' };
  }
}

export async function logoutUser() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    _notify();
    return { success: true };
  } catch {
    return { success: false, error: 'No se pudo cerrar sesión' };
  }
}

// Emula onAuthStateChanged de Firebase
const listeners = new Set();
export function onAuthStateChange(callback) {
  listeners.add(callback);
  callback(getUser()); // dispara con el estado actual
  return () => listeners.delete(callback);
}

function _notify() {
  const user = getUser();
  listeners.forEach(cb => cb(user));
}
<<<<<<< HEAD
=======
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './config';

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
>>>>>>> 1282151dd832ab1f839c20cd8ea4bff7b75e4477
=======
>>>>>>> f8111109a (encriptacion)
