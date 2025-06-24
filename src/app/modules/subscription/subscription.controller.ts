import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SubscriptionService } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";
import { status } from "@grpc/grpc-js";

const createSubsciption = catchAsync(async (req: Request, res: Response) => {
  const { userId, receipt } = req.body;
  const subscription = await SubscriptionService.verifyAppleReciept(
    receipt,
    userId
  );
  const response = {
    success: true,
    message: "Subscription created successfully",
    data: subscription,
    statusCode: status.OK,
  };
sendResponse(res, response);
});


export const SubscriptionController = {
  createSubsciption,
};