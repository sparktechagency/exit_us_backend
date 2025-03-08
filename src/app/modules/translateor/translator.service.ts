import {translate} from "@vitalets/google-translate-api";
import Tesseract from "tesseract.js";
import fs from "fs";
import langdetect from "langdetect";
import {SpeechClient,protos} from "@google-cloud/speech"
import textToSpeech,{protos as textToSpeechProto} from "@google-cloud/text-to-speech";
import {TranslationServiceClient} from "@google-cloud/translate"
import axios from "axios";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

// Configure Google Cloud Clients
const speechClient = new SpeechClient();
const textToSpeechClient = new textToSpeech.TextToSpeechClient();
const translationClient = new TranslationServiceClient();

const translateTextFree = async (text: string, targetLanguage: string,sourceLanguage:string) => {
    
        const response = await translate(text, {from: sourceLanguage, to: targetLanguage});
        return response.text;

}

const translateTextFormImage = async (filePath:string,fromlang:string="eng",toLang:string="eng") => {
    console.log(filePath);
    
    const {data:{text}} = await Tesseract.recognize(filePath,fromlang);
    const str = text.split("\n").filter(Boolean).join(" ");
    
    const lang = await langdetect.detect(str);
    const dlang = lang[0].lang
    
    fs.rmSync(filePath);
    return translateTextFree(str, toLang, dlang);

}

const voiceTranslate = async (audioPath:string,targetLanguage:string)=>{
    try {
        // Step 2: Convert Speech to Text
        const transcription = await transcribeAudio(audioPath);
        console.log('Transcribed Text:', transcription);

        // Step 3: Detect & Translate Text
        const { detectedLanguage, translatedText } = await translateText(transcription,targetLanguage);


        // Step 4: Convert Translated Text to Speech
        const translatedAudioPath = await textToSpeechConversion(translatedText);

        return translatedText;
    } catch (error) {
        console.error(error);
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to translate audio');
    } finally {
        // Delete uploaded file after processing
        fs.unlink(audioPath, (err) => {
            if (err) console.error('Failed to delete file:', err);
        });
    }
}

async function transcribeAudio(audioPath: string): Promise<string> {
    const audio = fs.readFileSync(audioPath);
    const audioBytes = audio.toString('base64');

    const request:protos.google.cloud.speech.v1.IRecognizeRequest = {
        audio: { content: audioBytes },
        config: {
            encoding:protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16, // Adjust encoding based on your file type
            sampleRateHertz: 16000,
            languageCode: 'auto', // Auto-detect language
        },
    };

    const [response] = await speechClient.recognize(request);
    return response.results?.map(result => result.alternatives?.[0].transcript).join('\n') || '';
}

// 🟢 Function: Translate Text
async function translateText(text: string,targetLanguage:string): Promise<TranslationResponse> {

    const [response] = await translationClient.translateText({
        parent: `projects/YOUR_PROJECT_ID/locations/global`,
        contents: [text],
        mimeType: 'text/plain',
        targetLanguageCode: targetLanguage,
    });

    return { detectedLanguage: response.translations?.[0].detectedLanguageCode || 'unknown', translatedText: response.translations?.[0].translatedText || '' };
}

// 🟢 Function: Convert Text to Speech
async function textToSpeechConversion(text: string): Promise<string> {
    const textToSpeechClient = new textToSpeech.TextToSpeechClient(); // ✅ Initialize client

    const request: any = {
        input: { text: text },
        voice: { 
            languageCode: 'en-US', 
            ssmlGender: textToSpeechProto.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE // ✅ Use enum correctly
        },
        audioConfig: { 
            audioEncoding: textToSpeechProto.google.cloud.texttospeech.v1.AudioEncoding.MP3 // ✅ Use enum correctly
        },
    };


    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    const outputPath = `outputs/translated_audio.mp3`;
    fs.writeFileSync(outputPath, response.audioContent as Buffer, 'binary');

    return outputPath;
}

interface TranslationResponse {
    detectedLanguage: string;
    translatedText: string;
}



export const TranslatorService = {
    translateTextFree,
    translateTextFormImage,
    voiceTranslate,
    translateText
}