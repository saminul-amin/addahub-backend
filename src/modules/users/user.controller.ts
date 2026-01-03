import { Request, Response } from 'express';
import { UserService } from './user.service';

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await UserService.getSingleUser(id);
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await UserService.updateUser(id, req.body);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err
        });
    }
};

export const UserController = {
    getSingleUser,
    updateUser,
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const result = await UserService.getAllUsers();
            res.status(200).json({
                success: true,
                message: 'Users fetched successfully',
                data: result
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message || 'Something went wrong',
                error: err
            });
        }
    },
    deleteUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await UserService.deleteUser(id);
            res.status(200).json({
                success: true,
                message: 'User deleted successfully',
                data: null
            });
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message || 'Something went wrong',
                error: err
            });
        }
    }
};
