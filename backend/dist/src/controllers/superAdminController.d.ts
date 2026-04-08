import { Request, Response } from 'express';
export declare const listOrganizations: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const patchOrgStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDashboard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
