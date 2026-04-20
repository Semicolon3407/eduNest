import express from 'express';
import { 
  getBranches, addBranch, updateBranch, deleteBranch,
  getStaff, onboardStaff, updateStaff, deleteStaff 
} from '../controllers/tenantController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

// All routes are protected and require ORGANIZATION role
router.use(protect);
router.use(authorize('ORGANIZATION'));

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

export default router;
