import { User } from './user.model';
import { IUser } from './user.interface';

const getSingleUser = async (id: string) => {
    const result = await User.findById(id);
    return result;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
    const result = await User.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

const getAllUsers = async () => {
    const result = await User.find();
    return result;
};

const deleteUser = async (id: string) => {
    const result = await User.findByIdAndDelete(id);
    return result;
};

export const UserService = {
    getSingleUser,
    updateUser,
    getAllUsers,
    deleteUser
};
