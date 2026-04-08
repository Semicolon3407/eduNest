import { Router } from 'express';
import * as studentController from '../controllers/studentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect); // All student routes require authentication

/**
 * @swagger
 * /api/students/admit:
 *   post:
 *     summary: Admit a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               name: { type: string }
 *               studentId: { type: string }
 *               gradeId: { type: string }
 *               sectionId: { type: string }
 */
router.post('/admit', authorize('ORG_ADMIN', 'ADMIN'), studentController.admitStudent);

/**
 * @swagger
 * /api/students/list:
 *   get:
 *     summary: List all students
 *     tags: [Students]
 */
router.get('/list', authorize('ORG_ADMIN', 'ADMIN', 'TUTOR', 'HR'), studentController.listStudents);

export default router;
