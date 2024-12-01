import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Plus, FileText, Video, Link as LinkIcon, MessageSquare, Download, Trash2, Loader2, GraduationCap, ChevronDown, BookOpen } from 'lucide-react';
import { getMaterials, uploadMaterial, getTutorClasses, deleteMaterial } from '../../services/tutorService';

const Classroom: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchMaterials();
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      const res = await getTutorClasses();
      setClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClassId(res.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await getMaterials(selectedClassId);
      setMaterials(res.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      setIsUploading(true);
      await uploadMaterial({
        title: formData.get('title') as string,
        class: formData.get('classId') as string,
        subject: formData.get('subject') as string,
        type: formData.get('type') as string,
        externalLink: formData.get('externalLink') as string,
        fileSize: '2.4 MB',
        fileUrl: '#'
      });
      setIsModalOpen(false);
      form.reset();
      fetchMaterials();
    } catch (error) {
      console.error('Error uploading material:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this learning asset?')) return;
    try {
       await deleteMaterial(id);
       fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  if (loading && classes.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title="Broadcast Learning Asset"
         description="Upload curriculum materials, lecture videos or external resources for your students."
         maxWidth="2xl"
      >
         <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                  <Input name="title" label="Resource Title" placeholder="e.g. Advanced Calculus - Week 4 Study Guide" icon={FileText} required />
               </div>
               
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Target Class</label>
                  <div className="relative">
                    <select name="classId" required className="w-full h-12 px-10 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                      <option value="">Select Target Class</option>
                      {classes.map(c => <option key={c._id} value={c._id}>{c.name}-{c.section}</option>)}
                    </select>
                    <GraduationCap size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
               </div>

               <div className="space-y-2">
                  <Input name="subject" label="Subject / Curriculum" placeholder="e.g. Quantum Physics, English Literature" icon={BookOpen} required />
               </div>

               <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Category / Format</label>
                  <select name="type" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                    <option value="PDF">PDF / Document</option>
                    <option value="Video">Video Lecture</option>
                    <option value="Interactive">Interactive Lab</option>
                    <option value="Link">External Quiz Link</option>
                  </select>
               </div>

               <div className="md:col-span-2">
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-white hover:border-brand-500 transition-all cursor-pointer group relative">
                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-500 group-hover:border-brand-100">
                        <Plus size={24} />
                     </div>
                     <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 leading-none">Click to upload file</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-2">Maximum file size: 250MB (PDF, MP4, ZIP)</p>
                     </div>
                  </div>
               </div>
               <div className="md:col-span-2">
                  <Input name="externalLink" label="External Link (Optional)" placeholder="https://youtube.com/..." icon={LinkIcon} />
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
               <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Discard</Button>
               <Button type="submit" disabled={isUploading} className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 min-w-[180px]">
                 {isUploading ? <><Loader2 className="animate-spin mr-2" size={18} /> Processing...</> : 'Publish to Classroom'}
               </Button>
            </div>
         </form>
      </Modal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 tracking-tight">Virtual Classroom</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage learning assets and communicate with your students</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl h-11"><MessageSquare size={18} /> Notifications</Button>
           <Button onClick={() => setIsModalOpen(true)} shadow-premium className="rounded-xl h-11 bg-brand-500 text-white hover:bg-brand-600"><Plus size={18} /> Upload Material</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-1 space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Active Class Sections</h3>
            <div className="space-y-3">
              {classes.map((cls) => (
                <div 
                  key={cls._id} 
                  onClick={() => setSelectedClassId(cls._id)}
                  className={`p-5 rounded-[24px] border transition-all cursor-pointer group ${selectedClassId === cls._id ? 'bg-brand-500 text-white border-brand-500 shadow-premium' : 'bg-white border-slate-200 text-gray-600 hover:border-brand-300 shadow-soft'}`}
                >
                   <div className="flex justify-between items-center mb-1">
                      <span className="font-bold tracking-tight">{cls.name || 'Grade'}-{cls.section}</span>
                      <div className={`w-2 h-2 rounded-full ${selectedClassId === cls._id ? 'bg-white animate-pulse' : 'bg-slate-200'}`}></div>
                   </div>
                   <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedClassId === cls._id ? 'text-brand-100' : 'text-slate-400'}`}>
                      {cls.room || 'Regular Room'}
                   </p>
                </div>
              ))}
            </div>
         </div>

         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-premium">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm">
                        <FileText size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Curriculum Material</h2>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">Distributed resources for {classes.find(c => c._id === selectedClassId)?.name || 'Class'}</p>
                     </div>
                  </div>
                  <Badge variant="brand" className="px-4 py-1.5 font-bold uppercase tracking-widest text-[9px] bg-brand-500 text-white shadow-sm border-none">
                    {materials.length} Resources
                  </Badge>
               </div>
               
               <div className="divide-y divide-slate-100">
                  {loading ? (
                     <div className="p-32 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-brand-500" size={32} />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Synchronizing Vault...</p>
                     </div>
                  ) : materials.length > 0 ? materials.map((file) => (
                    <div key={file._id} className="p-8 flex items-center justify-between group hover:bg-brand-50/10 transition-all">
                       <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-soft border transition-all ${
                            file.type === 'PDF' ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                            file.type === 'Video' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'
                          }`}>
                             {file.type === 'PDF' ? <FileText size={24}/> : file.type === 'Video' ? <Video size={24}/> : <LinkIcon size={24}/>}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1.5">
                               <h4 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors tracking-tight text-base">{file.title}</h4>
                               <Badge variant="neutral" className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-slate-50 border-slate-200 text-slate-500">{file.subject || 'Syllabus'}</Badge>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] flex items-center gap-3 mt-0.5">
                               <span className="text-slate-900/60 uppercase">{file.type}</span>
                               <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                               <span>{file.fileSize || '---'}</span>
                               <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                               <span>Published {new Date(file.createdAt || file.date).toLocaleDateString()}</span>
                            </p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <a 
                            href={file.fileUrl || file.externalLink || '#'} 
                            download
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all bg-slate-50"
                          >
                             <Download size={18} />
                          </a>
                          <button 
                            onClick={() => handleDelete(file._id)}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all bg-slate-50"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  )) : (
                     <div className="p-32 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-slate-200">
                           <FileText size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No learning assets distributed for this section.</p>
                     </div>
                  )}
               </div>
               <div className="p-10 text-center border-t border-dashed border-slate-100 bg-slate-50/20">
                  <button onClick={() => setIsModalOpen(true)} className="text-[10px] font-bold text-brand-500 uppercase tracking-widest hover:underline transition-all">
                    + Broadcast new resource to curriculum
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Classroom;
