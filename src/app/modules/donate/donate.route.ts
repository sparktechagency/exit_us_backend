

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DonationValidation } from './donate.validation';
import { DonatationController } from './donate.controller';
const router = express.Router();
router.post("/",validateRequest(DonationValidation.createDonationZodSchema), DonatationController.donateFromUser)

export const DonationRoute = router;
