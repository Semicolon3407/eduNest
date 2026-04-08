import { Router } from 'express';
import * as studentController from '../controllers/studentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
const router = Router();
router.use(protect); // All student routes require authentication
router.post('/admit', authorize('ORG_ADMIN', 'ADMIN'), studentController.admitStudent);
router.get('/list', authorize('ORG_ADMIN', 'ADMIN', 'TUTOR', 'HR'), studentController.listStudents);
export default router;
//# sourceMappingURL=studentRoutes.js.map