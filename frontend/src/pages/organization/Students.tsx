import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { 
  Mail, Search, 
  Users, CheckCircle2, BookOpen, Eye, ChevronDown, GitBranch
} from 'lucide-react';

const students = [
  { id: 'STU-101', name: 'Alex Johnson', email: 'alex.j@student.com', grade: 'Grade 10', section: 'A', branch: 'Main Campus', status: 'Active', enrolled: '2023-09-01' },
  { id: 'STU-102', name: 'Maria Garcia', email: 'maria.g@student.com', grade: 'Grade 9', section: 'B', branch: 'North Branch', status: 'Active', enrolled: '2023-09-05' },
  { id: 'STU-103', name: 'David Chen', email: 'david.c@student.com', grade: 'Grade 11', section: 'A', branch: 'Main Campus', status: 'Active', enrolled: '2023-09-02' },
  { id: 'STU-104', name: 'Sarah Miller', email: 'sarah.m@student.com', grade: 'Grade 10', section: 'C', branch: 'East Wing', status: 'Pending', enrolled: '2023-11-15' },
  { id: 'STU-105', name: 'Kevin Brown', email: 'kevin.b@student.com', grade: 'Grade 12', section: 'A', branch: 'Main Campus', status: 'Active', enrolled: '2022-09-01' },
];

const branches = ['Main Campus', 'North Branch', 'East Wing'];
const classSections = [
  'Grade 9 - A', 'Grade 9 - B', 'Grade 9 - C',
  'Grade 10 - A', 'Grade 10 - B', 'Grade 10 - C',
  'Grade 11 - A', 'Grade 11 - B', 'Grade 11 - C',
  'Grade 12 - A', 'Grade 12 - B', 'Grade 12 - C',
];

const StudentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedClassSection, setSelectedClassSection] = useState('All Classes & Sections');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Student Directory</h1>
          <p className="text-gray-500 mt-1">Institutional oversight and cross-branch auditing for all students</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-brand-200">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Enrollment</p>
            <p className="text-2xl font-display font-medium text-gray-900">2,482</p>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-success/30">
          <div className="w-14 h-14 rounded-2xl bg-success-light/50 text-success-dark flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Students</p>
            <p className="text-2xl font-display font-medium text-gray-900">2,410</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-brand-200">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 text-brand-600 flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Promotion Pending</p>
            <p className="text-2xl font-display font-medium text-gray-900">72</p>
          </div>
        </div>
      </div>

      <div className="bg-surface p-4 sm:p-6 rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by name, enrollment ID..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl h-12"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="relative group min-w-[200px]">
                <GitBranch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 z-10" />
                <select 
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full h-12 bg-white border border-surface-200 rounded-xl pl-12 pr-10 text-xs font-bold text-gray-800 appearance-none outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer"
                >
                  <option>All Branches</option>
                  {branches.map(b => <option key={b}>{b}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-brand-500" />
             </div>

             <div className="relative group min-w-[240px]">
                <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 z-10" />
                <select 
                  value={selectedClassSection}
                  onChange={(e) => setSelectedClassSection(e.target.value)}
                  className="w-full h-12 bg-white border border-surface-200 rounded-xl pl-12 pr-10 text-xs font-bold text-gray-800 appearance-none outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer"
                >
                  <option>All Classes & Sections</option>
                  {classSections.map(cs => <option key={cs}>{cs}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-brand-500" />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:-mx-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6 uppercase">
                  <th className="px-6 py-4">Student Participant</th>
                  <th className="px-6 py-4">Admission ID</th>
                  <th className="px-6 py-4">Academic Base</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {students.map((student) => (
                  <tr key={student.id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-medium text-sm transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight leading-none mb-1">{student.name}</p>
                          <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                            <Mail size={12} /> {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-gray-900">{student.id}</span>
                      <p className="text-[10px] text-brand-500 font-medium mt-0.5">{student.branch}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-gray-900">{student.grade}</p>
                        <p className="text-[10px] text-brand-500 font-medium uppercase">Section {student.section}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={
                        student.status === 'Active' ? 'success' :
                        student.status === 'Pending' ? 'warning' : 'danger'
                      }>
                        {student.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => navigate(`/organization/students/${student.id}`)}
                        className="p-2 text-gray-400 hover:bg-white hover:text-brand-600 rounded-lg shadow-sm border border-transparent hover:border-brand-100 transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between px-2">
          <p className="text-xs font-medium text-gray-400">Total Results: 2,482 Student Records</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-9">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
