import express from 'express';
import { protect, authorize } from '../middlewares/auth';
import { 
  getHRDashboardStats, 
  markAttendance, getAttendance,
  getPayrollRecords, processPayroll, setupPayrollRecord, disburseIndividualPayroll, disburseAllPayroll,
  getHRStaff,
  getLeaveRequests, updateLeaveStatus,
  getMyProfile,
  getDocuments, uploadStaffDocument, deleteDocument, updateDocument,
  getBranches
} from '../controllers/hrController';
import { onboardStaff, updateStaff, deleteStaff } from '../controllers/tenantController';

const router = express.Router();

// All HR routes are protected and require HR or ORGANIZATION role
router.use(protect as any);
router.use(authorize('HR', 'ORGANIZATION') as any);

router.get('/stats', getHRDashboardStats);
router.post('/attendance', markAttendance);
router.get('/attendance', getAttendance);
router.get('/payroll', getPayrollRecords);
router.post('/payroll/run', processPayroll);
router.post('/payroll/setup', setupPayrollRecord);
router.post('/payroll/disburse-all', disburseAllPayroll);
router.post('/payroll/disburse/:id', disburseIndividualPayroll);
router.get('/staff', getHRStaff);
router.post('/staff', onboardStaff);
router.put('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);
router.get('/leaves', getLeaveRequests);
router.put('/leaves/:id', updateLeaveStatus);
router.get('/profile', getMyProfile);
router.get('/documents', getDocuments);
router.post('/documents/upload', uploadStaffDocument);
router.put('/documents/:id', updateDocument);
router.delete('/documents/:id', deleteDocument);
router.get('/branches', getBranches);

export default router;
