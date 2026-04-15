import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { CurrencyProvider } from './src/context/CurrencyContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </CurrencyProvider>
    </AuthProvider>
  );
}
