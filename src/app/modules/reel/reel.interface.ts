import { Model, Types } from "mongoose";

// reel model
export type IReel = {
    video_url: string;
    caption?: string;
    user:Types.ObjectId
    likes?: number;
}

export type ReelModel = {

} & Model<IReel>;



