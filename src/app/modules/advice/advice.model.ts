import { model, Schema } from "mongoose";
import { AdviceModel, IAdvice } from "./advice.interface";

const adviceSchema = new Schema<IAdvice,AdviceModel>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
})

export const Advice = model<IAdvice, AdviceModel>("Advice", adviceSchema);