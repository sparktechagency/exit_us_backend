import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { MoveService } from "./move.service";
import sendResponse from "../../../shared/sendResponse";

const moveFromCountry = catchAsync(
    async (req:Request, res:Response) => {
        const details = req.body
        const user:any = req.user
        const detials = await MoveService.moveCountry(details,user.id)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Move successful",
            data: detials
        })
    }
)

export const MoveController = {
    moveFromCountry
}