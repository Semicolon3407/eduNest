import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import Notification from '../models/Notification';
import Organization from '../models/Organization';
import { AuthRequest } from '../middlewares/auth';

// @desc    Create a new support ticket
// @route   POST /api/v1/tenant/tickets
// @access  Private (Organization Admin)
export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { issue, description, priority } = req.body;

    const ticket = await Ticket.create({
      issue,
      description,
      priority: priority || 'Medium',
      organization: req.user.organization,
    });

    const org = await Organization.findById(req.user.organization);
    
    // Notify Super Admin
    await Notification.create({
      type: 'GENERAL',
      title: 'New Support Ticket Raised',
      message: `${org?.name || 'An organization'} raised a new ${priority || 'Medium'} priority problem ticket: ${issue}`,
      recipient: 'SUPER_ADMIN',
      organization: req.user.organization,
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get tickets for logged-in organization
// @route   GET /api/v1/tenant/tickets
// @access  Private (Organization Admin)
export const getTenantTickets = async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await Ticket.find({ organization: req.user.organization }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all tickets (Super Admin)
// @route   GET /api/v1/super-admin/tickets
// @access  Private (Super Admin)
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find().populate('organization', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Reply/Update a ticket (Super Admin)
// @route   PATCH /api/v1/super-admin/tickets/:id
// @access  Private (Super Admin)
export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { status, resolutionNotes, replyMessage } = req.body;

    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const oldStatus = ticket.status;
    
    if (status) ticket.status = status;
    if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;
    if (replyMessage) ticket.replyMessage = replyMessage;

    await ticket.save();

    // Notify Organization if status changed to Resolved or there's a reply
    if ((status && status !== oldStatus && status === 'Resolved') || replyMessage) {
      await Notification.create({
        type: 'GENERAL',
        title: `Ticket Status Update: #TK-${ticket._id.toString().slice(-4).toUpperCase()}`,
        message: `Your ticket "${ticket.issue}" has been updated. ${status === 'Resolved' ? 'The issue has been resolved.' : 'Support team has replied.'}`,
        recipient: 'ORGANIZATION',
        organization: ticket.organization,
      });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
