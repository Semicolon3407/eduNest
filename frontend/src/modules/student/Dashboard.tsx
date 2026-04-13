import type { ReactNode } from 'react';
import { BookOpen, Calendar, Star, FileText, Library, CheckCircle, Clock, Download, TrendingUp } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';

export function StudentDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome back, <span className="text-primary-600">Alex</span>!</h1>
          <p className="mt-1 text-muted-foreground font-medium">You have 2 assignments due by tomorrow. Keep going!</p>
        </div>
        <div className="flex gap-4">
             <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary-50 text-primary-700 border border-primary-100">
                <Star size={18} className="fill-primary-600" />
                <span className="text-sm font-black ">Rank: Top 5%</span>
             </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Attendance" 
          value="94%" 
          icon={<CheckCircle size={24} />} 
          trend={{ value: 2, isUp: true }}
        />
        <StatCard 
          title="Avg. Grade" 
          value="A-" 
          icon={<TrendingUp size={24} />} 
        />
        <StatCard 
          title="Courses" 
          value="6" 
          icon={<BookOpen size={24} />} 
        />
        <StatCard 
          title="Fee Status" 
          value="Paid" 
          icon={<CheckCircle size={24} />} 
          className="bg-emerald-600 text-white"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Upcoming Classes & LMS */}
        <div className="lg:col-span-2 space-y-8">
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar size={20} className="text-primary-600" /> Schedule for Today
                    </h2>
                    <button className="text-xs font-bold text-primary-600 transition-colors hover:underline">Full Timetable</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    <ScheduleCard time="09:00 AM" subject="Calculus" info="Room 302 • Prof. Miller" active />
                    <ScheduleCard time="11:30 AM" subject="Physics" info="Physics Lab • Dr. Stark" />
                    <ScheduleCard time="02:00 PM" subject="History" info="Auditorium • Ms. Croft" />
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen size={20} className="text-primary-600" /> Learning Resources
                    </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <ResourceItem title="Intro to Calculus Part 2" category="Mathematics" icon={<FileText size={18}/>} date="Oct 02, 2025" />
                    <ResourceItem title="Newton\'s Laws Physics Lab" category="Physics" icon={<Download size={18}/>} date="Oct 01, 2025" />
                    <ResourceItem title="Assignment: Modern Art Quiz" category="Fine Arts" icon={<FileText size={18}/>} date="Sept 28, 2025" />
                    <ResourceItem title="Library: Advanced AI Books" category="Computer Sc" icon={<Library size={18}/>} date="Sept 26, 2025" />
                </div>
            </section>
        </div>

        {/* Exams & Report Cards */}
        <div className="space-y-6">
             <div className="rounded-3xl border bg-background p-6 shadow-sm border-primary-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-primary-600" /> Exam Countdown
                </h2>
                <div className="space-y-4">
                    <ExamProgress subject="Mid Term Exams" daysLeft={14} progress={65} />
                    <ExamProgress subject="Physics Practical" daysLeft={2} progress={90} color="bg-orange-500" />
                    <ExamProgress subject="History Presentation" daysLeft={8} progress={15} color="bg-red-500" />
                </div>
             </div>

             <div className="rounded-3xl bg-foreground p-6 text-background shadow-xl">
                 <h3 className="text-lg font-bold mb-4 ">Digital Academy Records</h3>
                 <p className="text-xs text-muted-foreground mb-6 opacity-70">Download your verified digital certificates and report cards.</p>
                 <div className="space-y-3">
                    <button className="flex w-full items-center justify-between rounded-xl bg-background/10 p-3 text-xs font-bold transition-all hover:bg-background/20">
                        <span>Report Card - Term 1</span>
                        <Download size={14} />
                    </button>
                    <button className="flex w-full items-center justify-between rounded-xl bg-background/10 p-3 text-xs font-bold transition-all hover:bg-background/20">
                        <span>Character Certificate</span>
                        <Download size={14} />
                    </button>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleCard({ time, subject, info, active }: { time: string, subject: string, info: string, active?: boolean }) {
    return (
        <div className={`flex flex-col min-w-[200px] shrink-0 p-5 rounded-2xl border transition-all ${
            active ? 'bg-primary-600 text-white border-primary-600 shadow-xl shadow-primary-600/20 scale-105' : 'bg-background hover:border-primary-200'
        }`}>
            <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-primary-100' : 'text-muted-foreground'}`}>{time}</span>
            <h4 className="mt-2 text-xl font-black  tracking-tighter">{subject}</h4>
            <p className={`mt-4 text-xs font-bold ${active ? 'text-primary-100/90' : 'text-muted-foreground'}`}>{info}</p>
        </div>
    )
}

function ResourceItem({ title, category, icon, date }: { title: string, category: string, icon: ReactNode, date: string }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl border bg-background hover:border-primary-600/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    {icon}
                </div>
                <div>
                    <h5 className="text-sm font-bold tracking-tight">{title}</h5>
                    <div className="mt-1 flex gap-2 items-center text-[10px] font-bold text-muted-foreground uppercase">
                        <span className="text-primary-600">{category}</span>
                        <span>•</span>
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ExamProgress({ subject, daysLeft, progress, color = "bg-primary-600" }: { subject: string, daysLeft: number, progress: number, color?: string }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <div>
                    <p className="text-sm font-bold">{subject}</p>
                    <p className="text-[10px] font-bold text-muted-foreground">{daysLeft} days remaining</p>
                </div>
                <span className="text-xs font-black ">{progress}% Ready</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${color}`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    )
}
