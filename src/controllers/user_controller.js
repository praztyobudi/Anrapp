import { errorResponse, successResponse } from '../helper/response_status.js';
import { UserService } from '../services/user_service.js';

const userService = new UserService();

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.findAllUsers();
        res.status(200).json({
            status: 'success',
            message: 'User found',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            data: null
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userid = await userService.findUserById(req.params.id);
        if (!userid) {
            return errorResponse(res, 'User not found', 404)
        }
        return successResponse(res, 'User found', userid)
    } catch (error) {
        return errorResponse(res, error.message)
    }
}

export const createUser = async (req, res) => {
    try {
        const { name, password, username, department } = req.body;
        if (!name || !password || !username || !department) {
            return errorResponse(res, 'Please provide all required fields', 400)
        } 
        const user = await userService.createUser(name, password, username, department);
        return successResponse(res, 'created successfully', user)

    } catch (error) {
        return errorResponse(res, error.message)
    }
}
export const updateUser = async (req, res) => {
    try {
      const id = req.params.id;
      const updated = await userService.updateUser(id, req.body);
      return successResponse(res, 'updated successfully', {
        name: updated.name,
        username: updated.username,
        password: updated.password,
        department: updated.department,
      });
    } catch (error) {
      return errorResponse(res, error.message);
    }
  };
  
export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await userService.deleteUserById(id);
  
      if (!result) {
        return errorResponse(res, 'user not found', 404)
      }
      const { password, ...userData } = result;
      return successResponse(res, 'deleted successfully', userData)
    } catch (error) {
      return errorResponse(res, error.message)
    }
  };
  

