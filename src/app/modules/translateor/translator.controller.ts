import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { TranslatorService } from "./translator.service";
import sendResponse from "../../../shared/sendResponse";
import path from 'path'
const trnaslateText = catchAsync(
    async (req:Request,res:Response)=>{
        const {text,from,to } = req.body;
        const translatedText = await TranslatorService.translateTextFree(text,to,from)
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
        const {to,from } = req.body;
        const fileName=files?.image?.length? files?.image[0].filename:""
        const filePath = path.join(process.cwd(), 'uploads',"image", fileName)
        
        
        const translatedText = await TranslatorService.translateTextFormImage(filePath,from,to)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Translation successful",
            data: translatedText
        })
    }
    )

const voiceTranslateText = catchAsync(
    async (req:Request,res:Response)=>{
        const files:any=req.files
        const {to } = req.body;
        const fileName=files?.media?.length? files.media[0].filename:""
        const filePath = path.join(process.cwd(), 'uploads',"media", fileName)
        
        
        const translatedText = await TranslatorService.voiceTranslate(filePath,to)
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Translation successful",
            data: translatedText
        })
    }
    )

export const TranslatorController = {
    trnaslateText,
    translateTextFromImage,
    voiceTranslateText
}