import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {

  //validate email uniqueness
  const isExistUser = await User.isExistUserByEmail(payload.email!);
  if (isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exists');
  }

  //set role
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  
  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getAllUsersFromDB = async (query: any) => {
  const result = new QueryBuilder(User.find({role:USER_ROLES.USER,verified:true}), query).paginate().sort()
  const users = await result.modelQuery.lean()
  const pagination = await result.getPaginationInfo()
  return { users, pagination }
}

const changeStatusOfUser = async (id:string)=>{
  const user = await User.findById(id)
  if(!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
  await User.findByIdAndUpdate(id,{status:user.status=="delete"?"active":"delete"},{new:true})
  return user
}

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsersFromDB,
  changeStatusOfUser
};
