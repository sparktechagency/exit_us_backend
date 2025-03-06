import { Model, Types } from "mongoose";

export type IExperience = {
    date:string;
    description:string;
    image:string;
    user:Types.ObjectId;
}

export type ExperienceModel = {} & Model<IExperience>;
