import { model, Schema } from "mongoose";
import { EventModel, IEvent } from "./event.interface";

const eventSchema = new Schema<IEvent,EventModel>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'delete'],
        default: 'active'
    }
},{
    timestamps: true
})

export const Event = model<IEvent, EventModel>("Event", eventSchema);