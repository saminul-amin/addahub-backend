import express from 'express';
import { EventController } from './event.controller';

const router = express.Router();

router.post('/', EventController.createEvent);
router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);
router.post('/:id/join', EventController.joinEvent);
router.delete('/:id/join', EventController.leaveEvent);
router.delete('/:id', EventController.deleteEvent);

export const EventRoutes = router;
