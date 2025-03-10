import { NextFunction, Request, Response } from "express";
import { redisHelper } from "../../helpers/redisHelper";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";

export async function redisCacheHandler(req:Request,res:Response,next:NextFunction){
    const url = req.originalUrl
    const isCache =await redisHelper.client.exists(url)
    
    if(isCache){
        const data = await redisHelper.get(url)
        return sendResponse(res,
            data as any
        )
        
    }
    next()
}