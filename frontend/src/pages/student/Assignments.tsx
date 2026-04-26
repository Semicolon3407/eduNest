import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { 
  FileText, Calendar, Upload, CheckCircle2, 
  AlertCircle, Download, FileArchive, Clock, 
  ChevronRight, Plus, Loader2
} from 'lucide-react';
import { getAssignments, submitAssignment, uploadFile } from '../../services/studentService';

const StudentAssignments: React.FC = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAssignments();
      setAssignments(res.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile || !selectedTask) return;

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      // 1. Upload file first
      const uploadRes = await uploadFile(selectedFile);
      const { fileUrl, fileName, fileSize } = uploadRes.data;

      // 2. Submit assignment with real data
      await submitAssignment({
        assignment: selectedTask._id,
        remarks: formData.get('remarks'),
        fileName,
        fileSize,
        fileUrl
      });
      setIsSubmitModalOpen(false);
      setSelectedFile(null);
      fetchData();
    } catch (error) {
      console.error('Error submitting assignment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
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
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">My Assignments</h1>
          <p className="text-gray-500 mt-1 font-medium">Track tasks, submit work, and view performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 gap-6">
              {assignments.length > 0 ? assignments.map((task) => (
                <div key={task._id} className="bg-white rounded-[40px] shadow-soft border border-slate-200 overflow-hidden group hover:border-brand-500 transition-all duration-300">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all ${task.status === 'Submitted' ? 'bg-success/10 text-success' : task.status === 'Overdue' ? 'bg-danger/10 text-danger' : 'bg-brand-50 text-brand-500'}`}>
                          <FileText size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors leading-tight">{task.title}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{task.subject}</p>
                        </div>
                      </div>
                      <Badge variant={task.status === 'Submitted' ? 'success' : task.status === 'Overdue' ? 'danger' : 'warning'} className="px-5 py-2 uppercase font-black tracking-widest text-[10px]">
                        {task.status}
                      </Badge>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-2xl font-medium italic">
                      "{task.description}"
                    </p>

                    <div className="flex flex-wrap items-center gap-8 py-6 border-y border-slate-100 mb-8">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due On</p>
                        <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                          <Calendar size={16} className="text-brand-500" /> {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      {task.status === 'Submitted' && (
                        <>
                          <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted On</p>
                            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                              <CheckCircle2 size={16} className="text-success" /> {new Date(task.submissionDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grade Status</p>
                            <Badge variant="success" className="h-6 font-black text-xs">{task.grade}</Badge>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button className="h-10 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                          <Download size={16} /> Guidelines
                        </button>
                      </div>
                      {task.status !== 'Submitted' && (
                        <Button 
                          shadow-premium 
                          className="rounded-xl h-11 px-8 active:scale-95" 
                          onClick={() => { setSelectedTask(task); setIsSubmitModalOpen(true); }}
                        >
                          <Upload size={18} /> Submit Solution
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-gray-400">No assignments found for your class.</div>
              )}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3 tracking-tight">
                 <AlertCircle size={20} className="text-brand-500" /> Submission Rules
              </h3>
              <div className="space-y-5">
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><FileArchive size={16} /></div>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed font-sans">ZIP files must not contain executables or malware. Ensure source code is properly commented.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><FileText size={16} /></div>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed font-sans">PDF submissions must be clear and legible. Handwritten work should be scanned properly.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><Clock size={16} /></div>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed font-sans">Late submissions will attract a 10% penalty per day unless prior approval is obtained.</p>
                 </div>
              </div>
           </div>

           <div className="bg-brand-500 rounded-[40px] shadow-premium p-8 text-white relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full -mr-24 -mb-24 opacity-10 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <h4 className="text-2xl font-display font-bold">Need Help?</h4>
              <p className="text-white/80 text-sm mt-3 leading-relaxed">Reach out to your subject tutor via internal messages for any clarifications regarding the tasks.</p>
              <Button className="w-full mt-10 bg-white text-brand-600 rounded-xl h-12 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
                 Contact Tutor <ChevronRight size={16} className="ml-2" />
              </Button>
           </div>
        </div>
      </div>

      {/* Submission Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Assignment"
        description={`Uploading solution for: ${selectedTask?.title}`}
        maxWidth="md"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
           <div 
             className="relative border-4 border-dashed border-slate-100 rounded-[32px] p-10 flex flex-col items-center justify-center bg-slate-50 group hover:border-brand-500 hover:bg-brand-50/20 transition-all cursor-pointer overflow-hidden"
             onClick={() => document.getElementById('fileUpload')?.click()}
           >
              <input type="file" id="fileUpload" hidden onChange={onFileChange} accept=".pdf,.zip" />
              <div className="w-20 h-20 bg-white rounded-full shadow-premium flex items-center justify-center text-brand-500 mb-6 group-hover:scale-110 transition-transform">
                 <Upload size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Click or Drag to Upload</h4>
              <p className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-widest">Supported: PDF, ZIP (Max 50MB)</p>
              
              {selectedFile && (
                <div className="mt-8 p-4 bg-white rounded-2xl border border-brand-200 w-full flex items-center justify-between shadow-soft animate-in slide-in-from-bottom-2">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center italic font-black text-[10px]">
                         {selectedFile.name.split('.').pop()?.toUpperCase()}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{selectedFile.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                   </div>
                   <button 
                     type="button"
                     onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                     className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-all transition-transform hover:scale-110"
                   >
                     <Plus size={16} className="rotate-45" />
                   </button>
                </div>
              )}
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Remarks (Optional)</label>
              <textarea 
                name="remarks"
                className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none"
                placeholder="Leave a message for your tutor..."
              ></textarea>
           </div>

           <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsSubmitModalOpen(false)} className="rounded-xl h-12" disabled={submitting}>Cancel</Button>
              <Button type="submit" shadow-premium className="rounded-xl h-12 px-10" disabled={!selectedFile || submitting}>
                 {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                 {submitting ? 'Submitting...' : 'Finalize Submission'}
              </Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentAssignments;
