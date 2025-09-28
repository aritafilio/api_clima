import axios from 'axios';
<<<<<<< HEAD
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
=======

const API_KEY = '7b3b9c63037ddd97be0175dc1c71625e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', 
        lang: 'es' 
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { 
        success: false, 
        error: error.response.data.message || 'Error al obtener datos del clima' 
      };
    } else if (error.request) {
      return { 
        success: false, 
        error: 'Sin conexión a internet. Verifica tu conexión.' 
      };
    } else {
      return { 
        success: false, 
        error: 'Error inesperado al obtener datos del clima' 
      };
>>>>>>> 1282151dd832ab1f839c20cd8ea4bff7b75e4477
    }
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
<<<<<<< HEAD
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
=======
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'es'
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { 
        success: false, 
        error: error.response.data.message || 'Error al obtener datos del clima' 
      };
    } else if (error.request) {
      return { 
        success: false, 
        error: 'Sin conexión a internet. Verifica tu conexión.' 
      };
    } else {
      return { 
        success: false, 
        error: 'Error inesperado al obtener datos del clima' 
      };
>>>>>>> 1282151dd832ab1f839c20cd8ea4bff7b75e4477
    }
  }
};

<<<<<<< HEAD
=======
export const getForecast = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'es'
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { 
        success: false, 
        error: error.response.data.message || 'Error al obtener pronóstico del clima' 
      };
    } else if (error.request) {
      return { 
        success: false, 
        error: 'Sin conexión a internet. Verifica tu conexión.' 
      };
    } else {
      return { 
        success: false, 
        error: 'Error inesperado al obtener pronóstico del clima' 
      };
    }
  }
};
>>>>>>> 1282151dd832ab1f839c20cd8ea4bff7b75e4477
