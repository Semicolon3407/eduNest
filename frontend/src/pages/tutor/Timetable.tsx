import React from 'react';
import Badge from '../../components/ui/Badge';
import { Clock, MapPin, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const schedule = [
  { time: '09:00 AM - 10:30 AM', subject: 'Advanced Calculus', class: 'Grade 12-A', room: 'Hall 4', day: 'Monday' },
  { time: '11:00 AM - 12:30 PM', subject: 'Complex Variables', class: 'Grade 12-B', room: 'Lab 2', day: 'Monday' },
  { time: '02:00 PM - 03:30 PM', subject: 'Linear Algebra', class: 'Grade 11-A', room: 'Hall 1', day: 'Tuesday' },
  { time: '09:00 AM - 10:30 AM', subject: 'Advanced Calculus', class: 'Grade 12-A', room: 'Hall 4', day: 'Wednesday' },
  { time: '11:00 AM - 12:30 PM', subject: 'Tutorial Session', class: 'Grade 12-A', room: 'Seminar Room', day: 'Friday' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TutorTimetable: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Teacher's Schedule</h1>
          <p className="text-gray-500 mt-1 font-medium">Weekly lecture distribution and venue allocations</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-soft border border-slate-100">
           <button className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-brand-600"><ChevronLeft size={20}/></button>
           <span className="text-xs font-bold text-gray-900 px-4 uppercase tracking-[0.2em]">Oct 16 - Oct 21</span>
           <button className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-brand-600"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-soft overflow-hidden">
         <div className="grid grid-cols-1 md:grid-cols-6 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50">
            {days.map(day => (
               <div key={day} className="px-6 py-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day.substring(0, 3)}</span>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-6 divide-x divide-slate-100 h-[600px] overflow-y-auto">
            {days.map(day => (
               <div key={day} className="p-4 space-y-4 min-h-[150px] bg-white hover:bg-slate-50/30 transition-all">
                  {schedule.filter(s => s.day === day).map((item, i) => (
                     <div key={i} className="p-4 bg-brand-50 border border-brand-100 rounded-2xl shadow-sm hover:shadow-premium transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                           <Badge variant="brand" className="text-[8px] px-2">{item.class}</Badge>
                           <Clock size={12} className="text-brand-400" />
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-brand-600 transition-colors leading-tight mb-2">{item.subject}</h4>
                        <div className="space-y-1">
                           <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              <Clock size={10} /> {item.time.split(' - ')[0]}
                           </div>
                           <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              <MapPin size={10} /> {item.room}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ))}
         </div>
      </div>

      <div className="bg-brand-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-premium">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <CalendarIcon size={32} className="text-brand-300" />
               </div>
               <div>
                  <h2 className="text-2xl font-medium">Substitute Lecture Alert</h2>
                  <p className="text-brand-200 mt-1 font-medium">You have been assigned as a substitute for Grade 10-C Physics this Thursday.</p>
               </div>
            </div>
            <button className="h-14 px-8 bg-white text-brand-700 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-50 transition-all shadow-premium whitespace-nowrap">View Shift Details</button>
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>
    </div>
  );
};

export default TutorTimetable;
