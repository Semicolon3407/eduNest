import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Staff from '../models/Staff';
import Student from '../models/Student';
import Assignment from '../models/Assignment';
import Submission from '../models/Submission';
import Grade from '../models/Grade';
import StudentAttendance from '../models/StudentAttendance';
import BehaviorLog from '../models/BehaviorLog';
import Class from '../models/Class';
import Leave from '../models/Leave';
import Schedule from '../models/Schedule';
import Material from '../models/Material';
import mongoose from 'mongoose';

// @desc    Get tutor dashboard stats
// @route   GET /api/v1/tutor/dashboard
// @access  Private/Tutor
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff record not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fullName = `${staff.firstName} ${staff.lastName}`;
    
    // Get total students across all classes this tutor teaches
    // For now, let's assume we find classes where this tutor is assigned
    const classes = await Class.find({ tutor: fullName, organization: req.user.organization });
    const classIds = classes.map(c => c._id);

    const totalStudents = await Student.countDocuments({ 
      class: { $in: classIds },
      organization: req.user.organization 
    });

    const classesMarked = await StudentAttendance.distinct('class', {
      markedBy: staff._id,
      date: { $gte: today },
      organization: req.user.organization
    });

    const gradebooksCount = classes.length;

    // Get unread messages count
    const unreadMessages = await mongoose.model('Message').countDocuments({
      recipient: req.user._id,
      read: false,
      organization: req.user.organization
    });

    // Get upcoming deadlines (assignments)
    const upcomingDeadlines = await Assignment.find({
      tutor: staff._id,
      dueDate: { $gte: today },
      organization: req.user.organization
    }).sort('dueDate').limit(2).populate('class');

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        markedAttendance: `${classesMarked.length}/${classes.length} Classes`,
        gradebooks: gradebooksCount,
        unreadMessages,
        upcomingDeadlines: upcomingDeadlines.map(d => ({
          id: d._id,
          title: d.title,
          dueDate: d.dueDate,
          className: (d.class as any)?.name
        }))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tutor's classes
