import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DashboardService } from "./dashboard.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const allSummuryDetails = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await DashboardService.allSummuryDetails(query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Dashboard fetched successfully',
        data: result
    });
});


export const DashboardController = {
    allSummuryDetails
}