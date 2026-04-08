import { Router } from 'express';
import * as superAdminController from '../controllers/superAdminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
const router = Router();
router.use(protect);
router.use(authorize('SUPER_ADMIN'));
router.get('/organizations', superAdminController.listOrganizations);
router.patch('/organizations/:id/status', superAdminController.patchOrgStatus);
router.get('/dashboard', superAdminController.getDashboard);
export default router;
//# sourceMappingURL=superAdminRoutes.js.map