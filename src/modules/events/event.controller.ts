import { Request, Response } from 'express';
import { EventService } from './event.service';
import { Event } from './event.model';

const createEvent = async (req: Request, res: Response) => {
    try {
        const result = await EventService.createEvent(req.body);
        const event = await Event.findById(result._id).populate('organizer', 'name email profileImage');
        
        res.status(200).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err
        });
    }
};

const getAllEvents = async (req: Request, res: Response) => {
    try {
        const result = await EventService.getAllEvents(req.query);
        res.status(200).json({
            success: true,
            message: 'Events fetched successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err
        });
    }
};

const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await EventService.getEventById(id);
        res.status(200).json({
            success: true,
            message: 'Event fetched successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err
        });
    }
};

const joinEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const result = await EventService.joinEvent(id, userId);
        res.status(200).json({
            success: true,
            message: 'Joined event successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err
        });
    }
};

const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await EventService.deleteEvent(id);
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
            data: null
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err
        });
    }
};

const leaveEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const result = await EventService.leaveEvent(id, userId);
        res.status(200).json({
            success: true,
            message: 'Left event successfully',
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong',
            error: err
        });
    }
};

export const EventController = {
    createEvent,
    getAllEvents,
    getEventById,
    joinEvent,
    deleteEvent,
    leaveEvent
};
