import React, { useEffect, useState } from 'react';
import Badge from '../../components/ui/Badge';
import { FileText, Loader2, Download, ExternalLink, Link as LinkIcon, Video, Info } from 'lucide-react';
import { getCourses, getMaterials } from '../../services/studentService';

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, matRes] = await Promise.all([
          getCourses(),
          getMaterials()
        ]);
        setCourses(courseRes.data);
        setMaterials(matRes.data);
        if (courseRes.data.length > 0) {
          setSelectedSubject(courseRes.data[0].title);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMaterials = selectedSubject 
    ? materials.filter(m => m.subject === selectedSubject)
    : materials;

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
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 tracking-tight">Academic Routine</h1>
          <p className="text-gray-500 mt-1 font-medium">Access your curriculum materials and lecture distribution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar - Subject Selector (matching Tutor Class Selector) */}
         <div className="lg:col-span-1 space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">My Active Courses</h3>
            <div className="space-y-3">
              {courses.map((course, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedSubject(course.title)}
                  className={`p-5 rounded-[24px] border transition-all cursor-pointer group ${selectedSubject === course.title ? 'bg-brand-500 text-white border-brand-500 shadow-premium' : 'bg-white border-slate-200 text-gray-600 hover:border-brand-300 shadow-soft'}`}
                >
                   <div className="flex justify-between items-center mb-1">
                      <span className="font-bold tracking-tight">{course.title}</span>
                      <div className={`w-2 h-2 rounded-full ${selectedSubject === course.title ? 'bg-white animate-pulse' : 'bg-slate-200'}`}></div>
                   </div>
                   <div className="flex items-center justify-between mt-2">
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedSubject === course.title ? 'text-brand-100' : 'text-slate-400'}`}>
                         Instructor: {course.tutor.split(' ').pop()}
                      </p>
                      <Badge variant={selectedSubject === course.title ? 'neutral' : 'brand'} className={`text-[8px] px-2 ${selectedSubject === course.title ? 'bg-white/20 text-white border-white/20' : ''}`}>
                         {materials.filter(m => m.subject === course.title).length} Assets
                      </Badge>
                   </div>
                </div>
              ))}
            </div>
         </div>

         {/* Main - Material List (matching Tutor Material List) */}
         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-premium">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm">
                        <FileText size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{selectedSubject || 'Course'} Materials</h2>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">Distributed resources for your active curriculum</p>
                     </div>
                  </div>
                  <Badge variant="brand" className="px-4 py-1.5 font-bold uppercase tracking-widest text-[9px] bg-brand-500 text-white shadow-sm border-none">
                    {filteredMaterials.length} Distributed
                  </Badge>
               </div>
               
               <div className="divide-y divide-slate-100">
                  {filteredMaterials.length > 0 ? filteredMaterials.map((file) => (
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
                               <span>{file.fileSize || '2.4 MB'}</span>
                               <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                               <span>Received {new Date(file.createdAt || file.date).toLocaleDateString()}</span>
                            </p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          {file.type === 'Link' ? (
                             <a 
                               href={file.externalLink || '#'} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="h-12 px-8 rounded-2xl bg-brand-50 text-brand-600 font-bold text-[10px] uppercase tracking-widest hover:bg-brand-600 hover:text-white transition-all flex items-center justify-center"
                             >
                                <ExternalLink size={16} className="mr-2" /> Open
                             </a>
                          ) : (
                             <a 
                               href={file.fileUrl || '#'} 
                               download 
                               target="_blank"
                               rel="noopener noreferrer"
                               className="h-12 px-8 rounded-2xl bg-brand-500 text-white shadow-premium font-bold text-[10px] uppercase tracking-widest hover:bg-brand-600 transition-all flex items-center justify-center"
                             >
                                <Download size={16} className="mr-2" /> Download
                             </a>
                          )}
                       </div>
                    </div>
                  )) : (
                     <div className="p-32 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-slate-200">
                           <Info size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No learning assets distributed for {selectedSubject}.</p>
                     </div>
                  )}
               </div>
               <div className="p-10 text-center border-t border-dashed border-slate-100 bg-slate-50/20">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     Materials are automatically synchronized with your class curriculum.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MyCourses;
