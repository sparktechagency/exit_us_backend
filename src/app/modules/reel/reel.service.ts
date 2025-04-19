import { JwtPayload } from "jsonwebtoken";
import { IReel } from "./reel.interface";
import { Reel } from "./reel.model";
import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { USER_ROLES } from "../../../enums/user";
import QueryBuilder from "../../builder/QueryBuilder";
import { Like } from "../like/like.model";
import { CommentService } from "../comment/comment.service";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { timeHelper } from "../../../helpers/timeHelper";
import { Comment } from "../comment/comment.model";
const saveReeltoDB = async (reel:IReel) => {
    const createReel = await Reel.create({...reel});
    if (!createReel) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create reel');
    }
    return createReel;
}

const getUserReelsFromDB = async (userId: Types.ObjectId) => {
    const reels = await Reel.find({ user: userId }).populate(['user']).exec();
    if (!reels) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get reels');
    }
    return reels;
}

const deleteReelToDB = async (reelId: Types.ObjectId, user:JwtPayload) => {
    if(user.role== USER_ROLES.ADMIN){
        const result = await Reel.deleteOne({ _id: reelId }).exec();
        return result;

    }
    const deleteReel = await Reel.findByIdAndDelete({ _id: reelId, user: user.id });
    if (!deleteReel) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Reel not found');
    }
    return deleteReel;
}

const getAllReelsFromDB = async (query:Record<string,any>,user:Types.ObjectId|null=null) => {
    const result = new QueryBuilder(Reel.find({}), query).paginate().search(['video_url','caption']).sort();
    const reels = await result.modelQuery.populate(['user'],['image','name','email','phone']).lean().exec();
    const reelsWithLikes = await Promise.all(reels.map(async (reel:any) => {
        reel.likes = await Like.countDocuments({ reel: reel._id }).exec();
        reel.isILike = await Like.countDocuments({user,reel:reel._id})
        reel.comments = await Comment.countDocuments({ reel: reel._id }).exec();
        return reel;
    }))
    if (!reelsWithLikes) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get reels');
    }
    const paginateInfo = await result.getPaginationInfo();
    return { reelsWithLikes, paginateInfo };
}

const likeReelToDB = async (reelId: Types.ObjectId, userId: Types.ObjectId) => {
    //check if user already liked the reel
    const alreadyLiked = await Like.findOne({ reel: reelId, user: userId }).exec();
    if (alreadyLiked) {
        //unlike the reel
        const deleteReel = await Like.deleteOne({ _id: alreadyLiked._id }).exec();
        return deleteReel;
    }
    const likereel = await Like.create({ reel: reelId, user: userId });;
    if (!likereel) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to like reel');
    }
    return likereel;
}

const giveCommentToDB = async (reelId: Types.ObjectId, userId: Types.ObjectId, comment: string) => {
    const commentT = await CommentService.giveCommentToDB({
        reel: reelId,
        user: userId,
        comment: comment,
    })
    return commentT;
}
const UPLOAD_DIR = path.join(process.cwd(), "uploads",'video');
const stremUploadVideo =async (chunkIndex: number, totalChunks: number,filename: string,file:any)=>{
    const chunkPath = path.join(UPLOAD_DIR, `${filename}.part${chunkIndex}`);
    fs.renameSync(file.path, chunkPath);
    // Check if all chunks are received
    const chunks = fs.readdirSync(UPLOAD_DIR).filter(file => file.startsWith(filename));
    if (chunks.length === Number(totalChunks)) {
        const filePath = path.join(UPLOAD_DIR, filename);
        const writeStream = fs.createWriteStream(filePath);

        for (let i = 0; i < totalChunks; i++) {
            const chunkFile = path.join(UPLOAD_DIR, `${filename}.part${i}`);
            const data = fs.readFileSync(chunkFile);
            writeStream.write(data);
            fs.unlinkSync(chunkFile); // Remove chunk after merging
        }
        writeStream.end();
    }

}
const sendVideoInStream = (req: Request, res: Response,videoPAth:string):any => {
    const filePath = path.join(process.cwd(), "uploads",'video', videoPAth);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Video file not found" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
        res.writeHead(200, {
            "Content-Type": "video/mp4",
            "Content-Length": fileSize,
        });
        fs.createReadStream(filePath).pipe(res);
        return;
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE, fileSize - 1);
    
    if (start >= fileSize || end >= fileSize) {
        return res.status(416).json({ message: "Requested range not satisfiable" });
    }

    const contentLength = end - start + 1;
    res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    });

    const stream = fs.createReadStream(filePath, { start, end });
    stream.pipe(res);
};

export const ReelService = {
    saveReeltoDB,
    getUserReelsFromDB,
    deleteReelToDB,
    getAllReelsFromDB,
    likeReelToDB,
    giveCommentToDB,
    stremUploadVideo,
    sendVideoInStream
 };
