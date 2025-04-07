
import { Translate } from '@google-cloud/translate/build/src/v2';
import vision from '@google-cloud/vision';
import { Socket } from 'socket.io';
import { SpeechClient } from '@google-cloud/speech';
const visionClient = new vision.ImageAnnotatorClient();

const translate = new Translate();
const speechClient = new SpeechClient();
export const translateText = async (text: string, targetLanguage: string) => {
  const [translation] = await translate.translate(text, targetLanguage);
  return translation;
};

export const translateImage = async (imagePath: string, targetLang: string) => {
    // Step 1: Extract text from image
    const [result] = await visionClient.textDetection(imagePath);
    const detections = result.textAnnotations;
  
    if (!detections || detections.length === 0) {
      throw new Error('No text found in image');
    }
  
    const extractedText = detections[0].description;
  
    // Step 2: Translate extracted text
    const [translatedText] = await translate.translate(extractedText!, targetLang);
  
    return {
      extractedText,
      translatedText,
    };
  };

  const realTimeVoiceTranslate = (socket:Socket)=>{
    let recognizeStream: any;

  const startRecognitionStream = () => {
    recognizeStream = speechClient
      .streamingRecognize({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
        },
        interimResults: true,
      })
      .on('error', (err) => {
        console.error('Speech error:', err);
        recognizeStream.destroy();
        recognizeStream = null;
      })
      .on('data', async (data) => {
        const transcript = data.results?.[0]?.alternatives?.[0]?.transcript;
        if (transcript) {
          const [translated] = await translate.translate(transcript, 'es'); // Change to desired language
          socket.emit('translation', { transcript, translated });
        }
      });
  };

  socket.on('start-stream', () => {
    startRecognitionStream();
  });

  socket.on('audio-chunk', (chunk) => {
    if (recognizeStream) {
      recognizeStream.write(chunk);
    }
  });

  socket.on('stop-stream', () => {
    if (recognizeStream) {
      recognizeStream.end();
      recognizeStream = null;
    }
  });

  socket.on('disconnect', () => {
    if (recognizeStream) {
      recognizeStream.end();
    }
  });
  }


export const TranslatorService = {
    translateText,
    translateImage,
    realTimeVoiceTranslate
}