import { Request, Response } from 'express';
import Message from '../models/Message';
import User from '../models/User';
import Student from '../models/Student';
import Staff from '../models/Staff';
import Schedule from '../models/Schedule';
import { AuthRequest } from '../middlewares/auth';
import mongoose from 'mongoose';

// @desc    Get chat contacts
// @route   GET /api/v1/chat/contacts
// @access  Private
export const getContacts = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user.role;
    let contacts: any[] = [];

    if (userRole === 'TUTOR') {
      const staff = await Staff.findOne({ user: req.user._id });
      
      // Find all students in classes where this tutor is the primary tutor
      const classes = await mongoose.model('Class').find({ tutor: `${staff?.firstName} ${staff?.lastName}` });
      const classIds = classes.map(c => c._id.toString());
      
      // Find classes where this tutor teaches via Schedule
      const schedules = await Schedule.find({ staff: staff?._id });
      for (const s of schedules) {
        if (s.class && !classIds.includes(s.class.toString())) {
          classIds.push(s.class.toString());
        }
      }

      const students = await Student.find({ class: { $in: classIds } }).populate('user', 'firstName lastName role');
      const studentContacts = students.map(s => ({
        id: (s.user as any)._id.toString(),
        name: `${s.firstName} ${s.lastName}`,
        role: 'STUDENT',
        avatar: null
      }));

      // Also include any user who has an active chat history with this tutor
      const activeMessages = await Message.find({
        $or: [{ sender: req.user._id }, { recipient: req.user._id }],
        organization: req.user.organization
      });

      const partnerIds = new Set(
        activeMessages.map(m => m.sender.toString() === req.user._id.toString() ? m.recipient.toString() : m.sender.toString())
      );

      const activePartners = await User.find({ _id: { $in: Array.from(partnerIds) } });
      
      for (const partner of activePartners) {
        let name = 'Unknown User';
        if (partner.role === 'TUTOR' || partner.role === 'ADMIN' || partner.role === 'HR') {
          const s = await Staff.findOne({ user: partner._id });
          if (s) name = `${s.firstName} ${s.lastName}`;
        } else if (partner.role === 'STUDENT') {
          const s = await Student.findOne({ user: partner._id });
          if (s) name = `${s.firstName} ${s.lastName}`;
        }

        studentContacts.push({
          id: partner._id.toString(),
          name,
          role: partner.role,
          avatar: null
        });
      }

      contacts = Array.from(new Map(studentContacts.map(t => [t.id, t])).values());
    } else if (userRole === 'STUDENT') {
      const student = await Student.findOne({ user: req.user._id }).populate('class');
      
      // Find all tutors assigned to this student's class via Schedule
      const schedules = await Schedule.find({ class: student?.class }).populate({
        path: 'staff',
        populate: { path: 'user', select: 'firstName lastName role' }
      });
      
      const tutors = schedules
        .filter(s => s.staff)
        .map(s => ({
          id: ((s.staff as any).user as any)._id.toString(),
          name: `${(s.staff as any).firstName} ${(s.staff as any).lastName}`,
          role: 'TUTOR',
          avatar: null
        }));

      // Find the primary class tutor
      const classTutorName = (student?.class as any)?.tutor;
      if (classTutorName) {
        const staffList = await Staff.find({ organization: req.user.organization }).populate('user');
        const primaryStaff = staffList.find(s => `${s.firstName} ${s.lastName}` === classTutorName);
        if (primaryStaff && primaryStaff.user) {
          tutors.push({
            id: (primaryStaff.user as any)._id.toString(),
            name: `${primaryStaff.firstName} ${primaryStaff.lastName}`,
            role: 'TUTOR',
            avatar: null
          });
        }
      }

      // Also include any user who has an active chat history with this student
      const activeMessages = await Message.find({
        $or: [{ sender: req.user._id }, { recipient: req.user._id }],
        organization: req.user.organization
      });

      const partnerIds = new Set(
        activeMessages.map(m => m.sender.toString() === req.user._id.toString() ? m.recipient.toString() : m.sender.toString())
      );

      const activePartners = await User.find({ _id: { $in: Array.from(partnerIds) } });
      
      for (const partner of activePartners) {
        let name = 'Unknown User';
        if (partner.role === 'TUTOR' || partner.role === 'ADMIN' || partner.role === 'HR') {
          const staff = await Staff.findOne({ user: partner._id });
          if (staff) name = `${staff.firstName} ${staff.lastName}`;
        } else if (partner.role === 'STUDENT') {
          const s = await Student.findOne({ user: partner._id });
          if (s) name = `${s.firstName} ${s.lastName}`;
        }

        tutors.push({
          id: partner._id.toString(),
          name,
          role: partner.role,
          avatar: null
        });
      }
      
      // Get unique contacts by ID
      contacts = Array.from(new Map(tutors.map(t => [t.id, t])).values());
    }

    res.status(200).json({ success: true, data: contacts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get messages with a specific user
// @route   GET /api/v1/chat/messages/:recipientId
// @access  Private
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { recipientId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: recipientId },
        { sender: recipientId, recipient: req.user._id }
      ],
      organization: req.user.organization
    }).sort('createdAt');

    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/v1/chat/messages
// @access  Private
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { recipientId, content } = req.body;
    
    // Get sender's branch (assuming organization is already in req.user)
    const senderStaff = await Staff.findOne({ user: req.user._id });
    const senderStudent = await Student.findOne({ user: req.user._id });
    const branchId = senderStaff?.branch || senderStudent?.branch;

    if (!branchId) return res.status(400).json({ success: false, message: 'User branch not identified' });

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content,
      organization: req.user.organization,
      branch: branchId
    });

    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
