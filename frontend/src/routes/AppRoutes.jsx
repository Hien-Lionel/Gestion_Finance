import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import ManagerDashboard from '../pages/ManagerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Transactions from '../pages/Transactions';
import Categories from '../pages/Categories';
import Debts from '../pages/Debts';
import Factures from '../pages/Factures';
import Reports from '../pages/Reports';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import UsersManagement from '../pages/UsersManagement';
import History from '../pages/History';
import ManagerHistory from '../pages/ManagerHistory';
import AdminHistory from '../pages/AdminHistory';
import EnterpriseSetup from '../pages/EnterpriseSetup';

const Unauthorized = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', textAlign: 'center',
  }}>
    <h1 style={{ fontSize: 48, color: '#3F51B5', marginBottom: 16 }}>🔒</h1>
    <h2 style={{ color: '#2d3436' }}>Accès non autorisé</h2>
    <p style={{ color: '#636e72' }}>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
  </div>
);

const NotFound = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', textAlign: 'center',
  }}>
    <h1 style={{ fontSize: 48, color: '#E91E63', marginBottom: 16 }}>404</h1>
    <h2 style={{ color: '#2d3436' }}>Page non trouvée</h2>
    <p style={{ color: '#636e72' }}>La page que vous cherchez n'existe pas.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Enterprise Setup — admin only, standalone page (no MainLayout) */}
      <Route path="/enterprise-setup" element={<EnterpriseSetup />} />

      {/* Protected routes — all authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Common pages (all roles) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/debts" element={<Debts />} />
          <Route path="/factures" element={<Factures />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<History />} />

          {/* Manager routes */}
          <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/manager-history" element={<ManagerHistory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<UsersManagement />} />
          </Route>

          {/* Admin only routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-history" element={<AdminHistory />} />
          </Route>
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
