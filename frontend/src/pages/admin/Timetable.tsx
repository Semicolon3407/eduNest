import React from 'react';
import Button from '../../components/ui/Button';
import { Calendar, Clock, Filter, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Timetable: React.FC = () => {
  const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Academic Timetable</h1>
          <p className="text-gray-500 mt-1 font-medium">Coordinate class schedules and prevent faculty overlaps</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-full"><Filter size={18} /> Select Grade/Year</Button>
           <Button className="rounded-full shadow-premium"><Plus size={18} /> Schedule slot</Button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200 overflow-hidden">
         <div className="bg-brand-500 p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <h2 className="text-xl font-medium  ">Grade 10 - Section A</h2>
               </div>
               <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10">
                  <Calendar size={14} className="text-brand-300" />
                  <span className="text-[10px] font-medium  ">Oct 16 - Oct 20, 2023</span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2 hover:bg-white/10 rounded-xl transition-colors"><ChevronLeft size={20}/></button>
               <button className="p-2 hover:bg-white/10 rounded-xl transition-colors"><ChevronRight size={20}/></button>
            </div>
         </div>

         <div className="overflow-x-auto">
             <div className="overflow-x-auto"><table className="w-full text-center border-collapse">
               <thead>
                  <tr>
                     <th className="p-6 bg-slate-50 border-b border-r border-slate-100"></th>
                     {days.map(day => (
                        <th key={day} className="p-6 bg-slate-50 border-b border-r border-slate-100 text-[10px] font-medium text-slate-400   leading-none">
                           {day}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {timeSlots.map(time => (
                     <tr key={time}>
                        <td className="p-6 border-b border-r border-slate-100 bg-slate-50/50">
                           <div className="flex items-center justify-center gap-2 text-slate-500">
                              <Clock size={14} />
                              <span className="text-[10px] font-medium  ">{time}</span>
                           </div>
                        </td>
                        {days.map(day => (
                           <td key={day} className="p-4 border-b border-r border-slate-100 group relative">
                              {/* Simple logic for demo */}
                              {(time === '09:00 AM' && (day === 'Monday' || day === 'Wednesday')) ? (
                                 <div className="p-3 bg-brand-50 border border-brand-100 rounded-2xl text-left hover:bg-brand-500 hover:text-white transition-all cursor-pointer">
                                    <p className="text-[9px] font-medium   mb-1 opacity-60">Physics</p>
                                    <h5 className="font-medium text-[11px]   leading-none">Prof. Hawking</h5>
                                 </div>
                              ) : (time === '11:00 AM' && day === 'Friday') ? (
                                 <div className="p-3 bg-success-light border border-success-DEFAULT/20 rounded-2xl text-left hover:bg-success-dark hover:text-white transition-all cursor-pointer">
                                    <p className="text-[9px] font-medium   mb-1 opacity-60">Chemistry</p>
                                    <h5 className="font-medium text-[11px]   leading-none">Dr. Curie</h5>
                                 </div>
                              ) : (
                                 <div className="w-full h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-brand-500 hover:text-white transition-all">
                                       <Plus size={16}/>
                                    </button>
                                 </div>
                              )}
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table></div>
         </div>
      </div>
    </div>
  );
};

export default Timetable;
