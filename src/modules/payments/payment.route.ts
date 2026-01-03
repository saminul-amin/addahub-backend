import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post('/create-checkout-session', PaymentController.createCheckoutSession);
router.post('/verify-payment', PaymentController.verifyPayment);

export const PaymentRoutes = router;
