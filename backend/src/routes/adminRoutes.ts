import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);
router.use(authorize('ORG_ADMIN', 'ADMIN'));

/**
 * @swagger
 * /api/admin/grades:
 *   post:
 *     summary: Create a new grade with sections
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               sections: { type: array, items: { type: string } }
 */
router.post('/grades', adminController.postGrade);

/**
 * @swagger
 * /api/admin/fees:
 *   post:
 *     summary: Define fee structure
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.post('/fees', adminController.postFeeStructure);

/**
 * @swagger
 * /api/admin/inventory:
 *   get:
 *     summary: List inventory items
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/inventory', adminController.listInventory);

export default router;
