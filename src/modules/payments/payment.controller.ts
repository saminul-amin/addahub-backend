import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { EventService } from '../events/event.service';

const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { eventId, userId } = req.body;
        const session = await PaymentService.createCheckoutSession(eventId, userId);
        res.status(200).json({
            success: true,
            message: 'Checkout session created',
            data: session
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Failed to create session',
            error: err
        });
    }
};

const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { sessionId, eventId, userId } = req.body;
        
        // 1. Verify with Stripe
        const session = await PaymentService.verifyPayment(sessionId);
        
        if (session.payment_status === 'paid') {
            // 2. Add User to Event
            // We use the service method which handles duplicates, full capacity etc.
            // Note: In production, webhook is better for reliability. 
            // Here we trust the sessionId verification.
            try {
                // Check if already joined to avoid error
                const event = await EventService.getEventById(eventId);
                const isJoined = event?.participants.some((p: any) => p._id.toString() === userId || p.toString() === userId);
                
                if (!isJoined) {
                    await EventService.joinEvent(eventId, userId);
                }
            } catch (joinError) {
                // Ignore if already joined or handle specific errors
                console.log("Join skipped or failed:", joinError);
            }

            res.status(200).json({
                success: true,
                message: 'Payment verified and joined event',
                data: session
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not paid',
                data: session
            });
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Payment verification failed',
            error: err
        });
    }
};

export const PaymentController = {
    createCheckoutSession,
    verifyPayment
};
