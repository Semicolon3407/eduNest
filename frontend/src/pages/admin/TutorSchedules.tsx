import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
  Users, Mail, Search, Filter, AlertCircle, Plus, BookOpen, GraduationCap 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const tutors = [
  { id: 1, name: 'Prof. Stephen Hawking', dept: 'Physics', email: 'hawking@edunest.com', status: 'Available' },
  { id: 2, name: 'Dr. Marie Curie', dept: 'Chemistry', email: 'curie@edunest.com', status: 'In Class' },
  { id: 3, name: 'Prof. Albert Einstein', dept: 'Mathematics', email: 'einstein@edunest.com', status: 'Available' },
];

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'];

const TutorSchedules: React.FC = () => {
  const [selectedTutor, setSelectedTutor] = useState(tutors[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-display font-medium text-gray-900 leading-none  ">Tutor Schedules</h1>
          <p className="text-gray-500 mt-3 font-medium text-sm">Monitor faculty assignments and resolve scheduling conflicts</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Find tutor..." icon={Search} className="w-64" />
          <Button variant="outline" className="rounded-2xl h-14 px-6 border-slate-200">
             <Filter size={18} /> Dept Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Tutors List */}
        <div className="xl:col-span-1 space-y-4">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">Faculty Directory</h3>
           <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {tutors.map(tutor => (
                <div 
                  key={tutor.id} 
                  onClick={() => setSelectedTutor(tutor)}
                  className={`p-5 rounded-[32px] border transition-all cursor-pointer group ${
                    selectedTutor.id === tutor.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-premium ring-4 ring-slate-900/10' 
                    : 'bg-white border-slate-100 hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                      selectedTutor.id === tutor.id ? 'bg-brand-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600'
                    }`}>
                      {tutor.name.split(' ').pop()?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm leading-tight">{tutor.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={tutor.status === 'Available' ? 'success' : 'warning'} className="text-[8px] px-1.5 py-0">
                          {tutor.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Schedule Grid */}
        <div className="xl:col-span-3 space-y-6">
           <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-[28px] flex items-center justify-center shadow-sm">
                    <Users size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-gray-900 leading-none  ">{selectedTutor.name}</h3>
                    <p className="text-slate-400 text-sm font-medium mt-2">{selectedTutor.dept} Department • {selectedTutor.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" className="h-12 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest"><Mail size={16} /> Contact</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="p-4 border-b border-r border-slate-100 bg-white"></th>
                      {days.map(day => (
                        <th key={day} className="p-4 border-b border-r border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{day.substring(0, 3)}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(time => (
                      <tr key={time}>
                        <td className="p-4 border-b border-r border-slate-100 bg-slate-50/30">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{time}</span>
                        </td>
                        {days.map(day => (
                          <td 
                            key={day} 
                            className="p-2 border-b border-r border-slate-100 relative group cursor-pointer"
                            onClick={() => {
                              setSelectedSlot({ day, time });
                              setIsModalOpen(true);
                            }}
                          >
                             {/* Mock logic for allocated slots */}
                             {(time === '09:00 AM' && day === 'Monday') || (time === '11:00 AM' && day === 'Wednesday') ? (
                               <div className="p-3 bg-brand-50 border border-brand-100 rounded-2xl text-left shadow-sm group-hover:border-brand-300 transition-all">
                                  <p className="text-[9px] font-bold text-brand-600 uppercase tracking-widest mb-1">Grade {time === '09:00 AM' ? '10-A' : '11-B'}</p>
                                  <h5 className="font-bold text-[11px] text-slate-900 leading-none">{time === '09:00 AM' ? 'Physics' : 'Advanced Chem'}</h5>
                               </div>
                             ) : (
                               <div className="w-full h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-brand-500 hover:text-white transition-all shadow-sm">
                                    <Plus size={14} />
                                  </div>
                               </div>
                             )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>

           <div className="bg-warning-light/30 p-8 rounded-[40px] border border-warning/10 flex items-center gap-6 shadow-sm">
              <div className="w-12 h-12 bg-warning text-white rounded-2xl flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="text-lg font-medium text-warning-dark leading-none mb-2 uppercase tracking-tight  ">Overlap Detection</h4>
                <p className="text-warning-dark/70 text-sm font-medium leading-relaxed">System monitoring is active. You will be notified if a tutor is assigned to multiple classes simultaneously.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Faculty Load"
        description={`Assigning academic session to ${selectedTutor.name} on ${selectedSlot?.day} at ${selectedSlot?.time}`}
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-1.5 focus-within:z-10 group">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Target Class / Section</label>
            <div className="relative">
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-10 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer" required>
                <option value="">Select Grade & Section</option>
                <option value="10A">Grade 10 - Section A</option>
                <option value="10B">Grade 10 - Section B</option>
                <option value="11Sci">Grade 11 - Science</option>
              </select>
              <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <Input label="Subject Name" placeholder="e.g. Theoretical Physics" icon={BookOpen} required />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 px-1">Room Assignment</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer">
                <option value="B102">Room B-102</option>
                <option value="L4">Lab 4</option>
                <option value="HallA">Hall A</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 px-1">Intensity</label>
              <div className="flex gap-2">
                 <Badge variant="brand" className="h-12 grow justify-center cursor-pointer border-2 border-brand-500">Regular</Badge>
                 <Badge variant="neutral" className="h-12 grow justify-center cursor-pointer border border-slate-200">Extra</Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white">Assign Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TutorSchedules;
