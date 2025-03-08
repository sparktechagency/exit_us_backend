import * as faceapi from 'face-api.js';
import canvas, { Canvas, Image, ImageData,loadImage } from 'canvas';
import path from 'path';
import fs from 'fs';
import ApiError from '../../../errors/ApiError';

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
        // Load the uploaded image using node-canvas
        const img = (await loadImage(imagePath)) as unknown as HTMLImageElement;
    
        // Detect a single face with landmarks from the image
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks();
        
        
        if (!detection) {
          throw new ApiError(400, 'No face detected in the image');
        }
    
        // Get bounding box of the detected face
        const { x, y, width, height } = detection.detection.box;
    
        // Create a canvas to crop the face
        const faceCanvas = canvas.createCanvas(width, height);
        const faceCtx = faceCanvas.getContext('2d');
        // Draw the detected face region onto the new canvas
        faceCtx.drawImage(img as any, x, y, width, height, 0, 0, width, height);
     
        // Generate a file path for the cropped face image
        const outputPath = path.join('uploads',"image", 'face_' + Date.now() + '.png');
        // Write the cropped image buffer to disk
        const buffer = faceCanvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        fs.unlinkSync(imagePath); // Delete the original image file
        // Respond with the path of the extracted face image
        return outputPath;
  
      } catch (error) {
        console.error('Error processing image:', error);
        throw new ApiError(500, 'Failed to process image');
      }
  }

  export const KysService = {
    detectAndLabelFaces,
  }
  