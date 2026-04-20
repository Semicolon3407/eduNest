import { 
  LayoutDashboard, 
  School, 
  CreditCard, 
  LifeBuoy, 
  GitBranch, 
  Calendar, 
  UserRound, 
  BookOpen, 
  ClipboardList, 
  FileText, 
  MessageSquare,
  Trophy,
  Users
} from 'lucide-react';

export type UserRole = 'SUPER_ADMIN' | 'ORGANIZATION' | 'HR' | 'ADMIN' | 'TUTOR' | 'STUDENT';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles: UserRole[];
}

export const navItems: NavItem[] = [
  // Super Admin Items
  { title: 'Dashboard', href: '/super-admin', icon: LayoutDashboard, roles: ['SUPER_ADMIN'] },
  { title: 'Organizations', href: '/super-admin/organizations', icon: School, roles: ['SUPER_ADMIN'] },
  { title: 'Subscription Plans', href: '/super-admin/subscriptions', icon: CreditCard, roles: ['SUPER_ADMIN'] },
  { title: 'Support Tickets', href: '/super-admin/support', icon: LifeBuoy, roles: ['SUPER_ADMIN'] },

  // Organization Items
  { title: 'Dashboard', href: '/organization', icon: LayoutDashboard, roles: ['ORGANIZATION'] },
  { title: 'Branch Management', href: '/organization/branches', icon: GitBranch, roles: ['ORGANIZATION'] },
  { title: 'Student Management', href: '/organization/students', icon: Users, roles: ['ORGANIZATION'] },
  { title: 'Staff Onboarding', href: '/organization/staff', icon: UserRound, roles: ['ORGANIZATION'] },
  { title: 'My Profile', href: '/organization/profile', icon: UserRound, roles: ['ORGANIZATION'] },

  // HR Items
  { title: 'Dashboard', href: '/hr', icon: LayoutDashboard, roles: ['HR'] },
  { title: 'Staff Directory', href: '/hr/staff', icon: Users, roles: ['HR'] },
  { title: 'Payroll', href: '/hr/payroll', icon: CreditCard, roles: ['HR'] },
  { title: 'Attendance', href: '/hr/attendance', icon: ClipboardList, roles: ['HR'] },
  { title: 'Document Center', href: '/hr/documents', icon: FileText, roles: ['HR'] },
  { title: 'My Profile', href: '/hr/profile', icon: UserRound, roles: ['HR'] },

  // Admin Items
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['ADMIN'] },
  { title: 'Admissions', href: '/admin/admissions', icon: UserRound, roles: ['ADMIN'] },
  { title: 'Class & Sections', href: '/admin/classes', icon: BookOpen, roles: ['ADMIN'] },
  { title: 'Fee Management', href: '/admin/fees', icon: CreditCard, roles: ['ADMIN'] },
  { title: 'Student Schedules', href: '/admin/student-schedules', icon: Calendar, roles: ['ADMIN'] },
  { title: 'Tutor Schedules', href: '/admin/tutor-schedules', icon: Users, roles: ['ADMIN'] },
  { title: 'My Profile', href: '/admin/profile', icon: UserRound, roles: ['ADMIN'] },

  // Tutor Items
  { title: 'Dashboard', href: '/tutor', icon: LayoutDashboard, roles: ['TUTOR'] },
  { title: 'Classroom', href: '/tutor/classroom', icon: BookOpen, roles: ['TUTOR'] },
  { title: 'Mark Attendance', href: '/tutor/attendance', icon: ClipboardList, roles: ['TUTOR'] },
  { title: 'Gradebook', href: '/tutor/grades', icon: Trophy, roles: ['TUTOR'] },
  { title: 'Assignments', href: '/tutor/assignments', icon: FileText, roles: ['TUTOR'] },
  { title: 'Timetable', href: '/tutor/timetable', icon: Calendar, roles: ['TUTOR'] },
  { title: 'Messages', href: '/tutor/messages', icon: MessageSquare, roles: ['TUTOR'] },
  { title: 'My Profile', href: '/tutor/profile', icon: UserRound, roles: ['TUTOR'] },

  // Student Items
  { title: 'Dashboard', href: '/student', icon: LayoutDashboard, roles: ['STUDENT'] },
  { title: 'My Courses', href: '/student/courses', icon: BookOpen, roles: ['STUDENT'] },
  { title: 'Assignments', href: '/student/assignments', icon: FileText, roles: ['STUDENT'] },
  { title: 'Class Timetable', href: '/student/timetable', icon: Calendar, roles: ['STUDENT'] },
  { title: 'Exam Routine & Results', href: '/student/exams', icon: FileText, roles: ['STUDENT'] },
  { title: 'Fees Status', href: '/student/fees', icon: CreditCard, roles: ['STUDENT'] },
  { title: 'Messages', href: '/student/messages', icon: MessageSquare, roles: ['STUDENT'] },
  { title: 'My Profile', href: '/student/profile', icon: UserRound, roles: ['STUDENT'] },
];
