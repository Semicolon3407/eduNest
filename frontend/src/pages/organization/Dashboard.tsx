import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { GitBranch, Calendar, Users, Settings, ArrowRight, Building2, MapPin } from 'lucide-react';

const branches = [
  { id: 1, name: 'Main Campus', location: 'Downtown', students: '1,240', staff: '84' },
  { id: 2, name: 'North Branch', location: 'Uptown', students: '640', staff: '42' },
  { id: 3, name: 'West Side', location: 'Suburbs', students: '320', staff: '18' },
];

const OrganizationDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Institutional Overview</h1>
        <p className="text-gray-500 mt-1">Manage multiple branches and school-wide policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Branches" value="3 Active" icon={GitBranch} color="brand" />
        <StatCard title="Current Session" value="2024 - 2025" icon={Calendar} color="success" />
        <StatCard title="Total Staff" value="144" icon={Users} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-8">
        {/* Branches Grid */}
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-xl font-medium text-gray-900 px-1">Active Campuses</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {branches.map((branch) => (
               <div key={branch.id} className="bg-surface p-6 rounded-2xl shadow-soft border border-surface-200 hover:border-brand-200 transition-all group relative overflow-hidden">
                 <div className="flex justify-between items-start relative z-10">
                    <div className="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-all">
                      <Building2 size={24} />
                    </div>
                    <button className="text-gray-400 hover:text-brand-600"><Settings size={18}/></button>
                 </div>
                 <div className="mt-4 relative z-10">
                   <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-600 transition-colors  ">{branch.name}</h3>
                   <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 font-medium">
                     <MapPin size={14}/> {branch.location}
                   </p>
                 </div>
                 <div className="mt-6 flex items-center gap-4 border-t border-surface-100 pt-4 relative z-10">
                    <div>
                      <p className="text-[10px] font-medium text-gray-400  ">Students</p>
                      <p className="text-sm font-medium text-gray-900">{branch.students}</p>
                    </div>
                    <div className="w-px h-8 bg-surface-100"></div>
                    <div>
                      <p className="text-[10px] font-medium text-gray-400  ">Faculty</p>
                      <p className="text-sm font-medium text-gray-900">{branch.staff}</p>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
             ))}
           </div>
        </div>

        {/* Quick Configs */}
        <div className="space-y-6">
           <h2 className="text-xl font-medium text-gray-900 px-1">Academic Setup</h2>
           <div className="bg-brand-500 text-white rounded-3xl p-6 shadow-premium relative overflow-hidden group">
              <h3 className="text-lg font-medium">Session Configuration</h3>
              <p className="text-brand-200 text-xs mt-1 leading-relaxed">Define grading scales, terms, and session cycles for all branches.</p>
              <div className="mt-8 space-y-4">
                 <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer">
                    <span className="text-xs font-medium  tracking-wide">Grading System</span>
                    <ArrowRight size={14} className="text-brand-400" />
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer">
                    <span className="text-xs font-medium  tracking-wide">Term Management</span>
                    <ArrowRight size={14} className="text-brand-400" />
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-500/20 rounded-full blur-2xl transition-transform group-hover:scale-110"></div>
           </div>

           <div className="bg-surface rounded-2xl shadow-soft border border-surface-200 p-6">
              <h3 className="text-sm font-medium text-gray-900  ">Onboarding Status</h3>
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