// @route   GET /api/v1/tutor/classes
// @access  Private/Tutor
export const getTutorClasses = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) {
       return res.status(404).json({ success: false, message: 'Staff record not found' });
    }

    const fullName = `${staff.firstName} ${staff.lastName}`;
    const classes = await Class.find({ 
      tutor: fullName,
      organization: req.user.organization 
    });

    res.status(200).json({ success: true, data: classes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get schedule
// @route   GET /api/v1/tutor/schedule
// @access  Private/Tutor
export const getSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff record not found' });
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()];

    // Find schedules assigned to this tutor for today
    const schedules = await Schedule.find({
      organization: req.user.organization,
      day: currentDay,
      staff: staff._id
    }).populate('class');

    res.status(200).json({ success: true, data: schedules });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assignments
// @route   GET /api/v1/tutor/assignments
// @access  Private/Tutor
export const getAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    const assignments = await Assignment.find({
      tutor: staff?._id,
      organization: req.user.organization
    }).populate('class').lean();

    const submissions = await Submission.find({ organization: req.user.organization });

    const data = assignments.map(a => {
      const count = submissions.filter(s => s.assignment.toString() === a._id.toString()).length;
      const isOverdue = new Date(a.dueDate) < new Date();
      return { 
        ...a, 
        submissionsCount: count,
        status: isOverdue && a.status === 'Active' ? 'Expired' : a.status
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create assignment
// @route   POST /api/v1/tutor/assignments
// @access  Private/Tutor
export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff record not found' });

    const assignment = await Assignment.create({
      ...req.body,
      tutor: staff._id,
      organization: req.user.organization,
      branch: staff.branch
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get submissions
// @route   GET /api/v1/tutor/submissions
// @access  Private/Tutor
export const getSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId } = req.query;
    const filter: any = { organization: req.user.organization };
    if (assignmentId) filter.assignment = assignmentId;

    const submissions = await Submission.find(filter)
      .populate('student')
      .populate('assignment')
      .sort('-submittedAt');

    res.status(200).json({ success: true, data: submissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark attendance
// @route   POST /api/v1/tutor/attendance
// @access  Private/Tutor
export const markAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff record not found' });

    const { records, date } = req.body; // records: [{ student, status, note }]

    const fullName = `${staff.firstName} ${staff.lastName}`;
    const assignedClasses = await Class.find({ tutor: fullName, organization: req.user.organization }).select('_id');
    const assignedIds = assignedClasses.map(c => c._id.toString());

    // Validate that all records belong to the tutor's assigned classes
    for (const record of records) {
      if (!assignedIds.includes(record.class)) {
        return res.status(403).json({ success: false, message: 'Unauthorized: You can only mark attendance for your assigned classes.' });
      }
    }

    const operations = records.map((record: any) => ({
      updateOne: {
        filter: { 
          student: record.student, 
          date: new Date(date).setHours(0,0,0,0),
          organization: req.user.organization 
        },
        update: {
          $set: {
            status: record.status,
            note: record.note,
            markedBy: staff._id,
            class: record.class,
            branch: staff.branch
          }
        },
        upsert: true
      }
    }));

    await StudentAttendance.bulkWrite(operations);

    res.status(200).json({ success: true, message: 'Attendance marked successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add behavior log
// @route   POST /api/v1/tutor/behavior
// @access  Private/Tutor
export const addBehaviorLog = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff record not found' });

    const log = await BehaviorLog.create({
      ...req.body,
      tutor: staff._id,
      organization: req.user.organization,
      branch: staff.branch
    });

    res.status(201).json({ success: true, data: log });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get grades/results
// @route   GET /api/v1/tutor/grades
// @access  Private/Tutor
export const getGrades = async (req: AuthRequest, res: Response) => {
  try {
    const { classId, term } = req.query;
    const filter: any = { organization: req.user.organization };
    if (classId) filter.class = classId;
    if (term) filter.term = term;

    const grades = await Grade.find(filter).populate('student');

    res.status(200).json({ success: true, data: grades });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upsert grade
// @route   POST /api/v1/tutor/grades
// @access  Private/Tutor
export const upsertGrade = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff record not found' });

    const { student, term, subject, theoryMarks, practicalMarks, class: classId } = req.body;
    const totalMarks = theoryMarks + practicalMarks;
    
    const calculateGrade = (total: number) => {
      if (total >= 90) return 'A+';
      if (total >= 80) return 'A';
      if (total >= 70) return 'B';
      if (total >= 60) return 'C';
      return 'D';
    };

    const gradeStr = calculateGrade(totalMarks);

    const grade = await Grade.findOneAndUpdate(
      { student, term, subject, organization: req.user.organization },
      {
        student,
        term,
        subject,
        theoryMarks,
        practicalMarks,
        totalMarks,
        grade: gradeStr,
        class: classId,
        organization: req.user.organization,
        branch: staff.branch
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: grade });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tutor profile
// @route   GET /api/v1/tutor/profile
// @access  Private/Tutor
export const getTutorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id }).populate('user').populate('branch');
    if (!staff) return res.status(404).json({ success: false, message: 'Staff record not found' });

    const attendance = await mongoose.model('Attendance').find({ staff: staff._id }).sort('-date');
    const leaves = await Leave.find({ staff: staff._id }).sort('-createdAt');

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'Present').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;
    const late = attendance.filter(a => a.status === 'Late').length;
    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 100;

    res.status(200).json({
      success: true,
      data: {
        ...staff.toObject(),
        leaves,
        attendanceRecords: attendance,
        attendanceStats: {
           rate,
           total,
           present,
           absent,
           late
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply leave
// @route   POST /api/v1/tutor/leaves
// @access  Private/Tutor
export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff record not found' });

    const leave = await Leave.create({
      ...req.body,
      staff: staff._id,
      organization: req.user.organization,
      branch: staff.branch
    });

    res.status(201).json({ success: true, data: leave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get students by class
// @route   GET /api/v1/tutor/students/:classId
// @access  Private/Tutor
export const getStudentsByClass = async (req: AuthRequest, res: Response) => {
  try {
    const students = await Student.find({ 
      class: req.params.classId,
      organization: req.user.organization
    });

    res.status(200).json({ success: true, data: students });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/v1/tutor/student/:id
// @access  Private/Tutor
export const getStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const student = await Student.findOne({ 
      _id: req.params.id,
      organization: req.user.organization
    }).populate('class');

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete grade
// @route   DELETE /api/v1/tutor/grades/:id
// @access  Private/Tutor
export const deleteGrade = async (req: AuthRequest, res: Response) => {
  try {
    const grade = await Grade.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!grade) return res.status(404).json({ success: false, message: 'Grade not found' });

    res.status(200).json({ success: true, message: 'Grade record deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get behavior logs
// @route   GET /api/v1/tutor/behavior
// @access  Private/Tutor
export const getBehaviorLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await BehaviorLog.find({ organization: req.user.organization })
      .populate('student')
      .populate('tutor')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get materials
// @route   GET /api/v1/tutor/materials
// @access  Private/Tutor
export const getMaterials = async (req: AuthRequest, res: Response) => {
  try {
    const { classId } = req.query;
    const filter: any = { organization: req.user.organization };
    if (classId) filter.class = classId;

    const materials = await Material.find(filter).populate('class');
    res.status(200).json({ success: true, data: materials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload material
// @route   POST /api/v1/tutor/materials
// @access  Private/Tutor
export const uploadMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff record not found' });

    const material = await Material.create({
      ...req.body,
      uploadedBy: staff._id,
      organization: req.user.organization,
      branch: staff.branch
    });

    res.status(201).json({ success: true, data: material });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete material
// @route   DELETE /api/v1/tutor/materials/:id
// @access  Private/Tutor
export const deleteMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    const material = await Material.findOne({ _id: req.params.id, organization: req.user.organization });
    
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    // Optional: Only the owner can delete
    if (material.uploadedBy.toString() !== staff?._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this material' });
    }

    await Material.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance for a class on a specific date
// @route   GET /api/v1/tutor/attendance/check
// @access  Private/Tutor
export const getAttendanceByDate = async (req: AuthRequest, res: Response) => {
  try {
    const { classId, date } = req.query;
    if (!classId || !date) {
      return res.status(400).json({ success: false, message: 'Class ID and date are required' });
    }

    const startOfDay = new Date(date as string);
    startOfDay.setHours(0,0,0,0);
    
    const attendance = await StudentAttendance.find({
      class: classId as string,
      date: startOfDay,
      organization: req.user.organization
    });
    
    res.status(200).json({ success: true, data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student leave requests for assigned classes
// @route   GET /api/v1/tutor/student-leaves
// @access  Private/Tutor
export const getStudentLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff record not found' });

    const fullName = `${staff.firstName} ${staff.lastName}`;
    const assignedClasses = await Class.find({ tutor: fullName, organization: req.user.organization }).select('_id');
    const classIds = assignedClasses.map(c => c._id);

    // Find students in these classes
    const studentIds = await Student.find({ class: { $in: classIds } }).select('_id');

    const leaves = await Leave.find({
      student: { $in: studentIds.map(s => s._id) },
      organization: req.user.organization
    }).populate('student').sort('-appliedDate');

    res.status(200).json({ success: true, data: leaves });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student leave status
// @route   PUT /api/v1/tutor/student-leaves/:id
// @access  Private/Tutor
export const updateStudentLeaveStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findOneAndUpdate(
      { _id: req.params.id, organization: req.user.organization },
      { status, approvedBy: req.user._id },
      { new: true }
    ).populate('student');

    if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });

    // If approved, automatically mark as absent for those dates
    if (status === 'Approved' && leave.student) {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const studentId = leave.student._id;
      const classId = (leave.student as any).class;
      const organizationId = leave.organization;
      const branchId = leave.branch;
      const staff = await Staff.findOne({ user: req.user._id });

      const attendanceOps = [];
      let currentDate = new Date(start);
      while (currentDate <= end) {
        attendanceOps.push({
          updateOne: {
            filter: { 
              student: studentId, 
              date: new Date(currentDate).setHours(0,0,0,0),
              organization: organizationId 
            },
            update: {
              $set: {
                status: 'Absent' as 'Present' | 'Absent' | 'Late',
                note: `Approved Leave: ${leave.reason}`,
                markedBy: staff?._id as any,
                class: classId,
                branch: branchId as any
              }
            },
            upsert: true
          }
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (attendanceOps.length > 0) {
        await StudentAttendance.bulkWrite(attendanceOps);
      }
    }

    res.status(200).json({ success: true, data: leave });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create announcement
// @route   POST /api/v1/tutor/announcements
// @access  Private/Tutor
export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findOne({ user: req.user._id });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff record not found' });

    const announcement = await mongoose.model('Announcement').create({
      ...req.body,
      organization: req.user.organization,
      branch: req.body.branchId || staff.branch,
      class: req.body.classId || null,
      category: 'STUDENT',
      type: req.body.type || 'Academic'
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tutor announcements
// @route   GET /api/v1/tutor/announcements
// @access  Private/Tutor
export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await mongoose.model('Announcement').find({
      organization: req.user.organization,
      category: 'STUDENT'
    }).populate('class', 'name section').sort('-createdAt');
    res.status(200).json({ success: true, data: announcements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
