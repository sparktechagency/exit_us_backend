import { model, Schema } from "mongoose";
import { CommentModel, IComment } from "./comment.interface";

const commentSchema = new Schema<IComment, CommentModel>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reel: {
        type: Schema.Types.ObjectId,
        ref: 'Reel',
        required: true
    },
    comment: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

export const Comment = model<IComment, CommentModel>("Comment", commentSchema);