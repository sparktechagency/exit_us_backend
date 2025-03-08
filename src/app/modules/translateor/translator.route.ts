import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { TranslatorValidation } from './translator.validation';
import { TranslatorController } from './translator.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post("/text",validateRequest(TranslatorValidation.createTextTranlateZodSchema), TranslatorController.trnaslateText);

router.post("/voice",fileUploadHandler(),validateRequest(TranslatorValidation.createVoiceTranslateZodSchema), TranslatorController.voiceTranslateText);

router.post("/image",fileUploadHandler(),validateRequest(TranslatorValidation.createImageTranslateZodSchema) ,TranslatorController.translateTextFromImage);

export const TranslatorRoutes = router;

