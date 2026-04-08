import { Response } from 'express';
export declare const postOnboard: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const listLeaves: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const patchLeave: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
