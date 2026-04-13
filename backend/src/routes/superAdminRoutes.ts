import { Router } from 'express';
import * as superAdminController from '../controllers/superAdminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

/**
 * @swagger
 * /api/superadmin/organizations:
 *   get:
 *     summary: List all organizations
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/organizations', superAdminController.listOrganizations);

/**
 * @swagger
 * /api/superadmin/organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [SuperAdmin]
 */
router.post('/organizations', superAdminController.createOrganization);

/**
 * @swagger
 * /api/superadmin/organizations/{id}:
 *   delete:
 *     summary: Delete an organization
 *     tags: [SuperAdmin]
 */
router.delete('/organizations/:id', superAdminController.deleteOrganization);

/**
 * @swagger
 * /api/superadmin/organizations/{id}/status:
 *   patch:
 *     summary: Update organization status
 *     tags: [SuperAdmin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive: { type: boolean }
 */
router.patch('/organizations/:id/status', superAdminController.patchOrgStatus);

/**
 * @swagger
 * /api/superadmin/dashboard:
 *   get:
 *     summary: Get global metrics
 *     tags: [SuperAdmin]
 */
router.get('/dashboard', superAdminController.getDashboard);

export default router;
