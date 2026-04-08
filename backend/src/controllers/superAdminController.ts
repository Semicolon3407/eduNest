import { Request, Response } from 'express';
import * as superAdminService from '../services/superAdminService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const listOrganizations = async (req: Request, res: Response) => {
  try {
    const orgs = await superAdminService.getAllOrganizations();
    return sendSuccess(res, orgs, 'Organizations fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const patchOrgStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const org = await superAdminService.updateOrgStatus(id as string, isActive);
    return sendSuccess(res, org, `Organization ${isActive ? 'activated' : 'suspended'}`);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const metrics = await superAdminService.getGlobalMetrics();
    return sendSuccess(res, metrics, 'Global metrics fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
