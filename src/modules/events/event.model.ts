import { Schema, model } from "mongoose";
import { IEvent, EventModel } from "./event.interface";

const eventSchema = new Schema<IEvent, EventModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    additionalImages: [{ type: String }],
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    maxParticipants: { type: Number, required: true },
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["open", "full", "cancelled", "completed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

export const Event = model<IEvent, EventModel>("Event", eventSchema);
