import { model, Schema } from "mongoose";
import { IPhoneValdation, PhoneValidationModel } from "./phoneValidation.interface";


const phoneValidationSchema = new Schema<IPhoneValdation,PhoneValidationModel>({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        required: true
    },
    expireAt: {
        type: Date,
        required: true
    }
},{
    timestamps: true
})

phoneValidationSchema.statics.isExistPhone = async (
    phone: string
): Promise<IPhoneValdation | null> => {
    return await PhoneValidation.findOne({ phone });
}

phoneValidationSchema.statics.isExpiredOtp = async (
    phone: string,
): Promise<boolean> => {
    const currentDate = new Date();
    const phoneValidation = await PhoneValidation.findOne({ phone, expireAt: { $gt: currentDate } });
    return phoneValidation? false : true;
}


export const PhoneValidation = model<IPhoneValdation, PhoneValidationModel>("PhoneValidation", phoneValidationSchema);