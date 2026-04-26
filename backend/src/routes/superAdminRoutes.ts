import express from 'express';
import { 
  getOrganizations, 
  getOrganization,
  createOrganization, 
  updateOrganizationStatus, 
  deleteOrganization, 
  updateOrganization,
  recalculateOrgSubscriptionDates,
  backfillAllSubscriptionDates,
} from '../controllers/superAdminController';
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from '../controllers/subscriptionController';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  checkAndCreateExpiryNotifications,
  createPlanExpiredNotification,
} from '../controllers/notificationController';
import {
  getAllTickets,
  updateTicket
} from '../controllers/ticketController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// All routes here are restricted to SuperAdmin
router.use(protect as any);
router.use(authorize('SUPER_ADMIN') as any);

/**
 * @swagger
 * tags:
 *   name: Super Admin
 *   description: Super Admin management endpoints
 */

/**
 * @swagger
 * /super-admin/organizations:
 *   get:
 *     summary: Get all organizations
 *     tags: [Super Admin]
 *     responses:
 *       200:
 *         description: List of organizations
 *   post:
 *     summary: Create a new organization
 *     tags: [Super Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               type: { type: string }
 *               location: { type: string }
 *               email: { type: string }
 *               personalEmail: { type: string }
 *               phone: { type: string }
 *               branchCount: { type: number }
 *               subscriptionPlan: { type: string }
 *     responses:
 *       201:
 *         description: Organization created
 */
router.route('/organizations')
  .get(getOrganizations)
  .post(createOrganization);

// Must be defined BEFORE /:id to avoid conflict
router.post('/organizations/backfill-dates', backfillAllSubscriptionDates);

/**
 * @swagger
 * /super-admin/organizations/{id}:
 *   get:
 *     summary: Get a single organization
 *     tags: [Super Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Organization data
 *   put:
 *     summary: Update an organization
 *     tags: [Super Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               location: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *     responses:
 *       200:
 *         description: Organization updated
 *   delete:
 *     summary: Delete an organization
 *     tags: [Super Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Organization deleted
 */
router.route('/organizations/:id')
  .get(getOrganization)
  .put(updateOrganization)
  .delete(deleteOrganization);

/**
 * @swagger
 * /super-admin/organizations/{id}/status:
 *   patch:
 *     summary: Update organization status
 *     tags: [Super Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [Active, Pending, Suspended] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/organizations/:id/status', updateOrganizationStatus);
router.patch('/organizations/:id/recalculate-dates', recalculateOrgSubscriptionDates);

// Subscription Management
router.route('/subscriptions')
  .get(getSubscriptions as any)
  .post(createSubscription as any);

router.route('/subscriptions/:id')
  .put(updateSubscription as any)
  .delete(deleteSubscription as any);

// Notification Management
router.get('/notifications', getNotifications as any);
router.patch('/notifications/read-all', markAllNotificationsRead as any);
router.patch('/notifications/:id/read', markNotificationRead as any);
router.post('/notifications/check-expiry', checkAndCreateExpiryNotifications as any);
router.post('/notifications/plan-expired', createPlanExpiredNotification as any);

// Ticket Management
router.route('/tickets')
  .get(getAllTickets as any);
router.route('/tickets/:id')
  .patch(updateTicket as any);

export default router;
