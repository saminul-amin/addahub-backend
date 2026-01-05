import { Request, Response } from 'express';
import { Review } from './review.model';

const createReview = async (req: Request, res: Response) => {
    try {
        const { event, rating, comment, reviewer } = req.body;
        
        const result = await Review.create({
            event,
            rating,
            comment,
            reviewer
        });
        
        await result.populate('reviewer', 'name profileImage');

        res.status(200).json({
            success: true,
            message: 'Review submitted successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Failed to submit review',
            error: err
        });
    }
};

const getEventReviews = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const result = await Review.find({ event: eventId })
            .populate({
                path: 'reviewer',
                select: 'name profileImage' 
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Reviews fetched successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Failed to fetch reviews',
            error: err
        });
    }
};

export const ReviewController = {
    createReview,
    getEventReviews
};
