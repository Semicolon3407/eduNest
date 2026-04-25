import express from 'express';
import { protect, authorize } from '../middlewares/auth';
import { adminController } from '../controllers/adminController';

const router = express.Router();

// All Admin routes are protected and require ADMIN or ORGANIZATION role
router.use(protect as any);
router.use(authorize('ADMIN', 'ORGANIZATION') as any);

// Dashboard
router.get('/stats', adminController.getDashboardStats);
router.get('/profile', adminController.getMyProfile);
router.post('/leaves/request', adminController.requestLeave);

// Student Routes
router.post('/students/enroll', adminController.enrollStudent);
router.get('/students', adminController.getStudents);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Classes
router.post('/classes', adminController.createClass);
router.get('/classes', adminController.getClasses);
router.delete('/classes/:id', adminController.deleteClass);

// Fee Routes
router.post('/fees', adminController.createFee);
router.get('/fees', adminController.getFees);
router.put('/fees/:id', adminController.updateFee);
router.delete('/fees/:id', adminController.deleteFee);
router.get('/fees/records', adminController.getFeeRecords);
router.put('/fees/records/:id/status', adminController.updateFeeRecordStatus);
router.post('/fees/records/:id/remind', adminController.sendFeeReminder);

// Inventory
router.get('/inventory', adminController.getInventory);
router.post('/inventory', adminController.createAsset);

// Schedule Routes
router.get('/schedules', adminController.getSchedules);
router.post('/schedules', adminController.createSchedule);
router.delete('/schedules/:id', adminController.deleteSchedule);

export default router;
