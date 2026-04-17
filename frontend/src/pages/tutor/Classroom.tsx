import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Plus, FileText, Video, Link, MessageSquare, Download, Trash2, Edit2 } from 'lucide-react';

const materials = [
  { id: 1, title: 'Introduction to Calculus.pdf', type: 'PDF', size: '2.4 MB', date: 'Oct 12, 2023', class: 'Grade 12-A' },
  { id: 2, title: 'Calculus Lecture - Week 4', type: 'Video', size: '128 MB', date: 'Oct 14, 2023', class: 'Grade 12-A' },
  { id: 3, title: 'Practice Problems Set', type: 'Link', size: 'External', date: 'Oct 15, 2023', class: 'Grade 11-B' },
];

const Classroom: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title="Broadcast Learning Asset"
         description="Upload curriculum materials, lecture videos or external resources for your students."
         maxWidth="2xl"
      >
         <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                  <Input label="Resource Title" placeholder="e.g. Advanced Calculus - Week 4 Study Guide" icon={FileText} required />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Target Class</label>
                  <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                    <option>Grade 12-A</option>
                    <option>Grade 11-B</option>
                    <option>Grade 10-C</option>
                    <option>All My Classes</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Category / Format</label>
                  <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                    <option>PDF / Document</option>
                    <option>Video Lecture</option>
                    <option>Interactive Lab</option>
                    <option>External Quiz Link</option>
                  </select>
               </div>
               <div className="md:col-span-2">
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-white hover:border-brand-500 transition-all cursor-pointer group">
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
                  <Input label="External Link (Optional)" placeholder="https://youtube.com/..." icon={Link} />
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
               <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Discard</Button>
               <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600">Publish to Classroom</Button>
            </div>
         </form>
      </Modal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Virtual Classroom</h1>
          <p className="text-gray-500 mt-1">Manage learning assets and communicate with your students</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline"><MessageSquare size={18} /> Announcements</Button>
           <Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Upload Material</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:p-8">
         {/* Sidebar - Class Selector */}
         <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-medium text-gray-400   px-1">My Active Classes</h3>
            {['Grade 12-A', 'Grade 11-B', 'Grade 10-C'].map((cls, i) => (
              <div key={cls} className={`p-4 rounded-2xl border transition-all cursor-pointer ${i === 0 ? 'bg-brand-500 text-white border-brand-500 shadow-premium' : 'bg-surface border-surface-200 text-gray-600 hover:border-brand-300'}`}>
                 <div className="flex justify-between items-center">
                    <span className="font-medium  ">{cls}</span>
                    <Badge variant={i === 0 ? 'neutral' : 'brand'} className={i === 0 ? 'bg-white/20 text-white border-white/20' : ''}>{i === 0 ? 'Current' : 'View'}</Badge>
                 </div>
                 <p className={`text-[10px] mt-1 ${i === 0 ? 'text-brand-100' : 'text-gray-400'} font-medium`}>32 Students • 4 Materials</p>
              </div>
            ))}
         </div>

         {/* Main - Material List */}
         <div className="lg:col-span-3 space-y-6">
            <div className="bg-surface rounded-3xl border border-surface-200 overflow-hidden shadow-soft">
               <div className="p-6 border-b border-surface-200 flex items-center justify-between bg-surface-50">
                  <h2 className="text-xl font-medium text-gray-900  ">Class Materials</h2>
                  <span className="text-xs font-medium text-brand-600">Grade 12-A</span>
               </div>
               <div className="divide-y divide-surface-100">
                  {materials.map((file) => (
                    <div key={file.id} className="p-6 flex items-center justify-between group hover:bg-brand-50/20 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            file.type === 'PDF' ? 'bg-danger-light text-danger' : 
                            file.type === 'Video' ? 'bg-brand-50 text-brand-500' : 'bg-success-light text-success'
                          }`}>
                             {file.type === 'PDF' ? <FileText size={20}/> : file.type === 'Video' ? <Video size={20}/> : <Link size={20}/>}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors   text-sm">{file.title}</h4>
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-2 mt-0.5 capitalize">
                               {file.type} • {file.size} • Uploaded {file.date}
                            </p>
                          </div>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-surface-200 transition-all">
                             <Download size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-surface-200 transition-all">
                             <Edit2 size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-danger hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-surface-200 transition-all">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-6 sm:p-10 text-center border-t border-dashed border-surface-200 bg-surface-50/50">
                  <button className="text-sm font-medium text-brand-600 hover:underline">+ Drag and drop more files here</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Classroom;
