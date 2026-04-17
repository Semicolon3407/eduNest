import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import Organizations from './pages/super-admin/Organizations';
import Billing from './pages/super-admin/Billing';
import Support from './pages/super-admin/Support';
import SuperAdminSettings from './pages/super-admin/Settings';
import StudentDashboard from './pages/student/Dashboard';
import MyCourses from './pages/student/Courses';
import Exams from './pages/student/Exams';
import StudentTimetable from './pages/student/Timetable';
import StudentFees from './pages/student/Fees';
import AdminDashboard from './pages/admin/Dashboard';
import Admissions from './pages/admin/Admissions';
import Fees from './pages/admin/Fees';
import Classes from './pages/admin/Classes';
import Timetable from './pages/admin/Timetable';
import OrganizationDashboard from './pages/organization/Dashboard';
import Branches from './pages/organization/Branches';
import AcademicSetup from './pages/organization/Academic';
import StaffOnboarding from './pages/organization/Staff';
import OrgSettings from './pages/organization/Settings';
import TutorDashboard from './pages/tutor/Dashboard';
import Classroom from './pages/tutor/Classroom';
import Attendance from './pages/tutor/Attendance';
import Grades from './pages/tutor/Grades';
import TutorTimetable from './pages/tutor/Timetable';
import Messages from './pages/tutor/Messages';
import BehavioralTracking from './pages/tutor/Behavior';
import HRDashboard from './pages/hr/Dashboard';
import StaffManagement from './pages/hr/Staff';
import Payroll from './pages/hr/Payroll';
import HRAttendance from './pages/hr/Attendance';
import Recruitment from './pages/hr/Recruitment';
import DocumentManagement from './pages/hr/Documents';
import Login from './pages/Login';

const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 font-sans">
    <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 mb-4 animate-bounce">
      <h1 className="text-3xl sm:text-4xl font-medium">🚀</h1>
    </div>
    <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900   leading-none">{title}</h1>
    <p className="text-gray-500 max-w-md font-medium   text-[10px] mt-4">Module coming soon to the EduNest ecosystem</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Super Admin Routes */}
        <Route path="/super-admin" element={<DashboardLayout role="SUPER_ADMIN" />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="organizations" element={<Organizations />} />
          <Route path="billing" element={<Billing />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<SuperAdminSettings />} />
        </Route>

        {/* Organization Admin Routes */}
        <Route path="/organization" element={<DashboardLayout role="ORGANIZATION" />}>
          <Route index element={<OrganizationDashboard />} />
          <Route path="branches" element={<Branches />} />
          <Route path="academic" element={<AcademicSetup />} />
          <Route path="staff" element={<StaffOnboarding />} />
          <Route path="settings" element={<OrgSettings />} />
        </Route>

        {/* HR Routes */}
        <Route path="/hr" element={<DashboardLayout role="HR" />}>
          <Route index element={<HRDashboard />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="attendance" element={<HRAttendance />} />
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="documents" element={<DocumentManagement />} />
          <Route path="settings" element={<ComingSoon title="HR Profile" />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="ADMIN" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="fees" element={<Fees />} />
          <Route path="classes" element={<Classes />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="settings" element={<ComingSoon title="Admin Control" />} />
        </Route>

        {/* Tutor Routes */}
        <Route path="/tutor" element={<DashboardLayout role="TUTOR" />}>
          <Route index element={<TutorDashboard />} />
          <Route path="classroom" element={<Classroom />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="grades" element={<Grades />} />
          <Route path="behavior" element={<BehavioralTracking />} />
          <Route path="timetable" element={<TutorTimetable />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<ComingSoon title="Tutor Profile" />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<DashboardLayout role="STUDENT" />}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="exams" element={<Exams />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<ComingSoon title="Account Preferences" />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
