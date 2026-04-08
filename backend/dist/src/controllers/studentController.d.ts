import { Response } from 'express';
export declare const admitStudent: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const listStudents: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
