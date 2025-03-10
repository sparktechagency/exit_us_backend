import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { NetworkService } from "./network.service";
import sendResponse from "../../../shared/sendResponse";

const topReturnees = catchAsync(
    async (req:Request,res:Response)=>{
        const {amount } = req.query;
        const returnees = await NetworkService.topReturnees(Number(amount))
        sendResponse(res, {
            success: true,
            statusCode: 200,
            data: returnees
        })
    }
)

export const NetworkController = {
    topReturnees
}