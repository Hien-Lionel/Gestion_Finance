import { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

const defaultNotifications = [
  { id: 1, title: 'Dette en retard', description: 'Paiement fournisseur A en retard de 5 jours.', type: 'error', link: '/debts', read: false },
  { id: 2, title: 'Facture impayée', description: 'Facture FAC-2023-001 du client ABC toujours en attente.', type: 'error', link: '/factures', read: false },
  { id: 3, title: 'Objectif atteint', description: 'Les revenus du mois ont dépassé l\'objectif de 20%.', type: 'success', link: '/reports', read: false },
  { id: 4, title: 'Nouvelle transaction', description: 'Vous avez reçu un virement de 2 300 000 FCFA du Client X.', type: 'info', link: '/transactions', read: false },
  { id: 5, title: 'Recommandation', description: 'Vos dépenses en abonnements ont augmenté de 15%. Consultez le dashboard.', type: 'info', link: '/dashboard', read: true },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(defaultNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [
      { ...notification, id: Date.now(), read: false },
      ...prev,
    ]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
      removeNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
