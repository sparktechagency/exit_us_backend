

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DonationValidation } from './donate.validation';
import { DonatationController } from './donate.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();
router.post("/",validateRequest(DonationValidation.createDonationZodSchema), DonatationController.donateFromUser)
router.get("/",auth(USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN), DonatationController.getDonations)
router.get('/verify-donation',DonatationController.paymentProfUsers)

export const DonationRoute = router;
