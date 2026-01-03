import { Model, Types } from 'mongoose';
import { IUser } from '../users/user.interface';

export interface IReview {
    reviewer: Types.ObjectId | IUser;
    event: Types.ObjectId | any; // Changed from host to event
    rating: number; // 1-5
    comment?: string;
    createdAt: Date;
}

export type ReviewModel = Model<IReview>;
