import { Model, Types } from 'mongoose';
export type IPhoneValdation={
    phone:string;
    otp:number;
    expireAt:Date;
}

export type PhoneValidationModel={
    isExistPhone(phone:string):any;
    isMatchOtp(phone:string, otp:number, expireAt:Date):boolean;
    isExpiredOtp(phone:string):boolean;
} & Model<IPhoneValdation>;