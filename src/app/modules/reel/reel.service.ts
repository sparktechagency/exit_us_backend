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

const saveReeltoDB = async (reel: Partial<IReel>) => {
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
    const result = new QueryBuilder(Reel.find({}), query).paginate().search(['video_url','caption'])
    const reels = await result.modelQuery.populate(['user'],['image','name','email','phone']).lean().exec();
    const reelsWithLikes = await Promise.all(reels.map(async (reel:any) => {
        reel.likes = await Like.countDocuments({ reel: reel._id }).exec();
        reel.isILike = await Like.countDocuments({user,reel:reel._id})
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


export const ReelService = {
    saveReeltoDB,
    getUserReelsFromDB,
    deleteReelToDB,
    getAllReelsFromDB,
    likeReelToDB,
    giveCommentToDB,
 };
