import { Model } from "mongoose";

export type ILanguage = {
    name: string;
    code2: string;
    code3: string
    locale: string
}

export type LanguageModel = Model<ILanguage>