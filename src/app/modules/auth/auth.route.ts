import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import multer from 'multer';
const router = express.Router();
const upload = multer()

// Register Request Should be as FormData
router.post(
  '/register',
  fileUploadHandler(),
  validateRequest(AuthValidation.createRegisterZodSchema),
  AuthController.registerUser
);

router.post(
  '/login',
  validateRequest(AuthValidation.createLoginZodSchema),
  AuthController.loginUser
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.createForgetPasswordZodSchema),
  AuthController.forgetPassword
);

router.post(
  '/verify-email',
  validateRequest(AuthValidation.createVerifyEmailZodSchema),
  AuthController.verifyEmail
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.createResetPasswordZodSchema),
  AuthController.resetPassword
);

router.post(
  '/change-password',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  validateRequest(AuthValidation.createChangePasswordZodSchema),
  AuthController.changePassword
);

router.post('/send-otp',validateRequest(AuthValidation.sendOtpZodSchema),AuthController.sendOtpToPhone)

router.post('/verify-otp',validateRequest(AuthValidation.matchOtpZodSchema),AuthController.matchOtpFromPhone)
router.post('/refresh-token',validateRequest(AuthValidation.createRefreshTokenZodSchema), AuthController.refreshToken)
router.post('/reset-password-otp',validateRequest(AuthValidation.createResetPasswordUsingOtpZodSchema),AuthController.resetPasswordWithOtp)
router.post('/upload-nid',fileUploadHandler(),validateRequest(AuthValidation.createNidUploadZodSchema),AuthController.nidSubmit)
router.post("/verify-face/:id",fileUploadHandler(),AuthController.verificationFace)

export const AuthRoutes = router;
