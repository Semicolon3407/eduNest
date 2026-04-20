import { Request, Response } from 'express';
import User from '../models/User';
import Organization from '../models/Organization';
import { generateTokens, sendTokenResponse } from '../utils/token';
import jwt from 'jsonwebtoken';

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    
    // Save refresh token to user
    await User.findByIdAndUpdate(user._id, { refreshToken });

    sendTokenResponse(user, 201, res, accessToken, refreshToken);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await (user as any).matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if organization is suspended for ORGANIZATION roles
    if (user.role === 'ORGANIZATION') {
      const org = await Organization.findOne({ email: user.email });
      
      // Auto-repair missing organization link if it exists
      if (org && !user.organization) {
        user.organization = org._id;
      }

      if (org && org.status === 'Suspended') {
        return res.status(403).json({ success: false, message: 'Your organization has been blocked. Please contact support.' });
      }
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    
    // Update refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    sendTokenResponse(user, 200, res, accessToken, refreshToken);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Refresh token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user._id.toString());
    user.refreshToken = tokens.refreshToken;
    await user.save();

    sendTokenResponse(user, 200, res, tokens.accessToken, tokens.refreshToken);
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Token refresh failed' });
  }
};

/**
 * @desc    Log user out / clear cookie
 * @route   GET /api/v1/auth/logout
 * @access  Private
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user?._id);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({ success: true, data: {} });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user.id);
  res.status(200).json({ success: true, data: user });
};
