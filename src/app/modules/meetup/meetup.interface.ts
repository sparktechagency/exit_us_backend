import { Model, Types } from "mongoose";

export type IMeetup = {
    title: string;
    description: string;
    location: string;
    date: string;
    user:Types.ObjectId
}


export type MeetupModel = {} & Model<IMeetup>;