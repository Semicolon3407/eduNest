import express from 'express';
import { 
  getOrganizations, 
  createOrganization, 
  updateOrganizationStatus, 
  getPlans, 
  createPlan,
  deleteOrganization
} from '../controllers/superAdminController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// All routes here are restricted to SuperAdmin
router.use(protect as any);
router.use(authorize('SUPER_ADMIN') as any);

/**
 * @swagger
 * tags:
 *   name: Super Admin
 *   description: Super Admin management endpoints
 */

/**
 * @swagger
 * /super-admin/organizations:
 *   get:
 *     summary: Get all organizations
 *     tags: [Super Admin]
 *     responses:
 *       200:
 *         description: List of organizations
 *   post:
 *     summary: Create a new organization
 *     tags: [Super Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               type: { type: string }
 *               location: { type: string }
 *               email: { type: string }
 *               personalEmail: { type: string }
 *               phone: { type: string }
 *               branchCount: { type: number }
 *               subscriptionPlan: { type: string }
 *     responses:
 *       201:
 *         description: Organization created
 */
router.route('/organizations')
  .get(getOrganizations)
  .post(createOrganization);

/**
 * @swagger
 * /super-admin/organizations/{id}:
 *   delete:
 *     summary: Delete an organization
 *     tags: [Super Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Organization deleted
 */
router.route('/organizations/:id')
  .delete(deleteOrganization);

/**
 * @swagger
 * /super-admin/organizations/{id}/status:
 *   patch:
 *     summary: Update organization status
 *     tags: [Super Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [Active, Pending, Suspended] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/organizations/:id/status', updateOrganizationStatus);

/**
 * @swagger
 * /super-admin/plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Super Admin]
 *     responses:
 *       200:
 *         description: List of plans
 *   post:
 *     summary: Create a new subscription plan
 *     tags: [Super Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               monthlyPrice: { type: number }
 *               yearlyPrice: { type: number }
 *               features: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Plan created
 */
router.route('/plans')
  .get(getPlans)
  .post(createPlan);

export default router;
