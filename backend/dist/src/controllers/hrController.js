import * as hrService from '../services/hrService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logAction } from '../services/auditService.js';
export const postOnboard = async (req, res) => {
    try {
        const result = await hrService.onboardStaff({
            ...req.body,
            organizationId: req.user.organizationId,
        });
        await logAction('STAFF_ONBOARD', 'StaffProfile', result.staffProfile.id, req.user.organizationId, req.user.id, { name: req.body.name, role: req.body.role });
        return sendSuccess(res, result, 'Staff onboarded successfully', 201);
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
export const listLeaves = async (req, res) => {
    try {
        const leaves = await hrService.getLeaveRequests(req.user.organizationId);
        return sendSuccess(res, leaves, 'Leave requests fetched');
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
export const patchLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const leave = await hrService.updateLeaveStatus(id, status);
        await logAction('APPROVE_LEAVE', 'LeaveRequest', id, req.user.organizationId, req.user.id, { status });
        return sendSuccess(res, leave, `Leave request ${status.toLowerCase()}`);
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
//# sourceMappingURL=hrController.js.map