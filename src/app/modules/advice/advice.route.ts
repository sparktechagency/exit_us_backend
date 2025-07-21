import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdviceValidation } from './advice.validation';
import { AdviceController } from './advice.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import tempAuth from '../../middlewares/tempAuth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post('/',auth(),fileUploadHandler(),validateRequest(AdviceValidation.createAdviceValidationZodSchema),AdviceController.createAdvice)

router.get('/:id',tempAuth(), AdviceController.getAdvice)

router.put('/:id',auth(),validateRequest(AdviceValidation.updateAdviceValidationZodSchema), AdviceController.updateAdvice)

router.delete('/:id',auth(), AdviceController.deleteAdvice)

export const AdviceRoutes = router;