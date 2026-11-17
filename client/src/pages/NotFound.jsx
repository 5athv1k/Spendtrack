import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFound Page Component
 * Catches all undefined frontend routes (*).
 */
const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-code">404</div>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary btn-lg mt-4">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
