import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Staff from '../models/Staff';
import Attendance from '../models/Attendance';
import Leave from '../models/Leave';
import Payroll from '../models/Payroll';
import Branch from '../models/Branch';
import StaffDocument from '../models/StaffDocument';
import sendEmail from '../utils/sendEmail';


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
    const { date } = req.query;
    const query: any = { organization: req.user.organization };

    if (date) {
      const searchDate = new Date(date as string);
      searchDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(searchDate.getTime() + 24 * 60 * 60 * 1000);
      
      // Filter by appliedDate or if the leave spans across this date
      query.$or = [
        { appliedDate: { $gte: searchDate, $lt: nextDate } },
        { 
          startDate: { $lte: searchDate },
          endDate: { $gte: searchDate }
        }
      ];
    }

    const leaves = await Leave.find(query)
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
    const { month, year } = req.query;
    const query: any = { organization: req.user.organization };
    if (month && month !== 'All Months') query.month = month;
    if (year && year !== 'All Years') query.year = Number(year);

    const records = await Payroll.find(query)
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
    ).populate('staff', 'firstName lastName personalEmail employeeId');
    
    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll record not found' });

    // Send Email
    if (payroll.staff && (payroll.staff as any).personalEmail) {
      const emailContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #6366f1; text-align: center;">Institutional Salary Advice</h2>
          <p>Dear <b>${(payroll.staff as any).firstName}</b>,</p>
          <p>We are pleased to inform you that your salary for the period <b>${payroll.month} ${payroll.year}</b> has been successfully disbursed.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #f1f5f9;">
            <p style="margin: 8px 0; color: #64748b; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.05em;">Salary Breakdown</p>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 10px;">
              <p style="margin: 8px 0; display: flex; justify-content: space-between;"><span>Basic Salary:</span> <b>Rs. ${payroll.baseSalary?.toLocaleString()}</b></p>
              <p style="margin: 8px 0; display: flex; justify-content: space-between;"><span>Periodic Bonuses:</span> <b>Rs. ${payroll.bonuses?.toLocaleString()}</b></p>
              <p style="margin: 8px 0; display: flex; justify-content: space-between; color: #ef4444;"><span>Statutory Deductions:</span> <b>- Rs. ${payroll.deductions?.toLocaleString()}</b></p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #6366f1;">
                <p style="margin: 0; font-size: 1.2em; color: #10b981; display: flex; justify-content: space-between;"><b>Net Payout:</b> <b>Rs. ${payroll.netPay?.toLocaleString()}</b></p>
              </div>
            </div>
          </div>
          
          <p style="color: #64748b; font-size: 0.9em;">You can view and download your detailed PDF payslip via the eduNest portal's Document Center.</p>
          <p style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; text-align: center;">This is a system-generated salary advice. Please do not reply to this email.</p>
        </div>
      `;
      
      sendEmail({
        email: (payroll.staff as any).personalEmail,
        subject: `Salary Disbursed: ${payroll.month} ${payroll.year} - eduNest`,
        message: emailContent
      });
    }

    res.status(200).json({ success: true, data: payroll });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const disburseAllPayroll = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.body;
    
    // Find all pending records for this month/year
    const pendingRecords = await Payroll.find({
      organization: req.user.organization,
      month,
      year,
      status: 'Pending'
    }).populate('staff', 'firstName lastName personalEmail employeeId');

    if (pendingRecords.length === 0) {
      return res.status(200).json({ success: true, modifiedCount: 0 });
    }

    // Update them all
    await Payroll.updateMany(
      { organization: req.user.organization, month, year, status: 'Pending' },
      { status: 'Processed', paidAt: new Date() }
    );

    // Send Emails asynchronously
    pendingRecords.forEach(payroll => {
      if (payroll.staff && (payroll.staff as any).personalEmail) {
        const emailContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #6366f1; text-align: center;">Institutional Salary Advice</h2>
            <p>Dear <b>${(payroll.staff as any).firstName}</b>,</p>
            <p>We are pleased to inform you that your salary for the period <b>${payroll.month} ${payroll.year}</b> has been successfully disbursed.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #f1f5f9;">
              <p style="margin: 8px 0; color: #64748b; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.05em;">Salary Breakdown</p>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 10px;">
                <p style="margin: 8px 0; display: flex; justify-content: space-between;"><span>Basic Salary:</span> <b>Rs. ${payroll.baseSalary?.toLocaleString()}</b></p>
                <p style="margin: 8px 0; display: flex; justify-content: space-between;"><span>Periodic Bonuses:</span> <b>Rs. ${payroll.bonuses?.toLocaleString()}</b></p>
                <p style="margin: 8px 0; display: flex; justify-content: space-between; color: #ef4444;"><span>Statutory Deductions:</span> <b>- Rs. ${payroll.deductions?.toLocaleString()}</b></p>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #6366f1;">
                  <p style="margin: 0; font-size: 1.2em; color: #10b981; display: flex; justify-content: space-between;"><b>Net Payout:</b> <b>Rs. ${payroll.netPay?.toLocaleString()}</b></p>
                </div>
              </div>
            </div>
            
            <p style="color: #64748b; font-size: 0.9em;">You can view and download your detailed PDF payslip via the eduNest portal's Document Center.</p>
            <p style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; text-align: center;">This is a system-generated salary advice. Please do not reply to this email.</p>
          </div>
        `;
        
        sendEmail({
          email: (payroll.staff as any).personalEmail,
          subject: `Salary Disbursed: ${payroll.month} ${payroll.year} - eduNest`,
          message: emailContent
        });
      }
    });

    res.status(200).json({ success: true, modifiedCount: pendingRecords.length });
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
    const { staffId } = req.query;
    const query: any = { organization: req.user.organization };
    if (staffId) query.staff = staffId;

    const docs = await StaffDocument.find(query)
      .populate('staff', 'firstName lastName employeeId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const uploadStaffDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { staffId, documents } = req.body;

    if (!documents || !Array.isArray(documents)) {
      // Fallback for single document upload if needed
      const { title, category, status } = req.body;
      const doc = await StaffDocument.create({
        organization: req.user.organization,
        staff: staffId,
        title,
        category,
        type: 'PDF',
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        status: status || 'Pending Verification',
        url: '#'
      });
      return res.status(201).json({ success: true, data: doc });
    }

    const createdDocs = await Promise.all(documents.map(doc => 
      StaffDocument.create({
        organization: req.user.organization,
        staff: staffId,
        title: doc.title,
        category: doc.category,
        type: doc.type || 'PDF',
        size: doc.size || `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        status: doc.status || 'Pending Verification',
        url: doc.url || '#'
      })
    ));

    res.status(201).json({ success: true, data: createdDocs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await StaffDocument.findOneAndDelete({
      _id: id,
      organization: req.user.organization
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, status, url, size, type } = req.body;
    
    const doc = await StaffDocument.findOneAndUpdate(
      { _id: id, organization: req.user.organization },
      { title, category, status, url, size, type },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({ success: true, data: doc });
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
