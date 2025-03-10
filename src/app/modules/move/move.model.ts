import { model, Schema } from "mongoose";
import { IMove, MoveModel } from "./move.interface";

const moveSchema = new Schema<IMove,MoveModel>({
    originCountry: {
        type: String,
        required: true
    },
    destinationCountry: {
        type: String,
        required: true
    },
    originRegion: String,
    destinationRegion: String,
    originCity: String,
    destinationCity: String,
    checkout_date: {
        type: String,
        required: true
    },
    visa_type: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{
    timestamps: true
})

export const Move = model<IMove, MoveModel>("Move", moveSchema);