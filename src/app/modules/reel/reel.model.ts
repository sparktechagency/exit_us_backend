import { model, Schema } from "mongoose";
import {IReel,  ReelModel } from "./reel.interface";

const reelSchema = new Schema<IReel,ReelModel>({
    video_url: {
        type: String,
        required: false,
        default: '' // temprorary optional field
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes:{
        type:Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'delete'],
        default: 'active'
    }
},{
    timestamps: true
})

export const Reel = model<IReel, ReelModel>("Reel", reelSchema);




