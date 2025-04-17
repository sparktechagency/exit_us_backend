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
        const {to,from} = req.body;
        const fileName=files?.image?.length? files?.image[0].filename:""
        const filePath = path.join(process.cwd(), 'uploads',"image", fileName)
        const data = await TranslatorService.translateImage(filePath,to,from)
        
     
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
        const {to,from } = req.body;
        const fileName=files?.media?.length? files.media[0].filename:""
        const filePath = path.join(process.cwd(), 'uploads',"media", fileName)
        const data = await TranslatorService.translateImage(filePath,to,from)
        
   
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Translation successful",
            data: data
        })
    }
    )

const getLanguages = catchAsync(
    async (req:Request,res:Response)=>{
        const data = await TranslatorService.languagesFromGoogle()
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Languages fetched successfully",
            data: data
        })
    }
    )


export const TranslatorController = {
    trnaslateText,
    translateTextFromImage,
    voiceTranslateText,
    getLanguages
}