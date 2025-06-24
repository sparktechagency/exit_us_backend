import { Query, Types } from "mongoose";
import { IEvent } from "./event.interface";
import { Event } from "./event.model";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";

const createEventToDB = async (payload: Partial<IEvent>) => 
    {
        
    const createEvent = await Event.create(payload);
    if (!createEvent) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create event');
    }
    return createEvent;
}

const getUserEventToDB = async (userId:string,query?:Record<string,{
    page?: number,
    limit?:number,
    searchTerm?:string

}>) => {
    
    const result= new QueryBuilder(Event.find({user:userId,status:{$ne:'delete'}}),query!).paginate().search(['title','location'])
    const events = await result.modelQuery.lean().exec();
    if (!events) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get all events');
    }
    const paginateInfo =await result.getPaginationInfo();
    return { events, paginateInfo };
}

const getEventToDB = async (eventId: Types.ObjectId) => {
    const event = await Event.findById(eventId).populate(['user'],['name','image','email','phone','bio']).exec();
    if (!event) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get event');
    }
    return event;
}

const getAllEventToDB = async (query?:Record<string,{
    page?: number,
    limit?:number,
    searchTerm?:string

}>) => {
    const result= new QueryBuilder(Event.find({status:{$ne:'delete'}}),query!).paginate().search(['title','location']).sort()
    const events = await result.modelQuery.populate(['user'],['name','email','phone','bio','image']).lean().exec();
    if (!events) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get all events');
    }
    const paginateInfo =await result.getPaginationInfo();
    return { events, paginateInfo };
}

const updateEventToDB = async (eventId: Types.ObjectId, payload: Partial<IEvent>,user:string) => {
    const updateEvent = await Event.findOneAndUpdate({ _id: eventId,user }, payload, { new: true }).populate(['user']).exec();
    if (!updateEvent) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update event');
    }
    return updateEvent;
}

const deleteEventToDB = async (eventId: Types.ObjectId) => {
    const deleteEvent = await Event.findOneAndDelete({ _id: eventId},{ status: 'delete' }).exec();
    if (!deleteEvent) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete event');
    }
    return deleteEvent;
}
export const EventService = {
    createEventToDB,
    getUserEventToDB,
    getEventToDB,
    getAllEventToDB,
    updateEventToDB,
    deleteEventToDB,
}