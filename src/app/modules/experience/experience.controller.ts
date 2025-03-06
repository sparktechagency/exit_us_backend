import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ExperienceService } from "./experience.service";
import sendResponse from "../../../shared/sendResponse";
import { Types } from "mongoose";
import path from 'path'
import ApiError from "../../../errors/ApiError";
const createExperience = catchAsync(
    async (req:Request, res:Response) => {
        const experienceData = req.body;
        const user:any = req.user;
        const files:any=req.files;
        const fileName=files?.image?.length? files.image[0].filename:""
        const filePath =`/uploads/image/${fileName}`
        const experience = await ExperienceService.createExperienceToDB({...experienceData, user: user.id,image:fileName?filePath:"" });
        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Experience created successfully",
            data: experience
        })
    }
)

const getExperiences = catchAsync(
    async (req:Request, res:Response) => {
        const id:any = req.params.id;
        const query = req.query;
        const experiences = await ExperienceService.getAllExperiencesFromDB(id as Types.ObjectId, query);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Experiences retrieved successfully",
            pagination: experiences.paginateInfo,
            data: experiences.experiences
        })
    })

const updatedExperience = catchAsync(
    async (req:Request, res:Response) => {
        const experienceId:any = req.params.id;
        const experienceData = req.body;
        const user:any = req.user;
        const experience = await ExperienceService.updateExperienceToDB(experienceId as Types.ObjectId, experienceData, user.id);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Experience updated successfully",
            data: experience
        })
    }
)

const deleteExperience = catchAsync(
    async (req:Request, res:Response) => {
        const experienceId:any = req.params.id;
        const user:any = req.user;
        await ExperienceService.deleteExperienceToDB(experienceId as Types.ObjectId, user.id);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Experience deleted successfully"
        })
    })

const getExperience=catchAsync(
    async (req:Request, res:Response) => {
        const experienceId:any = req.params.id;
        const experience = await ExperienceService.getExperience(experienceId as Types.ObjectId);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Experience retrieved successfully",
            data: experience
        })
    })

export const ExperienceController = {
    createExperience,
    getExperiences,
    updatedExperience,
    deleteExperience,
    getExperience,
 
}