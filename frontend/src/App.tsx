import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { SuperAdminDashboard } from './modules/super-admin/Dashboard';
import { OrganizationManagement } from './modules/super-admin/OrganizationManagement';
import { Subscriptions } from './modules/super-admin/Subscriptions';
import { SupportTicketing } from './modules/super-admin/SupportTicketing';

import { LoginPage } from './modules/auth/LoginPage';
import { ForgotPasswordPage } from './modules/auth/ForgotPasswordPage';

import { OrganizationDashboard } from './modules/organization/Dashboard';
import { BranchManagement } from './modules/organization/Branches';
import { AcademicSetup } from './modules/organization/AcademicSetup';
import { StaffOnboarding } from './modules/organization/StaffOnboarding';
import { GlobalSettings } from './modules/organization/GlobalSettings';

import { HRDashboard } from './modules/hr/Dashboard';
import { Payroll } from './modules/hr/Payroll';
import { StaffAttendance } from './modules/hr/StaffAttendance';
import { RecruitmentPortal } from './modules/hr/Recruitment';

import { AdminDashboard } from './modules/admin/Dashboard';
import { Admissions } from './modules/admin/Admissions';
import { FeeManagement } from './modules/admin/FeeManagement';
import { TimetableScheduling } from './modules/admin/Timetable';
import { InventoryAssets } from './modules/admin/Inventory';
import { ClassManagement } from './modules/admin/Classes';

import { TutorDashboard } from './modules/tutor/Dashboard';
import { VirtualClassroom } from './modules/tutor/VirtualClassroom';
import { AttendanceMarking } from './modules/tutor/Attendance';
import { Gradebook } from './modules/tutor/Gradebook';
import { CommunicationHub } from './modules/tutor/Communication';
import { BehavioralTracking } from './modules/tutor/Behavioral';

import { StudentDashboard } from './modules/student/Dashboard';
import { LearningManagement } from './modules/student/LearningManagement';
import { StudentExams } from './modules/student/Exams';
import { LibraryPortal } from './modules/student/Library';

// Mock empty pages for truly minor features
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
    <h1 className="text-3xl font-black  uppercase tracking-tighter text-foreground/80">{title}</h1>
    <div className="rounded-3xl border-4 border-dashed border-primary-100 bg-primary-50/10 p-24 text-center">
      <div className="mx-auto mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 flex">
        <span className="text-2xl font-black  tracking-tighter">EN</span>
      </div>
      <p className="text-xl font-bold text-foreground">Feature Module Coming Soon</p>
      <p className="mx-auto mt-2 max-w-xs text-sm font-medium text-muted-foreground ">
        The team is building a production-ready interface for <span className="font-bold text-primary-600">"{title}"</span>. Stay tuned for real-time API integration.
      </p>
    </div>
  </div>
);

function AppRoutes() {
  const { user } = useAuth();


  const DashboardComponent = () => {
    switch(user.role) {
      case 'SUPER_ADMIN': return <SuperAdminDashboard />;
      case 'ORGANIZATION': return <OrganizationDashboard />;
      case 'HR': return <HRDashboard />;
      case 'ADMINISTRATOR': return <AdminDashboard />;
      case 'TUTOR': return <TutorDashboard />;
      case 'STUDENT': return <StudentDashboard />;
      default: return <SuperAdminDashboard />;
    }
  };

  const LMSComponent = () => {
    if (user?.role === 'TUTOR') return <VirtualClassroom />;
    if (user?.role === 'STUDENT') return <LearningManagement />;
    return <PlaceholderPage title="Learning Management" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

      <Route element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<DashboardComponent />} />

        {/* Super Admin Routes */}
        <Route path="/organizations" element={<OrganizationManagement />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/support" element={<SupportTicketing />} />

        {/* Organization Admin Routes */}
        <Route path="/branches" element={<BranchManagement />} />
        <Route path="/academic-setup" element={<AcademicSetup />} />
        <Route path="/staff" element={<StaffOnboarding />} />
        <Route path="/settings" element={<GlobalSettings />} />

        {/* HR Routes */}
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/staff-attendance" element={<StaffAttendance />} />
        <Route path="/documents" element={<PlaceholderPage title="Staff Documents Hub" />} />
        <Route path="/recruitment" element={<RecruitmentPortal />} />

        {/* Administrator Routes */}
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/timetable" element={<TimetableScheduling />} />
        <Route path="/fees" element={<FeeManagement />} />
        <Route path="/inventory" element={<InventoryAssets />} />
        <Route path="/classes" element={<ClassManagement />} />

        {/* Tutor Routes */}
        <Route path="/student-attendance" element={<AttendanceMarking />} />
        <Route path="/grades" element={<Gradebook />} />
        <Route path="/behavior" element={<BehavioralTracking />} />
        <Route path="/messages" element={<CommunicationHub />} />

        {/* Student/Shared Learning Routes */}
        <Route path="/lms" element={<LMSComponent />} />
        <Route path="/exams" element={<StudentExams />} />
        <Route path="/library" element={<LibraryPortal />} />
        
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
