import * as adminService from '../services/adminService.js';
import { sendSuccess, sendError } from '../utils/response.js';
export const postGrade = async (req, res) => {
    try {
        const { name, sections } = req.body;
        const grade = await adminService.createGradeWithSections(name, req.user.organizationId, sections);
        return sendSuccess(res, grade, 'Grade and sections created', 201);
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
export const postFeeStructure = async (req, res) => {
    try {
        const fee = await adminService.createFeeStructure({
            ...req.body,
            organizationId: req.user.organizationId,
        });
        return sendSuccess(res, fee, 'Fee structure defined', 201);
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
export const listInventory = async (req, res) => {
    try {
        const items = await adminService.getInventory(req.user.organizationId);
        return sendSuccess(res, items, 'Inventory items fetched');
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
//# sourceMappingURL=adminController.js.map