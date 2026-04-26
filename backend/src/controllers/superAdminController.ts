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
    const orgs = await Organization.find().populate('subscription');
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
    const org = await Organization.findById(req.params.id).populate('subscription');
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
    const { name, email, password, type, location, personalEmail, phone, subscription } = req.body;

    // Calculate subscription expiry if a plan is assigned
    let subscriptionStartDate: Date | null = null;
    let subscriptionExpiry: Date | null = null;

    if (subscription) {
      const Subscription = require('../models/Subscription').default;
      const plan = await Subscription.findById(subscription);
      if (plan) {
        subscriptionStartDate = new Date();
        subscriptionExpiry = new Date();
        switch (plan.duration) {
          case 'Monthly': subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 1); break;
          case '3 Months': subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 3); break;
          case '6 Months': subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 6); break;
          case 'Annual': subscriptionExpiry.setFullYear(subscriptionExpiry.getFullYear() + 1); break;
        }
      }
    }

    // Create organization
    const org = await Organization.create({
      name,
      email,
      type,
      location,
      personalEmail,
      phone,
      subscription,
      subscriptionStartDate,
      subscriptionExpiry,
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
    const updateData = { ...req.body };

    // Recalculate expiry if subscription plan is being updated
    if (updateData.subscription) {
      const Subscription = require('../models/Subscription').default;
      const plan = await Subscription.findById(updateData.subscription);
      if (plan) {
        const startDate = new Date();
        const expiryDate = new Date();
        switch (plan.duration) {
          case 'Monthly': expiryDate.setMonth(expiryDate.getMonth() + 1); break;
          case '3 Months': expiryDate.setMonth(expiryDate.getMonth() + 3); break;
          case '6 Months': expiryDate.setMonth(expiryDate.getMonth() + 6); break;
          case 'Annual': expiryDate.setFullYear(expiryDate.getFullYear() + 1); break;
        }
        updateData.subscriptionStartDate = startDate;
        updateData.subscriptionExpiry = expiryDate;
      }
    }

    const org = await Organization.findByIdAndUpdate(req.params.id, updateData, {
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

/**
 * Helper: compute expiry from a start date + plan duration
 */
const computeExpiry = (start: Date, duration: string): Date => {
  const expiry = new Date(start);
  switch (duration) {
    case 'Monthly':  expiry.setMonth(expiry.getMonth() + 1); break;
    case '3 Months': expiry.setMonth(expiry.getMonth() + 3); break;
    case '6 Months': expiry.setMonth(expiry.getMonth() + 6); break;
    case 'Annual':   expiry.setFullYear(expiry.getFullYear() + 1); break;
  }
  return expiry;
};

/**
 * @desc    Recalculate subscription dates for a single organization.
 *          Uses subscriptionStartDate if already set, otherwise falls back to createdAt.
 * @route   PATCH /api/v1/super-admin/organizations/:id/recalculate-dates
 * @access  Private/SuperAdmin
 */
export const recalculateOrgSubscriptionDates = async (req: Request, res: Response) => {
  try {
    const org = await Organization.findById(req.params.id).populate('subscription');
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    const sub = org.subscription as any;
    if (!sub) {
      return res.status(400).json({ success: false, message: 'Organization has no subscription plan assigned' });
    }

    // Use existing start date if present, otherwise use createdAt
    const startDate: Date = (org as any).subscriptionStartDate
      ? new Date((org as any).subscriptionStartDate)
      : new Date(org.createdAt as any);

    const expiryDate = computeExpiry(startDate, sub.duration);

    const updated = await Organization.findByIdAndUpdate(
      req.params.id,
      { subscriptionStartDate: startDate, subscriptionExpiry: expiryDate },
      { returnDocument: 'after', runValidators: true }
    ).populate('subscription');

    res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Backfill subscription dates for ALL organizations that have a subscription
 *          but are missing subscriptionExpiry. Uses createdAt as the start date.
 * @route   POST /api/v1/super-admin/organizations/backfill-dates
 * @access  Private/SuperAdmin
 */
export const backfillAllSubscriptionDates = async (req: Request, res: Response) => {
  try {
    const Subscription = require('../models/Subscription').default;
    const orgs = await Organization.find({ subscription: { $exists: true, $ne: null } });

    let updated = 0;

    for (const org of orgs as any[]) {
      // Only backfill if expiry is not set
      if (org.subscriptionExpiry) continue;

      const plan = await Subscription.findById(org.subscription);
      if (!plan) continue;

      const startDate: Date = org.subscriptionStartDate
        ? new Date(org.subscriptionStartDate)
        : new Date(org.createdAt);

      const expiryDate = computeExpiry(startDate, plan.duration);

      await Organization.findByIdAndUpdate(org._id, {
        subscriptionStartDate: startDate,
        subscriptionExpiry: expiryDate,
      });

      updated++;
    }

    res.status(200).json({
      success: true,
      message: `Backfilled ${updated} organization(s) out of ${orgs.length} total.`,
      updated,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
