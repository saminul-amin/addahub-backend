import { Model, Document } from 'mongoose';

export enum USER_ROLE {
    USER = 'user',
    HOST = 'host',
    ADMIN = 'admin'
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: USER_ROLE;
    profileImage?: string;
    bio?: string;
    interests?: string[];
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserModel = Model<IUser, Record<string, unknown>>;
