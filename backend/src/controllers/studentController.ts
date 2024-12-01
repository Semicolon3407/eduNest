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
import { AuthRequest } from '../middlewares/auth';
import mongoose from 'mongoose';

// @desc    Get student dashboard stats
// @route   GET /api/v1/student/dashboard/stats
// @access  Private/Student
export const getStudentDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
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
    const feeRecords = await FeeRecord.find({ student: student._id });
    const totalDue = feeRecords.filter(f => f.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

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

// @desc    Get student announcements
// @route   GET /api/v1/student/announcements
// @access  Private/Student
export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await Announcement.find({
      organization: req.user.organization,
      category: { $in: ['STUDENT', 'ALL'] }
    }).sort('-date');
    res.status(200).json({ success: true, data: announcements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student assignments
// @route   GET /api/v1/student/assignments
// @access  Private/Student
export const getStudentAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student record not found' });

    const assignments = await Assignment.find({ class: student.class })
      .populate('tutor', 'firstName lastName')
      .lean();

    const submissions = await Submission.find({ student: student._id });

    const data = assignments.map(a => {
      const submission = submissions.find(s => s.assignment.toString() === a._id.toString());
      return {
        ...a,
        status: submission ? (submission.status === 'Graded' ? 'Submitted' : 'Submitted') : (new Date(a.dueDate) < new Date() ? 'Overdue' : 'Pending'),
        submissionDate: (submission as any)?.submittedAt || (submission as any)?.createdAt,
        grade: submission?.status === 'Graded' ? 'Graded' : 'N/A'
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit assignment
// @route   POST /api/v1/student/assignments/submit
// @access  Private/Student
export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student record not found' });

    const submission = await Submission.create({
      ...req.body,
      student: student._id,
      organization: req.user.organization,
      branch: student.branch
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student courses
// @route   GET /api/v1/student/courses
// @access  Private/Student
export const getStudentCourses = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student record not found' });

    // Get subjects from schedules
    const schedules = await Schedule.find({ class: student.class }).populate('staff');
    const scheduleSubjects = schedules.map(s => s.subject);
    
    // Get subjects from uploaded materials to ensure visibility
    const materials = await Material.find({ class: student.class });
    const materialSubjects = materials.map(m => m.subject);

    const allSubjects = [...new Set([...scheduleSubjects, ...materialSubjects])];
    
    const courses = allSubjects.map(s => {
      const sch = schedules.find(sc => sc.subject === s);
      const matCount = materials.filter(m => m.subject === s).length;
      return {
        id: s,
        title: s,
        tutor: sch?.staff ? `${(sch.staff as any).firstName} ${(sch.staff as any).lastName}` : 'Multiple Tutors',
        progress: 0,
        color: 'brand',
        materialCount: matCount
      };
    });

    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get course materials
// @route   GET /api/v1/student/materials
// @access  Private/Student
export const getCourseMaterials = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }
    
    // Find materials for the student's class
    // Using $or to handle potential string/object mismatches in older records
    const materials = await Material.find({ 
      class: student.class
    }).populate('uploadedBy', 'firstName lastName').sort('-date');
    
    res.status(200).json({ success: true, data: materials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get exam routine
// @route   GET /api/v1/student/exams/routine
// @access  Private/Student
export const getExamRoutine = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const routine = await ExamRoutine.find({ class: student?.class }).sort('date');
    res.status(200).json({ success: true, data: routine });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get scorecard
// @route   GET /api/v1/student/exams/results
// @access  Private/Student
export const getResults = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const results = await Grade.find({ student: student?._id }).sort('-createdAt');
    res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get fee history
// @route   GET /api/v1/student/fees
// @access  Private/Student
export const getFeeRecords = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const records = await FeeRecord.find({ student: student?._id }).sort('-date');
    res.status(200).json({ success: true, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get library status
// @route   GET /api/v1/student/library/borrowed
// @access  Private/Student
export const getBorrowedBooks = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const borrowed = await BorrowedBook.find({ student: student?._id, status: { $ne: 'Returned' } }).populate('book');
    res.status(200).json({ success: true, data: borrowed });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search library catalog
// @route   GET /api/v1/student/library/search
// @access  Private/Student
export const searchLibrary = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;
    const books = await LibraryBook.find({
      organization: req.user.organization,
      $or: [
        { title: { $regex: query as string, $options: 'i' } },
        { author: { $regex: query as string, $options: 'i' } }
      ]
    } as any);
    res.status(200).json({ success: true, data: books });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get profile
// @route   GET /api/v1/student/profile
// @access  Private/Student
export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('class').populate('organization');
    if (!student) return res.status(404).json({ success: false, message: 'Student record not found' });
    
    // Get attendance details
    const attendance = await StudentAttendance.find({ student: student._id });
    
    res.status(200).json({ success: true, data: { ...student.toObject(), attendanceRecords: attendance } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply leave
// @route   POST /api/v1/student/leaves
// @access  Private/Student
export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student record not found' });

    const leave = await Leave.create({
      ...req.body,
      user: req.user._id,
      organization: req.user.organization,
      branch: student.branch,
      status: 'Pending'
    });

    res.status(201).json({ success: true, data: leave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get leave history
// @route   GET /api/v1/student/leaves
// @access  Private/Student
export const getLeaveHistory = async (req: AuthRequest, res: Response) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, data: leaves });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get timetable
// @route   GET /api/v1/student/timetable
// @access  Private/Student
export const getTimetable = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const schedules = await Schedule.find({ class: student?.class }).populate('staff');
    res.status(200).json({ success: true, data: schedules });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
