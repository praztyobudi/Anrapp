import * as service from '../services/user_service.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await service.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        }); 
    }
};