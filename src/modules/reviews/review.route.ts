import express from 'express';
import { ReviewController } from './review.controller';

const router = express.Router();

router.post('/', ReviewController.createReview);
router.get('/event/:eventId', ReviewController.getEventReviews); // Changed from host path

export const ReviewRoutes = router;
