import * as studentService from '../services/studentService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logAction } from '../services/auditService.js';
export const admitStudent = async (req, res) => {
    try {
        const { email, name, studentId, gradeId, sectionId } = req.body;
        const organizationId = req.user.organizationId;
        if (!organizationId) {
            return sendError(res, 'User not associated with an organization', 400);
        }
        const result = await studentService.createStudent({
            email,
            name,
            studentId,
            organizationId,
            gradeId,
            sectionId,
        });
        // Log the action for audit trails
        await logAction('ADMIT_STUDENT', 'StudentProfile', result.studentProfile.id, organizationId, req.user.id, { studentId, name });
        return sendSuccess(res, result, 'Student admitted successfully', 201);
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
export const listStudents = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const students = await studentService.getStudentsByOrg(organizationId);
        return sendSuccess(res, students, 'Students fetched successfully');
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
//# sourceMappingURL=studentController.js.map