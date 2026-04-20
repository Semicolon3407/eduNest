import { Request, Response } from 'express';
import Organization from '../models/Organization';
import SubscriptionPlan from '../models/SubscriptionPlan';
import User from '../models/User';

/**
 * @desc    Get all organizations
 * @route   GET /api/v1/super-admin/organizations
 * @access  Private/SuperAdmin
 */
export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const orgs = await Organization.find();
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
    const { name, email, password, type, location, personalEmail, phone } = req.body;

    // Create organization
    const org = await Organization.create({
      name,
      email,
      type,
      location,
      personalEmail,
      phone
    });

    // Create corresponding organization user
    await User.create({
      name,
      email,
      password,
      role: 'ORGANIZATION'
    });

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
    let plans = await SubscriptionPlan.find();
    
    // Auto-seed if no plans exist
    if (plans.length === 0) {
      const defaultPlans = [
        { name: 'Monthly', monthlyPrice: 49, yearlyPrice: 490, features: ['Core ERP Access', 'Basic Reporting', 'Email Support'] },
        { name: '3 Months', monthlyPrice: 139, yearlyPrice: 1390, features: ['Core ERP Access', 'Advanced Reporting', 'Priority Email Support'] },
        { name: '6 Months', monthlyPrice: 249, yearlyPrice: 2490, features: ['All ERP Modules', 'Custom Analytics', '24/7 Support'] },
        { name: 'Yearly', monthlyPrice: 449, yearlyPrice: 4490, features: ['Full Suite Access', 'Multi-Branch Support', 'Dedicated Account Manager'] }
      ];
      await SubscriptionPlan.insertMany(defaultPlans);
      plans = await SubscriptionPlan.find();
    }
    
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update subscription plan price
 * @route   PUT /api/v1/super-admin/plans/:id
 * @access  Private/SuperAdmin
 */
export const updatePlan = async (req: Request, res: Response) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update organization
 * @route   PUT /api/v1/super-admin/organizations/:id
 * @access  Private/SuperAdmin
 */
export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const org = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: org });
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
