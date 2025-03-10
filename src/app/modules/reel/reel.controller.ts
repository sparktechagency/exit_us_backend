import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IReel } from "./reel.interface";
import { ReelService } from "./reel.service";
import sendResponse from "../../../shared/sendResponse";
import { CommentService } from "../comment/comment.service";
import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

const postReel = catchAsync(
    async (req:Request,res:Response)=>{
        const requestBody = req.body;
        const user:any = req.user;
        const reelDetails:IReel = {
            user:user.id,
            video_url: requestBody?.finalVideoPath?`/uploads/video/${requestBody.finalVideoPath}`:"",
            caption: requestBody.caption
        }
        const newReel = await ReelService.saveReeltoDB(reelDetails);
        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Reel added successfully",
            data: newReel
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
        const {reelId} = req.body;
        const userId = req.user.id;
        const updatedReel = await ReelService.likeReelToDB(reelId, userId);
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
        const comments = await CommentService.getAllCommentsToDB(reelId as Types.ObjectId);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Comments retrieved successfully",
            data: comments
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





export const ReelController = {
    postReel,
    getReels,
    likeReel,
    commentOnReel,
    getAllCommentsToDB,
    deleteComment
}