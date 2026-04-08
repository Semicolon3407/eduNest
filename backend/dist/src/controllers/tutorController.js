import * as tutorService from '../services/tutorService.js';
import { sendSuccess, sendError } from '../utils/response.js';
export const postAttendance = async (req, res) => {
    try {
        const attendance = await tutorService.markAttendance(req.body);
        return sendSuccess(res, attendance, 'Attendance marked');
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
export const postMarks = async (req, res) => {
    try {
        const marks = await tutorService.inputMarks(req.body);
        return sendSuccess(res, marks, 'Marks updated in gradebook');
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
//# sourceMappingURL=tutorController.js.map