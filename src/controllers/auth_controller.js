import authService from '../services/auth_service.js';
import { successResponse, errorResponse } from '../helper/response_status.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return errorResponse(res, 'Username and password are required', 400);
    }

    const user = await authService.login(username, password);
    return successResponse(res, 'Login successful', user);
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};
