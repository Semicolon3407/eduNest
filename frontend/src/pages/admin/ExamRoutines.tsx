import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Calendar, BookOpen, Clock, MapPin, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { tenantService } from '../../services/tenantService';
import toast from 'react-hot-toast';

const ExamRoutines: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routines, setRoutines] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');

  const [formData, setFormData] = useState({
    subject: '',
    date: '',
    time: '',
    room: '',
    classId: '',
    branchId: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [routinesRes, classesRes, branchesRes] = await Promise.all([
        adminService.getExamRoutines(selectedClass, selectedBranch),
        adminService.getClasses(),
        tenantService.getBranches()
      ]);
      setRoutines(routinesRes.data || []);
      setClasses(classesRes.data || []);
      setBranches(branchesRes.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load exam routines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClass, selectedBranch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Adding exam routine...');
    try {
      const response = await adminService.createExamRoutine(formData);
      if (response.success) {
        toast.success('Exam routine added successfully', { id: loadingToast });
        setIsModalOpen(false);
        setFormData({
          subject: '',
          date: '',
          time: '',
          room: '',
          classId: '',
          branchId: ''
        });
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add exam routine', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this routine?')) return;
    const loadingToast = toast.loading('Deleting...');
    try {
      const response = await adminService.deleteExamRoutine(id);
      if (response.success) {
        toast.success('Routine deleted', { id: loadingToast });
        fetchData();
      }
    } catch (error: any) {
      toast.error('Failed to delete routine', { id: loadingToast });
    }
  };

  if (loading && routines.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900">Exam Routines</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage and schedule academic examinations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl h-12 shadow-premium bg-brand-500 text-white hover:bg-brand-600 px-6">
          <Plus size={18} className="mr-2" /> Add Routine
        </Button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-[32px] border border-slate-200 shadow-soft">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative min-w-[200px]">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full h-12 pl-4 pr-10 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-600 appearance-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">All Branches</option>
              {branches.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-12 pl-4 pr-10 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-600 appearance-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-6 py-4 rounded-tl-2xl">Subject & Class</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {routines.map(item => (
                <tr key={item._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shrink-0">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.subject}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.class?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <Calendar size={14} className="mr-2 text-slate-400" />
                        {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <Clock size={12} className="mr-2" />
                        {item.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center text-sm font-medium text-slate-600">
                      <MapPin size={16} className="mr-2 text-slate-400" />
                      Room {item.room}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 ml-6 uppercase tracking-widest">{item.branch?.name || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-slate-400 hover:text-error hover:bg-error-light rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {routines.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle size={24} className="text-slate-300" />
                      <p>No exam routines scheduled yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Exam Routine"
        description="Schedule a new examination for a specific class"
      >
        <form onSubmit={handleCreateRoutine} className="space-y-6">
          <Input 
            label="Subject Name" 
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required 
            placeholder="e.g. Mathematics Final"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Branch</label>
              <select 
                name="branchId"
                value={formData.branchId}
                onChange={handleInputChange}
                required
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
              >
                <option value="">Select Branch</option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Class</label>
              <select 
                name="classId"
                value={formData.classId}
                onChange={handleInputChange}
                required
                className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
              >
                <option value="">Select Class</option>
                {classes.filter(c => !formData.branchId || c.branch === formData.branchId || c.branch?._id === formData.branchId).map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="date"
              label="Date" 
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required 
            />
            <Input 
              type="time"
              label="Time" 
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required 
            />
          </div>

          <Input 
            label="Room / Location" 
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            required 
            placeholder="e.g. Hall A"
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl shadow-premium bg-brand-500 text-white hover:bg-brand-600">
              {isSubmitting ? 'Saving...' : 'Save Routine'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamRoutines;
