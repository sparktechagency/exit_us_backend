import { z } from 'zod';

const createVerifyEmailZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    oneTimeCode: z.number({ required_error: 'One time code is required' }),
  }),
});

const createLoginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const createForgetPasswordZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
  }),
});

const createResetPasswordZodSchema = z.object({
  body: z.object({
    newPassword: z.string({ required_error: 'Password is required' }),
    confirmPassword: z.string({
      required_error: 'Confirm Password is required',
    }),
  }),
});

const createChangePasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current Password is required',
    }),
    newPassword: z.string({ required_error: 'New Password is required' }),
    confirmPassword: z.string({
      required_error: 'Confirm Password is required',
    }),
  }),
});

const createRegisterZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    image:z.string().optional(),
    phone:z.string({ required_error: 'Phone is required'}),
    city:z.string({ required_error: 'City is required'}),
    country:z.string({ required_error: 'Country is required'}),
    bio:z.string().optional(),
    expat_status:z.string({ required_error: 'Status is required'}),
    residing_country:z.string({ required_error: 'residing_country is required'}).optional(),
    ethnicity:z.string({ required_error: 'ethnicity is required'}).optional(),
    birth_year:z.string({ required_error: 'BirthYear is required'}),
  }),
});

const sendOtpZodSchema = z.object({
  body: z.object({
    phone: z.string({ required_error: 'Phone is required' }),
  }),
})

const matchOtpZodSchema = z.object({
  body: z.object({
    phone: z.string({ required_error: 'Phone is required' }),
    otp: z.number({ required_error: 'OTP is required' }),
  }),
})

const createRefreshTokenZodSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: 'Refresh Token is required' }),
  }),
})

const createResetPasswordUsingOtpZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    otp: z.number({ required_error: 'OTP is required' }),
    newPassword: z.string({ required_error: 'New Password is required' }),
    confirmPassword: z.string({ required_error: 'Confirm Password is required' }),
  }),
})

export const AuthValidation = {
  createVerifyEmailZodSchema,
  createForgetPasswordZodSchema,
  createLoginZodSchema,
  createResetPasswordZodSchema,
  createChangePasswordZodSchema,
  createRegisterZodSchema,
  sendOtpZodSchema,
  matchOtpZodSchema,
  createRefreshTokenZodSchema,
  createResetPasswordUsingOtpZodSchema,
};
