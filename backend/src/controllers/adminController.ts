import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Student from '../models/Student';
import Class from '../models/Class';
import Fee from '../models/Fee';
import Inventory from '../models/Inventory';
import Schedule from '../models/Schedule';

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

      const studentData = { 
        ...req.body, 
        admissionNumber,
        status: 'Active',
        academicYear: currentAcademicYear,
        organization: orgId 
      };
      const student = await Student.create(studentData);
      
      // Update class strength
      await Class.findByIdAndUpdate(student.class, { $inc: { strength: 1 } });
      
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
      const [studentCount, activeClasses, totalFees, inventoryItems] = await Promise.all([
        Student.countDocuments({ organization: orgId }),
        Class.countDocuments({ organization: orgId, status: 'Active' }),
        Fee.aggregate([
          { $match: { organization: orgId } },
          { $group: { _id: '$status', total: { $sum: '$amount' } } }
        ]),
        Inventory.aggregate([
          { $match: { organization: orgId } },
          { $group: { _id: null, total: { $sum: '$quantity' } } }
        ])
      ]);

      res.status(200).json({
        success: true,
        data: {
          studentCount,
          activeClasses,
          fees: totalFees,
          inventoryCount: inventoryItems[0]?.total || 0
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
