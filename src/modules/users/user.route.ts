import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/:id', UserController.getSingleUser);
router.put('/:id', UserController.updateUser);
router.get('/', UserController.getAllUsers);
router.delete('/:id', UserController.deleteUser);

export const UserRoutes = router;
