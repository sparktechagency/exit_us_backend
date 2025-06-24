import mongoose, { Schema } from "mongoose";
import { DonationModel, IDonate } from "./donate.interface";

const donateSchema = new Schema<IDonate,DonationModel>({
    amount:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
})

export const Donation = mongoose.model<IDonate,DonationModel>('Donation',donateSchema);