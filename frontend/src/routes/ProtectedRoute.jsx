import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getUserRole, isSetupComplete } from '../utils/auth';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = getToken();
  const userRole = getUserRole();

  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Admin first-login: redirect to enterprise setup if not completed
  if (userRole === 'admin' && !isSetupComplete()) {
    return <Navigate to="/enterprise-setup" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Logged in but doesn't have the right role, redirect to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized so return child components
  return <Outlet />;
};

export default ProtectedRoute;
