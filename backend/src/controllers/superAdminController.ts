import { Request, Response } from 'express';
import Organization from '../models/Organization';
import SubscriptionPlan from '../models/SubscriptionPlan';

/**
 * @desc    Get all organizations
 * @route   GET /api/v1/super-admin/organizations
 * @access  Private/SuperAdmin
 */
export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const orgs = await Organization.find().populate('subscriptionPlan');
    res.status(200).json({ success: true, count: orgs.length, data: orgs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Create new organization
 * @route   POST /api/v1/super-admin/organizations
 * @access  Private/SuperAdmin
 */
export const createOrganization = async (req: Request, res: Response) => {
  try {
    const org = await Organization.create(req.body);
    res.status(201).json({ success: true, data: org });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update organization status
 * @route   PATCH /api/v1/super-admin/organizations/:id/status
 * @access  Private/SuperAdmin
 */
export const updateOrganizationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const org = await Organization.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: org });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get all subscription plans
 * @route   GET /api/v1/super-admin/plans
 * @access  Private/SuperAdmin
 */
export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Create new subscription plan
 * @route   POST /api/v1/super-admin/plans
 * @access  Private/SuperAdmin
 */
export const createPlan = async (req: Request, res: Response) => {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Delete organization
 * @route   DELETE /api/v1/super-admin/organizations/:id
 * @access  Private/SuperAdmin
 */
export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const org = await Organization.findByIdAndDelete(req.params.id);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
