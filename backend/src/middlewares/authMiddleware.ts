import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { sendError } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized, no token', 401);
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { organization: true },
    });

    if (!user) {
      return sendError(res, 'Not authorized, user not found', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Not authorized, user suspended', 401);
    }

    // Attach user to request
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    
    next();
  } catch (error) {
    return sendError(res, 'Not authorized, token failed', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, `Role ${req.user.role} is not authorized to access this route`, 403);
    }
    next();
  };
};
