import type { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  CreditCard, 
  Settings, 
  Building2,
  CalendarDays,
  UserCheck,
  BookOpen,
  ClipboardList,
  Library,
  Banknote,
  Boxes,
  MessageSquare,
  FileText
} from 'lucide-react';
import type { UserRole } from '../../types';

export interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  // Super Admin
  { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['SUPER_ADMIN'] },
  { title: 'Organizations', href: '/organizations', icon: <School size={20} />, roles: ['SUPER_ADMIN'] },
  { title: 'Subscriptions', href: '/subscriptions', icon: <CreditCard size={20} />, roles: ['SUPER_ADMIN'] },
  { title: 'Global Settings', href: '/global-config', icon: <Settings size={20} />, roles: ['SUPER_ADMIN'] },
  
  // Organization
  { title: 'Overview', href: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['ORG_ADMIN'] },
  { title: 'Branches', href: '/branches', icon: <Building2 size={20} />, roles: ['ORG_ADMIN'] },
  { title: 'Academic Year', href: '/academic-setup', icon: <CalendarDays size={20} />, roles: ['ORG_ADMIN'] },
  { title: 'Staff Mgmt', href: '/staff', icon: <Users size={20} />, roles: ['ORG_ADMIN'] },

  // HR
  { title: 'Payroll', href: '/payroll', icon: <Banknote size={20} />, roles: ['HR'] },
  { title: 'Attendance', href: '/staff-attendance', icon: <UserCheck size={20} />, roles: ['HR'] },
  { title: 'Recruitment', href: '/recruitment', icon: <Users size={20} />, roles: ['HR'] },

  // Administrator
  { title: 'Admissions', href: '/admissions', icon: <UserCheck size={20} />, roles: ['ADMIN'] },
  { title: 'Class & Sections', href: '/classes', icon: <Boxes size={20} />, roles: ['ADMIN'] },
  { title: 'Fee Management', href: '/fees', icon: <Banknote size={20} />, roles: ['ADMIN'] },
  { title: 'Inventory', href: '/inventory', icon: <Boxes size={20} />, roles: ['ADMIN'] },

  // Tutor
  { title: 'My Classes', href: '/classes', icon: <BookOpen size={20} />, roles: ['TUTOR'] },
  { title: 'Attendance', href: '/student-attendance', icon: <UserCheck size={20} />, roles: ['TUTOR'] },
  { title: 'Gradebook', href: '/grades', icon: <ClipboardList size={20} />, roles: ['TUTOR'] },
  { title: 'Messages', href: '/messages', icon: <MessageSquare size={20} />, roles: ['TUTOR'] },

  // Student
  { title: 'My Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['STUDENT'] },
  { title: 'LMS', href: '/lms', icon: <BookOpen size={20} />, roles: ['STUDENT'] },
  { title: 'Exams', href: '/exams', icon: <FileText size={20} />, roles: ['STUDENT'] },
  { title: 'Library', href: '/library', icon: <Library size={20} />, roles: ['STUDENT'] },

  // Shared
  { title: 'Settings', href: '/settings', icon: <Settings size={20} />, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'HR', 'ADMIN', 'TUTOR', 'STUDENT'] },
];
