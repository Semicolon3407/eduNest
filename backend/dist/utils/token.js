"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokenResponse = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokens = (userId) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || '15m') });
    const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || '7d') });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
const sendTokenResponse = (user, statusCode, res, accessToken, refreshToken) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
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
exports.sendTokenResponse = sendTokenResponse;
