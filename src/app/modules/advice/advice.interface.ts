import { Model, Types } from "mongoose";

export type IAdvice = {
    description: string;
    user:Types.ObjectId,
    date:string,
    image:string,
}

export type AdviceModel = Model<IAdvice>;