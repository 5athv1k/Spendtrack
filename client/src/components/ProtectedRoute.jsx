import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Prevents unauthorized users from accessing private routes.
 * If user is authenticated, renders the child component;
 * otherwise redirects the user to /login with state preserved.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // Also check localStorage as instant fallback during page reloads
  const hasToken = token || localStorage.getItem('token');

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
