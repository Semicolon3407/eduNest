import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Search, Save, Award, Calendar, ChevronDown, MoreVertical, Eye, Trash2, Edit } from 'lucide-react';

const gradeEntries = [
  { id: 1, name: 'Ava Thompson', roll: 'D2401', class: '12', section: 'A', quiz: '18/20', exam: '84/100', participation: '9/10' },
  { id: 2, name: 'Leo Garcia', roll: 'D2402', class: '12', section: 'A', quiz: '12/20', exam: '64/100', participation: '6/10' },
  { id: 3, name: 'Mia Robinson', roll: 'D2403', class: '11', section: 'B', quiz: '19/20', exam: '92/100', participation: '10/10' },
  { id: 4, name: 'Ethan Hunt', roll: 'D2404', class: '10', section: 'C', quiz: '15/20', exam: '72/100', participation: '8/10' },
];

const classes = ['10', '11', '12'];
const sections = ['A', 'B', 'C'];
const examTypes = [
  { id: 'first-term', name: 'First Term' },
  { id: 'mid-term', name: 'Midterm' },
  { id: 'final', name: 'Final Exam' },
];

const Grades: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('12');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedExam, setSelectedExam] = useState(examTypes[1].id);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filteredStudents = gradeEntries.filter(s => s.class === selectedClass && s.section === selectedSection);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Student Gradebook</h1>
          <p className="text-gray-500 mt-1">Manage student results and academic performance records</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-xl h-12 shadow-sm"><Award size={18} /> Grading Policy</Button>
           <Button shadow-premium className="rounded-xl h-12 px-8" onClick={() => {}}><Save size={18} /> Publish Term Results</Button>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Class</label>
          <div className="relative group">
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-14 bg-white border border-surface-200 rounded-2xl px-6 text-sm font-bold text-gray-800 appearance-none outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer shadow-soft"
            >
              {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-brand-500 transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Section</label>
          <div className="relative group">
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full h-14 bg-white border border-surface-200 rounded-2xl px-6 text-sm font-bold text-gray-800 appearance-none outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer shadow-soft"
            >
              {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-brand-500 transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Exam Term</label>
          <div className="relative group">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 z-10" />
            <select 
              value={selectedExam} 
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full h-14 bg-white border border-surface-200 rounded-2xl pl-12 pr-10 text-sm font-bold text-gray-800 appearance-none outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer shadow-soft"
            >
              {examTypes.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-brand-500 transition-colors" />
          </div>
        </div>

        <div className="h-14 bg-surface p-1 rounded-2xl border border-surface-200 flex shadow-soft">
          <div className="flex-1 px-4 flex items-center gap-3">
             <Search size={18} className="text-gray-400" />
             <input type="text" placeholder="Search by name or ID..." className="bg-transparent outline-none font-medium text-sm text-gray-900 w-full" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-premium border border-surface-200 overflow-hidden">
        <div className="p-6 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Current View:</span>
              <Badge variant="brand" className="px-4 py-1.5 font-bold uppercase tracking-wider text-[10px]">
                Class {selectedClass}-{selectedSection} — {examTypes.find(e => e.id === selectedExam)?.name}
              </Badge>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Students in List</p>
                <p className="text-sm font-bold text-gray-800">{filteredStudents.length} Students</p>
              </div>
           </div>
        </div>
        
        <div className="overflow-x-auto">
           <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-surface-100">
                <th className="px-8 py-6">Student Information</th>
                <th className="px-6 py-6">Enrollment ID</th>
                <th className="px-6 py-6">Class & Section</th>
                <th className="px-6 py-6">Overall Grade</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
               {filteredStudents.length > 0 ? filteredStudents.map(student => (
                 <tr key={student.id} className="group hover:bg-brand-50/10 transition-all relative">
                    <td className="px-8 py-6">
                       <p className="font-bold text-gray-800 group-hover:text-brand-600 transition-colors text-sm">{student.name}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-tight uppercase">Regular Student</p>
                    </td>
                    <td className="px-6 py-6 font-medium text-sm text-gray-600">
                       {student.roll}
                    </td>
                    <td className="px-6 py-6">
                       <Badge variant="neutral" className="border-slate-200 text-slate-600">
                         Class {student.class}-{student.section}
                       </Badge>
                    </td>
                    <td className="px-6 py-6">
                       <Badge variant="success" className="h-8 px-4 font-bold">A</Badge>
                    </td>
                    <td className="px-8 py-6 text-right relative">
                       <button 
                         onClick={() => setOpenMenu(openMenu === student.id ? null : student.id)}
                         className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-brand-500"
                       >
                         <MoreVertical size={20} />
                       </button>

                       {openMenu === student.id && (
                         <div className="absolute right-12 top-1/2 -translate-y-1/2 z-50 bg-white shadow-premium border border-slate-100 rounded-2xl p-2 w-48 animate-in zoom-in-95 duration-200">
                           <button 
                             onClick={() => navigate(`/tutor/grades/${student.id}`)}
                             className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all"
                           >
                             <Eye size={18} /> View Results
                           </button>
                           <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
                             <Edit size={18} /> Edit Record
                           </button>
                           <div className="my-1 border-t border-slate-50"></div>
                           <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-danger hover:bg-danger/5 rounded-xl transition-all">
                             <Trash2 size={18} /> Delete Record
                           </button>
                         </div>
                       )}
                    </td>
                 </tr>
               )) : (
                 <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                             <Search size={32} />
                          </div>
                          <p className="text-slate-500 font-medium">No students found matching the selected filters.</p>
                       </div>
                    </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>

        <div className="p-8 text-center bg-surface-50/30 border-t border-surface-100 flex flex-col items-center gap-6">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Export Options</p>
              <div className="flex items-center justify-center gap-3">
                 <Button size="sm" variant="outline" className="rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest bg-white">Download CSV</Button>
                 <Button size="sm" variant="outline" className="rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest bg-white">Print Register</Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;
