import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IReel } from "./reel.interface";
import { ReelService } from "./reel.service";
import sendResponse from "../../../shared/sendResponse";
import { CommentService } from "../comment/comment.service";
import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
const postReel = catchAsync(
    async (req:Request,res:Response)=>{
        const { chunkIndex, totalChunks, fileName,caption} = req.body;

        const {date,hour,minit}={date:new Date().toDateString(),hour:new Date().getHours(),minit:new Date().getMinutes()}
        const extName = path.extname(fileName);
        let filename = `video-${fileName.slice(0,10)}-${date}-${hour}-${minit}-${caption}${extName}`.replace(/\s/g, '-');
        const isExist = path.join(process.cwd(), "uploads",'video',filename);
        if (fs.existsSync(isExist)) {
            filename = `video-${fileName.slice(0,10)}-${date}-${hour}-${minit}-${caption.slice(0,10)}1${extName}`.replace(/\s/g, '-');
        }
      console.log(chunkIndex, totalChunks)
        

        await ReelService.stremUploadVideo(chunkIndex, totalChunks, filename, req.file);
        if(chunkIndex == totalChunks-1){
            
            
            
            await ReelService.saveReeltoDB({
                user: req.user.id,
                video_url: `${filename}`,   
            })
        }
     
        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Reel added successfully",
        })

    }
)

const getReels = catchAsync(
    async (req:Request, res:Response)=>{
        const query = req.query;
        const user:any = req.user
        const reels = await ReelService.getAllReelsFromDB(query,user.id);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Reels retrieved successfully",
            pagination: reels.paginateInfo,
            data: reels.reelsWithLikes
        })
    })

const likeReel = catchAsync(
    async (req:Request, res:Response)=>{
        const {reelId,status} = req.body;
        const userId = req.user.id;
        const updatedReel = await ReelService.likeReelToDB(reelId, status,userId);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Reel liked successfully",
            data: updatedReel
        })
    })

const commentOnReel = catchAsync(
    async (req:Request, res:Response)=>{
        const {reelId, comment} = req.body;
        const userId = req.user.id;
        const updatedReel = await ReelService.giveCommentToDB(reelId, userId, comment);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Reel commented successfully",
            data: updatedReel
        })
    })

const getAllCommentsToDB = catchAsync(
    async (req:Request, res:Response)=>{
        const reelId:any = req.params.reelId;
        const query = req.query;
        const comments = await CommentService.getAllCommentsToDB(reelId as Types.ObjectId,query);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Comments retrieved successfully",
            data: comments.result,
            pagination: comments.pagination
        })
    })

const deleteComment = catchAsync(
    async (req:Request, res:Response)=>{
        const commentId:any = req.params.commentId;
        const user:any = req.user;
        const updatedReel = await CommentService.deleteCommentToDB(commentId, user);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Comment deleted successfully",
            data: updatedReel
        })
    })

const getVideoStrem = catchAsync(
    async (req:Request, res:Response)=>{
        const url = req.params.url;
    await ReelService.sendVideoInStream(req,res,url);
    })




export const ReelController = {
    postReel,
    getReels,
    likeReel,
    commentOnReel,
    getAllCommentsToDB,
    deleteComment,
    getVideoStrem
}