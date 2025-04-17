import { Language } from "../app/modules/translateor/language/language.model";
import { languageData } from "../demo-data/language.data";

export const seedLanguage = async () => {
    try {
        const languages = await Language.find({}).exec();
        if (languages.length === 0) {
            languageData.languages.forEach(async (language) => {
                await Language.create(language);
            })
            console.log('Languages seeded successfully');
        }
        
    } catch (error) {
        console.error('Error seeding languages:', error);
    }
}