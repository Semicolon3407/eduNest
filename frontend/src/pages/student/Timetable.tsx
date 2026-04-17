import React from 'react';
import { Clock, MapPin, User, ChevronLeft, ChevronRight, Calendar as CalendarIcon, BookOpen } from 'lucide-react';

const schedule = [
  { time: '09:00 AM - 10:30 AM', subject: 'Advanced Physics', tutor: 'Prof. Hawking', room: 'Lab 4', day: 'Monday' },
  { time: '11:00 AM - 12:30 PM', subject: 'World History', tutor: 'Dr. Jones', room: 'Hall B', day: 'Monday' },
  { time: '01:30 PM - 03:00 PM', subject: 'Calculus III', tutor: 'Dr. Sarah Smith', room: 'Hall 4', day: 'Tuesday' },
  { time: '09:00 AM - 10:30 AM', subject: 'Advanced Physics', tutor: 'Prof. Hawking', room: 'Lab 4', day: 'Wednesday' },
  { time: '11:00 AM - 12:30 PM', subject: 'Computer Science', tutor: 'Prof. Chen', room: 'IT Lab 1', day: 'Thursday' },
  { time: '09:00 AM - 11:00 AM', subject: 'Lab Session', tutor: 'Prof. Hawking', room: 'Lab 4', day: 'Friday' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const StudentTimetable: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Class Timetable</h1>
          <p className="text-gray-500 mt-1 font-medium">Your personalized weekly lecture schedule</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-soft border border-slate-100">
           <button className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-brand-600"><ChevronLeft size={20}/></button>
           <span className="text-xs font-bold text-gray-900 px-4 uppercase tracking-[0.2em]">WEEK 4 • OCT 16</span>
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

         <div className="grid grid-cols-1 md:grid-cols-6 divide-x divide-slate-100 min-h-[500px]">
            {days.map(day => (
               <div key={day} className="p-4 space-y-4 bg-white hover:bg-slate-50/30 transition-all">
                  {schedule.filter(s => s.day === day).map((item, i) => (
                     <div key={i} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-premium hover:border-brand-200 transition-all cursor-pointer group">
                        <div className="w-10 h-10 bg-brand-50 text-brand-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-white transition-all">
                           <BookOpen size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight mb-3">{item.subject}</h4>
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              <User size={12} className="text-brand-400" /> {item.tutor.split(' ').pop()}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              <Clock size={12} className="text-brand-400" /> {item.time.split(' - ')[0]}
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              <MapPin size={12} className="text-brand-400" /> {item.room}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ))}
         </div>
      </div>

      <div className="bg-surface p-8 rounded-[40px] border border-surface-200 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-500 text-white rounded-2xl flex items-center justify-center shadow-premium">
               <CalendarIcon size={28} />
            </div>
            <div>
               <h3 className="text-lg font-bold text-gray-900 leading-none">Download PDF Timetable</h3>
               <p className="text-xs font-medium text-slate-400 mt-2 lowercase">Offline version for your mobile or desktop wallpaper</p>
            </div>
         </div>
         <button className="h-12 px-8 bg-brand-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-600 transition-all shadow-premium">Download Routine</button>
      </div>
    </div>
  );
};

export default StudentTimetable;
