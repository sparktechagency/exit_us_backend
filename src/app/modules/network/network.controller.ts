import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { NetworkService } from "./network.service";
import sendResponse from "../../../shared/sendResponse";

const topReturnees = catchAsync(
    async (req:Request,res:Response)=>{
        const query= req.query;
        const returnees = await NetworkService.topReturnees(query)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            data: returnees.data,
            pagination:returnees.pagination
        })
    }
)

const communitys = catchAsync(
    async (req:Request,res:Response)=>{
        const returnees = await NetworkService.communitys()
        sendResponse(res, {
            success: true,
            statusCode: 200,
            data: returnees
        })
    }
)

export const NetworkController = {
    topReturnees,
    communitys
}