import express from 'express';
import { ReviewController } from './review.controller';

const router = express.Router();

router.post('/', ReviewController.createReview);
router.get('/event/:eventId', ReviewController.getEventReviews);

export const ReviewRoutes = router;
