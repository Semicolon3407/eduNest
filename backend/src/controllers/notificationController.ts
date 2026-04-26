import { Request, Response } from 'express';
import Notification from '../models/Notification';
import Organization from '../models/Organization';
import { AuthRequest } from '../middlewares/auth';

/**
 * @desc    Get all notifications for super admin
 * @route   GET /api/v1/super-admin/notifications
 * @access  Private/SuperAdmin
 */
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ recipient: 'SUPER_ADMIN' })
      .populate('organization', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: 'SUPER_ADMIN',
      isRead: false,
    });

    res.status(200).json({ success: true, data: notifications, unreadCount });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PATCH /api/v1/super-admin/notifications/:id/read
 * @access  Private/SuperAdmin
 */
export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/v1/super-admin/notifications/read-all
 * @access  Private/SuperAdmin
 */
export const markAllNotificationsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany({ recipient: 'SUPER_ADMIN', isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Trigger a check of all organization subscription expiry dates
 *          and create notifications for expired / expiring-soon plans.
 * @route   POST /api/v1/super-admin/notifications/check-expiry
 * @access  Private/SuperAdmin
 */
export const checkAndCreateExpiryNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const soonThreshold = new Date();
    soonThreshold.setDate(soonThreshold.getDate() + 7); // warn 7 days before

    const orgs = await Organization.find({
      subscriptionExpiry: { $exists: true, $ne: null },
    }).populate('subscription');

    let created = 0;

    for (const org of orgs as any[]) {
      if (!org.subscriptionExpiry) continue;

      const expiry = new Date(org.subscriptionExpiry);

      // Already expired
      if (expiry < now) {
        const alreadyExists = await Notification.findOne({
          organization: org._id,
          type: 'PLAN_EXPIRED',
          createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        });
        if (!alreadyExists) {
          await Notification.create({
            type: 'PLAN_EXPIRED',
            title: 'Subscription Expired',
            message: `The subscription plan for ${org.name} has expired on ${expiry.toLocaleDateString()}. Immediate action required.`,
            organization: org._id,
            recipient: 'SUPER_ADMIN',
          });
          created++;
        }
      }
      // Expiring soon (within 7 days)
      else if (expiry <= soonThreshold) {
        const alreadyExists = await Notification.findOne({
          organization: org._id,
          type: 'PLAN_EXPIRING_SOON',
          createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        });
        if (!alreadyExists) {
          const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          await Notification.create({
            type: 'PLAN_EXPIRING_SOON',
            title: 'Subscription Expiring Soon',
            message: `${org.name}'s subscription plan expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} (${expiry.toLocaleDateString()}). Consider reaching out for renewal.`,
            organization: org._id,
            recipient: 'SUPER_ADMIN',
          });
          created++;
        }
      }
    }

    res.status(200).json({ success: true, message: `Checked ${orgs.length} orgs. Created ${created} notifications.` });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Manually create a plan-expired notification for a specific organization
 * @route   POST /api/v1/super-admin/notifications/plan-expired
 * @access  Private/SuperAdmin
 */
export const createPlanExpiredNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { organizationId, organizationName, expiryDate } = req.body;

    const notification = await Notification.create({
      type: 'PLAN_EXPIRED',
      title: 'Subscription Expired',
      message: `The subscription plan for ${organizationName} has expired${expiryDate ? ' on ' + new Date(expiryDate).toLocaleDateString() : ''}. Immediate action required.`,
      organization: organizationId || null,
      recipient: 'SUPER_ADMIN',
    });

    res.status(201).json({ success: true, data: notification });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get all notifications for an organization
 * @route   GET /api/v1/tenant/notifications
 * @access  Private/Organization
 */
export const getTenantNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({
      recipient: 'ORGANIZATION',
      organization: req.user.organization
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: 'ORGANIZATION',
      organization: req.user.organization,
      isRead: false,
    });

    res.status(200).json({ success: true, data: notifications, unreadCount });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Mark a single organization notification as read
 * @route   PATCH /api/v1/tenant/notifications/:id/read
 * @access  Private/Organization
 */
export const markTenantNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, organization: req.user.organization },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Mark all organization notifications as read
 * @route   PATCH /api/v1/tenant/notifications/read-all
 * @access  Private/Organization
 */
export const markAllTenantNotificationsRead = async (req: AuthRequest, res: Response) => {
  try {
    console.log("markAllTenantNotificationsRead hit. user org:", req.user?.organization);
    const result = await Notification.updateMany(
      { recipient: 'ORGANIZATION', organization: req.user.organization, isRead: false },
      { isRead: true }
    );
    console.log("markAllTenantNotificationsRead result:", result);
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
