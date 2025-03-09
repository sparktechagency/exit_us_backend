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

  async function enhancedImage (imagePath: string){
    const randId =Math.floor(Math.random()*100000)
    const extname = path.extname(imagePath)
    const enhancedUrl = join(process.cwd(),"uploads","image",randId.toString()+extname)
    sharp(imagePath)
    .sharpen() // Increases image sharpness
    .modulate({ brightness: 1.2, lightness: 1.3 }) // Increase brightness & contrast
    .toFile(`uploads/image/${randId}${extname}`)
    .then(() => console.log("Image enhanced!"))
    .catch(err => console.error(err));
    return enhancedUrl.normalize();
  }
  async function detectAndLabelFaces(imagePath:string) {
    try {

      
        // Load the uploaded image using node-canvas
        const img = (await loadImage(imagePath)) as unknown as HTMLImageElement;

        // Detect a single face with landmarks from the image
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        const des = detection?.descriptor
    
        await Kyc.create({face:des})
        
        if (!detection) {
          throw new ApiError(400, 'No face detected in the image');
        }
        fs.unlinkSync(imagePath)

        return des;
  
      } catch (error) {
        console.error('Error processing image:', error);
        throw new ApiError(500, 'Failed to process image');
      }
  }

  const verifyFace = async (image:string)=>{
  //  const img = await base64ToCanvas(image);// image as base64 it was use for video
  const img = (await loadImage(image)) as unknown as HTMLImageElement;
    // Detect a single face with landmarks from the image
    const detection = await faceapi.detectSingleFace(img as any).withFaceLandmarks().withFaceDescriptor();
    const des = detection?.descriptor
    if(!des) throw new ApiError(400, 'No face detected in the image');
  
    
    const faces = await Kyc.find().lean()

    let minDistance = 0.6; // Threshold (adjustable)  
    const match = faces.some(item=>{
      const faceArr = converToFload32Array(item.face as any)
      
      const distance = faceapi.euclideanDistance(faceArr, des)
      if (distance < minDistance) {
        minDistance = distance;
        Kyc.findOneAndDelete({_id:item._id}).then()
        return true;
      }
      return false;
    })


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
  