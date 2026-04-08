import { Response } from 'express';
import * as tutorService from '../services/tutorService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const postAttendance = async (req: any, res: Response) => {
  try {
    const attendance = await tutorService.markAttendance(req.body);
    return sendSuccess(res, attendance, 'Attendance marked');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const postMarks = async (req: any, res: Response) => {
  try {
    const marks = await tutorService.inputMarks(req.body);
    return sendSuccess(res, marks, 'Marks updated in gradebook');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
