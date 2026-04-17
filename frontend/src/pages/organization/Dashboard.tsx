import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { GitBranch, Calendar, Users, Settings, ArrowRight, Building2, MapPin, GraduationCap, ChevronRight } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const branches = [
  { id: 1, name: 'Main Campus', location: 'Downtown', students: '1,240', staff: '84' },
  { id: 2, name: 'North Branch', location: 'Uptown', students: '640', staff: '42' },
  { id: 3, name: 'West Side', location: 'Suburbs', students: '320', staff: '18' },
];

const recentStudents = [
  { id: 'STU-24-001', name: 'Alice Walker', grade: 'Grade 10 - Science', branch: 'Main Campus', status: 'Active' },
  { id: 'STU-24-002', name: 'Thomas Edison', grade: 'Grade 8 - General', branch: 'North Branch', status: 'Active' },
  { id: 'STU-24-003', name: 'Marie Curie', grade: 'Grade 12 - Advanced', branch: 'West Side', status: 'Pending' },
  { id: 'STU-24-004', name: 'Isaac Newton', grade: 'Grade 9 - Standard', branch: 'Main Campus', status: 'Active' },
  { id: 'STU-24-005', name: 'Albert Einstein', grade: 'Grade 11 - Science', branch: 'North Branch', status: 'Active' },
];

const activeStaff = [
  { id: 'EMP-001', name: 'Sarah Wilson', role: 'Principal', branch: 'Main Campus', status: 'Active' },
  { id: 'EMP-002', name: 'Michael Brown', role: 'Administrator', branch: 'North Branch', status: 'Active' },
  { id: 'EMP-003', name: 'Emily Davis', role: 'HR Manager', branch: 'Main Campus', status: 'Active' },
];

const OrganizationDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Organization Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage multiple branches and school-wide policies</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Total Branches" value="3 Active" icon={GitBranch} color="brand" />
        <StatCard title="Total Students" value="2,200" icon={GraduationCap} color="brand" />
        <StatCard title="Total Staff" value="144" icon={Users} color="warning" />
        <StatCard title="Current Session" value="2024 - 2025" icon={Calendar} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Branches & Students Section */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Active Campuses */}
           <div>
             <h2 className="text-xl font-medium text-gray-900 px-1 mb-6">Active Campuses</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {branches.map((branch) => (
                 <div key={branch.id} className="bg-surface p-6 rounded-[32px] shadow-soft border border-surface-200 hover:border-brand-200 transition-all group relative overflow-hidden">
                   <div className="flex justify-between items-start relative z-10">
                      <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-all">
                        <Building2 size={24} />
                      </div>
                      <button className="text-gray-400 hover:text-brand-600"><Settings size={18}/></button>
                   </div>
                   <div className="mt-4 relative z-10">
                     <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-600 transition-colors">{branch.name}</h3>
                     <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 font-medium">
                       <MapPin size={14}/> {branch.location}
                     </p>
                   </div>
                   <div className="mt-6 flex items-center gap-4 border-t border-surface-100 pt-4 relative z-10">
                      <div>
                        <p className="text-[10px] font-medium text-gray-400">Students</p>
                        <p className="text-sm font-medium text-gray-900">{branch.students}</p>
                      </div>
                      <div className="w-px h-8 bg-surface-100"></div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-400">Faculty</p>
                        <p className="text-sm font-medium text-gray-900">{branch.staff}</p>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </div>
               ))}
              </div>
           </div>

           {/* Active Staff List */}
           <div className="bg-surface rounded-[32px] shadow-soft border border-surface-200 overflow-hidden">
             <div className="p-6 border-b border-surface-100 flex items-center justify-between">
               <h2 className="text-xl font-medium text-gray-900">Active Staff</h2>
               <button className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                 View All <ChevronRight size={16} />
               </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[600px]">
                 <thead>
                   <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6">
                     <th className="px-6 py-4">Staff Member</th>
                     <th className="px-6 py-4">Role & Branch</th>
                     <th className="px-6 py-4">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-surface-100">
                   {activeStaff.map((staff) => (
                     <tr key={staff.id} className="hover:bg-brand-50/20 transition-all">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-brand-600 font-medium text-xs">
                             {staff.name.charAt(0)}
                           </div>
                           <div>
                             <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                             <p className="text-[10px] font-medium text-gray-400">{staff.id}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <p className="text-sm font-medium text-gray-900">{staff.role}</p>
                         <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1"><MapPin size={10} /> {staff.branch}</p>
                       </td>
                       <td className="px-6 py-4">
                         <Badge variant={staff.status === 'Active' ? 'success' : 'warning'}>
                           {staff.status}
                         </Badge>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

           {/* Student Details List */}
           <div className="bg-surface rounded-[32px] shadow-soft border border-surface-200 overflow-hidden">
             <div className="p-6 border-b border-surface-100 flex items-center justify-between">
               <h2 className="text-xl font-medium text-gray-900">Recent Student Admissions</h2>
               <button className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                 View All <ChevronRight size={16} />
               </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[600px]">
                 <thead>
                   <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6">
                     <th className="px-6 py-4">Student Info</th>
                     <th className="px-6 py-4">Academic Details</th>
                     <th className="px-6 py-4">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-surface-100">
                   {recentStudents.map((student) => (
                     <tr key={student.id} className="hover:bg-brand-50/20 transition-all">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-medium text-xs">
                             {student.name.charAt(0)}
                           </div>
                           <div>
                             <p className="text-sm font-medium text-gray-900">{student.name}</p>
                             <p className="text-[10px] font-medium text-gray-400">{student.id}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <p className="text-sm font-medium text-gray-900">{student.grade}</p>
                         <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1"><MapPin size={10} /> {student.branch}</p>
                       </td>
                       <td className="px-6 py-4">
                         <Badge variant={student.status === 'Active' ? 'success' : 'warning'}>
                           {student.status}
                         </Badge>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

        </div>

        {/* Quick Configs */}
        <div className="space-y-6">
           <h2 className="text-xl font-medium text-gray-900 px-1">Academic Setup</h2>
           <div className="bg-brand-500 text-white rounded-[32px] p-6 shadow-premium relative overflow-hidden group">
              <h3 className="text-lg font-medium">Session Configuration</h3>
              <p className="text-brand-200 text-xs mt-1 leading-relaxed">Define grading scales, terms, and session cycles for all branches.</p>
              <div className="mt-8 space-y-4 relative z-10">
                 <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer">
                    <span className="text-xs font-medium tracking-wide">Grading System</span>
                    <ArrowRight size={14} className="text-brand-400" />
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer">
                    <span className="text-xs font-medium tracking-wide">Term Management</span>
                    <ArrowRight size={14} className="text-brand-400" />
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-500/20 rounded-full blur-2xl transition-transform group-hover:scale-110"></div>
           </div>

           <div className="bg-surface rounded-2xl shadow-soft border border-surface-200 p-6">
              <h3 className="text-sm font-medium text-gray-900">Onboarding Status</h3>
              <div className="mt-4 flex items-center gap-3">
                 <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '85%' }}></div>
                 </div>
                 <span className="text-xs font-medium text-success-dark">85%</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 font-medium">8 out of 10 staff roles configured</p>
              <button className="w-full mt-4 py-2 text-xs font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors">Complete Setup</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
