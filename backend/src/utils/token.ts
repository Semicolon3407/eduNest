import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || '15m') as any }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || '7d') as any }
  );

  return { accessToken, refreshToken };
};

export const sendTokenResponse = (user: any, statusCode: number, res: Response, accessToken: string, refreshToken: string) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  res
    .status(statusCode)
    .cookie('refreshToken', refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};
