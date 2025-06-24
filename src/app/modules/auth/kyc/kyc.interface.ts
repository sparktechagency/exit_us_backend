import { Model } from "mongoose"

export type IKyc = {
    face:Float32Array,
    email:string,
    status:"verified" | "unverified"
}

export type KycModel = Model<IKyc>