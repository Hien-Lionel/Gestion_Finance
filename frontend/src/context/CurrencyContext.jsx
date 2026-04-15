import { createContext, useState, useContext, useCallback } from 'react';

const CurrencyContext = createContext();

const CURRENCIES = {
  FCFA: { symbol: 'FCFA', position: 'after', locale: 'fr-FR', decimals: 0 },
  EUR:  { symbol: '€',    position: 'after', locale: 'fr-FR', decimals: 2 },
  USD:  { symbol: '$',    position: 'before', locale: 'en-US', decimals: 2 },
  GBP:  { symbol: '£',    position: 'before', locale: 'en-GB', decimals: 2 },
  XOF:  { symbol: 'XOF',  position: 'after', locale: 'fr-FR', decimals: 0 },
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('app_currency') || 'FCFA';
  });

  const setCurrency = useCallback((newCurrency) => {
    if (CURRENCIES[newCurrency]) {
      setCurrencyState(newCurrency);
      localStorage.setItem('app_currency', newCurrency);
    }
  }, []);

  const formatMoney = useCallback((amount) => {
    const config = CURRENCIES[currency] || CURRENCIES.FCFA;
    const num = Number(amount);
    if (isNaN(num)) return `0 ${config.symbol}`;

    const formatted = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(Math.abs(num));

    const sign = num < 0 ? '-' : '';

    if (config.position === 'before') {
      return `${sign}${config.symbol}${formatted}`;
    }
    return `${sign}${formatted} ${config.symbol}`;
  }, [currency]);

  const getCurrencySymbol = useCallback(() => {
    return CURRENCIES[currency]?.symbol || 'FCFA';
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatMoney,
      getCurrencySymbol,
      availableCurrencies: Object.keys(CURRENCIES),
      CURRENCIES,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
