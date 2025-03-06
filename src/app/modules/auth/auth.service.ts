import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import {
  IAuthResetPassword,
  IChangePassword,
  ILoginData,
  IVerifyEmail,
} from '../../../types/auth';
import cryptoToken from '../../../util/cryptoToken';
import generateOTP from '../../../util/generateOTP';
import { ResetToken } from '../resetToken/resetToken.model';
import { User } from '../user/user.model';
import { phoneHelper } from '../../../helpers/phoneHelper';
import { PhoneValidation } from '../phoneValidation/phoneValidation.model';
import jwt from 'jsonwebtoken';
//login
const loginUserFromDB = async (payload: ILoginData) => {
  const { email, password } = payload;
  const isExistUser = await User.findOne({ email }).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check verified and status
  if (!isExistUser.verified) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please verify your account, then try to login again'
    );
  }

  //check user status
  if (isExistUser.status === 'delete') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You don’t have permission to access this content.It looks like your account has been deactivated.'
    );
  }

  //check match password
  if (
    password &&
    !(await User.isMatchPassword(password, isExistUser.password))
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
  }

  //create token
  const createToken = jwtHelper.createToken(
    { id: isExistUser._id, role: isExistUser.role, email: isExistUser.email },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expire_in as number
  );

  const refreshToken = cryptoToken()

  await ResetToken.deleteMany({ user: isExistUser._id });
  ResetToken.create({
    token:refreshToken,
    user: isExistUser._id,
    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days
  })
  

  return { createToken,refreshToken };
};

//forget password
const forgetPasswordToDB = async (email: string) => {
  const isExistUser = await User.isExistUserByEmail(email);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    email: isExistUser.email,
  };
  const forgetPassword = emailTemplate.resetPassword(value);
  emailHelper.sendEmail(forgetPassword);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate({ email }, { $set: { authentication } });
};

//verify email
const verifyEmailToDB = async (payload: IVerifyEmail) => {
  const { email, oneTimeCode } = payload;
  const isExistUser = await User.findOne({ email }).select('+authentication');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give the otp, check your email we send a code'
    );
  }

  if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You provided wrong otp');
  }

  const date = new Date();
  if (date > isExistUser.authentication?.expireAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Otp already expired, Please try again'
    );
  }

  let message;
  let data;

  if (!isExistUser.verified) {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      { verified: true, authentication: { oneTimeCode: null, expireAt: null } }
    );
    message = 'Email verify successfully';
  } else {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      {
        authentication: {
          isResetPassword: true,
          oneTimeCode: null,
          expireAt: null,
        },
      }
    );

    //create token ;
    const createToken = cryptoToken();
    await ResetToken.create({
      user: isExistUser._id,
      token: createToken,
      expireAt: new Date(Date.now() + 5 * 60000),
    });
    message =
      'Verification Successful: Please securely store and utilize this code for reset password';
    data = createToken;
  }
  return { data, message };
};

//forget password
const resetPasswordToDB = async (
  token: string,
  payload: IAuthResetPassword
) => {
  const { newPassword, confirmPassword } = payload;
  //isExist token
  const isExistToken = await ResetToken.isExistToken(token);
  if (!isExistToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
  }

  //user permission check
  const isExistUser = await User.findById(isExistToken.user).select(
    '+authentication'
  );
  if (!isExistUser?.authentication?.isResetPassword) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "You don't have permission to change the password. Please click again to 'Forgot Password'"
    );
  }

  //validity check
  const isValid = await ResetToken.isExpireToken(token);
  if (!isValid) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Token expired, Please click again to the forget password'
    );
  }

  //check password
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "New password and Confirm password doesn't match!"
    );
  }

  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
    authentication: {
      isResetPassword: false,
    },
  };

  await User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
    new: true,
  });
};


const changePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword
) => {
  const { currentPassword, newPassword, confirmPassword } = payload;
  const isExistUser = await User.findById(user.id).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //current password match
  if (
    currentPassword &&
    !(await User.isMatchPassword(currentPassword, isExistUser.password))
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
  }

  //newPassword and current password
  if (currentPassword === newPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give different password from current password'
    );
  }
  //new password and confirm password check
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password and Confirm password doesn't matched"
    );
  }

  //hash password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
  };
  await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
};

//reset password using email otp

const resetPasswordByEmailOtpToDB = async (email: string, payload: IAuthResetPassword,otp:number) => {
  if(payload.newPassword!== payload.confirmPassword){
    throw new ApiError(StatusCodes.BAD_REQUEST, "New password and Confirm password doesn't match!")
  }
  const isExistUser = await User.findOne({ email }).select('+authentication');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  if (!isExistUser.authentication?.oneTimeCode) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give the otp, check your email we send a code'
    );
  }
  if (isExistUser.authentication?.oneTimeCode!== otp) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You provided wrong otp');
  }
  const date = new Date();
  if (date > isExistUser.authentication?.expireAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Otp already expired, Please try again'
    );
  }
  
  const hashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  await User.findOneAndUpdate({ _id: isExistUser._id }, { password: hashPassword }, { new: true });
}

// Sending Otp To Phone Number
const sendOtpToDB = async(phone:string)=>{
  const otp = generateOTP()
  const isExist = PhoneValidation.isExistPhone(phone);
  if(!isExist){
    await PhoneValidation.create({phone, otp, expireAt: new Date(Date.now() + 3 * 60000)})
    const result = await phoneHelper.sendVerificationCode(phone,otp)
  }else{
    const isExpired = PhoneValidation.isExpiredOtp(phone);
    if(isExpired){
      await PhoneValidation.findOneAndUpdate({phone}, {otp, expireAt: new Date(Date.now() + 3 * 60000)})
      const result = await phoneHelper.sendVerificationCode(phone, otp)
    }else{
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Otp already sent, please wait 3 minutes')
    }
  }

}

// Match Otp From Phone Number
const matchOtpFromDB = async (phone:string, otp:number)=>{
  const isExist = await PhoneValidation.isExistPhone(phone);
  if(!isExist){
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Phone number does not exist')
  }
  const isExpired = PhoneValidation.isExpiredOtp(phone);
  if(isExpired){
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Otp expired, please request again')
  }
  const isMatch = await PhoneValidation.findOne({phone:phone, otp:otp})
  if(!isMatch){
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Otp does not match')
  }
  await PhoneValidation.deleteOne({phone})
  return true
}

// Refresh Access Token
  const refreshAccessTokenDB = async (token: string) => {
    
    const existToken = ResetToken.isExistToken(token);
    if (!existToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token');
    }
    const isExipire = ResetToken.isExpireToken(token);
    if (!isExipire) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token expired');
    }
    const leanUser = await ResetToken.findOne({token}).populate(["user"],['_id','email','role']).select('user')
    const user:any = leanUser?.user;
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not found');
    }
    const accessToken = jwt.sign({ id: user?._id, role: user?.role },config.jwt.jwt_secret!, { expiresIn:config.jwt.jwt_expire_in });
    const refreshToken = cryptoToken()
    await ResetToken.findOneAndUpdate({user:user._id}, {$set: {token: refreshToken, expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1)}})
    return { accessToken, refreshToken };
    
    
  };





export const AuthService = {
  verifyEmailToDB,
  loginUserFromDB,
  forgetPasswordToDB,
  resetPasswordToDB,
  changePasswordToDB,
  sendOtpToDB,
  matchOtpFromDB,
  refreshAccessTokenDB,
  resetPasswordByEmailOtpToDB
};
