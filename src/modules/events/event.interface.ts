import { Model, Document, Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  image?: string;
  additionalImages?: string[];
  organizer: Types.ObjectId;
  participants: Types.ObjectId[];
  maxParticipants: number;
  price: number;
  status: "open" | "full" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export type EventModel = Model<IEvent, Record<string, unknown>>;
