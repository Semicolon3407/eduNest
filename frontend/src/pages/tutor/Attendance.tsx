import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Filter, Save, Users, CheckCircle, XCircle, FileText, Plus, User } from 'lucide-react';

const students = [
  { id: 1, name: 'Ava Thompson', roll: 'D2401', status: 'Present' },
  { id: 2, name: 'Leo Garcia', roll: 'D2402', status: 'Absent' },
  { id: 3, name: 'Mia Robinson', roll: 'D2403', status: 'Present' },
  { id: 4, name: 'Noah Davis', roll: 'D2404', status: 'Present' },
  { id: 5, name: 'Sophia Lee', roll: 'D2405', status: 'Present' },
];

const Attendance: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Digital Register</h1>
          <p className="text-gray-500 mt-1 font-medium">Mark daily attendance and track behavioral engagement</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
           <div className="flex gap-2 text-sm font-medium  ">
              <span className="flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-xl border border-success/20">Present: 156</span>
              <span className="flex items-center gap-2 bg-danger/10 text-danger px-4 py-2 rounded-xl border border-danger/20">Absent: 4</span>
           </div>
           <Button onClick={() => setIsModalOpen(true)} className="rounded-xl h-12 shadow-premium bg-brand-500 text-white hover:bg-brand-600">
              <Plus size={18} /> Quick Note
           </Button>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-[32px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="bg-brand-50 border border-brand-100 p-4 rounded-2xl flex items-center gap-6 min-w-[300px]">
              <div className="p-3 bg-brand-500 text-white rounded-xl shadow-premium">
                 <Users size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-medium text-brand-600   leading-none mb-1">Active Selection</p>
                 <h4 className="text-lg font-medium text-brand-500  ">Grade 12-A • Math</h4>
              </div>
           </div>
           <div className="flex-1">
              <input type="text" placeholder="Search student by name or roll..." className="w-full h-14 bg-surface-50 border border-surface-200 rounded-2xl px-6 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-sm" />
           </div>
           <Button variant="outline" className="h-14 px-8 flex items-center gap-2">
              <Filter size={18} /> Filters
           </Button>
        </div>

        <div className="overflow-x-auto">
           <div className="overflow-x-auto"><table className="w-full text-left">
            <thead>
              <tr className="bg-surface-50 text-gray-400 text-[10px] font-medium  ">
                <th className="px-6 py-4 rounded-l-2xl">Roll No.</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Attendance Status</th>
                <th className="px-6 py-4 text-right rounded-r-2xl">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {students.map((student) => (
                <tr key={student.id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                  <td className="px-6 py-5 font-mono font-medium text-brand-600 text-sm">{student.roll}</td>
                  <td className="px-6 py-5">
                    <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors   text-sm">{student.name}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                       <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${student.status === 'Present' ? 'bg-success text-white' : 'bg-surface-100 text-gray-400 hover:bg-success-light hover:text-success'}`}>
                         <CheckCircle size={14} /> P
                       </button>
                       <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${student.status === 'Absent' ? 'bg-danger text-white' : 'bg-surface-100 text-gray-400 hover:bg-danger-light hover:text-danger'}`}>
                         <XCircle size={14} /> A
                       </button>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-medium text-xs text-gray-400 hover:text-brand-600 underline" onClick={() => setIsModalOpen(true)}>Add Behavior Note</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>

        <div className="mt-12 flex justify-between items-center border-t border-surface-100 pt-8">
           <p className="text-xs font-medium text-gray-400">Digital Signature Required: <span className="text-brand-600">Dr. Sarah Smith</span></p>
           <Button className="h-14 px-12 shadow-premium">
              <Save size={18} /> Finalize Register
           </Button>
        </div>
      </div>

      <Modal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         title="Behavioral Note"
         description="Log a quick behavioral observation during class session."
         maxWidth="xl"
      >
         <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
            <div className="space-y-6">
               <Input label="Student Selection" placeholder="Type student name..." icon={User} required />
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Engagement Level</label>
                  <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                    <option>High (Actively Participating)</option>
                    <option>Moderate (Listening/Ready)</option>
                    <option>Low (Distracted/Unresponsive)</option>
                    <option>Commendable Action</option>
                    <option>Minor Disruption</option>
                  </select>
               </div>
               <Input label="Observation Note" placeholder="Quick comment (e.g. Led group discussion...)" icon={FileText} required />
            </div>

            <div className="flex justify-end gap-3 pt-4">
               <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Discard</Button>
               <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600">Save Note</Button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default Attendance;
