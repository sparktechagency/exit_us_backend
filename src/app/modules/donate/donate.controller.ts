import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import Stripe from "stripe";
import sendResponse from "../../../shared/sendResponse";
import { getAccessToken, PaypalHelper } from "../../../helpers/paypalHelper";
import { Donation } from "./donate.model";
import QueryBuilder from "../../builder/QueryBuilder";

const donateFromUser = catchAsync(
    async (req:Request,res:Response)=>{
        const {amount,currency = "usd"} = req.body;
        // const token = await getAccessToken()
        // console.log(token);
        
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

const paymentProfUsers = catchAsync(
    async (req:Request,res:Response)=>{
       const {paymentId,PayerID} = req.query;
       PaypalHelper.paypal.payment.execute(paymentId as string, {payer_id:PayerID as string}, async (error, payment:any) => {
        if (error) {
          console.error('Error executing PayPal payment:', error);
          sendResponse(res, {
            success: false,
            statusCode: 500,
            message: 'Error executing PayPal payment',
          });
        } else {
          // Payment successful
          const amount = payment?.transactions?.[0]?.amount?.total;
          const email = payment?.payer.payer_info.email;
          await Donation.create({amount,email});
          sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Payment successful',
            data:payment,
          });
        }
      });
      })
  
const getDonations = catchAsync(
    async (req:Request,res:Response)=>{
        const result =new QueryBuilder(Donation.find(),req.query).sort().paginate()
        const data = await result.modelQuery.lean()
        const pagination = await result.getPaginationInfo()

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Donations fetched successfully',
            data:data,
            pagination:pagination
          });
    }
)
          

export const DonatationController = {
    donateFromUser,
    paymentProfUsers,
    getDonations
}