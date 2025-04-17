import * as faceapi from 'face-api.js';
import canvas, { Canvas, Image, ImageData,loadImage } from 'canvas';
import path, { join } from 'path';
import fs from 'fs';
import ApiError from '../../../errors/ApiError';
import Tesseract from 'tesseract.js'
import sharp from 'sharp';
import { Kyc } from './kyc/kyc.model';
faceapi.env.monkeyPatch({
    Canvas: Canvas as any,
    Image: Image as any,
    ImageData: ImageData as any
});


const MODEL_PATH = path.join(process.cwd(), 'models');

// Load face-api.js models
async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

  }
  loadModels().then(() => console.log('Models loaded')).catch(console.error);


  async function detectAndLabelFaces(imagePath:string) {
    try {
;
      
        // Ensure the image file exists
        if (!fs.existsSync(imagePath)) {
          throw new ApiError(400, 'Image file not found');
  
        }
        
        console.log(imagePath);
      
        // Load the uploaded image using node-canvas
        const img = (await loadImage(imagePath)) as unknown as HTMLImageElement;
      
        

        // Detect a single face with landmarks from the image
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        const des = detection?.descriptor
    
       const data= await Kyc.create({face:des})
        
        if (!detection) {
          throw new ApiError(400, 'No face detected in the image');
        }
        fs.unlinkSync(imagePath)

        return {id:data._id};
  
      } catch (error) {
        console.error('Error processing image:', error);
      }
  }

  const verifyFace = async (image:string,id:string)=>{
    const face = await Kyc.findOne({_id:id}).lean()

    if(!face) throw new ApiError(400, 'Face not found');
  //  const img = await base64ToCanvas(image);// image as base64 it was use for video

  const img = (await loadImage(image)) as unknown as HTMLImageElement;
    // Detect a single face with landmarks from the image
    const detection = await faceapi.detectSingleFace(img as any).withFaceLandmarks().withFaceDescriptor();
    const des = detection?.descriptor
    if(!des) throw new ApiError(400, 'No face detected in the image');
  
    
  
    
    let minDistance = 0.6; // Threshold (adjustable)  
    const faceArr = converToFload32Array(face.face as any)
      
    const distance = faceapi.euclideanDistance(faceArr, des)
  
    const match = distance < minDistance

    if(match){
      await Kyc.deleteOne({_id:id})
    }

    if(!match) throw new ApiError(401, 'Face verification failed');
    
    return match;
  }

  const converToFload32Array = (arr:any[])=>{
    const temp = []
    const tempObj = arr[0]
    for(let key in tempObj){
      temp.push(tempObj[key])
    }
    return temp
  }

  // Convert base64 to image buffer
  const base64ToCanvas = async (base64: string): Promise<canvas.Canvas> => {
    const imgBuffer = Buffer.from(base64.split(",")[1], "base64");
    const img = await canvas.loadImage(imgBuffer);
    const c = canvas.createCanvas(img.width, img.height);
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return c;
  };
  
  export const KysService = {
    detectAndLabelFaces,
    verifyFace,
  }
  