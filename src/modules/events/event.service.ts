import { Event } from "./event.model";
import { IEvent } from "./event.interface";
import { SortOrder } from "mongoose";

const createEvent = async (payload: IEvent): Promise<IEvent> => {
  const event = await Event.create(payload);
  return event;
};

const getAllEvents = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortBy = "date",
    sortOrder = "asc",
    ...filterData
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: ["title", "location", "category"].map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Dynamic Sort
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy as string] = sortOrder === "desc" ? -1 : 1;
  }

  const result = await Event.find(whereConditions)
    .populate("organizer", "name email")
    .sort(sortConditions)
    .skip(skip)
    .limit(limitNumber);

  const total = await Event.countDocuments(whereConditions);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: result,
  };
};

const getEventById = async (id: string) => {
  const result = await Event.findById(id)
    .populate("organizer", "name email")
    .populate("participants", "name email");
  return result;
};

const joinEvent = async (eventId: string, userId: string) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (
    event.status === "full" ||
    event.status === "cancelled" ||
    event.status === "completed"
  ) {
    throw new Error("Event is not available for joining");
  }

  const isAlreadyJoined = event.participants.some(
    (p) => p.toString() === userId,
  );
  if (isAlreadyJoined) {
    throw new Error("You have already joined this event");
  }

  if (event.participants.length >= event.maxParticipants) {
    throw new Error("Event is full");
  }

  event.participants.push(userId as any);

  if (event.participants.length >= event.maxParticipants) {
    event.status = "full";
  }

  await event.save();
  return event;
};

const deleteEvent = async (id: string) => {
  const result = await Event.findByIdAndDelete(id);
  return result;
};

const leaveEvent = async (eventId: string, userId: string) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const isParticipant = event.participants.some((p) => p.toString() === userId);
  if (!isParticipant) {
    throw new Error("You are not a participant of this event");
  }
  event.participants = event.participants.filter(
    (p) => p.toString() !== userId,
  );

  if (
    event.status === "full" &&
    event.participants.length < event.maxParticipants
  ) {
    event.status = "open";
  }

  await event.save();
  return event;
};

export const EventService = {
  createEvent,
  getAllEvents,
  getEventById,
  joinEvent,
  deleteEvent,
  leaveEvent,
};
