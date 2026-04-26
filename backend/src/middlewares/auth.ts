import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Organization from '../models/Organization';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    console.log('Auth Error: No token provided');
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      console.log('Auth Error: User not found for ID', decoded.id);
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Auto-repair missing organization link for ORGANIZATION role
    if (req.user.role === 'ORGANIZATION' && !req.user.organization) {
      const org = await Organization.findOne({ email: req.user.email });
      if (org) {
        req.user.organization = org._id;
        await req.user.save();
      }
    }

    next();
  } catch (err: any) {
    console.log('Auth Error: JWT Verification failed', err.message);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user?.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
