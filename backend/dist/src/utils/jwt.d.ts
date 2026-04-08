import { Response } from 'express';
export declare const generateTokens: (userId: string, role: string) => {
    accessToken: string;
    refreshToken: string;
};
export declare const setTokenCookies: (res: Response, accessToken: string, refreshToken: string) => void;
export declare const clearTokenCookies: (res: Response) => void;
