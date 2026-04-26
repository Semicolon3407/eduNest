import express from 'express';
import { 
  getDashboardStats, 
  getTutorClasses,
  getSchedule, 
  getAssignments, 
  createAssignment, 
  getSubmissions, 
  markAttendance, 
  addBehaviorLog, 
  getGrades, 
  upsertGrade, 
  getTutorProfile, 
  applyLeave,
  getStudentsByClass,
  getStudentById,
  deleteGrade,
  getBehaviorLogs,
  getMaterials,
  uploadMaterial,
  deleteMaterial,
  getAttendanceByDate,
  getStudentLeaves,
  updateStudentLeaveStatus,
  createAnnouncement,
  getAnnouncements
} from '../controllers/tutorController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.use(protect);
router.use(authorize('TUTOR', 'ADMIN')); // Admins might also want to see these

router.get('/dashboard', getDashboardStats);
router.get('/classes', getTutorClasses);
router.get('/schedule', getSchedule);
router.get('/assignments', getAssignments);
router.post('/assignments', createAssignment);
router.get('/submissions', getSubmissions);
router.post('/attendance', markAttendance);
router.post('/behavior', addBehaviorLog);
router.get('/grades', getGrades);
router.post('/grades', upsertGrade);
router.get('/profile', getTutorProfile);
router.post('/leaves', applyLeave);
router.get('/students/:classId', getStudentsByClass);
router.get('/student/:id', getStudentById);
router.delete('/grades/:id', deleteGrade);
router.get('/behavior', getBehaviorLogs);
router.get('/materials', getMaterials);
router.post('/materials', uploadMaterial);
router.delete('/materials/:id', deleteMaterial);
router.get('/attendance/check', getAttendanceByDate);
router.get('/student-leaves', getStudentLeaves);
router.put('/student-leaves/:id', updateStudentLeaveStatus);
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);

export default router;
