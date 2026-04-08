import * as authService from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { setTokenCookies, clearTokenCookies } from '../utils/jwt.js';
export const register = async (req, res) => {
    try {
        const { orgName, email, password, name } = req.body;
        if (!orgName || !email || !password || !name) {
            return sendError(res, 'All fields are required', 400);
        }
        const result = await authService.registerOrgAdmin(orgName, email, password, name);
        return sendSuccess(res, result, 'Organization and Admin registered successfully', 201);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return sendError(res, 'Email or Organization slug already exists', 400);
        }
        return sendError(res, error.message);
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendError(res, 'Email and password are required', 400);
        }
        const { user, tokens } = await authService.loginUser(email, password);
        setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;
        return sendSuccess(res, { user: userWithoutPassword }, 'Logged in successfully');
    }
    catch (error) {
        return sendError(res, error.message, 401);
    }
};
export const logout = async (req, res) => {
    clearTokenCookies(res);
    return sendSuccess(res, null, 'Logged out successfully');
};
export const me = async (req, res) => {
    return sendSuccess(res, { user: req.user }, 'User details fetched');
};
//# sourceMappingURL=authController.js.map