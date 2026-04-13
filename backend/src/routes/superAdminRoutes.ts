import { Router } from 'express';
import * as superAdminController from '../controllers/superAdminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

// Dashboards
router.get('/dashboard', superAdminController.getDashboard);

// Organizations
router.get('/organizations', superAdminController.listOrganizations);
router.post('/organizations', superAdminController.createOrganization);
router.put('/organizations/:id', superAdminController.updateOrganization);
router.patch('/organizations/:id/status', superAdminController.patchOrgStatus);
router.delete('/organizations/:id', superAdminController.deleteOrganization);

// Subscriptions
router.get('/subscription-plans', superAdminController.listSubscriptionPlans);
router.post('/subscription-plans', superAdminController.createSubscriptionPlan);
router.get('/billing/history', superAdminController.getBillingHistory);
router.get('/billing/renewals', superAdminController.getRenewals);
router.get('/billing/metrics', superAdminController.getSubscriptionMetrics);

// Config
router.get('/config', superAdminController.getConfig);
router.post('/config', superAdminController.updateConfig);

export default router;
