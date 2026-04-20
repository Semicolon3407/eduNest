import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Staff from '../models/Staff';
import Attendance from '../models/Attendance';
import Leave from '../models/Leave';
import Payroll from '../models/Payroll';
import Branch from '../models/Branch';
import StaffDocument from '../models/StaffDocument';


// --- Dashboard & Stats ---
export const getHRDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.user.organization;
    
    const [totalStaff, pendingLeaves, lastPayroll] = await Promise.all([
      Staff.countDocuments({ organization: orgId, status: 'Active' }),
      Leave.countDocuments({ organization: orgId, status: 'Pending' }),
      Payroll.findOne({ organization: orgId }).sort({ createdAt: -1 })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStaff,
        pendingLeaves,
        lastPayroll: lastPayroll?.netPay || 0
      }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- Staff Management ---
export const getHRStaff = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.find({ organization: req.user.organization })
      .populate('user', 'name email role')
      .populate('branch', 'name city');
    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- Attendance & Leave ---
export const getAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;
    const searchDate = date ? new Date(date as string) : new Date();
    searchDate.setHours(0,0,0,0);

    const attendance = await Attendance.find({ 
      organization: req.user.organization,
      date: { $gte: searchDate, $lt: new Date(searchDate.getTime() + 24*60*60*1000) }
    }).populate('staff', 'firstName lastName employeeId');

    res.status(200).json({ success: true, data: attendance });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const markAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { staffId, status, date, clockIn, clockOut } = req.body;
    const attendDate = date ? new Date(date) : new Date();
    attendDate.setHours(0,0,0,0);

    const attendance = await Attendance.findOneAndUpdate(
      { staff: staffId, organization: req.user.organization, date: attendDate },
      { status, clockIn, clockOut },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: attendance });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getLeaveRequests = async (req: AuthRequest, res: Response) => {
  try {
    const leaves = await Leave.find({ organization: req.user.organization })
      .populate('staff', 'firstName lastName designation employeeId')
      .sort({ appliedDate: -1 });
    res.status(200).json({ success: true, data: leaves });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateLeaveStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const leave = await Leave.findOneAndUpdate(
      { _id: id, organization: req.user.organization },
      { status, approvedBy: req.user._id },
      { new: true }
    );
    if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });
    res.status(200).json({ success: true, data: leave });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- Payroll Management ---
export const getPayrollRecords = async (req: AuthRequest, res: Response) => {
  try {
    const records = await Payroll.find({ organization: req.user.organization })
      .populate('staff', 'firstName lastName designation employeeId')
      .populate({
        path: 'staff',
        populate: { path: 'branch', select: 'name' }
      })
      .sort({ year: -1, month: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const setupPayrollRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { staffId, month, year, baseSalary, bonuses, deductions } = req.body;
    
    // Calculate netPay
    const netPay = Number(baseSalary) + Number(bonuses || 0) - Number(deductions || 0);

    const payroll = await Payroll.findOneAndUpdate(
      { staff: staffId, month, year, organization: req.user.organization },
      { 
        baseSalary, 
        bonuses, 
        deductions, 
        netPay,
        status: 'Pending' // Reset to pending if updated
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: payroll });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const processPayroll = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.body;
    const staffs = await Staff.find({ organization: req.user.organization, status: 'Active' });

    const results = [];
    for (const staff of staffs) {
      // Only create if it doesn't exist
      const existing = await Payroll.findOne({ staff: staff._id, month, year, organization: req.user.organization });
      if (!existing) {
        const netPay = staff.salary; 
        const payroll = await Payroll.create({
          staff: staff._id,
          organization: req.user.organization,
          month,
          year,
          baseSalary: staff.salary,
          bonuses: 0,
          deductions: 0,
          netPay,
          status: 'Pending'
        });
        results.push(payroll);
      } else {
        results.push(existing);
      }
    }

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const disburseIndividualPayroll = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findOneAndUpdate(
      { _id: id, organization: req.user.organization },
      { status: 'Processed', paidAt: new Date() },
      { new: true }
    );
    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll record not found' });
    res.status(200).json({ success: true, data: payroll });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const disburseAllPayroll = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.body;
    const result = await Payroll.updateMany(
      { organization: req.user.organization, month, year, status: 'Pending' },
      { status: 'Processed', paidAt: new Date() }
    );
    res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- Profile & Utilities ---

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ 
      user: req.user._id,
      organization: req.user.organization 
    }).populate('branch', 'name');

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff record not found' });
    }

    res.status(200).json({ success: true, data: staff });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const docs = await StaffDocument.find({ organization: req.user.organization })
      .populate('staff', 'firstName lastName employeeId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const uploadStaffDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { staffId, title, category, status } = req.body;
    
    const doc = await StaffDocument.create({
      organization: req.user.organization,
      staff: staffId,
      title,
      category,
      type: 'PDF', // Mocked format
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`, // Mocked size
      status,
      url: '#' // Mocked URL
    });

    res.status(201).json({ success: true, data: doc });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
export const getBranches = async (req: AuthRequest, res: Response) => {
  try {
    const branches = await Branch.find({ organization: req.user.organization });
    res.status(200).json({ success: true, count: branches.length, data: branches });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
