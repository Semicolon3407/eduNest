import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import Organizations from './pages/super-admin/Organizations';
import OrganizationDetails from './pages/super-admin/OrganizationDetails';
import Subscriptions from './pages/super-admin/Subscriptions';
import Support from './pages/super-admin/Support';
import StudentDashboard from './pages/student/Dashboard';
import MyCourses from './pages/student/Courses';
import StudentAssignments from './pages/student/Assignments';
import Exams from './pages/student/Exams';
import StudentTimetable from './pages/student/Timetable';
import StudentFees from './pages/student/Fees';
import StudentProfile from './pages/student/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import Admissions from './pages/admin/Admissions';
import Fees from './pages/admin/Fees';
import Classes from './pages/admin/Classes';
import StudentSchedules from './pages/admin/StudentSchedules';
import TutorSchedules from './pages/admin/TutorSchedules';
import OrganizationDashboard from './pages/organization/Dashboard';
import Branches from './pages/organization/Branches';
import StudentManagement from './pages/organization/Students';
import OrgStudentDetails from './pages/organization/StudentDetails';
import OrganizationProfile from './pages/organization/Profile';
import StaffOnboarding from './pages/organization/Staff';
import TutorDashboard from './pages/tutor/Dashboard';
import Classroom from './pages/tutor/Classroom';
import Assignments from './pages/tutor/Assignments';
import Attendance from './pages/tutor/Attendance';
import Grades from './pages/tutor/Grades';
import TutorTimetable from './pages/tutor/Timetable';
import Messages from './pages/tutor/Messages';
import BehavioralTracking from './pages/tutor/Behavior';
import TutorProfile from './pages/tutor/Profile';
import StudentResult from './pages/tutor/StudentResult';
import HRDashboard from './pages/hr/Dashboard';
import StaffManagement from './pages/hr/Staff';
import Payroll from './pages/hr/Payroll';
import HRAttendance from './pages/hr/Attendance';
import DocumentManagement from './pages/hr/Documents';
import StaffDocuments from './pages/hr/StaffDocuments';
import HRProfile from './pages/hr/Profile';
import AdminProfile from './pages/admin/Profile';
import FeeCollection from './pages/admin/FeeCollection';
import Login from './pages/Login';
import { PaymentSuccess, PaymentFailure } from './pages/student/PaymentStatus';

import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
        }
      }} />
      <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Super Admin Routes */}
        <Route path="/super-admin" element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <DashboardLayout role="SUPER_ADMIN" />
          </ProtectedRoute>
        }>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="organizations" element={<Organizations />} />
          <Route path="organizations/:id" element={<OrganizationDetails />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Organization Admin Routes */}
        <Route path="/organization" element={
          <ProtectedRoute allowedRoles={['ORGANIZATION']}>
            <DashboardLayout role="ORGANIZATION" />
          </ProtectedRoute>
        }>
          <Route index element={<OrganizationDashboard />} />
          <Route path="branches" element={<Branches />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="students/:studentId" element={<OrgStudentDetails />} />
          <Route path="staff" element={<StaffOnboarding />} />
          <Route path="profile" element={<OrganizationProfile />} />
        </Route>

        {/* HR Routes */}
        <Route path="/hr" element={
          <ProtectedRoute allowedRoles={['HR']}>
            <DashboardLayout role="HR" />
          </ProtectedRoute>
        }>
          <Route index element={<HRDashboard />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="attendance" element={<HRAttendance />} />
          <Route path="documents" element={<DocumentManagement />} />
          <Route path="documents/staff/:staffId" element={<StaffDocuments />} />
          <Route path="profile" element={<HRProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout role="ADMIN" />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="fees" element={<Fees />} />
          <Route path="fee-collection" element={<FeeCollection />} />
          <Route path="classes" element={<Classes />} />
          <Route path="student-schedules" element={<StudentSchedules />} />
          <Route path="tutor-schedules" element={<TutorSchedules />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Tutor Routes */}
        <Route path="/tutor" element={
          <ProtectedRoute allowedRoles={['TUTOR']}>
            <DashboardLayout role="TUTOR" />
          </ProtectedRoute>
        }>
          <Route index element={<TutorDashboard />} />
          <Route path="classroom" element={<Classroom />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="grades" element={<Grades />} />
          <Route path="behavior" element={<BehavioralTracking />} />
          <Route path="timetable" element={<TutorTimetable />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<TutorProfile />} />
          <Route path="grades/:studentId" element={<StudentResult />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout role="STUDENT" />
          </ProtectedRoute>
        }>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="exams" element={<Exams />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
