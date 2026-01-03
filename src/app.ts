import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Application Routes
import { AuthRoutes } from './modules/auth/auth.route';
import { UserRoutes } from './modules/users/user.route';

app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/users', UserRoutes);
import { EventRoutes } from './modules/events/event.route';
app.use('/api/v1/events', EventRoutes);
import { ReviewRoutes } from './modules/reviews/review.route';
app.use('/api/v1/reviews', ReviewRoutes);
import { UploadRoutes } from './modules/upload/upload.route';
app.use('/api/upload', UploadRoutes);
import { PaymentRoutes } from './modules/payments/payment.route';
app.use('/api/v1/payments', PaymentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Events & Activities App Backend Running!');
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
    res.status(statusCode).json({
        success: false,
        message,
        error: err
    });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found'
            }
        ]
    })
})

export default app;
