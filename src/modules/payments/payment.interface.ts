export interface ICheckoutSession {
    eventId: string;
    userId: string;
}

export interface IPaymentResult {
    sessionId: string;
    eventId: string;
    userId: string;
    amount: number;
    currency: string;
    status: string;
}
