import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Trophy, Search, Save, Award, Star, Filter } from 'lucide-react';

const gradeEntries = [
  { id: 1, name: 'Ava Thompson', roll: 'D2401', quiz: '18/20', exam: '84/100', participation: '9/10' },
  { id: 2, name: 'Leo Garcia', roll: 'D2402', quiz: '12/20', exam: '64/100', participation: '6/10' },
  { id: 3, name: 'Mia Robinson', roll: 'D2403', quiz: '19/20', exam: '92/100', participation: '10/10' },
];

const Grades: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Digital Gradebook</h1>
          <p className="text-gray-500 mt-1">Input scores and evaluate student academic progress</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline"><Award size={18} /> Grading Schema</Button>
           <Button shadow-premium><Save size={18} /> Publish Results</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 rounded-[32px] bg-brand-50 border border-brand-100 flex items-center gap-4">
            <div className="p-3 bg-brand-500 text-white rounded-2xl shadow-premium animate-pulse"><Star size={24} /></div>
            <div>
               <p className="text-[10px] font-medium text-brand-600   leading-none mb-1">High Performance</p>
               <h4 className="text-lg font-medium text-brand-500  ">12 Students</h4>
            </div>
         </div>
         <div className="p-6 rounded-[32px] bg-warning-light/30 border border-warning/10 flex items-center gap-4">
            <div className="p-3 bg-warning text-white rounded-2xl shadow-premium"><Trophy size={24} /></div>
            <div>
               <p className="text-[10px] font-medium text-warning-dark   leading-none mb-1">Class Average</p>
               <h4 className="text-lg font-medium text-gray-900  ">78.4%</h4>
            </div>
         </div>
         <div className="p-6 rounded-[32px] bg-surface border border-surface-200 flex items-center gap-4 shadow-soft">
            <div className="p-3 bg-surface-100 text-gray-400 rounded-2xl"><Search size={24} /></div>
            <div className="flex-1">
               <input type="text" placeholder="Jump to student..." className="w-full bg-transparent outline-none font-medium text-sm text-gray-900 placeholder:text-gray-400" />
            </div>
         </div>
      </div>

      <div className="bg-surface p-6 rounded-[32px] shadow-soft border border-surface-200 overflow-hidden">
        <div className="p-4 border-b border-surface-100 flex items-center justify-between bg-surface-50">
           <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-400   tracking-[0.2em]">Assessment Period:</span>
              <Badge variant="brand">Mid-term Exam 2023</Badge>
           </div>
           <Button size="sm" variant="outline"><Filter size={16}/> Filter Classes</Button>
        </div>
        
        <div className="overflow-x-auto">
           <div className="overflow-x-auto"><table className="w-full text-left">
            <thead>
              <tr className="bg-surface text-gray-400 text-[10px] font-medium   border-b border-surface-100">
                <th className="px-6 py-6">Student Information</th>
                <th className="px-6 py-6">Class Quiz</th>
                <th className="px-6 py-6">Final Exam</th>
                <th className="px-6 py-6">Participation</th>
                <th className="px-6 py-6 text-right">Weighted Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
               {gradeEntries.map(student => (
                 <tr key={student.id} className="group hover:bg-brand-50/20 transition-all">
                    <td className="px-6 py-6">
                       <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors   text-sm">{student.name}</p>
                       <p className="text-[10px] font-medium text-gray-400 ">ID: {student.roll} • MATH-12A</p>
                    </td>
                    <td className="px-6 py-6">
                       <input type="text" defaultValue={student.quiz} className="w-20 bg-surface-50 border border-surface-200 rounded-lg p-2 text-center text-sm font-medium focus:border-brand-500 outline-none" />
                    </td>
                    <td className="px-6 py-6">
                       <input type="text" defaultValue={student.exam} className="w-20 bg-surface-50 border border-surface-200 rounded-lg p-2 text-center text-sm font-medium focus:border-brand-500 outline-none" />
                    </td>
                    <td className="px-6 py-6">
                       <input type="text" defaultValue={student.participation} className="w-20 bg-surface-50 border border-surface-200 rounded-lg p-2 text-center text-sm font-medium focus:border-brand-500 outline-none" />
                    </td>
                    <td className="px-6 py-6 text-right">
                       <Badge variant="success" className="h-8 px-4 text-base font-medium">A</Badge>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table></div>
        </div>

        <div className="p-4 sm:p-8 text-center bg-surface-50 border-t border-surface-100">
           <p className="text-[10px] font-medium text-gray-400   mb-4">Batch Actions</p>
           <div className="flex items-center justify-center gap-4">
              <Button size="sm" variant="outline">Apply Curve</Button>
              <Button size="sm" variant="outline">Reset Batch</Button>
              <Button size="sm" variant="outline">Import CSV</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;
