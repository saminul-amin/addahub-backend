import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const registerUser = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.registerUser(req.body);
        res.status(200).json({
            success: true,
            message: 'User registered successfully',
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

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.loginUser(req.body);
        const { refreshToken, accessToken, ...others } = result;

        res.cookie('refreshToken', refreshToken, {
            secure: false, // Set to true in production
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                accessToken,
                user: others.user
            }
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err
        });
    }
};

export const AuthController = {
    registerUser,
    loginUser
};
