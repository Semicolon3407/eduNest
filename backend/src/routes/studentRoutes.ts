import express from 'express';
import {
  getStudentDashboardStats,
  getAnnouncements,
  getStudentAssignments,
  submitAssignment,
  getStudentCourses,
  getCourseMaterials,
  getExamRoutine,
  getResults,
  getFeeRecords,
  getBorrowedBooks,
  searchLibrary,
  getStudentProfile,
  applyLeave,
  getLeaveHistory,
  getTimetable
} from '../controllers/studentController';
import { protect, authorize } from '../middlewares/auth';

const router = express.Router();

router.use(protect);
router.use(authorize('STUDENT'));

router.get('/dashboard/stats', getStudentDashboardStats);
router.get('/announcements', getAnnouncements);
router.get('/assignments', getStudentAssignments);
router.post('/assignments/submit', submitAssignment);
router.get('/courses', getStudentCourses);
router.get('/materials', getCourseMaterials);
router.get('/exams/routine', getExamRoutine);
router.get('/exams/results', getResults);
router.get('/fees', getFeeRecords);
router.get('/library/borrowed', getBorrowedBooks);
router.get('/library/search', searchLibrary);
router.get('/profile', getStudentProfile);
router.post('/leaves', applyLeave);
router.get('/leaves', getLeaveHistory);
router.get('/timetable', getTimetable);

export default router;
