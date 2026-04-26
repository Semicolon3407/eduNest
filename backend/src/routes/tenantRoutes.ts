import express from 'express';
import { 
  getBranches, addBranch, updateBranch, deleteBranch,
  getStaff, onboardStaff, updateStaff, deleteStaff,
  getOrganizationProfile, updateOrganizationProfile,
  buyPlan, recalculateDates
} from '../controllers/tenantController';
import { getSubscriptions } from '../controllers/subscriptionController';
import {
  getTenantTickets,
  createTicket
} from '../controllers/ticketController';
import {
  getTenantNotifications,
  markTenantNotificationRead,
  markAllTenantNotificationsRead
} from '../controllers/notificationController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// All routes are protected and require ORGANIZATION or ADMIN role
router.use(protect);
router.use(authorize('ORGANIZATION', 'ADMIN'));

// Branch Routes
router.route('/branches')
  .get(getBranches)
  .post(addBranch);

router.route('/branches/:id')
  .put(updateBranch)
  .delete(deleteBranch);

// Staff Routes
router.route('/staff')
  .get(getStaff)
  .post(onboardStaff);

router.route('/staff/:id')
  .put(updateStaff)
  .delete(deleteStaff);

router.route('/profile')
  .get(getOrganizationProfile)
  .put(updateOrganizationProfile);

// Subscription Routes
router.get('/subscriptions', getSubscriptions);
router.post('/buy-plan', buyPlan);
router.patch('/recalculate-dates', recalculateDates as any);

// Support Ticket Routes
router.route('/tickets')
  .get(getTenantTickets as any)
  .post(createTicket as any);

// Notification Routes
router.get('/notifications', getTenantNotifications as any);
router.patch('/notifications/read-all', markAllTenantNotificationsRead as any);
router.patch('/notifications/:id/read', markTenantNotificationRead as any);

export default router;
