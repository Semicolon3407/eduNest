import { Request, Response } from 'express';
import Organization from '../models/Organization';
import User from '../models/User';
import sendEmail from '../utils/sendEmail';

/**
 * @desc    Get all organizations
 * @route   GET /api/v1/super-admin/organizations
 * @access  Private/SuperAdmin
 */
export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const orgs = await Organization.find();
    res.status(200).json({ success: true, count: orgs.length, data: orgs });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get single organization
 * @route   GET /api/v1/super-admin/organizations/:id
 * @access  Private/SuperAdmin
 */
export const getOrganization = async (req: Request, res: Response) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    res.status(200).json({ success: true, data: org });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Create new organization
 * @route   POST /api/v1/super-admin/organizations
 * @access  Private/SuperAdmin
 */
export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name, email, password, type, location, personalEmail, phone } = req.body;

    // Create organization
    const org = await Organization.create({
      name,
      email,
      type,
      location,
      personalEmail,
      phone
    });

    // Create corresponding organization user
    await User.create({
      name,
      email,
      password,
      role: 'ORGANIZATION',
      organization: org._id
    });

    // Send credentials via email
    if (personalEmail) {
      const message = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #4f46e5;">Welcome to EduNest!</h2>
          <p>Hello ${name},</p>
          <p>Your organization has been successfully registered on EduNest. You can now log in using the credentials below:</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Portal URL:</strong> <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a></p>
            <p style="margin: 5px 0;"><strong>Login Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <p>For security reasons, we recommend that you change your password after your first login.</p>
          <p>Best Regards,<br>EduNest Team</p>
        </div>
      `;

      try {
        await sendEmail({
          email: personalEmail,
          subject: 'Your Organization Credentials - EduNest',
          message,
        });
      } catch (emailErr) {
        console.error('Error sending email:', emailErr);
        // We don't want to fail the whole request if email fails, 
        // but we should probably log it or notify the admin
      }
    }

    res.status(201).json({ success: true, data: org });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update organization status
 * @route   PATCH /api/v1/super-admin/organizations/:id/status
 * @access  Private/SuperAdmin
 */
export const updateOrganizationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const org = await Organization.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after', runValidators: true });
    
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: org });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update organization
 * @route   PUT /api/v1/super-admin/organizations/:id
 * @access  Private/SuperAdmin
 */
export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const org = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: org });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Delete organization
 * @route   DELETE /api/v1/super-admin/organizations/:id
 * @access  Private/SuperAdmin
 */
export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const org = await Organization.findByIdAndDelete(req.params.id);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
