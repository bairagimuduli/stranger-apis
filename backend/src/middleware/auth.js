import { verifyToken, extractToken } from '../utils/jwt.js';

/**
 * JWT authentication middleware
 */
export function authenticate(req, res, next) {
  const token = extractToken(req.headers.authorization);
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'No token provided. Please login first.' 
    });
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid or expired token.' 
    });
  }
  
  req.user = decoded;
  next();
}

