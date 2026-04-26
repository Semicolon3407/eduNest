import React, { useEffect, useState } from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { ClipboardList, Trophy, MessageSquare, Bell, ArrowRight, User, Loader2, Megaphone } from 'lucide-react';
import { tutorService } from '../../services/tutorService';
import { tenantService } from '../../services/tenantService';
import { cn } from '../../utils/cn';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const TutorDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Announcement State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    content: '',
    branchId: '',
    classId: '',
    type: 'Academic'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, scheduleRes, classesRes, branchesRes] = await Promise.all([
          tutorService.getDashboardStats(),
          tutorService.getSchedule(),
          tutorService.getTutorClasses(),
          tenantService.getBranches()
        ]);
        setStats(statsRes.data);
        setSchedule(scheduleRes.data);
        setClasses(classesRes.data);
        setBranches(branchesRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Posting announcement...');
    try {
      const response = await tutorService.createAnnouncement(announcementData);
      if (response.success) {
        toast.success('Announcement posted successfully!', { id: toastId });
        setIsModalOpen(false);
        setAnnouncementData({ title: '', content: '', branchId: '', classId: '', type: 'Academic' });
      }
    } catch (error) {
      toast.error('Failed to post announcement', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Academic Central</h1>
          <p className="text-gray-500 mt-1">Managed your classes, mark attendance, and grade students</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl h-12 shadow-premium bg-brand-500 text-white hover:bg-brand-600 px-6">
          <Megaphone size={18} className="mr-2" /> Post Announcement
        </Button>
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
                      <p className="text-xs text-gray-500 font-medium">{item.class?.name}-{item.class?.section} • {item.startTime}</p>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post Announcement"
        description="Broadcast an announcement to your students."
      >
        <form onSubmit={handlePostAnnouncement} className="space-y-6">
          <Input 
            label="Announcement Title" 
            value={announcementData.title}
            onChange={(e) => setAnnouncementData({...announcementData, title: e.target.value})}
            placeholder="e.g. Midterm Exam Prep"
            required 
          />
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type</label>
            <select 
              value={announcementData.type}
              onChange={(e) => setAnnouncementData({...announcementData, type: e.target.value})}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="Administrative">Administrative</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Branch (Optional)</label>
              <select 
                value={announcementData.branchId}
                onChange={(e) => setAnnouncementData({...announcementData, branchId: e.target.value})}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Select Branch</option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Class (Optional)</label>
              <select 
                value={announcementData.classId}
                onChange={(e) => setAnnouncementData({...announcementData, classId: e.target.value})}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">All My Classes</option>
                {classes.filter(c => !announcementData.branchId || c.branch === announcementData.branchId).map(c => (
                  <option key={c._id} value={c._id}>{c.name} - Sec {c.section}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message Content</label>
            <textarea 
              value={announcementData.content}
              onChange={(e) => setAnnouncementData({...announcementData, content: e.target.value})}
              required
              rows={4}
              placeholder="Write your announcement details here..."
              className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm font-medium text-slate-700 focus:ring-2 focus:ring-brand-500/20 resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl shadow-premium bg-brand-500 text-white hover:bg-brand-600">
              {isSubmitting ? 'Posting...' : 'Post Announcement'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TutorDashboard;
