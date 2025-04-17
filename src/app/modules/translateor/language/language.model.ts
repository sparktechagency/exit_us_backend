import { model, Schema } from "mongoose";
import { ILanguage, LanguageModel } from "./language.interface";

const languageSchema = new Schema<ILanguage,LanguageModel>({
    name: {
        type: String,
        required: true
    },
    code2: {
        type: String,
        required: true
    },
    code3: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

export const Language = model<ILanguage, LanguageModel>("Language", languageSchema);