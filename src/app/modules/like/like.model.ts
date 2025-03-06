import { model, Schema } from "mongoose";
import { ILike, LikeModel } from "./like.interface";

const likeSchema = new Schema<ILike, LikeModel>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reel: {
        type: Schema.Types.ObjectId,
        ref: 'Reel',
        required: true
    }
},{
    timestamps: true
})

export const Like = model<ILike, LikeModel>("Like", likeSchema);