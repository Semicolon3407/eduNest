import React, { useEffect, useState } from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { ClipboardList, Trophy, MessageSquare, Bell, ArrowRight, User, Loader2 } from 'lucide-react';
import { tutorService } from '../../services/tutorService';
import { cn } from '../../utils/cn';

const TutorDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, scheduleRes] = await Promise.all([
          tutorService.getDashboardStats(),
          tutorService.getSchedule()
        ]);
        setStats(statsRes.data);
        setSchedule(scheduleRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Academic Central</h1>
          <p className="text-gray-500 mt-1">Managed your classes, mark attendance, and grade students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats?.totalStudents?.toString() || '0'} icon={User} color="brand" />
        <StatCard title="Marked Attendance" value={stats?.markedAttendance || '0/0 Today'} icon={ClipboardList} color="warning" />
        <StatCard title="Gradebooks" value={stats?.gradebooks?.toString() || '0'} icon={Trophy} color="success" />
        <StatCard title="Unread Messages" value={stats?.unreadMessages?.toString() || '0'} icon={MessageSquare} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-8">
        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-soft border border-surface-200">
          <div className="p-6 border-b border-surface-200 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900  ">Today's Teaching Schedule</h2>
          </div>
          <div className="p-4 space-y-4">
             {schedule.length > 0 ? schedule.map((item: any) => (
               <div key={item._id} className="flex items-center justify-between p-4 rounded-2xl border border-surface-100 hover:border-brand-200 hover:bg-brand-50/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center text-gray-400 font-medium group-hover:bg-white group-hover:text-brand-600 transition-all">
                       {item.class?.name?.split(' ')[1] || 'CL'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900  ">{item.subject}</h4>
                      <p className="text-xs text-gray-500 font-medium">Grade {item.class?.name}-{item.class?.section} • {item.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                       <p className="text-[10px] font-medium text-gray-400  ">Room</p>
                       <p className="text-xs font-medium text-brand-600">{item.room}</p>
                     </div>
                     <button className="bg-brand-500 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-brand-600 transition-colors shadow-sm">
                        View Details
                     </button>
                  </div>
               </div>
             )) : (
               <div className="text-center py-12 text-gray-400">
                 <p className="text-sm font-medium">No classes scheduled for today.</p>
               </div>
             )}
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-soft border border-surface-200 p-6">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900  underline">Upcoming Deadlines</h2>
              <Bell size={18} className="text-danger animate-pulse" />
           </div>
           <div className="space-y-6">
              {stats?.upcomingDeadlines?.map((deadline: any, index: number) => (
                <div key={deadline.id} className={cn(
                  "relative pl-6 border-l-2",
                  index === 0 ? "border-brand-200" : "border-surface-200"
                )}>
                   <div className={cn(
                     "absolute w-3 h-3 rounded-full -left-[7px] top-1",
                     index === 0 ? "bg-brand-500" : "bg-surface-200"
                   )}></div>
                   <p className={cn(
                     "text-[10px] font-medium",
                     index === 0 ? "text-brand-600" : "text-gray-400"
                   )}>{new Date(deadline.dueDate).toLocaleDateString()}</p>
                   <h4 className="text-sm font-medium text-gray-900 mt-1">{deadline.title}</h4>
                   <p className="text-xs text-gray-500 mt-1 font-medium">{deadline.className} • Submission Tracking</p>
                </div>
              ))}
              {(!stats?.upcomingDeadlines || stats.upcomingDeadlines.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No upcoming deadlines.</p>
              )}
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
