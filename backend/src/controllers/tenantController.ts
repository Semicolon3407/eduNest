import { Request, Response } from 'express';
import Staff from '../models/Staff';
import User from '../models/User';
import Organization from '../models/Organization';
import Branch from '../models/Branch';
import { AuthRequest } from '../middlewares/auth';
import mongoose from 'mongoose';

// --- Branch Management ---

// @desc    Get all branches
// @route   GET /api/v1/tenant/branches
// @access  Private (Organization Admin)
export const getBranches = async (req: AuthRequest, res: Response) => {
  try {
    const branches = await Branch.find({ organization: req.user.organization });
    res.status(200).json({ success: true, count: branches.length, data: branches });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Add a branch
// @route   POST /api/v1/tenant/branches
// @access  Private (Organization Admin)
export const addBranch = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user.organization) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is not associated with any organization. Please contact support.' 
      });
    }

    const branchData = {
      ...req.body,
      organization: req.user.organization
    };

    const branch = await Branch.create(branchData);
    res.status(201).json({ success: true, data: branch });
  } catch (err: any) {
    console.error('Error adding branch:', err);
    res.status(400).json({ 
      success: false, 
      message: err.code === 11000 
        ? 'A branch with this code already exists. Codes must be globally unique.' 
        : err.message 
    });
  }
};

// @desc    Update a branch
// @route   PUT /api/v1/tenant/branches/:id
// @access  Private (Organization Admin)
export const updateBranch = async (req: AuthRequest, res: Response) => {
  try {
    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.id, organization: req.user.organization },
      req.body,
      { new: true, runValidators: true }
    );

    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: branch });
  } catch (err: any) {
    res.status(400).json({ 
      success: false, 
      message: err.code === 11000 
        ? 'A branch with this code already exists.' 
        : err.message 
    });
  }
};

// @desc    Delete a branch
// @route   DELETE /api/v1/tenant/branches/:id
// @access  Private (Organization Admin)
export const deleteBranch = async (req: AuthRequest, res: Response) => {
  try {
    const branch = await Branch.findOne({ _id: req.params.id, organization: req.user.organization });
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    
    // Check if staff are assigned to this branch
    const staffCount = await Staff.countDocuments({ branch: req.params.id });
    if (staffCount > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete branch with assigned staff' });
    }

    await branch.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- Staff Management ---

// @desc    Get all staff
// @route   GET /api/v1/tenant/staff
// @access  Private (Organization Admin)
export const getStaff = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.find({ organization: req.user.organization }).populate('user branch');
    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Onboard staff
// @route   POST /api/v1/tenant/staff
// @access  Private (Organization Admin)
export const onboardStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, email, role, department, employeeId, branch: branchId, phone, personalEmail, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // 1. Create User
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: password || 'EduNest@123', // Default strong password
      role,
      organization: req.user.organization
    });

    // 2. Create Staff Profile
    const staff = await Staff.create({
      user: user._id,
      organization: req.user.organization,
      branch: branchId,
      employeeId,
      department,
      firstName,
      lastName,
      phone,
      personalEmail,
      status: 'Active'
    });

    res.status(201).json({ success: true, data: staff });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update staff
// @route   PUT /api/v1/tenant/staff/:id
// @access  Private (Organization Admin)
export const updateStaff = async (req: AuthRequest, res: Response) => {
  try {
    let staff = await Staff.findOne({ _id: req.params.id, organization: req.user.organization });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff profile not found' });
    }

    staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff profile not found' });
    }
    
    // If name, role, or password updated, update User model too
    if (req.body.firstName || req.body.lastName || req.body.role || req.body.password) {
      const user = await User.findById(staff.user);
      if (user) {
        if (req.body.firstName && req.body.lastName) {
          user.name = `${req.body.firstName} ${req.body.lastName}`;
        }
        if (req.body.role) {
          user.role = req.body.role;
        }
        if (req.body.password) {
          user.password = req.body.password;
        }
        await user.save();
      }
    }

    res.status(200).json({ success: true, data: staff });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete/Terminate staff
// @route   DELETE /api/v1/tenant/staff/:id
// @access  Private (Organization Admin)
export const deleteStaff = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ _id: req.params.id, organization: req.user.organization });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff profile not found' });
    }

    // Delete both Staff profile and User account
    if (staff.user) {
      await User.findByIdAndDelete(staff.user);
    }
    await staff.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- Organization Profile ---

// @desc    Get organization profile
// @route   GET /api/v1/tenant/profile
// @access  Private (Organization Admin)
export const getOrganizationProfile = async (req: AuthRequest, res: Response) => {
  try {
    const org = await Organization.findById(req.user.organization);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    res.status(200).json({ success: true, data: org });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update organization profile
// @route   PUT /api/v1/tenant/profile
// @access  Private (Organization Admin)
export const updateOrganizationProfile = async (req: AuthRequest, res: Response) => {
  try {
    const org = await Organization.findByIdAndUpdate(req.user.organization, req.body, {
      new: true,
      runValidators: true
    });
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    res.status(200).json({ success: true, data: org });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
