import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorResponse } from '../helper/response_status.js';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Token is required', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token', 403);
  }
};
export const authRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const authRole = req.user.role;

    if (!authRole) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    if (!allowedRoles.includes(authRole)) {
      return errorResponse(res, 'Access denied', 403);
    }

    next();
  };
};

