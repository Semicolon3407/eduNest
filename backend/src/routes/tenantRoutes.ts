import express from 'express';
import { 
  getBranches, addBranch, updateBranch, deleteBranch,
  getStaff, onboardStaff, updateStaff, deleteStaff,
  getOrganizationProfile, updateOrganizationProfile,
  buyPlan
} from '../controllers/tenantController';
import { getSubscriptions } from '../controllers/subscriptionController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// All routes are protected and require ORGANIZATION or ADMIN role
router.use(protect);
router.use(authorize('ORGANIZATION', 'ADMIN'));

// Branch Routes
router.route('/branches')
  .get(getBranches)
  .post(addBranch);

router.route('/branches/:id')
  .put(updateBranch)
  .delete(deleteBranch);

// Staff Routes
router.route('/staff')
  .get(getStaff)
  .post(onboardStaff);

router.route('/staff/:id')
  .put(updateStaff)
  .delete(deleteStaff);

router.route('/profile')
  .get(getOrganizationProfile)
  .put(updateOrganizationProfile);

// Subscription Routes
router.get('/subscriptions', getSubscriptions);
router.post('/buy-plan', buyPlan);

export default router;
