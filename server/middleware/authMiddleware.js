const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Validates the JWT token in the Authorization header.
 * If valid, fetches the user record from the database (excluding password)
 * and attaches it to the request object (req.user).
 * If invalid or absent, returns HTTP 401 Unauthorized.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and follows the 'Bearer <token>' pattern
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token string after 'Bearer '
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature against JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Retrieve user from DB by decoded ID; exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }

      // Proceed to the next middleware or controller
      return next();
    } catch (error) {
      console.error('[AuthMiddleware] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or expired token.',
      });
    }
  }

  // If no token header was provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided in Authorization header.',
    });
  }
};

module.exports = { protect };
