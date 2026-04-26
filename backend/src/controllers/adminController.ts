import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Student from '../models/Student';
import Class from '../models/Class';
import Fee from '../models/Fee';
import Inventory from '../models/Inventory';
import Schedule from '../models/Schedule';
import User from '../models/User';
import FeeRecord from '../models/FeeRecord';
import Staff from '../models/Staff';
import ExamRoutine from '../models/ExamRoutine';
import Attendance from '../models/Attendance';
import Leave from '../models/Leave';
import sendEmail from '../utils/sendEmail';
import mongoose from 'mongoose';

// Full list of academic months starting from April
const ACADEMIC_MONTHS = [
  'April', 'May', 'June', 'July', 'August', 'September', 
  'October', 'November', 'December', 'January', 'February', 'March'
];

export const adminController = {
  // Students
  enrollStudent: async (req: AuthRequest, res: Response) => {
    try {
      const orgId = req.user.organization;
      
      // Auto-generate admission number: ADM-YYYY-XXXX
      const year = new Date().getFullYear();
      const count = await Student.countDocuments({ organization: orgId });
      const admissionNumber = `ADM-${year}-${(count + 1).toString().padStart(4, '0')}`;

      const month = new Date().getMonth(); 
      const currentAcademicYear = month >= 3 ? `${year}-${(year + 1).toString().slice(-2)}` : `${year - 1}-${year.toString().slice(-2)}`;

      // 1. Create User Account for Student
      const password = req.body.password;
      if (!password) {
        return res.status(400).json({ success: false, message: 'Initial password is required.' });
      }
      const user = await User.create({
        name: `${req.body.firstName} ${req.body.lastName}`,
        email: req.body.studentEmail || `std${admissionNumber.toLowerCase().replace(/-/g, '')}@edunest.com`,
        password,
        role: 'STUDENT',
        organization: orgId
      });

      // 2. Create Student Profile
      const studentData = { 
        ...req.body, 
        user: user._id,
        admissionNumber,
        status: 'Active',
        academicYear: currentAcademicYear,
        organization: orgId 
      };
      const student = await Student.create(studentData);
      
      // Update class strength
      await Class.findByIdAndUpdate(student.class, { $inc: { strength: 1 } });

      // 3. Send Credentials Email
      if (req.body.personalEmail) {
        const message = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px; color: #1e293b;">
            <h2 style="color: #6366f1; text-align: center; font-size: 24px;">Welcome to eduNest!</h2>
            <p>Dear <b>${req.body.firstName} ${req.body.lastName}</b>,</p>
            <p>Your institutional student account has been successfully initialized. You can now access your learning dashboard and resources using the credentials below:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 16px; margin: 25px 0; border: 1px solid #f1f5f9;">
              <p style="margin: 8px 0;"><b>Institutional ID:</b> ${admissionNumber}</p>
              <p style="margin: 8px 0;"><b>Portal Login:</b> ${user.email}</p>
              <p style="margin: 8px 0;"><b>Access Password:</b> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${password}</code></p>
            </div>
            
            <p style="font-size: 0.9em; line-height: 1.6;">Please log in to the portal and update your password for security. Your teacher/branch administrator will guide you through the next steps of your academic journey.</p>
            
            <p style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
              This is an automated system notification from eduNest ERP. See you in class!
            </p>
          </div>
        `;

        try {
          await sendEmail({
            email: req.body.personalEmail,
            subject: 'Your Account is Ready - eduNest Student Portal',
            message
          });
        } catch (emailError) {
          console.error('Failed to send student enrollment email:', emailError);
        }
      }
      
      res.status(201).json({ success: true, data: student });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getStudents: async (req: AuthRequest, res: Response) => {
    try {
      const orgId = req.user.organization;

      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const currentAY = month >= 3 ? `${year}-${(year + 1).toString().slice(-2)}` : `${year - 1}-${year.toString().slice(-2)}`;

      // Legacy fix: Set Active status and Current Academic Year for students who don't have them
      await Student.updateMany(
        { organization: orgId, status: 'Pending' },
        { $set: { status: 'Active' } }
      );
      await Student.updateMany(
        { organization: orgId, academicYear: { $exists: false } },
        { $set: { academicYear: currentAY } }
      );
      
      // Auto-inactivate students from previous academic years
      await Student.updateMany(
        { organization: orgId, status: 'Active', academicYear: { $ne: currentAY } },
        { $set: { status: 'Inactive' } }
      );

      const students = await Student.find({ organization: orgId })
        .populate('class')
        .populate('branch');
        
      res.status(200).json({ success: true, data: students });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateStudent: async (req: AuthRequest, res: Response) => {
    try {
      const student = await Student.findOneAndUpdate(
        { _id: req.params.id, organization: req.user.organization },
        req.body,
        { new: true, runValidators: true }
      );
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      res.status(200).json({ success: true, data: student });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteStudent: async (req: AuthRequest, res: Response) => {
    try {
      const student = await Student.findOneAndDelete({ _id: req.params.id, organization: req.user.organization });
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      
      // Decement class strength
      await Class.findByIdAndUpdate(student.class, { $inc: { strength: -1 } });
      
      res.status(200).json({ success: true, message: 'Student removed' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Classes
  createClass: async (req: AuthRequest, res: Response) => {
    try {
      const classData = { ...req.body, organization: req.user.organization };
      const newClass = await Class.create(classData);
      res.status(201).json({ success: true, data: newClass });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getClasses: async (req: AuthRequest, res: Response) => {
    try {
      const classes = await Class.find({ organization: req.user.organization })
        .populate('branch');
      res.status(200).json({ success: true, data: classes });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteClass: async (req: AuthRequest, res: Response) => {
    try {
      const cls = await Class.findOneAndDelete({ _id: req.params.id, organization: req.user.organization });
      if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
      res.status(200).json({ success: true, message: 'Class removed' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Fees
  createFee: async (req: AuthRequest, res: Response) => {
    try {
      const fee = await Fee.create({ ...req.body, organization: req.user.organization });
      res.status(201).json({ success: true, data: fee });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getFees: async (req: AuthRequest, res: Response) => {
    try {
      const fees = await Fee.find({ organization: req.user.organization });
      res.status(200).json({ success: true, data: fees });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateFee: async (req: AuthRequest, res: Response) => {
    try {
      const fee = await Fee.findOneAndUpdate(
        { _id: req.params.id, organization: req.user.organization },
        req.body,
        { new: true, runValidators: true }
      );
      if (!fee) return res.status(404).json({ success: false, message: 'Fee not found' });
      res.status(200).json({ success: true, data: fee });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteFee: async (req: AuthRequest, res: Response) => {
    try {
      const fee = await Fee.findOneAndDelete({ _id: req.params.id, organization: req.user.organization });
      if (!fee) return res.status(404).json({ success: false, message: 'Fee not found' });
      res.status(200).json({ success: true, message: 'Fee removed' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getFeeRecords: async (req: AuthRequest, res: Response) => {
    try {
      const { status, studentId, branchId, classId } = req.query;
      const orgId = req.user.organization;
      
      const studentQuery: any = { organization: orgId, status: 'Active' };
      if (studentId) studentQuery._id = studentId;
      if (branchId) studentQuery.branch = branchId;
      if (classId) studentQuery.class = classId;
      
      const students = await Student.find(studentQuery).populate('class branch');
      const studentIds = students.map(s => s._id);

      const recordQuery: any = { organization: orgId, student: { $in: studentIds } };
      if (status) recordQuery.status = status;
      
      const existingRecords = await FeeRecord.find(recordQuery)
        .populate({
          path: 'student',
          populate: { path: 'class branch' }
        })
        .sort({ createdAt: -1 });

      const allFees = await Fee.find({ organization: orgId });
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentIndex = (currentMonth - 3 + 12) % 12;

      let allVirtualRecords: any[] = [];

      if (!status || status === 'Pending') {
        const existingRecordsUnfiltered = await FeeRecord.find({ organization: orgId, student: { $in: studentIds } });

        for (const student of students) {
          const className = (student.class as any)?.name;
          const studentFees = allFees.filter(f => !f.targetGrade || f.targetGrade === className);
          const studentExistingRecords = existingRecordsUnfiltered.filter(r => r.student.toString() === student._id.toString());
          const paidDescriptions = studentExistingRecords.filter(r => r.status === 'Paid').map(r => r.description);

          studentFees.forEach(f => {
            if (f.frequency === 'Monthly') {
              ACADEMIC_MONTHS.forEach((month, idx) => {
                const desc = `${f.name} - ${month}`;
                if (!paidDescriptions.includes(desc)) {
                  const existing = studentExistingRecords.find(r => r.description === desc);
                  if (!existing && idx <= currentIndex) {
                    if (!status || status === 'Pending') {
                      allVirtualRecords.push({
                        _id: `${f._id}-${month}-${student._id}`,
                        description: desc,
                        amount: f.amount,
                        date: new Date(now.getFullYear(), 3 + idx, 15),
                        status: 'Pending',
                        method: '-',
                        category: f.category,
                        frequency: 'Monthly',
                        student: student
                      });
                    }
                  }
                }
              });
            } else {
              if (!paidDescriptions.includes(f.name) && !studentExistingRecords.some(r => r.description === f.name)) {
                if (!status || status === 'Pending') {
                  allVirtualRecords.push({
                    _id: `${f._id}-${student._id}`,
                    description: f.name,
                    amount: f.amount,
                    date: f.createdAt,
                    status: 'Pending',
                    method: '-',
                    category: f.category,
                    frequency: f.frequency,
                    student: student
                  });
                }
              }
            }
          });
        }
      }

      const allRecords = [...existingRecords, ...allVirtualRecords].sort((a, b) => 
        new Date((b as any).date).getTime() - new Date((a as any).date).getTime()
      );

      res.status(200).json({ success: true, data: allRecords });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateFeeRecordStatus: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, transactionId, method, studentId, amount, description } = req.body;
      
      let record;
      if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
        record = await FeeRecord.findOneAndUpdate(
          { _id: id, organization: req.user.organization },
          { status, transactionId, method, date: new Date() },
          { new: true }
        );
      }
      
      if (!record && studentId) {
        record = await FeeRecord.create({
          student: studentId,
          organization: req.user.organization,
          amount,
          description,
          status,
          method,
          transactionId,
          date: new Date()
        });
      }

      if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
      
      res.status(200).json({ success: true, data: record });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteFeeRecord: async (req: AuthRequest, res: Response) => {
    try {
      const record = await FeeRecord.findOneAndDelete({
        _id: req.params.id,
        organization: req.user.organization
      });
      if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
      res.status(200).json({ success: true, message: 'Record removed' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  sendFeeReminder: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const record = await FeeRecord.findOne({ _id: id, organization: req.user.organization })
        .populate('student');
      
      if (!record || !record.student) {
        return res.status(404).json({ success: false, message: 'Fee record or student not found' });
      }

      const student: any = record.student;
      const email = student.personalEmail || student.studentEmail;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Student has no email address' });
      }

      const message = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px; color: #1e293b;">
          <h2 style="color: #6366f1; text-align: center;">Fee Payment Reminder</h2>
          <p>Dear <b>${student.firstName} ${student.lastName}</b>,</p>
          <p>This is a friendly reminder regarding your pending fee payment for <b>${record.description}</b>.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 16px; margin: 25px 0; border: 1px solid #f1f5f9;">
            <p style="margin: 8px 0;"><b>Amount Due:</b> Rs. ${record.amount.toLocaleString()}</p>
            <p style="margin: 8px 0;"><b>Status:</b> ${record.status}</p>
          </div>
          
          <p>Please log in to the student portal to complete your payment using eSewa or other available methods.</p>
          
          <p style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8;">
            EduNest Institutional Fee Management System
          </p>
        </div>
      `;

      await sendEmail({
        email,
        subject: `Payment Reminder: ${record.description}`,
        message
      });

      res.status(200).json({ success: true, message: 'Reminder sent successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Inventory
  getInventory: async (req: AuthRequest, res: Response) => {
    try {
      const inventory = await Inventory.find({ organization: req.user.organization });
      res.status(200).json({ success: true, data: inventory });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createAsset: async (req: AuthRequest, res: Response) => {
    try {
      const assetData = { ...req.body, organization: req.user.organization };
      const asset = await Inventory.create(assetData);
      res.status(201).json({ success: true, data: asset });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Schedules
  getSchedules: async (req: AuthRequest, res: Response) => {
    try {
      const { type, classId, staffId } = req.query;
      const query: any = { organization: req.user.organization };
      if (type) query.type = type;
      if (classId) query.class = classId;
      if (staffId) query.staff = staffId;
      
      const schedules = await Schedule.find(query)
        .populate('class')
        .populate('staff');
      res.status(200).json({ success: true, data: schedules });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createSchedule: async (req: AuthRequest, res: Response) => {
    try {
      const scheduleData = { ...req.body, organization: req.user.organization };
      const schedule = await Schedule.create(scheduleData);
      res.status(201).json({ success: true, data: schedule });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteSchedule: async (req: AuthRequest, res: Response) => {
    try {
      const schedule = await Schedule.findOneAndDelete({ _id: req.params.id, organization: req.user.organization });
      if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });
      res.status(200).json({ success: true, message: 'Schedule removed' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Dashboard Stats
  getDashboardStats: async (req: AuthRequest, res: Response) => {
    try {
      const orgId = req.user.organization;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [studentCount, activeClasses, feeStats, dailyCollection, inventoryItems] = await Promise.all([
        Student.countDocuments({ organization: orgId }),
        Class.countDocuments({ organization: orgId, status: 'Active' }),
        FeeRecord.aggregate([
          { $match: { organization: orgId } },
          { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]),
        FeeRecord.aggregate([
          { 
            $match: { 
              organization: orgId, 
              status: 'Paid',
              date: { $gte: today }
            } 
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Inventory.aggregate([
          { $match: { organization: orgId } },
          { $group: { _id: null, total: { $sum: '$quantity' } } }
        ])
      ]);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0,0,0,0);

      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      lastMonth.setDate(1);
      lastMonth.setHours(0,0,0,0);

      const [thisMonthAdmissions, lastMonthAdmissions] = await Promise.all([
        Student.countDocuments({ organization: orgId, createdAt: { $gte: thisMonth } }),
        Student.countDocuments({ organization: orgId, createdAt: { $gte: lastMonth, $lt: thisMonth } })
      ]);

      const admissionTrend = lastMonthAdmissions > 0 
        ? Math.round(((thisMonthAdmissions - lastMonthAdmissions) / lastMonthAdmissions) * 100)
        : thisMonthAdmissions > 0 ? 100 : 0;

      res.status(200).json({
        success: true,
        data: {
          studentCount,
          activeClasses,
          fees: feeStats,
          collectedToday: dailyCollection[0]?.total || 0,
          inventoryCount: inventoryItems[0]?.total || 0,
          admissionTrend: admissionTrend >= 0 ? `+${admissionTrend}%` : `${admissionTrend}%`
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getMyProfile: async (req: AuthRequest, res: Response) => {
    try {
      const staff = await Staff.findOne({ 
        user: req.user._id,
        organization: req.user.organization 
      }).populate('branch', 'name').populate('user');

      if (!staff) {
        return res.status(404).json({ success: false, message: 'Staff record not found' });
      }

      const attendance = await Attendance.find({ staff: staff._id }).sort({ date: -1 });
      const leaves = await Leave.find({ staff: staff._id }).sort({ appliedDate: -1 });

      const presentCount = attendance.filter(a => a.status === 'Present').length;
      const absentCount = attendance.filter(a => a.status === 'Absent').length;
      const lateCount = attendance.filter(a => a.status === 'Late').length;
      const attendanceRate = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : 100;

      res.status(200).json({ 
        success: true, 
        data: { 
          ...staff.toObject(), 
          attendanceRecords: attendance,
          leaveHistory: leaves,
          attendanceStats: {
            rate: attendanceRate,
            total: attendance.length,
            present: presentCount,
            absent: absentCount,
            late: lateCount
          }
        } 
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  requestLeave: async (req: AuthRequest, res: Response) => {
    try {
      const staff = await Staff.findOne({ user: req.user._id, organization: req.user.organization });
      if (!staff) return res.status(404).json({ success: false, message: 'Staff record not found' });

      const leave = await Leave.create({
        ...req.body,
        staff: staff._id,
        organization: req.user.organization,
        status: 'Pending'
      });

      res.status(201).json({ success: true, data: leave });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Exam Routines
  createExamRoutine: async (req: AuthRequest, res: Response) => {
    try {
      const { subject, date, time, room, classId, branchId } = req.body;
      const routine = await ExamRoutine.create({
        subject,
        date,
        time,
        room,
        class: classId,
        branch: branchId,
        organization: req.user.organization
      });
      res.status(201).json({ success: true, data: routine });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getExamRoutines: async (req: AuthRequest, res: Response) => {
    try {
      const { classId, branchId } = req.query;
      const query: any = { organization: req.user.organization };
      if (classId) query.class = classId;
      if (branchId) query.branch = branchId;

      const routines = await ExamRoutine.find(query)
        .populate('class', 'name')
        .populate('branch', 'name')
        .sort({ date: 1 });
      
      res.status(200).json({ success: true, data: routines });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteExamRoutine: async (req: AuthRequest, res: Response) => {
    try {
      const routine = await ExamRoutine.findOneAndDelete({ 
        _id: req.params.id, 
        organization: req.user.organization 
      });
      if (!routine) return res.status(404).json({ success: false, message: 'Routine not found' });
      res.status(200).json({ success: true, message: 'Routine deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
