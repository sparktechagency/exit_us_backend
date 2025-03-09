import { model, Schema } from "mongoose";
import { IKyc, KycModel } from "./kyc.interface";

const kycSchema = new Schema<IKyc,KycModel>(
    {
        face:Array<Number>
    }
)

export const Kyc = model("Kyc",kycSchema)