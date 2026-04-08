import { Router } from 'express';
import * as hrController from '../controllers/hrController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
const router = Router();
router.use(protect);
router.use(authorize('ORG_ADMIN', 'HR'));
router.post('/onboard', hrController.postOnboard);
router.get('/leaves', hrController.listLeaves);
router.patch('/leaves/:id', hrController.patchLeave);
export default router;
//# sourceMappingURL=hrRoutes.js.map