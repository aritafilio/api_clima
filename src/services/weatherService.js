import axios from 'axios';
import { getToken } from '../firebase/auth';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

export const getWeatherByCity = async (city) => {
  try {
    const token = getToken();
    const resp = await axios.get(`${API_BASE}/weather`, {
      params: { q: city },
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
      timeout: 8000
    });
    // Adaptamos al shape que ya usan tus componentes (name, main.temp, weather[0].description)
    return { success: true, data: { 
      name: resp.data.name, 
      main: { temp: resp.data.temp }, 
      weather: [{ description: resp.data.desc }] 
    }};
  } catch (error) {
    if (error.response) {
      return { success: false, error: error.response.data?.error || 'Error al obtener datos del clima' };
    } else if (error.request) {
      return { success: false, error: 'Sin conexión a internet. Verifica tu conexión.' };
    } else {
      return { success: false, error: 'Ocurrió un error inesperado.' };
    }
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const token = getToken();
    const resp = await axios.get(`${API_BASE}/weather/coords`, {
      params: { lat, lon },
      headers: { Authorization: token ? `Bearer ${token}` : undefined },
      timeout: 8000
    });
    // Mantener el mismo shape que espera tu UI:
    return { success: true, data: {
      name: resp.data.name,
      main: { temp: resp.data.temp },
      weather: [{ description: resp.data.desc }]
    }};
  } catch (error) {
    if (error.response) {
      return { success: false, error: error.response.data?.error || 'Error al obtener clima por coordenadas' };
    } else if (error.request) {
      return { success: false, error: 'Sin conexión a internet. Verifica tu conexión.' };
    } else {
      return { success: false, error: 'Ocurrió un error inesperado.' };
    }
  }
};

