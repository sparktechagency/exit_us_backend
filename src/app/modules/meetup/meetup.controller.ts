import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { MeetupService } from "./meetup.service";
import sendResponse from "../../../shared/sendResponse";

const createMeetup = catchAsync(
    async (req:Request, res:Response) => {
        const meetupData = req.body;
        console.log(meetupData);
        
        const user:any = req.user;
        meetupData.date = new Date(meetupData.date);
        const meetup = await MeetupService.createMeetUpToDB({...meetupData, user: user.id });
        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Meetup created successfully",
            data: meetup
        })

    }
)

const getMeetups = catchAsync(
    async (req:Request, res:Response) => {
        const query = req.query;
        const meetups = await MeetupService.getAllMeetupsFromDB(query);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Meetups retrieved successfully",
            pagination: meetups.paginateInfo,
            data: meetups.meetups
        })
    })

const getMeetupById = catchAsync(
    async (req:Request, res:Response) => {
        const meetupId = req.params.id;
        const meetup = await MeetupService.getMeetupByIdFromDB(meetupId);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Meetup retrieved successfully",
            data: meetup
        })
    })

const updateMeetup = catchAsync(
    async (req:Request, res:Response) => {
        const meetupId = req.params.id;
        const meetupData = req.body;
        const user:any = req.user;

        const meetup = await MeetupService.updateMeetupToDB(meetupId, meetupData,user.id);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Meetup updated successfully",
            data: meetup
        })
    })

const deleteMeetup = catchAsync(
    async (req:Request, res:Response) => {
        const meetupId = req.params.id;
        const user:any = req.user;
        await MeetupService.deleteMeetupFromDB(meetupId,user);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Meetup deleted successfully"
        })
    })

const getUserMeetups = catchAsync(
    async (req:Request, res:Response) => {
        const user:any = req.user;
        const id = req.params.id
        const query = req.query;
        const meetups = await MeetupService.getUserMeetupsFromDB(user.id || id,query);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "User's meetups retrieved successfully",
            pagination: meetups.paginateInfo,
            data: meetups.meetups
        })
    })

export const MeetupController = {
    createMeetup,
    getMeetups,
    getMeetupById,
    updateMeetup,
    deleteMeetup,
    getUserMeetups
}