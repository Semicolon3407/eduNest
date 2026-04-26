import React, { useEffect, useState } from 'react';
import StatCard from '../../components/dashboard/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Calendar, BookOpen, CreditCard, Clock, ChevronRight, Award, MessageSquare, Loader2 } from 'lucide-react';
import { getDashboardStats, getAnnouncements, getAssignments } from '../../services/studentService';

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, annRes, assRes] = await Promise.all([
          getDashboardStats(),
          getAnnouncements(),
          getAssignments()
        ]);
        setStats(statsRes.data);
        setAnnouncements(annRes.data.slice(0, 2));
        setAssignments(assRes.data.filter((a: any) => a.status === 'Pending').slice(0, 2));
      } catch (error) {
        console.error('Error fetching student dashboard data:', error);
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
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900   leading-none">Welcome back, {stats?.studentName || 'Student'}</h1>
          <p className="text-gray-500 mt-2 font-medium">Your academic journey for <span className="text-brand-600 font-medium">AY {stats?.academicYear || '2023-24'}</span> is on track.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-2xl shadow-premium">
           <Award size={20} className="text-brand-300" />
           <span className="text-[10px] font-medium   text-brand-100">Rank #{stats?.rank || 'N/A'} in Class</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Course Average" value={`${stats?.avgGrade}%`} icon={BookOpen} trend={{ value: 'Live', isUp: true }} />
        <StatCard title="Attendance" value={`${stats?.attendanceRate}%`} icon={Calendar} trend={{ value: stats?.attendanceRate >= 75 ? 'On track' : 'Low', isUp: stats?.attendanceRate >= 75 }} />
        <StatCard title="Pending Tasks" value={stats?.pendingAssignments?.toString() || '0'} icon={Clock} />
        <StatCard title="Fee Status" value={stats?.totalDue > 0 ? `Rs. ${stats.totalDue}` : 'Paid'} icon={CreditCard} />
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
                 {announcements.length > 0 ? announcements.map((item, idx) => (
                    <div key={idx} className="p-8 bg-slate-50/50 rounded-[32px] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-soft transition-all group cursor-pointer">
                       <div className="flex justify-between items-start mb-4">
                          <Badge variant="brand" className="text-[9px] uppercase tracking-widest">{item.type}</Badge>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</span>
                       </div>
                       <h4 className="text-lg font-medium text-gray-900 group-hover:text-brand-600 transition-colors mb-2 leading-tight">{item.title}</h4>
                       <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">{item.content}</p>
                       <div className="mt-6 flex items-center gap-2 text-brand-600 font-bold text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
                          Read More <ChevronRight size={14} />
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-12 text-gray-400">No recent announcements.</div>
                 )}
              </div>
           </div>
        </div>

        {/* Pending Tasks */}
        <div className="space-y-6">
           <div className="bg-brand-500 p-6 sm:p-10 rounded-[40px] shadow-premium relative overflow-hidden h-full group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all"></div>
              
              <h2 className="text-xl font-medium text-white   mb-8 relative z-10">Pending Tasks</h2>
              <div className="space-y-4 relative z-10">
                 {assignments.length > 0 ? assignments.map((task, idx) => (
                    <div key={idx} className="p-5 bg-white/10 border border-white/5 rounded-3xl hover:bg-white/20 transition-all cursor-pointer">
                       <h4 className="font-medium text-xs text-white   mb-1">{task.title}</h4>
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-medium text-brand-300  ">Due {new Date(task.dueDate).toLocaleDateString()}</span>
                          <Badge variant="brand" className="text-[8px] border-white/20 bg-white/10">Pending</Badge>
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-12 text-white/50">No pending assignments.</div>
                 )}
                 <Button className="w-full mt-4 bg-white text-brand-500 hover:bg-brand-50 font-medium text-[10px]   rounded-2xl h-12 border-none">Browse LMS</Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
