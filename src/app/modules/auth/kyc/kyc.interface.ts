import { Model } from "mongoose"

export type IKyc = {
    face:Float32Array,
}

export type KycModel = Model<IKyc>