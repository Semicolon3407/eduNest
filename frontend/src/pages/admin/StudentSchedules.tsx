import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { 
  Plus, BookOpen, Users, Layout, 
  Filter, Trash2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { hrService } from '../../services/hrService';
import toast from 'react-hot-toast';

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
  const [classes, setClasses] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [formData, setFormData] = useState({
    subject: '',
    staffId: '',
    room: '',
    lessonType: 'lecture'
  });

  React.useEffect(() => {
    fetchInitialData();
  }, []);

  React.useEffect(() => {
    if (selectedClassId) {
      fetchSchedules();
    }
  }, [selectedClassId]);

  const fetchInitialData = async () => {
    try {
      const [classesRes, staffRes] = await Promise.all([
        adminService.getClasses(),
        hrService.getStaff()
      ]);
      if (classesRes.success) {
        setClasses(classesRes.data);
        if (classesRes.data.length > 0) setSelectedClassId(classesRes.data[0]._id);
      }
      if (staffRes.success) {
        setStaff(staffRes.data.filter((s: any) => s.user?.role === 'TUTOR'));
      }
    } catch (error) {
      toast.error('Failed to load classes or staff');
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await adminService.getSchedules({ type: 'Student', classId: selectedClassId });
      if (response.success) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        type: 'Student',
        class: selectedClassId,
        day: selectedSlot.day,
        startTime: selectedSlot.time,
        endTime: selectedSlot.endTime || selectedSlot.time, // Default logic
        subject: formData.subject,
        staff: formData.staffId,
        room: formData.room,
        organization: '' // Handled by backend
      };
      const response = await adminService.createSchedule(data);
      if (response.success) {
        toast.success('Slot assigned successfully');
        setIsModalOpen(false);
        fetchSchedules();
        setFormData({ subject: '', staffId: '', room: '', lessonType: 'lecture' });
      }
    } catch (error) {
      toast.error('Failed to save slot');
    }
  };

  const handleDeleteSlot = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Remove this slot?')) return;
    try {
      const response = await adminService.deleteSchedule(id);
      if (response.success) {
        toast.success('Slot removed');
        fetchSchedules();
      }
    } catch (error) {
      toast.error('Failed to delete slot');
    }
  };

  const getSlotContent = (day: string, time: string) => {
    return schedules.find(s => s.day === day && s.startTime === time);
  };

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
              value={selectedClassId} 
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent text-xs font-bold uppercase tracking-widest px-4 outline-none appearance-none cursor-pointer"
            >
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.name} - SEC {cls.section}</option>
              ))}
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
                      <div className="w-full h-24 rounded-[28px] border-2 border-dashed border-slate-100 flex items-center justify-center group-hover/cell:border-brand-300 group-hover/cell:bg-brand-50/20 transition-all relative">
                        {getSlotContent(day, slot.time) ? (
                          <div className="w-full h-full p-4 bg-brand-50 border border-brand-100 rounded-[24px] text-left relative group/slot">
                            <button 
                              onClick={(e) => handleDeleteSlot(getSlotContent(day, slot.time)._id, e)}
                              className="absolute top-2 right-2 p-1.5 text-danger opacity-0 group-hover/slot:opacity-100 transition-opacity hover:bg-white rounded-lg shadow-sm"
                            >
                              <Trash2 size={12} />
                            </button>
                            <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest leading-none mb-1">{getSlotContent(day, slot.time).subject}</p>
                            <p className="text-[9px] font-medium text-slate-500 truncate">{getSlotContent(day, slot.time).staff?.firstName} {getSlotContent(day, slot.time).staff?.lastName}</p>
                            <div className="absolute bottom-3 left-4 flex items-center gap-1">
                               <div className="w-1 h-1 rounded-full bg-brand-400"></div>
                               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">RM {getSlotContent(day, slot.time).room}</span>
                            </div>
                          </div>
                        ) : (
                          <Plus size={24} className="text-slate-200 group-hover/cell:text-brand-500 transition-all" />
                        )}
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
        description={`Assigning a subject to ${classes.find(c => c._id === selectedClassId)?.name || 'Class'} on ${selectedSlot?.day} at ${selectedSlot?.time}`}
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={handleSaveSlot}>
          <Input 
            label="Subject Name" 
            placeholder="e.g. Advanced Physics" 
            icon={BookOpen} 
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required 
          />
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Assign Faculty</label>
            <div className="relative">
              <select 
                value={formData.staffId}
                onChange={(e) => setFormData({...formData, staffId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-10 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer" 
                required
              >
                <option value="">Select Faculty Member</option>
                {staff.map(s => (
                  <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.designation})</option>
                ))}
              </select>
              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Classroom / Lab</label>
              <div className="relative">
                <select 
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-10 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer"
                >
                  <option value="">Select Room</option>
                  <option value="B102">Room B-102</option>
                  <option value="L4">Science Lab 4</option>
                  <option value="Auditorium">Auditorium</option>
                </select>
                <Layout size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Lesson Type</label>
               <select 
                 value={formData.lessonType}
                 onChange={(e) => setFormData({...formData, lessonType: e.target.value})}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer"
                >
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
