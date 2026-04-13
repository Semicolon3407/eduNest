import { Request, Response } from 'express';
import * as superAdminService from '../services/superAdminService.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Organizations
export const listOrganizations = async (req: Request, res: Response) => {
  try {
    const orgs = await superAdminService.getAllOrganizations();
    return sendSuccess(res, orgs, 'Organizations fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const org = await superAdminService.createOrganization(req.body);
    return sendSuccess(res, org, 'Organization created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const org = await superAdminService.updateOrganization(id as string, req.body);
    return sendSuccess(res, org, 'Organization updated successfully');
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

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await superAdminService.deleteOrganization(id as string);
    return sendSuccess(res, null, 'Organization deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// Subscriptions
export const listSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const plans = await superAdminService.getSubscriptionPlans();
    return sendSuccess(res, plans, 'Plans fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const createSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const plan = await superAdminService.createSubscriptionPlan(req.body);
    return sendSuccess(res, plan, 'Plan created', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getBillingHistory = async (req: Request, res: Response) => {
  try {
    const data = await superAdminService.getBillingHistory();
    return sendSuccess(res, data, 'Billing history fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getRenewals = async (req: Request, res: Response) => {
  try {
    const data = await superAdminService.getRenewals();
    return sendSuccess(res, data, 'Upcoming renewals fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getSubscriptionMetrics = async (req: Request, res: Response) => {
  try {
    const data = await superAdminService.getSubscriptionMetrics();
    return sendSuccess(res, data, 'Subscription metrics fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// Dashboard
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const data = await superAdminService.getGlobalMetrics();
    return sendSuccess(res, data, 'Dashboard data fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// Config
export const getConfig = async (req: Request, res: Response) => {
  try {
    const config = await superAdminService.getSystemConfig();
    return sendSuccess(res, config, 'System config fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    const config = await superAdminService.updateSystemConfig(key as string, value as string);
    return sendSuccess(res, config, 'Config updated');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
