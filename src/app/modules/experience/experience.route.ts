

import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { ExperienceValidation } from './experience.validation';
import { ExperienceController } from './experience.controller';
import tempAuth from '../../middlewares/tempAuth';

const router = express.Router();
// experience details should formData
router.post('/',auth(USER_ROLES.USER),fileUploadHandler(),validateRequest(ExperienceValidation.createExperienceZodSchema),ExperienceController.createExperience)

router.get('/user/:id',tempAuth(), ExperienceController.getExperiences)

router.get('/:id', ExperienceController.getExperience)

router.put('/:id',auth(USER_ROLES.USER),validateRequest(ExperienceValidation.updateExperienceZodSchema), ExperienceController.updatedExperience)

router.delete('/:id',auth(USER_ROLES.USER,USER_ROLES.SUPER_ADMIN), ExperienceController.deleteExperience)

export const ExperienceRoutes = router;