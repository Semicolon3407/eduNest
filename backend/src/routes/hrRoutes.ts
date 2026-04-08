import { Router } from 'express';
import * as hrController from '../controllers/hrController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);
router.use(authorize('ORG_ADMIN', 'HR'));

/**
 * @swagger
 * /api/hr/onboard:
 *   post:
 *     summary: Onboard new staff
 *     tags: [HR]
 *     security:
 *       - bearerAuth: []
 */
router.post('/onboard', hrController.postOnboard);

/**
 * @swagger
 * /api/hr/leaves:
 *   get:
 *     summary: List leave requests
 *     tags: [HR]
 */
router.get('/leaves', hrController.listLeaves);

/**
 * @swagger
 * /api/hr/leaves/{id}:
 *   patch:
 *     summary: Update leave status
 *     tags: [HR]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.patch('/leaves/:id', hrController.patchLeave);

export default router;
