import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import Stripe from "stripe";
import sendResponse from "../../../shared/sendResponse";
import { PaypalHelper } from "../../../helpers/paypalHelper";

const donateFromUser = catchAsync(
    async (req:Request,res:Response)=>{
        const {amount,currency = "usd"} = req.body;
        PaypalHelper.paypal.payment.create(PaypalHelper.paypalJson(amount), (error, payment) => {
          if (error) {
            console.error('Error creating PayPal payment:', error);
            sendResponse(res, {
              success: false,
              statusCode: 500,
              message: 'Error creating PayPal payment',
            });
          } else {
            // Find approval_url and send it back to the client
            const approval_url = payment?.links?.find(
              (link) => link.rel === 'approval_url'
            )?.href;
            
            if (approval_url) {
              sendResponse(res, {
                success: true,
                statusCode: 200,
                message: 'Payment successfull. Please redirect to PayPal to complete the payment.',
                data:approval_url,
              });
            } else {
              sendResponse(res, {
                success: false,
                statusCode: 500,
                message: 'Error finding approval URL for PayPal payment',
              });
            }
          }
        });
      }
    

)

export const DonatationController = {
    donateFromUser,
}