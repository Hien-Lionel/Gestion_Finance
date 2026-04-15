import React, { createContext, useContext } from 'react';

export const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const currency = 'FCFA';

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XOF', 'FCFA');
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatMoney }}>
      {children}
    </CurrencyContext.Provider>
  );
};
