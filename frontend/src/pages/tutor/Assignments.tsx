import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { 
  Plus, FileText, Users, Calendar, 
  MoreVertical, Download, CheckCircle2, Clock, 
  ArrowRight, BookOpen, AlertCircle, Loader2
} from 'lucide-react';
import { tutorService } from '../../services/tutorService';

const TutorAssignments: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    dueDate: '',
    instructions: '',
    subject: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignRes, subRes, classRes] = await Promise.all([
        tutorService.getAssignments(),
        tutorService.getSubmissions(),
        tutorService.getTutorClasses()
      ]);
      setActiveAssignments(assignRes.data);
      setSubmissions(subRes.data);
      setClasses(classRes.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tutorService.createAssignment({
        title: formData.title,
        class: formData.classId,
        dueDate: formData.dueDate,
        instructions: formData.instructions,
        subject: formData.subject
      });
      setIsCreateModalOpen(false);
      fetchData();
      setFormData({ title: '', classId: '', dueDate: '', instructions: '', subject: '' });
    } catch (error) {
      console.error('Error creating assignment:', error);
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Course Assignments</h1>
          <p className="text-gray-500 mt-1 font-medium">Create tasks and manage student submissions</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-xl h-12 shadow-sm font-bold text-[10px] uppercase tracking-widest">
              <BookOpen size={18} /> Grading Criteria
           </Button>
           <Button shadow-premium className="rounded-xl h-12 px-8" onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={18} /> Create Assignment
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Assignments List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <h3 className="text-lg font-bold text-slate-800 tracking-tight">Current Assignments</h3>
                 <Badge variant="brand" className="px-4 py-1.5 font-bold uppercase tracking-wider text-[10px]">
                    {activeAssignments.length} Active Tasks
                 </Badge>
              </div>

              <div className="divide-y divide-slate-100">
                 {activeAssignments.map((task) => (
                    <div key={task._id} className="p-6 hover:bg-slate-50/50 transition-all group">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center border border-brand-100/50">
                                <FileText size={20} />
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{task.title}</h4>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                   {task.subject} • Class {task.class?.name}-{task.class?.section}
                                </h4>
                             </div>
                          </div>
                          <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg">
                             <MoreVertical size={18} />
                          </button>
                       </div>

                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                             <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                                <Calendar size={14} className="text-brand-500" /> {new Date(task.dueDate).toLocaleDateString()}
                             </div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                             <Badge variant={task.status === 'Completed' ? 'success' : 'warning'} className="h-5 px-3">
                                {task.status}
                             </Badge>
                          </div>
                          <div className="sm:col-span-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                             <div className="flex justify-between items-end mb-2">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Submissions</p>
                                <p className="text-xs font-bold text-brand-600">{task.submissionsCount || 0}/{task.class?.strength || 0} Students</p>
                             </div>
                             <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${((task.submissionsCount || 0)/(task.class?.strength || 1))*100}%` }}></div>
                             </div>
                          </div>
                       </div>

                       <div className="mt-6 pt-4 border-t border-dashed border-slate-100 flex justify-end">
                          <button 
                            className="flex items-center gap-2 text-xs font-bold text-brand-500 hover:text-brand-600 uppercase tracking-widest group/btn"
                          >
                             Review Submissions <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Recent Submissions Sidebar */}
        <div className="space-y-6">
           <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3 tracking-tight">
                 <Clock size={20} className="text-brand-500" /> Recent Submissions
              </h3>
              <div className="space-y-6">
                 {submissions.length > 0 ? submissions.map((sub) => (
                    <div key={sub._id} className="relative pl-6 border-l-2 border-slate-100">
                       <div className="absolute w-3 h-3 bg-brand-500 rounded-full -left-[7.5px] top-1 ring-4 ring-white shadow-sm"></div>
                       <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{new Date(sub.submittedAt).toLocaleTimeString()}</p>
                       <h5 className="text-sm font-bold text-slate-800 mt-1">{sub.student?.firstName} {sub.student?.lastName}</h5>
                       <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-tight truncate max-w-full">
                          {sub.fileName}
                       </p>
                       <button className="flex items-center gap-2 text-[10px] font-black text-brand-500 uppercase tracking-widest mt-3 hover:text-brand-600">
                          <Download size={12} /> Download Submission ({sub.fileSize})
                       </button>
                    </div>
                 )) : (
                    <p className="text-center text-gray-400 text-xs py-4">No submissions yet.</p>
                 )}
              </div>
              <Button variant="outline" className="w-full mt-10 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                 View All History
              </Button>
           </div>

           <div className="bg-slate-900 rounded-[40px] shadow-premium p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full -mr-16 -mt-16 opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <CheckCircle2 size={40} className="text-brand-400 mb-4" />
              <h4 className="text-xl font-display font-bold">Plagiarism Check</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">System automatically runs scanning on all PDF and ZIP submissions to ensure integrity.</p>
              <div className="mt-8 pt-6 border-t border-white/10">
                 <Badge variant="brand" className="bg-white/10 text-white border-0">A.I. Scanning Enabled</Badge>
              </div>
           </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Assignment"
        description="Fill in the details to publish a new task for your students."
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
           <Input 
             label="Assignment Title" 
             placeholder="e.g. Calculus Problem Set 5" 
             icon={FileText} 
             required 
             value={formData.title}
             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
           />
           
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Target Class</label>
                 <div className="relative group">
                    <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" />
                    <select 
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-12 font-bold text-sm appearance-none outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                      required
                      value={formData.classId}
                      onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    >
                       <option value="">Select Class</option>
                       {classes.map(cls => (
                         <option key={cls._id} value={cls._id}>{cls.name}-{cls.section}</option>
                       ))}
                    </select>
                 </div>
              </div>
              <Input 
                label="Due Date" 
                type="date" 
                icon={Calendar} 
                required 
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
           </div>

           <Input 
             label="Subject" 
             placeholder="e.g. Mathematics" 
             icon={FileText} 
             required 
             value={formData.subject}
             onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
           />

           <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Task Instructions</label>
              <textarea 
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none"
                placeholder="Give detailed steps for completion (max 500 characters)..."
                required
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              ></textarea>
           </div>

           <div className="p-4 bg-brand-50/50 rounded-2xl border border-dashed border-brand-200 flex items-center gap-4">
              <AlertCircle size={20} className="text-brand-500" />
              <p className="text-[10px] font-bold text-brand-700 uppercase tracking-wide">
                 Accepted Formats: PDF, ZIP (Max 50MB)
              </p>
           </div>

           <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
              <Button type="submit" shadow-premium className="rounded-xl h-12 px-10">Publish Assignment</Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default TutorAssignments;
