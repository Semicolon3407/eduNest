import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { BookOpen, FileText, ArrowRight, PlayCircle } from 'lucide-react';

const courses = [
  { id: 1, title: 'Advanced Calculus', tutor: 'Dr. Sarah Smith', progress: 85, lessons: 12, completed: 10, color: 'brand' },
  { id: 2, title: 'Computer Science II', tutor: 'Prof. Michael Chen', progress: 62, lessons: 15, completed: 9, color: 'success' },
  { id: 3, title: 'Engineering Physics', tutor: 'Dr. James Wilson', progress: 40, lessons: 10, completed: 4, color: 'warning' },
];

const studyMaterials = [
  { id: 1, title: 'Quantum Mechanics - Lecture Notes', course: 'Engineering Physics', type: 'PDF', size: '2.4 MB', date: 'Oct 15' },
  { id: 2, title: 'Advanced Integration Cheat Sheet', course: 'Advanced Calculus', type: 'PDF', size: '1.1 MB', date: 'Oct 14' },
  { id: 3, title: 'Data Structures Lab Manual', course: 'Computer Science II', type: 'Doc', size: '3.8 MB', date: 'Oct 12' },
];

const MyCourses: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans text-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">My Courses</h1>
          <p className="text-gray-500 mt-1">Track your academic progress and access tutors' materials</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl h-11"><FileText size={18} /> Syllabus</Button>
            <Button className="rounded-xl h-11 shadow-premium bg-brand-500 text-white hover:bg-brand-600"><PlayCircle size={18} /> Join Lecture</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {courses.map((course) => (
           <div key={course.id} className="bg-surface rounded-[40px] border border-surface-200 shadow-premium-sm overflow-hidden group hover:border-brand-300 transition-all flex flex-col">
              <div className={`h-40 bg-${course.color === 'brand' ? 'brand-500' : course.color === 'success' ? 'success' : 'warning'} p-8 flex flex-col justify-end relative overflow-hidden`}>
                 <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-xl p-2 text-white border border-white/20">
                    <BookOpen size={20} />
                 </div>
                 <h3 className="text-xl font-medium text-white relative z-10  leading-tight">{course.title}</h3>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                       {course.tutor.split(' ').pop()?.[0]}
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Instructor</p>
                       <p className="text-sm font-medium text-gray-900 mt-1.5">{course.tutor}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-3 mb-10">
                    <div className="flex justify-between text-[10px] font-bold  uppercase tracking-widest">
                       <span className="text-slate-400">Course Progress</span>
                       <span className={`text-${course.color === 'brand' ? 'brand-600' : course.color === 'success' ? 'success-dark' : 'warning-dark'}`}>{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full bg-${course.color === 'brand' ? 'brand-500' : course.color === 'success' ? 'success' : 'warning'} rounded-full transition-all duration-1000`} style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-1">
                        <span>{course.completed}/{course.lessons} completed</span>
                        <span>4 Materials</span>
                    </div>
                 </div>

                 <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex -space-x-2">
                       <div className="w-9 h-9 rounded-xl border-2 border-white bg-brand-50 flex items-center justify-center text-brand-600 shadow-sm"><PlayCircle size={16}/></div>
                       <div className="w-9 h-9 rounded-xl border-2 border-white bg-success-light flex items-center justify-center text-success-dark shadow-sm"><FileText size={16}/></div>
                    </div>
                    <Button variant="ghost" size="sm" className={`text-brand-600 font-bold text-[10px] uppercase tracking-widest group px-0`}>
                       Continue <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <div className="space-y-6 pt-4">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500">
                  <FileText size={20} />
               </div>
               <h2 className="text-xl font-medium text-gray-900">Recent Materials</h2>
            </div>
            <button className="text-[10px] font-bold text-brand-600 uppercase tracking-widest border-b border-brand-200 pb-1">View All Documents</button>
         </div>

         <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-soft">
            <div className="divide-y divide-slate-50">
               {studyMaterials.map((file) => (
                  <div key={file.id} className="p-8 flex items-center justify-between hover:bg-brand-50/20 transition-all cursor-pointer group">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all border border-transparent group-hover:border-brand-100">
                           <FileText size={20} />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-base font-medium text-gray-900 group-hover:text-brand-600 transition-colors tracking-tight">{file.title}</h4>
                              <Badge variant="brand" className="text-[8px] font-bold uppercase tracking-widest px-2">{file.type}</Badge>
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {file.course} • {file.size} • Uploaded {file.date}
                           </p>
                        </div>
                     </div>
                     <Button variant="outline" size="sm" className="rounded-xl px-6 h-10 text-[10px] font-bold uppercase tracking-widest group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all">Download</Button>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default MyCourses;
