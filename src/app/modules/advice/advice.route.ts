import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdviceValidation } from './advice.validation';
import { AdviceController } from './advice.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/',auth(USER_ROLES.USER),validateRequest(AdviceValidation.createAdviceValidationZodSchema),AdviceController.createAdvice)

router.get('/:id', AdviceController.getAdvice)

router.put('/:id',auth(USER_ROLES.USER),validateRequest(AdviceValidation.updateAdviceValidationZodSchema), AdviceController.updateAdvice)

router.delete('/:id',auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN), AdviceController.deleteAdvice)

export const AdviceRoutes = router;