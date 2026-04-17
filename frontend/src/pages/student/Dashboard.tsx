import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Calendar, BookOpen, CreditCard, Clock, ChevronRight, Award, MessageSquare } from 'lucide-react';

const announcements = [
  { title: 'Winter Semester Registration', content: 'Enrollment for the Spring 2024 semester begins next Monday. Ensure all dues are cleared.', date: 'Oct 20, 2023', type: 'Administrative' },
  { title: 'Annual Science Fair 2023', content: 'Registrations are open for the annual innovation showcase. Grand prize includes a research grant.', date: 'Oct 18, 2023', type: 'Event' },
];

const assignments = [
  { title: 'Newtonian Laws Paper', due: 'Today, 11:59 PM', status: 'Pending' },
  { title: 'Algebra Quiz', due: 'Oct 18', status: 'Pending' },
];

const StudentDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900   leading-none">Welcome back, Anup</h1>
          <p className="text-gray-500 mt-2 font-medium">Your academic journey for <span className="text-brand-600 font-medium">Fall 2023</span> is on track.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-2xl shadow-premium">
           <Award size={20} className="text-brand-300" />
           <span className="text-[10px] font-medium   text-brand-100">Rank #4 in Science</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Course Average" value="88.4%" icon={BookOpen} trend={{ value: '+2.5%', isUp: true }} />
        <StatCard title="Attendance" value="96%" icon={Calendar} trend={{ value: 'On track', isUp: true }} />
        <StatCard title="Credits" value="18/22" icon={Clock} />
        <StatCard title="Fee Status" value="Paid" icon={CreditCard} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Announcements */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-soft border border-slate-200 h-full">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center">
                      <MessageSquare size={24} />
                    </div>
                    <h2 className="text-xl font-medium text-gray-900  ">Announcements</h2>
                 </div>
                 <button className="text-[10px] font-medium text-brand-600  tracking-[0.2em] border-b border-brand-200 pb-1">View Archive</button>
              </div>

              <div className="space-y-6">
                 {announcements.map((item, idx) => (
                    <div key={idx} className="p-8 bg-slate-50/50 rounded-[32px] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-soft transition-all group cursor-pointer">
                       <div className="flex justify-between items-start mb-4">
                          <Badge variant="brand" className="text-[9px] uppercase tracking-widest">{item.type}</Badge>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                       </div>
                       <h4 className="text-lg font-medium text-gray-900 group-hover:text-brand-600 transition-colors mb-2 leading-tight">{item.title}</h4>
                       <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">{item.content}</p>
                       <div className="mt-6 flex items-center gap-2 text-brand-600 font-bold text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                          Read More <ChevronRight size={14} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Pending Tasks */}
        <div className="space-y-6">
           <div className="bg-brand-500 p-6 sm:p-10 rounded-[40px] shadow-premium relative overflow-hidden h-full group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all"></div>
              
              <h2 className="text-xl font-medium text-white   mb-8 relative z-10">Pending Tasks</h2>
              <div className="space-y-4 relative z-10">
                 {assignments.map((task, idx) => (
                    <div key={idx} className="p-5 bg-white/10 border border-white/5 rounded-3xl hover:bg-white/20 transition-all cursor-pointer">
                       <h4 className="font-medium text-xs text-white   mb-1">{task.title}</h4>
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-medium text-brand-300  ">Due {task.due}</span>
                          <Badge variant="brand" className="text-[8px] border-white/20 bg-white/10">Pending</Badge>
                       </div>
                    </div>
                 ))}
                 <Button className="w-full mt-4 bg-white text-brand-500 hover:bg-brand-50 font-medium text-[10px]   rounded-2xl h-12 border-none">Browse LMS</Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
