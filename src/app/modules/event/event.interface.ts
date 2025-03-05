import { Model, Types } from "mongoose";

export type IEvent={
    title:string;
    description:string;
    date:String;
    location:string;
    image:string;
    user:Types.ObjectId
}

export type EventModel = Model<IEvent> 