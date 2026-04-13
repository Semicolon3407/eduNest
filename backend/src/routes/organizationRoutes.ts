import { Router } from 'express';
import * as organizationController from '../controllers/organizationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

// All routes require authentication and ORG_ADMIN role
router.use(protect);
router.use(authorize('ORG_ADMIN'));

router.get('/dashboard', organizationController.getDashboard);
router.get('/settings', organizationController.getSettings);
router.put('/settings', organizationController.updateSettings);
router.post('/branches', organizationController.createBranch);
router.get('/audit-logs', organizationController.getAuditLogs);
router.get('/academic-setup', organizationController.getAcademicSetup);
router.post('/academic-year', organizationController.createAcademicYear);

export default router;
