import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import path from 'path';
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { ...verifyData } = req.body;
  const result = await AuthService.verifyEmailToDB(verifyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: result.data,
  });
});

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const {...userData } = req.body;
  
  const files:any=req.files
  const fileName= files.image[0].filename
  const filePath = path.join(process.cwd(), 'uploads', fileName)
  const userDetails = {
    ...userData,
    image:fileName?filePath:"",
    birth_year:Number(userData.birth_year),
  }
  const result = await UserService.createUserToDB(userDetails);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User created successfully',
    data: result,
  });
})

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUserFromDB(loginData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User logged in successfully.',
    data: {
      accessToken: result.createToken,
      refreshToken: result.refreshToken,

    },
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email;
  const result = await AuthService.forgetPasswordToDB(email);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message:
      'Please check your email. We have sent you a one-time passcode (OTP).',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const { ...resetData } = req.body;
  const result = await AuthService.resetPasswordToDB(token!, resetData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your password has been successfully reset.',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;
  await AuthService.changePasswordToDB(user, passwordData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your password has been successfully changed',
  });
});

// send otp to phone number
const sendOtpToPhone= catchAsync(async (req: Request, res: Response) => {
  const { phone } = req.body;
  await AuthService.sendOtpToDB(phone);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'OTP sent successfully.',
    
  })
})

// match otp from phone number
const matchOtpFromPhone = catchAsync(async (req: Request, res: Response) =>{
  const { phone, otp } = req.body;
  await AuthService.matchOtpFromDB(phone, otp);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'OTP matched successfully.',
  })
})

//refresh token controller

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  const result = await AuthService.refreshAccessTokenDB(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Token refreshed successfully.',
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

export const AuthController = {
  verifyEmail,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
  registerUser,
  sendOtpToPhone,
  matchOtpFromPhone,
  refreshToken,
};
