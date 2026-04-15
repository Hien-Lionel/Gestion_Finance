import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axiosClient from '../api/axiosClient';

const EnterpriseContext = createContext();

export const useEnterprise = () => useContext(EnterpriseContext);

export const EnterpriseProvider = ({ children }) => {
  const { user } = useAuth();
  const [enterprise, setEnterprise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEnterpriseData();
    } else {
      setEnterprise(null);
      setLoading(false);
    }
  }, [user]);

  const loadEnterpriseData = async () => {
    try {
      // In a real flow, you might call /api/entreprises/{user.enterprise}/
      // For now, we mock the enterprise details based on the user's connection
      setEnterprise({
        id: null,
        name: user?.nom_entreprise || 'Faso Finance SA',
        code: user?.entreprise_code || 'ENT-FF2026',
      });
    } catch (e) {
      console.log('Error fetching enterprise', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EnterpriseContext.Provider value={{ enterprise, loading, setEnterprise }}>
      {children}
    </EnterpriseContext.Provider>
  );
};
