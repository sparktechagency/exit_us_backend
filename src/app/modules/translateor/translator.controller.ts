import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { TranslatorService } from "./translator.service";
import sendResponse from "../../../shared/sendResponse";
import path from 'path'
const trnaslateText = catchAsync(
    async (req:Request,res:Response)=>{
        const {text,to } = req.body;
        const translatedText = await TranslatorService.translateText(text,to)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Translation successful",
            data: translatedText
        })

    }
)

const translateTextFromImage = catchAsync(
    async (req:Request,res:Response)=>{
        const files:any=req.files
        const {to} = req.body;
        const fileName=files?.image?.length? files?.image[0].filename:""
        const filePath = path.join(process.cwd(), 'uploads',"image", fileName)
        const data = await TranslatorService.translateImage(filePath,to)
        
     
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Translation successful",
            data: data
           
        })
    }
    )

const voiceTranslateText = catchAsync(
    async (req:Request,res:Response)=>{
        const files:any=req.files
        const {to } = req.body;
        const fileName=files?.media?.length? files.media[0].filename:""
        const filePath = path.join(process.cwd(), 'uploads',"media", fileName)
        const data = await TranslatorService.translateImage(filePath,to)
        
   
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Translation successful",
            data: data
        })
    }
    )

export const TranslatorController = {
    trnaslateText,
    translateTextFromImage,
    voiceTranslateText
}