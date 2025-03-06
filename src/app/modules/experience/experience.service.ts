import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IExperience } from "./experience.interface";
import { Experience } from "./experience.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Types } from "mongoose";
import { USER_ROLES } from "../../../enums/user";

const createExperienceToDB = async (experienceData: Partial<IExperience>) => {
    const experience = await Experience.create(experienceData);
    if (!experience) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create experience');
    }
    return experience;
}

const getAllExperiencesFromDB = async (userId:Types.ObjectId, query:Record<string,any>) => {
    const result = new QueryBuilder(Experience.find({user:userId}), query).paginate();
    const paginateInfo = await result.getPaginationInfo();
    const experiences = await result.modelQuery.exec();
    if (!experiences) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to get experiences');
    }
    return {
        experiences,
        paginateInfo,
    };
}

const updateExperienceToDB = async (experienceId: Types.ObjectId, experienceData: Partial<IExperience>,userid:Types.ObjectId) => {
    const experience = await Experience.findOneAndUpdate({_id:experienceId,user:userid},experienceData).exec();
    if (!experience) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Experience not found');
    }
    return experience;
}

const deleteExperienceToDB = async (experienceId: Types.ObjectId,user:any) => {
    if(user.role === USER_ROLES.SUPER_ADMIN){
        const experience= await Experience.deleteOne({_id: experienceId}).exec();
        return experience
    }
    const experience = await Experience.findOneAndDelete({_id: experienceId,user:user.id}).exec();
    if (!experience) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Experience not found');
    }
    return experience;
}

const getExperience = async (experienceId: Types.ObjectId) => {
    const experience = await Experience.findById(experienceId).populate(['user'],['name','email','image','phone','bio']).exec();

    if (!experience) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Experience not found');
    }
    return experience;
 
}

export const ExperienceService = {
    createExperienceToDB,
    getAllExperiencesFromDB,
    updateExperienceToDB,
    deleteExperienceToDB,
    getExperience,
 };
