import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const mapEnterprise = (e) => ({
  ...e,
  name: e.nom,
  code: e.code_entreprise
});

const EnterpriseContext = createContext();

export const useEnterprise = () => {
  const ctx = useContext(EnterpriseContext);
  if (!ctx) throw new Error('useEnterprise must be used within EnterpriseProvider');
  return ctx;
};

export const EnterpriseProvider = ({ children }) => {
  const [enterprises, setEnterprises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEnterpriseId, setActiveEnterpriseIdState] = useState(() => {
    return localStorage.getItem('sf_active_enterprise') || null;
  });

  const fetchEnterprises = useCallback(async () => {
    try {
      // Don't fetch if not logged in
      const hasToken = localStorage.getItem('accessToken') !== null || localStorage.getItem('refreshToken') !== null;
      if (!hasToken) {
        setIsLoading(false);
        return;
      }

      const response = await axiosClient.get('entreprises/');
      const mappedEnterprises = response.map(mapEnterprise);
      setEnterprises(mappedEnterprises);
      
      // Auto-select first enterprise if none active
      if (mappedEnterprises && mappedEnterprises.length > 0) {
        let currentActive = localStorage.getItem('sf_active_enterprise');
        if (!currentActive || !mappedEnterprises.find(e => e.id.toString() === currentActive)) {
          setActiveEnterpriseIdState(mappedEnterprises[0].id.toString());
          localStorage.setItem('sf_active_enterprise', mappedEnterprises[0].id.toString());
        }
      }
    } catch (e) {
      console.error('Failed to fetch enterprises', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnterprises();
  }, [fetchEnterprises]);

  const activeEnterprise = enterprises.find(e => e.id.toString() === activeEnterpriseId) || enterprises[0] || null;
  const hasEnterprises = enterprises.length > 0;

  const setActiveEnterpriseId = useCallback((id) => {
    setActiveEnterpriseIdState(id.toString());
    localStorage.setItem('sf_active_enterprise', id.toString());
  }, []);

  const addEnterprise = useCallback(async (enterprise) => {
    try {
      const res = await axiosClient.post('entreprises/', enterprise);
      const mapped = mapEnterprise(res);
      setEnterprises(prev => [...prev, mapped]);
      setActiveEnterpriseId(mapped.id.toString());
      return mapped;
    } catch (error) {
      console.error('Failed to create enterprise', error);
      throw error;
    }
  }, [setActiveEnterpriseId]);

  const updateEnterprise = useCallback(async (id, updates) => {
    try {
       const res = await axiosClient.patch(`entreprises/${id}/`, updates);
       const mapped = mapEnterprise(res);
       setEnterprises(prev => prev.map(e => String(e.id) === String(id) ? { ...e, ...mapped } : e));
    } catch (e) {
       console.error(e);
    }
  }, []);

  const deleteEnterprise = useCallback(async (id) => {
    try {
       await axiosClient.delete(`entreprises/${id}/`);
       setEnterprises(prev => prev.filter(e => String(e.id) !== String(id)));
       if (String(activeEnterpriseId) === String(id)) {
           localStorage.removeItem('sf_active_enterprise');
           setActiveEnterpriseIdState(null);
           fetchEnterprises();
       }
    } catch (e) {
       console.error(e);
    }
  }, [activeEnterpriseId, fetchEnterprises]);

  return (
    <EnterpriseContext.Provider value={{
      enterprises,
      isLoading,
      activeEnterprise,
      activeEnterpriseId,
      hasEnterprises,
      setActiveEnterpriseId,
      addEnterprise,
      updateEnterprise,
      deleteEnterprise,
      fetchEnterprises
    }}>
      {children}
    </EnterpriseContext.Provider>
  );
};

export default EnterpriseProvider;
