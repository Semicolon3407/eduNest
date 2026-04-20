import { Request, Response } from 'express';
import Organization from '../models/Organization';
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
 * @desc    Get single organization
 * @route   GET /api/v1/super-admin/organizations/:id
 * @access  Private/SuperAdmin
 */
export const getOrganization = async (req: Request, res: Response) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    res.status(200).json({ success: true, data: org });
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
      role: 'ORGANIZATION',
      organization: org._id
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
    const org = await Organization.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after', runValidators: true });
    
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: org });
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
      returnDocument: 'after',
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
