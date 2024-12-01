import React, { useState, useEffect } from 'react';
import Badge from '../../components/ui/Badge';
import { Clock, MapPin, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, GraduationCap, Info } from 'lucide-react';
import { getSchedule } from '../../services/tutorService';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TutorTimetable: React.FC = () => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await getSchedule();
        setSchedule(res.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-4xl font-display font-medium text-gray-900 tracking-tight">Academic Routine</h1>
          <p className="text-slate-500 mt-1.5 font-medium text-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></div>
            Weekly lecture distribution and institutional venue allocations
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-[20px] shadow-sm border border-slate-200">
           <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-brand-600"><ChevronLeft size={18}/></button>
           <div className="flex flex-col items-center px-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Schedule</span>
              <span className="text-xs font-bold text-gray-900 uppercase">Current Term</span>
           </div>
           <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-brand-600"><ChevronRight size={18}/></button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-soft overflow-visible">
         <div className="grid grid-cols-6 border-b border-slate-100 bg-slate-50/50">
            {days.map(day => (
               <div key={day} className="px-6 py-6 text-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">{day.substring(0, 3)}</span>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-6 divide-x divide-slate-100 min-h-[650px] relative">
            {days.map(day => (
               <div key={day} className="p-4 space-y-5 min-h-[150px] bg-white group transition-all relative">
                  {schedule.filter(s => s.day === day).length > 0 ? (
                    schedule
                      .filter(s => s.day === day)
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((item, i) => (
                        <div key={i} className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all cursor-pointer group/card animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-5">
                               <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center group-hover/card:bg-brand-500 group-hover/card:text-white transition-all shadow-sm border border-brand-100/50">
                                  <GraduationCap size={20} />
                               </div>
                               <Badge variant="brand" className="px-3.5 py-1.5 font-bold uppercase tracking-widest text-[9px] border-brand-100 bg-brand-50/50 text-brand-700">
                                  {item.class?.name || '---'} {item.class?.section}
                               </Badge>
                            </div>
                            <h4 className="text-base font-bold text-gray-900 group-hover/card:text-brand-600 transition-colors leading-tight mb-5">{item.subject}</h4>
                            
                            <div className="grid grid-cols-1 gap-3">
                               <div className="flex items-center gap-2.5">
                                  <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-brand-500 shadow-sm border border-slate-100">
                                     <Clock size={12} />
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Session</p>
                                     <p className="text-[11px] font-bold text-gray-800">{item.startTime} - {item.endTime || 'End'}</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-2.5">
                                  <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-brand-500 shadow-sm border border-slate-100">
                                     <MapPin size={12} />
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Venue</p>
                                     <p className="text-[11px] font-bold text-gray-800">Room {item.room}</p>
                                  </div>
                               </div>
                            </div>
                        </div>
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-20 pb-10 opacity-20 group-hover:opacity-40 transition-all">
                       <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-3">
                          <Info size={18} className="text-slate-400" />
                       </div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Off Duty</span>
                    </div>
                  )}
               </div>
            ))}
         </div>
      </div>

      <div className="bg-brand-700 rounded-[40px] p-8 sm:p-12 text-white relative overflow-hidden shadow-premium border border-white/10 mx-4 sm:mx-0">
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-start sm:items-center gap-6 sm:gap-8">
               <div className="w-16 sm:w-20 h-16 sm:h-20 bg-white/10 backdrop-blur-xl rounded-[24px] flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                  <CalendarIcon size={32} className="text-brand-300" />
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <Badge variant="neutral" className="bg-white/20 border-white/20 text-white text-[10px] px-3 py-1 font-bold">New Notification</Badge>
                     <p className="text-white/60 text-xs font-medium">Updated 2h ago</p>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-medium tracking-tight">Substitute Assignments</h2>
                  <p className="text-brand-200 mt-2 font-medium text-sm sm:text-base max-w-xl leading-relaxed">System identified a scheduling conflict for Grade 10-C Physics. You have been drafted as an emergency substitute for the Thursday morning session.</p>
               </div>
            </div>
            <button className="h-16 px-10 bg-white text-brand-700 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-50 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-premium whitespace-nowrap active:scale-95">Action Details</button>
         </div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-500/20 to-transparent rounded-full blur-[100px] -mr-48 -mt-48"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-brand-400/10 to-transparent rounded-full blur-[80px] -ml-32 -mb-32"></div>
      </div>
    </div>
  );
};

export default TutorTimetable;
