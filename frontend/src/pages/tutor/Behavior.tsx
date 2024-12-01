import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Award, ShieldAlert, Star, Search, Filter, MoreHorizontal, User, FileText, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { getBehaviorLogs, addBehaviorLog, getTutorClasses, getStudentsByClass } from '../../services/tutorService';

const BehavioralTracking: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [selectedClassId]);

  const fetchLogs = async () => {
    try {
      const res = await getBehaviorLogs();
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await getTutorClasses();
      setClasses(res.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await getStudentsByClass(selectedClassId);
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await addBehaviorLog({
        student: formData.get('studentId'),
        engagementMetric: formData.get('category'),
        observation: formData.get('description'),
        severity: formData.get('severity')
      });
      setIsModalOpen(false);
      fetchLogs();
    } catch (error) {
      console.error('Error adding log:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Behavioral Tracking</h1>
          <p className="text-gray-500 mt-1 font-medium">Log commendable actions and disciplinary reports</p>
        </div>
        <Button className="rounded-xl h-12 shadow-premium bg-brand-500 text-white hover:bg-brand-600" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200 group hover:border-brand-500 transition-all">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center font-medium text-xl">
                  <Star size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-gray-900  ">Student of the Month</h3>
                  <p className="text-[10px] font-medium text-slate-400   leading-none">Nominate excellence</p>
               </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-6 font-sans">Highlight students who show exemplary academic or behavioral performance this session.</p>
            <Button variant="outline" className="w-full rounded-2xl font-medium   text-[10px] h-12">Submit Nomination</Button>
         </div>

         <div className="bg-brand-500 p-4 sm:p-8 rounded-[40px] shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
               <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                  <Award size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white  ">Achievement Awards</h3>
                  <p className="text-[10px] font-medium   leading-none text-brand-300">Issue certificates</p>
               </div>
            </div>
            <p className="text-sm font-medium text-brand-100 mb-6 font-sans relative z-10">Reward consistency and progress with official institutional digital certificates.</p>
            <Button className="w-full rounded-2xl font-medium   text-[10px] h-12 bg-white text-brand-500 hover:bg-slate-50 relative z-10 border-none">Browse Award Library</Button>
         </div>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200">
         <div className="flex items-center justify-between mb-8 overflow-hidden">
            <h2 className="text-xl font-medium text-gray-900  ">Recent Logs</h2>
            <div className="flex gap-2">
               <Button size="sm" variant="outline"><Search size={16}/></Button>
               <Button size="sm" variant="outline"><Filter size={16}/></Button>
            </div>
         </div>

         <div className="space-y-4">
            {logs.length > 0 ? logs.map(log => (
               <div key={log._id} className="p-6 bg-slate-50 rounded-[32px] border border-transparent hover:border-slate-200 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-sans">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${log.severity === 'Commendable (Positive)' ? 'bg-success-light text-success-dark' : log.severity === 'Critical Violation' ? 'bg-danger-light text-danger-dark' : 'bg-brand-50 text-brand-600'}`}>
                        {log.severity === 'Commendable (Positive)' ? <Award size={20} /> : log.severity === 'Critical Violation' ? <ShieldAlert size={20} /> : <User size={20} />}
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <h4 className="font-medium text-gray-900   leading-none">{log.student?.firstName} {log.student?.lastName}</h4>
                           <span className="text-[10px] font-medium text-slate-400  ">({new Date(log.createdAt).toLocaleDateString()})</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">{log.observation}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <Badge variant={log.severity === 'Commendable (Positive)' ? 'success' : log.severity === 'Critical Violation' ? 'danger' : 'brand'}>{log.engagementMetric}</Badge>
                     <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><MoreHorizontal size={18}/></button>
                  </div>
               </div>
            )) : (
               <div className="py-20 text-center text-gray-400 italic">No behavioral logs recorded yet.</div>
            )}
         </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Behavioral Incident Report"
        description="Record a commendable action or a disciplinary incident for a student."
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Select Class</label>
                <select 
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans"
                >
                  <option value="">Choose Class</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name}-{c.section}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Select Student</label>
                <select 
                  name="studentId"
                  required
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans disabled:opacity-50"
                  disabled={!selectedClassId}
                >
                  <option value="">{selectedClassId ? 'Choose Student' : 'Select Class First'}</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Report Category</label>
                <select name="category" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                  <option>Academic Achievement</option>
                  <option>Excellence in Leadership</option>
                  <option>Disciplinary Issue</option>
                  <option>Attendance Concern</option>
                  <option>Other / General Note</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Severity / Impact</label>
                <select name="severity" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                  <option>Commendable (Positive)</option>
                  <option>Minor Incident</option>
                  <option>Moderate Concern</option>
                  <option>Critical Violation</option>
                </select>
            </div>
            <div className="md:col-span-2">
              <Input name="description" label="Detailed Description" placeholder="Describe the incident or action..." icon={FileText} required />
            </div>
          </div>

          <div className="bg-brand-50 p-6 rounded-3xl border border-brand-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
               <AlertCircle size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-brand-600 leading-tight">Administrative Review</p>
               <p className="text-xs text-brand-600/70 mt-1 leading-relaxed">Critical reports will be immediately escalated to the departmental head for review.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Discard</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600">Submit Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BehavioralTracking;
