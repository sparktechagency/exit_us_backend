import { Model, Types } from "mongoose";

export type IAdvice = {
    title: string;
    description: string;
    user:Types.ObjectId
}

export type AdviceModel = Model<IAdvice>;