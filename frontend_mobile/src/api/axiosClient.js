import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your local IP or backend URL
const API_URL = 'http://192.168.1.18:8000/api/'; // Example

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('sf_mb_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('Error getting token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (error.config && !error.config.url.includes('auth/login/')) {
        await AsyncStorage.removeItem('sf_mb_token');
        // Handle logout navigation on the app side
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
