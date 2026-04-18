import React from 'react';
import { Clock, MapPin, User, ChevronLeft, ChevronRight, Calendar as CalendarIcon, BookOpen, Coffee, GraduationCap } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const timeSlots = [
  { id: 1, time: '08:00 AM', duration: '55 min' },
  { id: 2, time: '09:00 AM', duration: '55 min' },
  { id: 3, time: '10:00 AM', duration: '55 min' },
  { id: 4, time: '11:00 AM', duration: '55 min' },
  { id: 5, time: '12:00 PM', duration: '55 min' },
  { id: 6, time: '01:00 PM', duration: '55 min' },
];

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Mock data for 6 subjects per day
const routine: Record<string, any[]> = {
  'Sunday': [
    { subject: 'Mathematics', tutor: 'Dr. Smith', room: 'B-102', type: 'Lecture' },
    { subject: 'Physics', tutor: 'Prof. Hawking', room: 'Lab 4', type: 'Lab' },
    { subject: 'English', tutor: 'Ms. Emily', room: 'A-201', type: 'Lecture' },
    { subject: 'Biology', tutor: 'Dr. Ray', room: 'Bio Lab', type: 'Lecture' },
    { subject: 'Chemistry', tutor: 'Dr. Curie', room: 'Lab 2', type: 'Lecture' },
    { subject: 'History', tutor: 'Dr. Jones', room: 'Hall B', type: 'Seminar' },
  ],
  'Monday': [
    { subject: 'Physics', tutor: 'Prof. Hawking', room: 'Lab 4', type: 'Lecture' },
    { subject: 'Mathematics', tutor: 'Dr. Smith', room: 'B-102', type: 'Lecture' },
    { subject: 'Computer Sci', tutor: 'Prof. Chen', room: 'IT Lab 1', type: 'Lab' },
    { subject: 'History', tutor: 'Dr. Jones', room: 'Hall B', type: 'Lecture' },
    { subject: 'English', tutor: 'Ms. Emily', room: 'A-201', type: 'Lecture' },
    { subject: 'Geography', tutor: 'Dr. Atlas', room: 'C-303', type: 'Lecture' },
  ],
  // ... adding more for demo
};

const StudentTimetable: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-display font-medium text-gray-900 leading-none">Class Routine</h1>
          <p className="text-gray-500 mt-3 font-medium text-sm flex items-center gap-2">
            <GraduationCap size={16} className="text-brand-500" /> Grade 10 - Section A • Academic Session 2023-24
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-soft border border-slate-200">
           <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-brand-600"><ChevronLeft size={20}/></button>
           <div className="px-6 text-center border-x border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Active Week</span>
              <span className="block text-xs font-bold text-gray-900 uppercase">Oct 16 - Oct 21</span>
           </div>
           <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-brand-600"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="p-8 border-b border-r border-slate-100 bg-white">
                  <div className="flex items-center gap-2 justify-center text-brand-600">
                    <Clock size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Timeline</span>
                  </div>
                </th>
                {days.map(day => (
                  <th key={day} className="p-8 border-b border-r border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1 block">{day.substring(0, 3)}</span>
                    <span className="text-sm font-bold text-gray-900 uppercase">{day}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, rowIndex) => (
                <tr key={slot.id} className="group">
                  <td className="p-8 border-b border-r border-slate-100 bg-slate-50/30 group-hover:bg-brand-50/10 transition-colors">
                    <p className="text-sm font-bold text-gray-900 mb-1">{slot.time}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{slot.duration}</p>
                  </td>
                  {days.map(day => {
                    const subject = (routine[day] || routine['Sunday'])[rowIndex];
                    return (
                      <td key={day} className="p-4 border-b border-r border-slate-100 group/cell relative">
                        {subject ? (
                          <div className={`p-5 rounded-[28px] text-left transition-all cursor-pointer h-full border ${
                            subject.type === 'Lab' 
                              ? 'bg-success-light/30 border-success-light hover:bg-success-dark hover:text-white group-hover/cell:-translate-y-1' 
                              : subject.type === 'Seminar'
                              ? 'bg-warning-light/30 border-warning-light hover:bg-warning-dark hover:text-white group-hover/cell:-translate-y-1'
                              : 'bg-white border-slate-100 shadow-sm hover:border-brand-500 group-hover/cell:shadow-premium group-hover/cell:-translate-y-1'
                          }`}>
                            <div className="flex justify-between items-start mb-4">
                               <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                 subject.type === 'Lab' ? 'bg-success-dark/10 text-success-dark group-hover/cell:bg-white' :
                                 subject.type === 'Seminar' ? 'bg-warning-dark/10 text-warning-dark group-hover/cell:bg-white' :
                                 'bg-brand-50 text-brand-500 group-hover/cell:bg-brand-500 group-hover/cell:text-white'
                               }`}>
                                 <BookOpen size={16} />
                               </div>
                               <Badge variant={subject.type === 'Lab' ? 'success' : subject.type === 'Seminar' ? 'warning' : 'neutral'} className="text-[8px] px-2">
                                 {subject.type}
                               </Badge>
                            </div>
                            
                            <h4 className="text-sm font-bold text-gray-900 leading-tight mb-4 group-hover/cell:text-inherit uppercase tracking-tight">{subject.subject}</h4>
                            
                            <div className="space-y-1.5 pt-4 border-t border-slate-900/5 group-hover/cell:border-white/20">
                               <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover/cell:text-inherit">
                                  <User size={12} className="opacity-70" /> {subject.tutor}
                               </div>
                               <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover/cell:text-inherit">
                                  <MapPin size={12} className="opacity-70" /> Room {subject.room}
                               </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity min-h-[140px]">
                             <button className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full hover:bg-brand-500 hover:text-white transition-all shadow-sm">
                               <Coffee size={18} />
                             </button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-premium relative overflow-hidden group border border-white/5">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full -mr-32 -mt-32 opacity-10 blur-3xl transition-all duration-1000 group-hover:scale-150"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-sm">
                <CalendarIcon size={32} className="text-brand-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h3 className="text-2xl font-medium tracking-tight mb-2 uppercase">Official Routine PDF</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">Download the certified institutional weekly routine for your academic year.</p>
              </div>
              <button className="h-14 px-8 bg-white text-slate-900 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-xl active:scale-95 shrink-0">
                Download Now
              </button>
           </div>
        </div>

        <div className="bg-brand-50 p-8 rounded-[40px] border border-brand-100 flex flex-col md:flex-row items-center gap-8 shadow-soft">
           <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm text-brand-500 border border-brand-100">
             <Coffee size={32} />
           </div>
           <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-medium text-brand-900 tracking-tight leading-none mb-3 uppercase">Break Interval</h3>
              <p className="text-brand-700 text-sm font-medium leading-relaxed italic">"Daily break from 1:55 PM to 2:30 PM. Use this time for lunch and recreation."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;
