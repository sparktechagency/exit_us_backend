import { Model, Types } from "mongoose"

// comment model
export type IComment = {
    user: Types.ObjectId,
    reel: Types.ObjectId,
    comment: string
}

export type CommentModel = Model<IComment>
