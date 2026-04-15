import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info'); // 'info', 'success', 'error'

  const showNotification = (msg, msgType = 'info') => {
    setMessage(msg);
    setType(msgType);
    setVisible(true);
  };

  const hideNotification = () => {
    setVisible(false);
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#f44336';
      default:
        return '#667eea';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideNotification}
        duration={3000}
        style={{ backgroundColor: getBackgroundColor() }}
        action={{
          label: 'Fermer',
          color: '#ffffff',
          onPress: hideNotification,
        }}
      >
        {message}
      </Snackbar>
    </NotificationContext.Provider>
  );
};
