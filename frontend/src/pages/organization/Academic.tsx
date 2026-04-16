import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Calendar, Plus, Clock, ChevronRight, Settings2 } from 'lucide-react';

const AcademicSetup: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Academic Architecture</h1>
        <p className="text-gray-500 mt-1">Configure study sessions, semesters, and overall school calendar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-8">
         {/* Session Management */}
         <div className="bg-surface p-4 sm:p-8 rounded-[40px] shadow-soft border border-surface-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16"></div>
            <div className="flex justify-between items-start relative z-10 mb-8">
               <h3 className="text-xl font-medium text-gray-900  ">Sessions</h3>
               <Button size="sm"><Plus size={16}/> New Session</Button>
            </div>
            
            <div className="space-y-4 relative z-10">
               <div className="p-5 rounded-3xl bg-brand-500 text-white shadow-premium flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <Calendar size={24} />
                     <div>
                        <p className="font-medium">2024 - 2025</p>
                        <p className="text-xs text-brand-100 font-medium">Ongoing • 240 Days Remaining</p>
                     </div>
                  </div>
                  <Badge variant="neutral" className="bg-white/20 text-white border-white/20">Current</Badge>
               </div>
               
               {['2023 - 2024', '2022 - 2023'].map(session => (
                 <div key={session} className="p-5 rounded-2xl border border-surface-100 bg-surface-50 flex items-center justify-between group hover:border-brand-200 transition-all">
                    <div className="flex items-center gap-4 text-gray-400 group-hover:text-brand-600 transition-colors font-medium  ">
                       <Clock size={20} />
                       {session}
                    </div>
                    <Badge variant="neutral">Archived</Badge>
                 </div>
               ))}
            </div>
         </div>

         {/* Term Management */}
         <div className="bg-surface p-4 sm:p-8 rounded-[40px] shadow-soft border border-surface-200 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
               <h3 className="text-xl font-medium text-gray-900  ">Terms & Semesters</h3>
               <Button size="sm" variant="outline"><Settings2 size={16}/> Rules</Button>
            </div>

            <div className="space-y-6">
               {[
                 { name: 'Fall Semester', dates: 'Sept 01 - Dec 20', status: 'Completed' },
                 { name: 'Spring Semester', dates: 'Jan 05 - May 15', status: 'Active' },
                 { name: 'Summer Fast-track', dates: 'June 01 - Aug 15', status: 'Upcoming' },
               ].map((term) => (
                 <div key={term.name} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-1.5 h-12 bg-surface-200 rounded-full group-hover:bg-brand-500 transition-all"></div>
                       <div>
                          <h4 className="font-medium text-gray-900 flex items-center gap-2 group-hover:text-brand-600 transition-colors  ">
                             {term.name}
                             <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>
                          <p className="text-xs text-gray-400 font-medium">{term.dates}</p>
                       </div>
                    </div>
                    <Badge variant={term.status === 'Active' ? 'success' : term.status === 'Completed' ? 'neutral' : 'brand'}>
                       {term.status}
                    </Badge>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AcademicSetup;
