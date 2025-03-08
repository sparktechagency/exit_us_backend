import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import Stripe from "stripe";
import sendResponse from "../../../shared/sendResponse";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: "2025-02-24.acacia"});
const donateFromUser = catchAsync(
    async (req:Request,res:Response)=>{
        const {amount,currency = "usd"} = req.body;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"], // Correct placement
            mode: "payment",
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency:currency,
                  unit_amount: amount*100, 
                  product_data: {
                    name: "Donation", // Correct placement
                  },
                },
              },
            ],
            success_url: "https://yourwebsite.com/success",
            cancel_url: "https://yourwebsite.com/cancel",
          });
          
          sendResponse(res,{
            success: true,
            statusCode: 200,
            message: "Donation successful",
            data: session.url,
          })
    
}
)

export const DonatationController = {
    donateFromUser,
}