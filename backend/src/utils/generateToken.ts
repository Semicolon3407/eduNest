import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/user.model';

export const generateAccessToken = (user: IUser): string => {
  const options: SignOptions = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRY ?? '15m') as SignOptions['expiresIn'],
  };
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    options
  );
};

export const generateRefreshToken = (user: IUser): string => {
  const options: SignOptions = {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRY ?? '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET!,
    options
  );
};
