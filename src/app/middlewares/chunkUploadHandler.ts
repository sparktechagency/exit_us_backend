import { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs-extra";
import path from "path";
import crypto from "crypto"; // For file integrity check

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "video");
fs.ensureDirSync(UPLOAD_DIR); // Ensure directory exists

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const { chunkIndex, fileName } = req.body;
    cb(null, `${fileName}.part${chunkIndex}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per chunk
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(null, false);
    }
    cb(null, true);
  },
});

export const uploadChunkMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single("video")(req, res, async (err) => {
    if (err) return res.status(500).json({ success: false, message: "Upload failed", error: err.message });

    const { fileName, totalChunks, chunkIndex, title, description } = req.body;

    console.log(`✅ Received chunk ${chunkIndex}/${totalChunks} for ${fileName}`);

    // Save metadata when first chunk is uploaded
    if (chunkIndex === 0) {
      try {
        // Store metadata in the database (pseudocode, adjust to your DB)
      } catch (e) {
        console.error("Error saving metadata", e);
        return res.status(500).json({ success: false, message: "Failed to save video metadata" });
      }
    }

    // Count the uploaded chunks
    const uploadedChunks = fs.readdirSync(UPLOAD_DIR).filter((file) => file.startsWith(fileName));
    console.log(`📂 Current chunks: ${uploadedChunks.length}/${totalChunks}`);

    // If all chunks are uploaded, merge them
    if (uploadedChunks.length === parseInt(totalChunks)) {
      console.log(`🔄 Merging ${totalChunks} chunks...`);
      const finalVideoPath = await mergeChunks(fileName, parseInt(totalChunks), res);

      if (finalVideoPath) {
        console.log(`🎬 Final video saved: ${finalVideoPath}`);
        try {
          // Update metadata with final video path (pseudocode, adjust to your DB)
          req.body.finalVideoPath = finalVideoPath; // Attach final path
        } catch (e) {
          return res.status(500).json({ success: false, message: "Failed to update video metadata" });
        }
      } else {
        return res.status(400).json({ success: false, message: "Error merging chunks" });
      }
    }

    next();
  });
};

// Function to merge chunks into one file
const mergeChunks = async (fileName: string, totalChunks: number, res: Response): Promise<string | null> => {
  const finalFilePath = path.join(UPLOAD_DIR, `${fileName}.mp4`);
  const writeStream = fs.createWriteStream(finalFilePath);

  // Merge chunks concurrently for better performance
  const chunkPromises = [];
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(UPLOAD_DIR, `${fileName}.part${i}`);
    chunkPromises.push(
      new Promise<void>((resolve, reject) => {
        if (fs.existsSync(chunkPath)) {
          const data = fs.readFileSync(chunkPath);
          writeStream.write(data, (err) => {
            if (err) reject(`Error writing chunk ${i}`);
            else resolve();
          });
          fs.unlinkSync(chunkPath); // Delete chunk after merging
        } else {
          reject(`❌ Missing chunk: ${chunkPath}`);
        }
      })
    );
  }

  try {
    await Promise.all(chunkPromises);
    writeStream.end();
    console.log(`🎬 Merged file saved: ${finalFilePath}`);
    return finalFilePath;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Function to save video metadata to the database (pseudocode)

