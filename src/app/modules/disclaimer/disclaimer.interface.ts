import { Model } from "mongoose";

export type IDisclaimer = {
    content:string;
    type:"terms"|"privacy"
}

export type DisclaimerModel = Model<IDisclaimer>