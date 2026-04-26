import { Request, Response } from 'express';
import Student from '../models/Student';
import Assignment from '../models/Assignment';
import Submission from '../models/Submission';
import Grade from '../models/Grade';
import StudentAttendance from '../models/StudentAttendance';
import Material from '../models/Material';
import ExamRoutine from '../models/ExamRoutine';
import FeeRecord from '../models/FeeRecord';
import Announcement from '../models/Announcement';
import LibraryBook from '../models/LibraryBook';
import BorrowedBook from '../models/BorrowedBook';
import Schedule from '../models/Schedule';
import Leave from '../models/Leave';
import Fee from '../models/Fee';
import { AuthRequest } from '../middlewares/auth';
import mongoose from 'mongoose';

// Full list of academic months starting from April
const ACADEMIC_MONTHS = [
  'April', 'May', 'June', 'July', 'August', 'September', 
  'October', 'November', 'December', 'January', 'February', 'March'
];

// Helper to get index of current month in academic cycle (April=0)
const getCurrentAcademicMonthIndex = () => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  return (currentMonth - 3 + 12) % 12; // April is 3
};

// @desc    Get student dashboard stats
// @route   GET /api/v1/student/dashboard/stats
// @access  Private/Student
export const getStudentDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('class');
    if (!student) return res.status(404).json({ success: false, message: 'Student record not found' });

    // Get average grade
    const grades = await Grade.find({ student: student._id });
    const avgGrade = grades.length > 0 
      ? (grades.reduce((acc, curr) => acc + curr.totalMarks, 0) / grades.length).toFixed(1) 
      : 0;

    // Get attendance %
    const attendance = await StudentAttendance.find({ student: student._id });
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const attendanceRate = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : 100;

    // Get pending assignments count
    const submissions = await Submission.find({ student: student._id });
    const submittedIds = submissions.map(s => s.assignment.toString());
    const pendingAssignments = await Assignment.countDocuments({ 
      class: student.class, 
      _id: { $nin: submittedIds } 
    });

    // Get fee status
    const currentIndex = getCurrentAcademicMonthIndex();
    const feeRecords = await FeeRecord.find({ student: student._id });
    const paidDescriptions = feeRecords.filter(r => r.status === 'Paid').map(r => r.description);
    
    const className = (student.class as any)?.name;
    const feeStructures = await Fee.find({ 
      organization: req.user.organization,
      $or: [
        { targetGrade: className },
        { targetGrade: '' },
        { targetGrade: { $exists: false } }
      ]
    });

    let totalDue = 0;

    feeStructures.forEach(f => {
      if (f.frequency === 'Monthly') {
        // Add to due only for months up to current
        ACADEMIC_MONTHS.forEach((month, idx) => {
          if (idx <= currentIndex) {
            const desc = `${f.name} - ${month}`;
            if (!paidDescriptions.includes(desc)) {
              totalDue += f.amount;
            }
          }
        });
      } else {
        if (!paidDescriptions.includes(f.name)) {
          totalDue += f.amount;
        }
      }
    });

    // Add any manual records that are not paid
    const manualDue = feeRecords
      .filter(r => r.status !== 'Paid' && !feeStructures.some(s => r.description.startsWith(s.name)))
      .reduce((acc, curr) => acc + curr.amount, 0);

    totalDue += manualDue;

    res.status(200).json({
      success: true,
      data: {
        avgGrade,
        attendanceRate,
        pendingAssignments,
        totalDue,
        studentName: student.firstName
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get fee history
// @route   GET /api/v1/student/fees
// @access  Private/Student
export const getFeeRecords = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('class');
    if (!student) return res.status(404).json({ success: false, message: 'Student record not found' });

    const className = (student.class as any)?.name;
    const currentIndex = getCurrentAcademicMonthIndex();
    
    // Get actual fee records
    const records = await FeeRecord.find({ student: student._id }).sort('-date');
    const paidDescriptions = records.filter(r => r.status === 'Paid').map(r => r.description);
    
    // Get fee structures
    const feeStructures = await Fee.find({ 
      organization: req.user.organization,
      $or: [
        { targetGrade: className },
        { targetGrade: '' },
        { targetGrade: { $exists: false } }
      ]
    });

    const structureRecords: any[] = [];

    feeStructures.forEach(f => {
      if (f.frequency === 'Monthly') {
        // Show all 12 months but mark past/present ones as due
        ACADEMIC_MONTHS.forEach((month, idx) => {
          const desc = `${f.name} - ${month}`;
          if (!paidDescriptions.includes(desc)) {
            const existingPending = records.find(r => r.description === desc);
            if (!existingPending) {
              const date = new Date();
              const year = date.getFullYear();
              const virtualDate = new Date(year, 3 + idx, 15); 
              
              structureRecords.push({
                _id: `${f._id}-${month}`,
                description: desc,
                amount: f.amount,
                date: virtualDate,
                status: idx <= currentIndex ? 'Pending' : 'Upcoming',
                method: '-',
                category: f.category,
                frequency: 'Monthly'
              });
            }
          }
        });
      } else {
        if (!paidDescriptions.includes(f.name) && !records.some(r => r.description === f.name)) {
          structureRecords.push({
            _id: f._id,
            description: f.name,
            amount: f.amount,
            date: f.createdAt,
            status: 'Pending',
            method: '-',
            category: f.category,
            frequency: f.frequency
          });
        }
      }
    });

    const allRecords = [...records, ...structureRecords].sort((a, b) => 
      new Date((b as any).date).getTime() - new Date((a as any).date).getTime()
    );

    res.status(200).json({ success: true, data: allRecords });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await Announcement.find({ organization: req.user.organization, category: { $in: ['STUDENT', 'ALL'] } }).sort('-date');
    res.status(200).json({ success: true, data: announcements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student record not found' });
    const assignments = await Assignment.find({ class: student.class }).populate('tutor', 'firstName lastName').lean();
    const submissions = await Submission.find({ student: student._id });
    const data = assignments.map(a => {
      const submission = submissions.find(s => s.assignment.toString() === a._id.toString());
      return { ...a, status: submission ? 'Submitted' : (new Date(a.dueDate) < new Date() ? 'Overdue' : 'Pending'), submissionDate: (submission as any)?.submittedAt || (submission as any)?.createdAt, grade: submission?.status === 'Graded' ? 'Graded' : 'N/A' };
    });
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student record not found' });
    
    const submission = await Submission.create({ 
      ...req.body, 
      student: student._id, 
      organization: req.user.organization, 
      branch: student.branch || (student as any).organization 
    });
    
    res.status(201).json({ success: true, data: submission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentCourses = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student record not found' });
    const schedules = await Schedule.find({ class: student.class }).populate('staff');
    const scheduleSubjects = schedules.map(s => s.subject);
    const materials = await Material.find({ class: student.class });
    const materialSubjects = materials.map(m => m.subject);
    const allSubjects = [...new Set([...scheduleSubjects, ...materialSubjects])];
    const courses = allSubjects.map(s => {
      const sch = schedules.find(sc => sc.subject === s);
      const matCount = materials.filter(m => m.subject === s).length;
      return { id: s, title: s, tutor: sch?.staff ? `${(sch.staff as any).firstName} ${(sch.staff as any).lastName}` : 'Multiple Tutors', progress: 0, color: 'brand', materialCount: matCount };
    });
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseMaterials = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const materials = await Material.find({ class: student?.class }).populate('uploadedBy', 'firstName lastName').sort('-date');
    res.status(200).json({ success: true, data: materials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExamRoutine = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const routine = await ExamRoutine.find({ class: student?.class }).sort('date');
    res.status(200).json({ success: true, data: routine });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResults = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const results = await Grade.find({ student: student?._id }).sort('-createdAt');
    res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBorrowedBooks = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const borrowed = await BorrowedBook.find({ student: student?._id, status: { $ne: 'Returned' } }).populate('book');
    res.status(200).json({ success: true, data: borrowed });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchLibrary = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;
    const books = await LibraryBook.find({ organization: req.user.organization, $or: [{ title: { $regex: query as string, $options: 'i' } }, { author: { $regex: query as string, $options: 'i' } }] });
    res.status(200).json({ success: true, data: books });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('class').populate('organization');
    const attendance = await StudentAttendance.find({ student: student?._id });
    res.status(200).json({ success: true, data: { ...student?.toObject(), attendanceRecords: attendance } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const leave = await Leave.create({ 
      ...req.body, 
      user: req.user._id, 
      student: student?._id,
      organization: req.user.organization, 
      branch: student?.branch, 
      status: 'Pending' 
    });
    res.status(201).json({ success: true, data: leave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaveHistory = async (req: AuthRequest, res: Response) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, data: leaves });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTimetable = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const schedules = await Schedule.find({ class: student?.class }).populate('staff');
    res.status(200).json({ success: true, data: schedules });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
