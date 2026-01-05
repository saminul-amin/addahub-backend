import { Model, Types } from 'mongoose';
import { IUser } from '../users/user.interface';

export interface IReview {
    reviewer: Types.ObjectId | IUser;
    event: Types.ObjectId | any;
    rating: number; 
    comment?: string;
    createdAt: Date;
}

export type ReviewModel = Model<IReview>;
