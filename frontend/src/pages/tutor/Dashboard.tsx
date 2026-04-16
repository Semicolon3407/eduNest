import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { ClipboardList, Trophy, MessageSquare, Plus, Bell, ArrowRight, User } from 'lucide-react';
import { cn } from '../../utils/cn';

const teacherClasses = [
  { id: 1, subject: 'Advanced Math', grade: '12-A', time: '10:00 AM', attendance: '92%' },
  { id: 2, subject: 'Algebra', grade: '10-C', time: '12:00 PM', attendance: 'Pending' },
  { id: 3, subject: 'Calculus', grade: '11-B', time: '02:30 PM', attendance: 'Pending' },
];

const TutorDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Academic Central</h1>
          <p className="text-gray-500 mt-1">Managed your classes, mark attendance, and grade students</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-surface border border-surface-200 text-gray-600 px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-surface-50 transition-all flex items-center gap-2">
             <MessageSquare size={18} />
             Announcements
           </button>
           <button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-premium flex items-center gap-2 transition-all active:scale-95">
             <Plus size={18} />
             Add Materials
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="184" icon={User} color="brand" />
        <StatCard title="Marked Attendance" value="1/3 Today" icon={ClipboardList} color="warning" />
        <StatCard title="Gradebooks" value="8" icon={Trophy} color="success" />
        <StatCard title="Unread Messages" value="12" icon={MessageSquare} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-8">
        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-soft border border-surface-200">
          <div className="p-6 border-b border-surface-200 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900  ">Today's Teaching Schedule</h2>
          </div>
          <div className="p-4 space-y-4">
             {teacherClasses.map((cls) => (
               <div key={cls.id} className="flex items-center justify-between p-4 rounded-2xl border border-surface-100 hover:border-brand-200 hover:bg-brand-50/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center text-gray-400 font-medium group-hover:bg-white group-hover:text-brand-600 transition-all">
                       {cls.grade.split('-')[0]}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900  ">{cls.subject}</h4>
                      <p className="text-xs text-gray-500 font-medium">Grade {cls.grade} • {cls.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                       <p className="text-[10px] font-medium text-gray-400  ">Attendance</p>
                       <p className={cn("text-xs font-medium", cls.attendance === 'Pending' ? 'text-warning-dark' : 'text-success-dark')}>{cls.attendance}</p>
                     </div>
                     <button className="bg-brand-500 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-brand-600 transition-colors shadow-sm">
                        Mark Now
                     </button>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-soft border border-surface-200 p-6">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900  underline">Upcoming Deadlines</h2>
              <Bell size={18} className="text-danger animate-pulse" />
           </div>
           <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-brand-200">
                 <div className="absolute w-3 h-3 bg-brand-500 rounded-full -left-[7px] top-1"></div>
                 <p className="text-[10px] font-medium text-brand-600  ">Oct 18, 2023</p>
                 <h4 className="text-sm font-medium text-gray-900 mt-1  ">Grade Submission (12-A)</h4>
                 <p className="text-xs text-gray-500 mt-1 font-medium">Mid-term results must be uploaded by 5 PM.</p>
              </div>
              <div className="relative pl-6 border-l-2 border-surface-200">
                 <div className="absolute w-3 h-3 bg-surface-200 rounded-full -left-[7px] top-1"></div>
                 <p className="text-[10px] font-medium text-gray-400  ">Oct 20, 2023</p>
                 <h4 className="text-sm font-medium text-gray-900 mt-1  ">Lab Report Review</h4>
                 <p className="text-xs text-gray-500 mt-1 font-medium">General Physics Lab Session Feedback.</p>
              </div>
           </div>
           
           <button className="w-full mt-10 flex items-center justify-center gap-2 text-sm font-medium text-brand-600 group">
             Full Calendar <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
