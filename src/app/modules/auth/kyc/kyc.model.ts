import { model, Schema } from "mongoose";
import { IKyc, KycModel } from "./kyc.interface";

const kycSchema = new Schema<IKyc,KycModel>(
    {
        face:Array<Number>,
        email:String,
        status:{
            type:String,
            enum:["verified","unverified"],
            default:"unverified"
        }
    }
)

export const Kyc = model("Kyc",kycSchema)