import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { EventService } from "./event.service";
import sendResponse from "../../../shared/sendResponse";
import path from 'path'
import { Types } from "mongoose";

const createEvent = catchAsync(
    async (req:Request, res:Response) => {
        const eventData = req.body;
        const user:any = req.user;
        const files:any=req.files
        const fileName= files.image[0].filename
        const filePath = path.join(process.cwd(), 'uploads', fileName)

        const result = await EventService.createEventToDB({...eventData, user:user.id,image: filePath});
        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: 'Event created successfully',
            data: result
        })
    }
)

const getEvent = catchAsync(
    async (req:Request, res:Response) => {
        const id:any = req.params.id
        const events = await EventService.getEventToDB(id as Types.ObjectId);
        if(!events) return sendResponse(res, {success: false, statusCode: 404, message: 'Event not found'})
        
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Event retrieved successfully',
            data: events
        })
    })

const getAllEvents = catchAsync(
    async (req:Request, res:Response) => {
        const query:any = req.query;
        const events = await EventService.getAllEventToDB(query);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'All events retrieved successfully',
            pagination:events.paginateInfo,
            data: events.events
        })
    })

const getUserEvents = catchAsync(
    async (req:Request, res:Response) => {
        const user:any = req.user
        const events = await EventService.getUserEventToDB(user.id);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Events retrieved successfully',
            pagination: events.paginateInfo,
            data: events.events
        })
    })

const updateEvent = catchAsync(
    async (req:Request, res:Response) => {
        const id:any = req.params.id
        const user:any = req.user
        const eventData = req.body;
        const events = await EventService.updateEventToDB(id as Types.ObjectId, eventData,user.id);
        if(!events) return sendResponse(res, {success: false, statusCode: 404, message: 'Event not found'})
        
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Event updated successfully',
            data: events
        })
    })

const deleteEvent = catchAsync(
    async (req:Request, res:Response) => {
        const id:any = req.params.id
        const user:any = req.user
        const events = await EventService.deleteEventToDB(id as Types.ObjectId, user.id);
        if(!events) return sendResponse(res, {success: false, statusCode: 404, message: 'Event not found'})
        
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Event deleted successfully',
        })
    })


export const EventController = {
    createEvent,
    getEvent,
    getAllEvents,
    getUserEvents,
    updateEvent,
    deleteEvent
}