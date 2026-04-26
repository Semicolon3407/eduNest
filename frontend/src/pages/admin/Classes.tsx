import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Users, Layout, Plus, MoreHorizontal, GraduationCap, DoorOpen, UserCheck, Shield } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { tenantService } from '../../services/tenantService';
import { hrService } from '../../services/hrService';
import toast from 'react-hot-toast';

const ClassManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    section: '',
    room: '',
    tutor: '',
    capacity: 45,
    branchId: ''
  });

  const fetchData = async () => {
    try {
      const [classesRes, branchesRes, staffRes] = await Promise.all([
        adminService.getClasses(),
        tenantService.getBranches(),
        hrService.getStaff()
      ]);
      setClasses(classesRes.data);
      setBranches(branchesRes.data);
      setStaff(staffRes.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await adminService.createClass({
        ...formData,
        branch: formData.branchId
      });
      if (response.success) {
        toast.success('Section initialized successfully');
        setIsModalOpen(false);
        fetchData();
        setFormData({
          name: '',
          section: '',
          room: '',
          tutor: '',
          capacity: 45,
          branchId: ''
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create section');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Academic Classes</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage student groups, sections, and room assignments</p>
        </div>
        <Button className="rounded-2xl h-12 px-6 shadow-premium bg-brand-500 text-white hover:bg-brand-600 transition-all active:scale-95" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Section
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
          <div key={cls._id} className="bg-white p-4 sm:p-8 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200 group hover:border-brand-500 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-[20px] flex items-center justify-center font-bold text-xl group-hover:bg-brand-500 group-hover:text-white transition-all shadow-sm border border-brand-100">
                {cls.name.split(' ')[1] || cls.name}
              </div>
              <Badge variant="neutral" className="text-[10px] font-bold uppercase tracking-widest">Room {cls.room}</Badge>
            </div>

            <h3 className="text-2xl font-medium text-gray-900 group-hover:text-brand-600 transition-colors mb-2 uppercase tracking-tight">{cls.name} / {cls.section}</h3>
            <p className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <UserCheck size={14} className="text-brand-500" /> Lead: {cls.tutor}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Enrolled</p>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-brand-500" />
                  <span className="font-bold text-gray-900 text-sm">{cls.strength}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                <div className="flex items-center gap-2">
                  <Layout size={16} className="text-slate-400" />
                  <span className="font-bold text-gray-900 text-sm">{cls.capacity}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-8 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest h-11 border-slate-200">
              Class Schedule <MoreHorizontal size={16} />
            </Button>
          </div>
        ))}
      </div>

      {/* Required Form: New Class Section */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Academic Section"
        description="Establish a new student cohort and assign faculty leadership."
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={handleCreateClass}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <Input 
                label="Grade Level" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="e.g. Grade 10" 
                required 
              />
            </div>
            <Input label="Section Name / ID" name="section" value={formData.section} onChange={handleInputChange} placeholder="e.g. Science-A" icon={Layout} required />
            <div className="md:col-span-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Target Branch</label>
                <select 
                  name="branchId" 
                  value={formData.branchId} 
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, branchId: e.target.value, tutor: '' }));
                  }}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Assigned Class Tutor</label>
                <input 
                  list="tutors-list"
                  name="tutor" 
                  value={formData.tutor} 
                  onChange={handleInputChange}
                  placeholder={formData.branchId ? "Type or select tutor..." : "Select Branch First"}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={!formData.branchId}
                  autoComplete="off"
                />
                <datalist id="tutors-list">
                  {staff
                    .filter(s => {
                      const isTutor = (s.user?.role === 'TUTOR') || 
                                      (s.designation?.toLowerCase().includes('tutor')) || 
                                      (s.designation?.toLowerCase().includes('teacher')) ||
                                      (s.designation?.toLowerCase().includes('professor'));
                      const isSameBranch = s.branch === formData.branchId || s.branch?._id === formData.branchId;
                      return isTutor && isSameBranch;
                    })
                    .map(s => (
                      <option key={s._id} value={`${s.firstName} ${s.lastName}`}>
                        {s.firstName} {s.lastName} ({s.designation})
                      </option>
                    ))
                  }
                </datalist>
              </div>
            </div>

            <Input label="Assigned Classroom" name="room" value={formData.room} onChange={handleInputChange} placeholder="e.g. B-102" icon={DoorOpen} required />
            <Input label="Student Capacity" name="capacity" value={formData.capacity} onChange={handleInputChange} placeholder="45" icon={Shield} required type="number" />
          </div>

          <div className="bg-brand-50 p-6 rounded-3xl border border-brand-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-700 leading-tight">Academic Integrity</p>
              <p className="text-xs text-brand-700 mt-1 leading-relaxed">This section will be automatically linked to the current active session's timetable and grading schema.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 transition-all active:scale-95">
              {isSubmitting ? 'Initializing...' : 'Initialize Section'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClassManagement;

