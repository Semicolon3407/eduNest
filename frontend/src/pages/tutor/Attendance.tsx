import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Filter, Save, Users, CheckCircle, XCircle, Plus, User, Search, ChevronDown, Clock, MoreVertical } from 'lucide-react';

const students = [
   { id: 1, name: 'Ava Thompson', roll: 'D2401', status: 'Present', lastAction: '2 mins ago' },
   { id: 2, name: 'Leo Garcia', roll: 'D2402', status: 'Absent', lastAction: '-' },
   { id: 3, name: 'Mia Robinson', roll: 'D2403', status: 'Present', lastAction: '5 mins ago' },
   { id: 4, name: 'Noah Davis', roll: 'D2404', status: 'Present', lastAction: '1 min ago' },
   { id: 5, name: 'Sophia Lee', roll: 'D2405', status: 'Present', lastAction: 'Just now' },
];

const Attendance: React.FC = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');

   return (
      <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
               <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Digital Register</h1>
               <p className="text-gray-500 mt-1 font-medium">Mark daily attendance and track behavioral engagement</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
               <div className="flex gap-2">
                  <div className="bg-success/5 border border-success/10 px-4 py-2.5 rounded-2xl flex flex-col justify-center shadow-sm">
                     <p className="text-[9px] font-bold text-success-dark uppercase tracking-widest leading-none mb-1">Present</p>
                     <p className="text-sm font-bold text-success-dark">156 Students</p>
                  </div>
                  <div className="bg-danger/5 border border-danger/10 px-4 py-2.5 rounded-2xl flex flex-col justify-center shadow-sm">
                     <p className="text-[9px] font-bold text-danger-dark uppercase tracking-widest leading-none mb-1">Absent</p>
                     <p className="text-sm font-bold text-danger-dark">4 Students</p>
                  </div>
               </div>
               <Button onClick={() => setIsModalOpen(true)} shadow-premium className="rounded-xl h-12 px-6">
                  <Plus size={18} /> Quick Note
               </Button>
            </div>
         </div>

         {/* Control Bar */}
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
            <div className="lg:col-span-1 space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Selected Class</label>
               <div className="relative group">
                  <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500 z-10" />
                  <select className="w-full h-14 bg-white border border-surface-200 rounded-2xl pl-12 pr-10 text-sm font-bold text-gray-800 appearance-none outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer shadow-soft">
                     <option>Grade 12-A</option>
                     <option>Grade 10-C</option>
                     <option>Grade 11-B</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-brand-500 transition-colors" />
               </div>
            </div>

            <div className="lg:col-span-2 h-14 bg-surface p-1 rounded-2xl border border-surface-200 flex shadow-soft">
               <div className="flex-1 px-4 flex items-center gap-3">
                  <Search size={18} className="text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search student by name or roll number..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="bg-transparent outline-none font-medium text-sm text-gray-900 w-full"
                  />
               </div>
            </div>

            <div className="lg:col-span-1">
               <Button variant="outline" className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                  <Filter size={18} /> Advanced Filters
               </Button>
            </div>
         </div>

         <div className="bg-white rounded-[40px] shadow-premium border border-surface-200 overflow-hidden">
            <div className="p-6 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Session:</span>
                  <Badge variant="brand" className="px-4 py-1.5 font-bold uppercase tracking-wider text-[10px]">
                     Today • Apr 19, 2026
                  </Badge>
               </div>
               <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Auto-saving Enabled</p>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-white text-gray-400 text-[10px] font-bold uppercase tracking-widest border-b border-surface-100">
                        <th className="px-8 py-6">Roll No.</th>
                        <th className="px-6 py-6 font-bold">Student Participant</th>
                        <th className="px-6 py-6 text-center">Attendance Status</th>
                        <th className="px-6 py-6 text-center">Last Updated</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                     {students.map((student) => (
                        <tr key={student.id} className="group hover:bg-brand-50/10 transition-all">
                           <td className="px-8 py-6">
                              <span className="font-mono font-bold text-brand-600 bg-brand-50/50 px-3 py-1 rounded-lg text-xs">
                                 {student.roll}
                              </span>
                           </td>
                           <td className="px-6 py-6">
                              <p className="font-bold text-gray-800 group-hover:text-brand-600 transition-colors text-sm">{student.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Regular Enrollment</p>
                           </td>
                           <td className="px-6 py-6">
                              <div className="flex justify-center gap-2">
                                 <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${student.status === 'Present' ? 'bg-success text-white ring-4 ring-success/10' : 'bg-surface-50 text-gray-400 hover:bg-success/10 hover:text-success hover:ring-4 hover:ring-success/5'}`}>
                                    <CheckCircle size={16} /> Present
                                 </button>
                                 <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${student.status === 'Absent' ? 'bg-danger text-white ring-4 ring-danger/10' : 'bg-surface-50 text-gray-400 hover:bg-danger/10 hover:text-danger hover:ring-4 hover:ring-danger/5'}`}>
                                    <XCircle size={16} /> Absent
                                 </button>
                              </div>
                           </td>
                           <td className="px-6 py-6 text-center">
                              <p className="text-xs font-medium text-slate-500">{student.lastAction}</p>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-3">
                                 <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-[10px] font-bold text-brand-500 uppercase tracking-widest hover:underline hover:text-brand-600 transition-all"
                                 >
                                    Add Note
                                 </button>
                                 <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                    <MoreVertical size={18} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <div className="p-10 bg-surface-50/50 border-t border-surface-100 flex flex-col sm:flex-row justify-between items-center gap-6">
               <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signatory Authority</p>
                  <p className="text-sm font-bold text-slate-700">Dr. Sarah Wilson — <span className="font-medium text-slate-400">Senior Faculty Representative</span></p>
               </div>
               <Button className="h-14 px-12 shadow-premium bg-brand-500 text-white hover:bg-brand-600 rounded-2xl transform transition-all active:scale-95">
                  <Save size={18} /> Submit & Sync Register
               </Button>
            </div>
         </div>

         <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Behavioral Observation"
            description="Log professional behavioral notes and engagement levels for students."
            maxWidth="xl"
         >
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
               <div className="space-y-6">
                  <Input label="Search Student" placeholder="Begin typing student name..." icon={User} required />

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Engagement Metric</label>
                     <div className="relative group">
                        <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer pr-10">
                           <option>Exceptional Participation</option>
                           <option>Active & Focused</option>
                           <option>Moderate Attention</option>
                           <option>Requires Encouragement</option>
                           <option>Distracted / Off-task</option>
                           <option>Unresponsive</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-brand-500 transition-colors" />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Observation Details</label>
                     <textarea
                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none"
                        placeholder="Provide specific details about the behavior (e.g., Contributed original insights during the Algebra proofs section...)"
                        required
                     ></textarea>
                  </div>
               </div>

               <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-11 px-6">Discard</Button>
                  <Button type="submit" shadow-premium className="rounded-xl h-11 px-8">Save Observation</Button>
               </div>
            </form>
         </Modal>
      </div>
   );
};

export default Attendance;
