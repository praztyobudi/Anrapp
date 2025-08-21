import { errorResponse, successResponse } from '../../../helper/response_status.js';
import ideService from '../../../services/speak/ide/ide_service.js';

export const getAllIde = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const data = await ideService.findAllIde(userId, userRole);
        return successResponse(res, 'Success get all ideas', data);
    } catch (error) {
        console.error('Error in getAllIde:', error);
        return errorResponse(res, 'Failed to get ideas');
    }
};
export const getIdeById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const result = await ideService.findIdeById(id, userRole, userId);
        if (!result) {
            return errorResponse(res, 'Idea not found', null, 404);
        }
        return successResponse(res, 'Success found ideas', result);
    } catch (error) {
        console.error('Error in getIdeById:', error);
        return errorResponse(res, 'Failed to get idea by ID');
    }
};
export const createIde = async (req, res) => {
    try {
        const { name, message, department } = req.body;
        const user_id = req.user?.id;
        console.log("user_id", user_id);
        if (!user_id || !name || !message || !department) {
            return errorResponse(res, 'Missing required fields');
        }

        const result = await ideService.createIde({ user_id, name, message, department });
        return successResponse(res, 'Idea created successfully', result, 201);
    } catch (error) {
        console.error('Error in createIde:', error);
        return errorResponse(res, 'Failed to create idea');
    }
};
export const updateIde = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, message, department } = req.body;

        if (!name || !message || !department) {
            return errorResponse(res, 'Missing required fields');
        }

        const result = await ideService.updateIde(id, req.body);
        return successResponse(res, 'updated successfully', result);
    } catch (error) {
        console.error('Error in updateIde:', error);
        return errorResponse(res, 'Failed to update idea');
    }
};
export const deleteIde = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ideService.deleteIde(id);
        if (!result) {
            return errorResponse(res, 'Idea not found', null, 404);
        }
        return successResponse(res, 'Idea deleted successfully', result);
    } catch (error) {
        console.error('Error in deleteIde:', error);
        return errorResponse(res, 'Failed to delete idea');
    }
};

