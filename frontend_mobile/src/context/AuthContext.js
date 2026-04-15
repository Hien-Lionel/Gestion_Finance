import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../api/axiosClient';
import { jwtDecode } from 'jwt-decode'; // Will need to install this or parse manually

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = await AsyncStorage.getItem('sf_mb_token');
      const userInfoStr = await AsyncStorage.getItem('sf_mb_user');
      if (token && userInfoStr) {
        setUser(JSON.parse(userInfoStr));
      }
    } catch (e) {
      console.log('Error checking user', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await axiosClient.post('auth/login/', credentials);
      await AsyncStorage.setItem('sf_mb_token', res.access);
      await AsyncStorage.setItem('sf_mb_refresh', res.refresh);
      await AsyncStorage.setItem('sf_mb_user', JSON.stringify(res.user));
      setUser(res.user);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('sf_mb_token');
    await AsyncStorage.removeItem('sf_mb_refresh');
    await AsyncStorage.removeItem('sf_mb_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
