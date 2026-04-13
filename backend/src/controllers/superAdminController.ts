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

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name, slug, adminEmail, adminPassword, adminName } = req.body;
    
    if (!name || !adminEmail || !adminPassword || !adminName) {
      return sendError(res, 'Name, admin email, password and admin name are required', 400);
    }

    const result = await superAdminService.createOrganization({
      name,
      slug,
      adminEmail,
      adminPassword,
      adminName
    });

    return sendSuccess(res, result, 'Organization created successfully', 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return sendError(res, 'Slug or admin email already exists', 400);
    }
    return sendError(res, error.message);
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await superAdminService.deleteOrganization(id as string);
    return sendSuccess(res, null, 'Organization deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
