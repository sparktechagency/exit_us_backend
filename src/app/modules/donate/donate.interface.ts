import { Model } from "mongoose";

export type IDonate = {
    amount:number;
    email:string;
}

export type DonationModel = Model<IDonate, Record<string, unknown>>;