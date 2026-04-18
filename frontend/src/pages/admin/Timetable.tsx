import React from 'react';
import Button from '../../components/ui/Button';
import { Calendar, Clock, Filter, ChevronLeft, ChevronRight, Plus, BookOpen, Users, Layout } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const Timetable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<any>(null);
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
           <Button className="rounded-full shadow-premium" onClick={() => setIsModalOpen(true)}><Plus size={18} /> Schedule slot</Button>
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
                                    <button 
                                      onClick={() => {
                                        setSelectedSlot({ day, time });
                                        setIsModalOpen(true);
                                      }}
                                      className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-brand-500 hover:text-white transition-all shadow-sm"
                                    >
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Academic Slot"
        description="Assign a subject and faculty member to a specific time slot."
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm text-brand-600">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Slot</p>
              <p className="text-sm font-bold text-slate-700">{selectedSlot ? `${selectedSlot.day} @ ${selectedSlot.time}` : 'New Schedule'}</p>
            </div>
          </div>

          <Input label="Subject Name" placeholder="e.g. Advanced Mathematics" icon={BookOpen} required />
          
          <div className="space-y-1.5 focus-within:z-10 group">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Assign Faculty</label>
            <div className="relative">
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-10 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer">
                <option value="">Select Faculty Member</option>
                <option value="1">Prof. Hawking (Physics)</option>
                <option value="2">Dr. Curie (Chemistry)</option>
                <option value="3">Prof. Einstein (Mathematics)</option>
              </select>
              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 focus-within:z-10 group">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Classroom / Lab</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-10 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer">
                  <option value="">Select Room</option>
                  <option value="B102">Room B-102</option>
                  <option value="L4">Science Lab 4</option>
                  <option value="AUD">Main Auditorium</option>
                </select>
                <Layout size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Type</label>
               <div className="flex gap-2">
                  <Badge variant="brand" className="h-10 grow justify-center cursor-pointer border-2 border-brand-500 shadow-sm">Lecture</Badge>
                  <Badge variant="neutral" className="h-10 grow justify-center cursor-pointer border border-slate-200 hover:border-brand-500 transition-colors">Lab/Practical</Badge>
               </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white">Save Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Timetable;
