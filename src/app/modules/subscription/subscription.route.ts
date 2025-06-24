import express from 'express';
import { SubscriptionController } from './subscription.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SubscriptionValidation } from './subscription.validation';
const router = express.Router();
router.post(
  '/',
  validateRequest(SubscriptionValidation.createSubsciptionZodSchema),
  SubscriptionController.createSubsciption
);
export const SubscriptionRoutes = router;