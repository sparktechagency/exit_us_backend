import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IMeetup } from "./meetup.interface";
import { MeetUp } from "./meetup.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Types } from "mongoose";
import { IUser } from "../user/user.interface";
import { USER_ROLES } from "../../../enums/user";

const createMeetUpToDB = async (payload: Partial<IMeetup>) => {
    const createMeetup = await MeetUp.create(payload);
    if (!createMeetup) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create meetup');
    }
    return createMeetup;

}

const getAllMeetupsFromDB = async (query:Record<string,any>) => {
    const result = new QueryBuilder(MeetUp.find(),query).paginate().search(['location', 'title' ]);
    const paginateInfo = await result.getPaginationInfo();
    const meetups = await result.modelQuery.populate(['user'  ],['name','email','image','bio','phone']).exec();
    return { meetups, paginateInfo };
}

const getMeetupByIdFromDB = async (id: string) => {
    const meetup = await MeetUp.findById(id).populate(['user'], { select: 'name email bio image' }).exec();
    if (!meetup) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Meetup not found');
    }
    return meetup;
}

const updateMeetupToDB = async (id: string, payload: Partial<IMeetup>,user:any) => {
    const meetup = await MeetUp.findOneAndUpdate({ _id: id,user:user}, payload).populate(['user'],['name','email','image','bio','phone']).exec();
    if (!meetup) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Meetup not found');
    }
   
    return meetup;
}

const deleteMeetupFromDB = async (id: string,user:any) => {
    if(user.role === USER_ROLES.SUPER_ADMIN){
        await MeetUp.deleteOne({ _id: id }).exec();
    }
    const meetup = await MeetUp.findOneAndDelete({ _id: id, user: user.id}).exec();
    if (!meetup) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Meetup not found');
    }
    return meetup;

}

const getUserMeetupsFromDB = async (userId: string,query:Record<string,any>) => {
    const result = new QueryBuilder(MeetUp.find({user:userId}),query).paginate().search(['location', 'title' ]);
    const paginateInfo =await result.getPaginationInfo();
    const meetups = await result.modelQuery.populate(['user'],['name','email','image','bio','phone']).exec();
    return { meetups, paginateInfo };
}

export const MeetupService = {
    createMeetUpToDB,
    getAllMeetupsFromDB,
    getMeetupByIdFromDB,
    updateMeetupToDB,
    deleteMeetupFromDB,
    getUserMeetupsFromDB,
 };
