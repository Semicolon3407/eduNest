import { Router } from 'express';
import * as tutorController from '../controllers/tutorController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
const router = Router();
router.use(protect);
router.use(authorize('ORG_ADMIN', 'TUTOR'));
router.post('/attendance', tutorController.postAttendance);
router.post('/marks', tutorController.postMarks);
export default router;
//# sourceMappingURL=tutorRoutes.js.map