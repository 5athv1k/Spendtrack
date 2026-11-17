import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, clearAuthError } from '../features/auth/authSlice';

/**
 * Login Page Component
 * Allows existing users to sign in with their email and password.
 * Includes a 1-click Demo credentials auto-filler for testing and evaluation.
 */
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [clientError, setClientError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, isLoading, isError, errorMessage } = useSelector(
    (state) => state.auth
  );

  // If already authenticated, redirect to Dashboard or previous page
  useEffect(() => {
    if (isAuthenticated) {
      const origin = location.state?.from?.pathname || '/';
      navigate(origin, { replace: true });
    }
    // Clean up error state on mount
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, location, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (clientError) setClientError('');
    if (isError) dispatch(clearAuthError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setClientError('Please enter your email address.');
      return;
    }

    if (!formData.password) {
      setClientError('Please enter your password.');
      return;
    }

    dispatch(login(formData));
  };

  // Quick helper for evaluation & viva demonstration
  const handleFillDemo = () => {
    setFormData({
      email: 'demo@spendtrack.com',
      password: 'Demo@123',
    });
    setClientError('');
    dispatch(clearAuthError());
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand-logo">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to track and manage your daily expenses</p>
        </div>

        {/* Demo Credentials Pill */}
        <div className="demo-credentials-banner">
          <div className="demo-text">
            <strong>Demo Account:</strong>
            <code>demo@spendtrack.com</code> / <code>Demo@123</code>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-outline-primary btn-xs"
            id="fill-demo-btn"
          >
            Auto-fill Demo
          </button>
        </div>

        {/* Error Messages */}
        {(clientError || isError) && (
          <div className="alert alert-danger" role="alert">
            {clientError || errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
            </div>
            <input
              type="password"
              id="login-password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isLoading}
            id="login-submit-btn"
          >
            {isLoading ? <span className="spinner-sm"></span> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
