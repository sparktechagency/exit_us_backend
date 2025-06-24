import { Model, Types } from "mongoose";

export type IEvent={
    title:string;
    description:string;
    date:Date;
    location:string;
    image:string;
    user:Types.ObjectId,
    status?:"active"|"delete"
}

export type EventModel = Model<IEvent> 