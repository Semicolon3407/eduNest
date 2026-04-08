import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
const router = Router();
router.use(protect);
router.use(authorize('ORG_ADMIN', 'ADMIN'));
router.post('/grades', adminController.postGrade);
router.post('/fees', adminController.postFeeStructure);
router.get('/inventory', adminController.listInventory);
export default router;
//# sourceMappingURL=adminRoutes.js.map