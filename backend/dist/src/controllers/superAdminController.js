import * as superAdminService from '../services/superAdminService.js';
import { sendSuccess, sendError } from '../utils/response.js';
export const listOrganizations = async (req, res) => {
    try {
        const orgs = await superAdminService.getAllOrganizations();
        return sendSuccess(res, orgs, 'Organizations fetched');
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
export const patchOrgStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const org = await superAdminService.updateOrgStatus(id, isActive);
        return sendSuccess(res, org, `Organization ${isActive ? 'activated' : 'suspended'}`);
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
export const getDashboard = async (req, res) => {
    try {
        const metrics = await superAdminService.getGlobalMetrics();
        return sendSuccess(res, metrics, 'Global metrics fetched');
    }
    catch (error) {
        return sendError(res, error.message);
    }
};
//# sourceMappingURL=superAdminController.js.map