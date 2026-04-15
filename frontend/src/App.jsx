import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ThemeProvider from './context/ThemeContext';
import CurrencyProvider from './context/CurrencyContext';
import NotificationProvider from './context/NotificationContext';
import EnterpriseProvider from './context/EnterpriseContext';

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <NotificationProvider>
          <EnterpriseProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </EnterpriseProvider>
        </NotificationProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
