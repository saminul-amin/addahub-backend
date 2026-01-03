import { Schema, model } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

const reviewSchema = new Schema<IReview, ReviewModel>({
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true }, // Changed host to event
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
}, {
    timestamps: true
});

export const Review = model<IReview, ReviewModel>('Review', reviewSchema);
