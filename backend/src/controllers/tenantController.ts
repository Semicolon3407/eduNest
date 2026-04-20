import { Request, Response } from 'express';
import Branch from '../models/Branch';
import Staff from '../models/Staff';
import User from '../models/User';
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
    req.body.organization = req.user.organization;
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, data: branch });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update a branch
// @route   PUT /api/v1/tenant/branches/:id
// @access  Private (Organization Admin)
export const updateBranch = async (req: AuthRequest, res: Response) => {
  try {
    let branch = await Branch.findOne({ _id: req.params.id, organization: req.user.organization });
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    res.status(200).json({ success: true, data: branch });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { firstName, lastName, email, role, department, employeeId, branch: branchId, phone, personalEmail, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // 1. Create User
    const user = await User.create([{
      name: `${firstName} ${lastName}`,
      email,
      password: password || 'EduNest@123', // Default strong password
      role,
      organization: req.user.organization
    }], { session });

    // 2. Create Staff Profile
    const staff = await Staff.create([{
      user: user[0]._id,
      organization: req.user.organization,
      branch: branchId,
      employeeId,
      department,
      firstName,
      lastName,
      phone,
      personalEmail,
      status: 'Active'
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: staff[0] });
  } catch (err: any) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
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
    
    // If name or role updated, update User model too
    if (req.body.firstName || req.body.lastName || req.body.role) {
      const updateData: any = {};
      if (req.body.firstName && req.body.lastName) updateData.name = `${req.body.firstName} ${req.body.lastName}`;
      if (req.body.role) updateData.role = req.body.role;
      
      await User.findByIdAndUpdate(staff?.user, updateData);
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const staff = await Staff.findOne({ _id: req.params.id, organization: req.user.organization });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff profile not found' });
    }

    // Delete both Staff profile and User account
    await User.findByIdAndDelete(staff.user).session(session);
    await staff.deleteOne({ session });

    await session.commitTransaction();
    res.status(200).json({ success: true, data: {} });
  } catch (err: any) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};
