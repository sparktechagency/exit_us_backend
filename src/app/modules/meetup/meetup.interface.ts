import { Model, Types } from "mongoose";

export type IMeetup = {
    title: string;
    description: string;
    location: string;
    date: string;
    user:Types.ObjectId,
    status?:"active"|"delete"
}


export type MeetupModel = {} & Model<IMeetup>;