import { Request, Response } from 'express';
import * as organizationService from '../services/organizationService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getDashboard = async (req: any, res: any) => {
  try {
    const orgId = req.user?.organizationId;
    if (!orgId) return sendError(res, 'Organization context missing', 403);
    
    const data = await organizationService.getDashboardMetrics(orgId);
    return sendSuccess(res, data, 'Dashboard data fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getSettings = async (req: any, res: any) => {
  try {
    const orgId = req.user?.organizationId;
    if (!orgId) return sendError(res, 'Organization context missing', 403);
    
    const settings = await organizationService.getOrgSettings(orgId);
    return sendSuccess(res, settings, 'Organization settings fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const updateSettings = async (req: any, res: any) => {
  try {
    const orgId = req.user?.organizationId;
    if (!orgId) return sendError(res, 'Organization context missing', 403);

    const data = await organizationService.updateOrgSettings(orgId, req.body);
    return sendSuccess(res, data, 'Settings updated');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const createBranch = async (req: any, res: any) => {
  try {
    const orgId = req.user?.organizationId;
    if (!orgId) return sendError(res, 'Organization context missing', 403);

    const branch = await organizationService.createBranch(orgId, req.body);
    return sendSuccess(res, branch, 'Branch created', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getAuditLogs = async (req: any, res: any) => {
  try {
    const orgId = req.user?.organizationId;
    if (!orgId) return sendError(res, 'Organization context missing', 403);

    const logs = await organizationService.getAuditLogs(orgId);
    return sendSuccess(res, logs, 'Audit logs fetched');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getAcademicSetup = async (req: any, res: any) => {
    try {
      const orgId = req.user?.organizationId;
      if (!orgId) return sendError(res, 'Organization context missing', 403);
  
      const data = await organizationService.getAcademicSetup(orgId);
      return sendSuccess(res, data, 'Academic setup fetched');
    } catch (error: any) {
      return sendError(res, error.message);
    }
};

export const createAcademicYear = async (req: any, res: any) => {
    try {
      const orgId = req.user?.organizationId;
      if (!orgId) return sendError(res, 'Organization context missing', 403);
  
      const data = await organizationService.createAcademicYear(orgId, req.body);
      return sendSuccess(res, data, 'Academic year created', 201);
    } catch (error: any) {
      return sendError(res, error.message);
    }
};
