import { Router } from 'express';
import * as tutorController from '../controllers/tutorController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);
router.use(authorize('ORG_ADMIN', 'TUTOR'));

/**
 * @swagger
 * /api/tutor/attendance:
 *   post:
 *     summary: Mark student attendance
 *     tags: [Tutor]
 *     security:
 *       - bearerAuth: []
 */
router.post('/attendance', tutorController.postAttendance);

/**
 * @swagger
 * /api/tutor/marks:
 *   post:
 *     summary: Input students marks
 *     tags: [Tutor]
 *     security:
 *       - bearerAuth: []
 */
router.post('/marks', tutorController.postMarks);

export default router;
