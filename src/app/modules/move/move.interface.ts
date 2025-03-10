import { Model, Types } from "mongoose";

export type IMove ={
    originCountry:string,
    destinationCountry:string,
    originRegion?:string;
    destinationRegion?:string;
    originCity?:string;
    destinationCity?:string;
    checkout_date:String;
    user:Types.ObjectId;
    visa_type:string
}

export type MoveModel = {} & Model<IMove>