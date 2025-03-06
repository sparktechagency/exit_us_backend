import { Model, Types } from "mongoose"

// like model
export type ILike ={
    user: Types.ObjectId,
    reel: Types.ObjectId
}

export type LikeModel = Model<ILike>