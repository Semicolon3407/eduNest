import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { BookOpen, FileText, ArrowRight, PlayCircle } from 'lucide-react';

const courses = [
  { id: 1, title: 'Advanced Calculus', tutor: 'Dr. Sarah Smith', progress: 85, lessons: 12, completed: 10, color: 'brand' },
  { id: 2, title: 'Computer Science II', tutor: 'Prof. Michael Chen', progress: 62, lessons: 15, completed: 9, color: 'success' },
  { id: 3, title: 'Engineering Physics', tutor: 'Dr. James Wilson', progress: 40, lessons: 10, completed: 4, color: 'warning' },
];

const MyCourses: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">My Courses</h1>
        <p className="text-gray-500 mt-1">Track your academic progress and access learning materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:p-8">
         {courses.map((course) => (
           <div key={course.id} className="bg-surface rounded-[40px] border border-surface-200 shadow-soft overflow-hidden group hover:border-brand-300 transition-all flex flex-col">
              <div className={`h-40 bg-${course.color}-500 p-4 sm:p-8 flex flex-col justify-end relative overflow-hidden`}>
                 <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-xl p-2 text-white">
                    <BookOpen size={20} />
                 </div>
                 <h3 className="text-xl font-medium text-white relative z-10  leading-tight">{course.title}</h3>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
              </div>
              
              <div className="p-4 sm:p-8 flex-1 flex flex-col">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center font-medium text-gray-400">
                       {course.tutor.split(' ').pop()?.[0]}
                    </div>
                    <div>
                       <p className="text-xs font-medium text-gray-400   leading-none">Instructor</p>
                       <p className="text-sm font-medium text-gray-900 mt-1">{course.tutor}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-2 mb-8">
                    <div className="flex justify-between text-xs font-medium  ">
                       <span className="text-gray-400">Course Progress</span>
                       <span className={`text-${course.color}-600`}>{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                       <div className={`h-full bg-${course.color}-500 rounded-full transition-all duration-1000`} style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">{course.completed} of {course.lessons} lessons completed</p>
                 </div>

                 <div className="mt-auto flex items-center justify-between pt-4 border-t border-surface-100">
                    <div className="flex -space-x-2">
                       <div className="w-8 h-8 rounded-full border-2 border-surface bg-brand-50 flex items-center justify-center text-brand-600"><PlayCircle size={14}/></div>
                       <div className="w-8 h-8 rounded-full border-2 border-surface bg-success-light flex items-center justify-center text-success-dark"><FileText size={14}/></div>
                    </div>
                    <Button variant="ghost" size="sm" className={`text-${course.color}-600 font-medium group`}>
                       Continue <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-gradient-to-br from-brand-900 to-brand-500 text-white rounded-[40px] p-6 sm:p-10 relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:p-8">
            <div className="max-w-xl text-center md:text-left">
               <Badge variant="neutral" className="bg-white/10 text-white border-white/20 mb-4 tracking-[0.2em]">Announcement</Badge>
               <h2 className="text-2xl sm:text-3xl font-medium ">Library Access Restored!</h2>
               <p className="mt-2 text-brand-200 font-medium">Digital archives for 2023 engineering journals are now available for all Grade 11-12 students. Check the library portal for your session credentials.</p>
            </div>
            <Button className="bg-white text-brand-500 hover:bg-brand-50 shadow-premium whitespace-nowrap h-14 px-10">
               Go to Library Portal
            </Button>
         </div>
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mb-32"></div>
      </div>
    </div>
  );
};

export default MyCourses;
