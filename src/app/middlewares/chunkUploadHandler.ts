import { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs-extra";
import path from "path";

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
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(null, false);
        }
        cb(null, true);
    },
});

export const uploadChunkMiddleware = (req: Request, res: Response, next: NextFunction) => {
    upload.single("video")(req, res, async (err) => {
        if (err) return res.status(500).json({ success: false, message: "Upload failed", error: err.message });

        const { fileName, totalChunks, chunkIndex } = req.body;

        console.log(`✅ Received chunk ${chunkIndex}/${totalChunks} for ${fileName}`);

        // Count the uploaded chunks
        const uploadedChunks = fs.readdirSync(UPLOAD_DIR).filter((file) => file.startsWith(fileName));
        console.log(`📂 Current chunks: ${uploadedChunks.length}/${totalChunks}`);

        // If all chunks are uploaded, merge them
        if (uploadedChunks.length === parseInt(totalChunks)) {
            console.log(`🔄 Merging ${totalChunks} chunks...`);
            const finalVideoPath = await mergeChunks(fileName, parseInt(totalChunks), res);
            if (finalVideoPath) {
                console.log(`🎬 Final video saved: ${finalVideoPath}`);
                req.body.finalVideoPath = finalVideoPath; // Attach final path
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

    for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(UPLOAD_DIR, `${fileName}.part${i}`);
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
    console.log(`🎬 Merged file saved: ${finalFilePath}`);
    return finalFilePath;
};
