

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
router.post('/',auth(),fileUploadHandler(),validateRequest(ExperienceValidation.createExperienceZodSchema),ExperienceController.createExperience)

router.get('/:id',tempAuth(), ExperienceController.getExperiences)


router.put('/:id',auth(),validateRequest(ExperienceValidation.updateExperienceZodSchema), ExperienceController.updatedExperience)

router.delete('/:id',auth(), ExperienceController.deleteExperience)

export const ExperienceRoutes = router;