import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearAuthError } from '../features/auth/authSlice';

/**
 * Register Page Component
 * Allows new users to create an account in SpendTrack.
 */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [clientError, setClientError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, isLoading, isError, errorMessage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

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

    if (!formData.name.trim()) {
      setClientError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setClientError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setClientError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setClientError('Passwords do not match.');
      return;
    }

    dispatch(
      register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })
    );
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
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join SpendTrack and take control of your budget</p>
        </div>

        {/* Error Alert */}
        {(clientError || isError) && (
          <div className="alert alert-danger" role="alert">
            {clientError || errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="reg-name"
              name="name"
              placeholder="e.g. Sathvik B R"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">
              Email Address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              id="reg-email"
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
            <label htmlFor="reg-password" className="form-label">
              Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              id="reg-password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirmPassword" className="form-label">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              id="reg-confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isLoading}
            id="register-submit-btn"
          >
            {isLoading ? <span className="spinner-sm"></span> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
