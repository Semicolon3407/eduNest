"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const token_1 = require("../utils/token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Create user
        const user = await User_1.default.create({
            name,
            email,
            password,
            role,
        });
        const { accessToken, refreshToken } = (0, token_1.generateTokens)(user._id.toString());
        // Save refresh token to user
        await User_1.default.findByIdAndUpdate(user._id, { refreshToken });
        (0, token_1.sendTokenResponse)(user, 201, res, accessToken, refreshToken);
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
exports.register = register;
/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }
        // Check for user
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = (0, token_1.generateTokens)(user._id.toString());
        // Update refresh token in db
        user.refreshToken = refreshToken;
        await user.save();
        (0, token_1.sendTokenResponse)(user, 200, res, accessToken, refreshToken);
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
exports.login = login;
/**
 * @desc    Refresh token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'No refresh token' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User_1.default.findById(decoded.id).select('+refreshToken');
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }
        const tokens = (0, token_1.generateTokens)(user._id.toString());
        user.refreshToken = tokens.refreshToken;
        await user.save();
        (0, token_1.sendTokenResponse)(user, 200, res, tokens.accessToken, tokens.refreshToken);
    }
    catch (err) {
        res.status(401).json({ success: false, message: 'Token refresh failed' });
    }
};
exports.refresh = refresh;
/**
 * @desc    Log user out / clear cookie
 * @route   GET /api/v1/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?._id);
        if (user) {
            user.refreshToken = undefined;
            await user.save();
        }
        res.cookie('refreshToken', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
        res.status(200).json({ success: true, data: {} });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
exports.logout = logout;
/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    const user = await User_1.default.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
};
exports.getMe = getMe;
