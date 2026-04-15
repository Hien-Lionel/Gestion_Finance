import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { CurrencyProvider } from './src/context/CurrencyContext';
import { EnterpriseProvider } from './src/context/EnterpriseContext';
import { NotificationProvider } from './src/context/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { isDark } = useTheme();
  
  const paperTheme = isDark ? { ...MD3DarkTheme } : { ...MD3LightTheme };

  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <EnterpriseProvider>
          <CurrencyProvider>
            <NotificationProvider>
              <AppNavigator />
              <StatusBar style={isDark ? "light" : "dark"} />
            </NotificationProvider>
          </CurrencyProvider>
        </EnterpriseProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
