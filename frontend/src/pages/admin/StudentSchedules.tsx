import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { 
  Plus, BookOpen, Users, Layout, 
  Filter
} from 'lucide-react';

const timeSlots = [
  { time: '08:00 AM', id: 1 },
  { time: '09:00 AM', id: 2 },
  { time: '10:00 AM', id: 3 },
  { time: '11:00 AM', id: 4 },
  { time: '12:00 PM', id: 5 },
  { time: '01:00 PM', id: 6 },
];

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const StudentSchedules: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-display font-medium text-gray-900 leading-none  ">Student Schedules</h1>
          <p className="text-gray-500 mt-3 font-medium text-sm">Design and manage weekly class schedules for all grades</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-soft border border-slate-200">
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-xs font-bold uppercase tracking-widest px-4 outline-none appearance-none cursor-pointer"
            >
              <option>Grade 10-A</option>
              <option>Grade 10-B</option>
              <option>Grade 11-Science</option>
              <option>Grade 12-Commerce</option>
            </select>
            <Filter size={16} className="text-slate-400 mr-2" />
          </div>
          <Button className="rounded-2xl shadow-premium h-14 px-8" onClick={() => setIsModalOpen(true)}>
             <Plus size={18} /> Add Slot
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="p-8 border-b border-r border-slate-100 bg-white min-w-[140px]">
                   <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Time Slot</span>
                </th>
                {days.map(day => (
                  <th key={day} className="p-8 border-b border-r border-slate-100 min-w-[160px]">
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">{day}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(slot => (
                <tr key={slot.id} className="group">
                  <td className="p-8 border-b border-r border-slate-100 bg-slate-50/30 group-hover:bg-brand-50/10 transition-colors">
                    <p className="text-sm font-bold text-gray-900">{slot.time}</p>
                  </td>
                  {days.map(day => (
                    <td 
                      key={day} 
                      className="p-4 border-b border-r border-slate-100 group/cell relative cursor-pointer"
                      onClick={() => {
                        setSelectedSlot({ day, time: slot.time });
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="w-full h-24 rounded-[28px] border-2 border-dashed border-slate-100 flex items-center justify-center group-hover/cell:border-brand-300 group-hover/cell:bg-brand-50/20 transition-all">
                        <Plus size={24} className="text-slate-200 group-hover/cell:text-brand-500 transition-all" />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduler Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Class Routine"
        description={`Assigning a subject to ${selectedClass} on ${selectedSlot?.day} at ${selectedSlot?.time}`}
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <Input label="Subject Name" placeholder="e.g. Advanced Physics" icon={BookOpen} required />
          
          <div className="space-y-1.5">
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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Classroom / Lab</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-10 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer">
                  <option value="">Select Room</option>
                  <option value="B102">Room B-102</option>
                  <option value="L4">Science Lab 4</option>
                </select>
                <Layout size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Lesson Type</label>
               <select className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer">
                  <option value="lecture">Lecture</option>
                  <option value="practical">Practical/Lab</option>
                  <option value="seminar">Seminar</option>
               </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white">Save Slot</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentSchedules;
