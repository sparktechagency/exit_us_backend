import { NextFunction, Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import multer from 'multer';

// Utility function to merge chunks
const mergeChunks = async (fileName: string, totalChunks: number, uploadDir: string): Promise<string | null> => {
  const finalFilePath = path.join(uploadDir, `${fileName}.mp4`);
  const writeStream = fs.createWriteStream(finalFilePath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(uploadDir, `${fileName}.part${i}`);
    if (fs.existsSync(chunkPath)) {
      const data = fs.readFileSync(chunkPath);
      writeStream.write(data);
      fs.unlinkSync(chunkPath); // Delete chunk after merging
    } else {
      console.error(`❌ Missing chunk: ${chunkPath}`);
      return null; // Stop merging if a chunk is missing
    }
  }

  writeStream.end();
  return finalFilePath;
};

// Method to handle video chunk uploads and merging
export const handleVideoUpload = async (req: Request, res: Response, uploadDir: string,next:NextFunction) => {
  const { fileName, totalChunks, chunkIndex } = req.body;

  // Ensure the directory exists
  fs.ensureDirSync(uploadDir);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      cb(null, `${fileName}.part${chunkIndex}`);
    },
  });

  const upload = multer({ storage });

  // Handling chunk upload
  await new Promise((resolve, reject) => {
    upload.single('video')(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });

  // After receiving the chunk, check if all chunks have been uploaded
  const uploadedChunks = fs.readdirSync(uploadDir).filter((file) => file.startsWith(fileName));

  if (uploadedChunks.length === totalChunks) {
    // If all chunks are uploaded, merge them
    const finalVideoPath = await mergeChunks(fileName, totalChunks, uploadDir);
    if (finalVideoPath) {
      req.body.finalVideoPath = finalVideoPath;
      next()
    } else {
      return res.status(400).json({ success: false, message: 'Error merging chunks' });
    }
  }

  return null; // Continue to next middleware/controller
};

export const fileUploadHalper = { handleVideoUpload };