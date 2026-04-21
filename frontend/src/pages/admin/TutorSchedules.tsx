import React from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
  Users, Mail, Search, Filter, AlertCircle, Plus, BookOpen, GraduationCap 
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { adminService } from '../../services/adminService';
import { hrService } from '../../services/hrService';
import toast from 'react-hot-toast';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'];

const TutorSchedules: React.FC = () => {
  const [tutors, setTutors] = React.useState<any[]>([]);
  const [selectedTutor, setSelectedTutor] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<any>(null);
  const [schedules, setSchedules] = React.useState<any[]>([]);
  const [classes, setClasses] = React.useState<any[]>([]);
  const [formData, setFormData] = React.useState({
    classId: '',
    subject: '',
    room: 'B102'
  });

  React.useEffect(() => {
    fetchInitialData();
  }, []);

  React.useEffect(() => {
    if (selectedTutor) {
      fetchSchedules();
    }
  }, [selectedTutor]);

  const fetchInitialData = async () => {
    try {
      const [staffRes, classesRes] = await Promise.all([
        hrService.getStaff(),
        adminService.getClasses()
      ]);
      if (staffRes.success) {
        const availableTutors = staffRes.data.filter((s: any) => s.user?.role === 'TUTOR' || s.designation?.toUpperCase().includes('TUTOR'));
        setTutors(availableTutors);
        if (availableTutors.length > 0) setSelectedTutor(availableTutors[0]);
      }
      if (classesRes.success) {
        setClasses(classesRes.data);
      }
    } catch (error) {
      toast.error('Failed to load faculty directory');
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await adminService.getSchedules({ type: 'Tutor', staffId: selectedTutor._id });
      if (response.success) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const handleAssignLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        type: 'Tutor',
        staff: selectedTutor._id,
        class: formData.classId,
        day: selectedSlot.day,
        startTime: selectedSlot.time,
        endTime: selectedSlot.time, 
        subject: formData.subject,
        room: formData.room
      };
      const response = await adminService.createSchedule(data);
      if (response.success) {
        toast.success('Faculty load assigned');
        setIsModalOpen(false);
        fetchSchedules();
        setFormData({ classId: '', subject: '', room: 'B102' });
      }
    } catch (error) {
      toast.error('Conflict detected or assignment failed');
    }
  };

  const getSlotContent = (day: string, time: string) => {
    return schedules.find(s => s.day === day && s.startTime === time);
  };

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
                  key={tutor._id} 
                  onClick={() => setSelectedTutor(tutor)}
                  className={`p-5 rounded-[32px] border transition-all cursor-pointer group ${
                    selectedTutor?._id === tutor._id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-premium ring-4 ring-slate-900/10' 
                    : 'bg-white border-slate-100 hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                      selectedTutor?._id === tutor._id ? 'bg-brand-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600'
                    }`}>
                      {(tutor.firstName || 'T').charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm leading-tight">{tutor.firstName} {tutor.lastName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={tutor.status === 'Active' ? 'success' : 'warning'} className="text-[8px] px-1.5 py-0">
                          {tutor.status === 'Active' ? 'Available' : 'Unavailable'}
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
                    <h3 className="text-2xl font-medium text-gray-900 leading-none  ">{selectedTutor?.firstName} {selectedTutor?.lastName}</h3>
                    <p className="text-slate-400 text-sm font-medium mt-2">{selectedTutor?.designation} • {selectedTutor?.user?.email || selectedTutor?.email}</p>
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
                             {getSlotContent(day, time) ? (
                               <div className="p-3 bg-brand-50 border border-brand-100 rounded-2xl text-left shadow-sm group-hover:border-brand-300 transition-all">
                                  <p className="text-[9px] font-bold text-brand-600 uppercase tracking-widest mb-1">{getSlotContent(day, time).class?.name}</p>
                                  <h5 className="font-bold text-[11px] text-slate-900 leading-none">{getSlotContent(day, time).subject}</h5>
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">RM {getSlotContent(day, time).room}</span>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); adminService.deleteSchedule(getSlotContent(day, time)._id).then(fetchSchedules); }}
                                      className="text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Plus size={10} className="rotate-45" />
                                    </button>
                                  </div>
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
        description={`Assigning academic session to ${selectedTutor?.firstName || 'Tutor'} on ${selectedSlot?.day} at ${selectedSlot?.time}`}
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={handleAssignLoad}>
          <div className="space-y-1.5 focus-within:z-10 group">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Target Class / Section</label>
            <div className="relative">
              <select 
                value={formData.classId}
                onChange={(e) => setFormData({...formData, classId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-10 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer" 
                required
              >
                <option value="">Select Grade & Section</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name} - SEC {cls.section}</option>
                ))}
              </select>
              <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <Input 
            label="Subject Name" 
            placeholder="e.g. Theoretical Physics" 
            icon={BookOpen} 
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 px-1">Room Assignment</label>
              <select 
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer"
              >
                <option value="B102">Room B-102</option>
                <option value="L4">Lab 4</option>
                <option value="HallA">Hall A</option>
                <option value="Auditorium">Auditorium</option>
              </select>
            </div>
            <div className="flex items-end">
               <div className="p-4 bg-brand-50 border border-brand-100 rounded-2xl w-full">
                  <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest leading-none mb-1">Status</p>
                  <p className="text-xs font-medium text-slate-900">Conflict-free check active</p>
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
