import { model, Schema } from "mongoose";
import { ExperienceModel, IExperience } from "./experience.interface";

const experienceSchema = new Schema<IExperience,ExperienceModel>({
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
})

export const Experience = model<IExperience, ExperienceModel>("Experience", experienceSchema);