import { Types } from "mongoose";
import { IComment } from "./comment.interface";
import { Comment } from "./comment.model";
import { JwtPayload } from "jsonwebtoken";
import { USER_ROLES } from "../../../enums/user";
import QueryBuilder from "../../builder/QueryBuilder";

const giveCommentToDB = async (comment:Partial<IComment>) => {
    const createComment = await Comment.create({...comment });
    if (!createComment) {
        throw new Error('Failed to create comment');
    }
    return createComment;
}

const deleteCommentToDB = async (commentId: Types.ObjectId, userId: Types.ObjectId) => {
    const deleteComment = await Comment.findByIdAndDelete(commentId, { user: userId });
    if (!deleteComment) {
        throw new Error('Failed to delete comment');
    }
    return deleteComment;
}

const getAllCommentsToDB = async (reelId: Types.ObjectId,query: Record<string, any>) => {
    const comments = new QueryBuilder(Comment.find({ reel: reelId }), query).sort().paginate()

    const pagination = await comments.getPaginationInfo()

    const result = await comments.modelQuery.populate('user', ['name', 'email', 'phone', 'bio','image']).lean()
    return {
        pagination,
        result
    }

}
const deleteCommentFromDB = async (commentId: Types.ObjectId, user:JwtPayload) => {
    if(user.role === USER_ROLES.SUPER_ADMIN){
        return await Comment.deleteOne({ _id: commentId }).exec();
    }
    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        user: user.id,
    });
    if (!comment) {
        throw new Error('Failed to delete comment');
    }
    return comment;

}

export const CommentService = {
    giveCommentToDB,
    deleteCommentToDB,
    getAllCommentsToDB,
    deleteCommentFromDB,
}