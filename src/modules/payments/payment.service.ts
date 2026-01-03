import Stripe from 'stripe';
import config from '../../config';
import { Event } from '../events/event.model';
import { User } from '../users/user.model'; // Import User to populate customer email if needed

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-12-15.clover',
});

const createCheckoutSession = async (eventId: string, userId: string) => {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    
    // Validate event status
    if (event.status === 'full' || event.status === 'cancelled' || event.status === 'completed') {
        throw new Error(`Event is ${event.status}`);
    }
    if (event.participants.length >= event.maxParticipants) {
        throw new Error("Event is full");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: event.title,
                        description: `Ticket for ${event.title}`,
                        images: event.image ? [event.image] : [],
                    },
                    unit_amount: Math.round(event.price * 100), // Stripe expects cents
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&eventId=${eventId}`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel?eventId=${eventId}`,
        metadata: {
            eventId,
            userId
        },
        customer_email: undefined // Can populate if we fetch user
    });

    return session;
};

const verifyPayment = async (sessionId: string) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
};

export const PaymentService = {
    createCheckoutSession,
    verifyPayment
};
