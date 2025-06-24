import { Model, Types } from "mongoose";

// reel model
export type IReel = {
    video_url: string;
    user:Types.ObjectId
    likes?: number;
    status?: "active" | "delete";
}

export type ReelModel = {

} & Model<IReel>;



