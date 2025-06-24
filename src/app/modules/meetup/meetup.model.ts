import { model, Schema } from "mongoose";
import { IMeetup, MeetupModel } from "./meetup.interface";

const meetupSchema = new Schema<IMeetup,MeetupModel>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['active', 'delete'],
        default: 'active'
    }
},{
    timestamps: true
})

export const MeetUp = model<IMeetup, MeetupModel>("Meetup", meetupSchema);