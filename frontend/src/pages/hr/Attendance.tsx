import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Clock, Calendar, CheckCircle2, XCircle, Search, Filter, Plus, User, FileText, MoreVertical } from 'lucide-react';

const leaveRequests = [
  { id: 1, name: 'Alice Johnson', type: 'Sick Leave', duration: '2 Days', status: 'Pending', date: 'Oct 20, 2023' },
  { id: 2, name: 'Robert Fox', type: 'Annual Leave', duration: '5 Days', status: 'Approved', date: 'Oct 18, 2023' },
  { id: 3, name: 'Sarah Wilson', type: 'Personal', duration: '1 Day', status: 'Rejected', date: 'Oct 15, 2023' },
];

const AttendanceLeave: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Attendance & Leave</h1>
          <p className="text-gray-500 mt-1 font-medium">Monitor staff clock-ins and manage leave lifecycle</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
           <Button variant="outline" className="rounded-xl h-11 flex-1 sm:flex-none whitespace-nowrap"><Calendar size={18} /> Leave Policy</Button>
           <Button onClick={() => setIsModalOpen(true)} className="rounded-xl h-11 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex-1 sm:flex-none whitespace-nowrap"><Plus size={18} /> Add Leave Request</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center">
               <Clock size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-slate-400   leading-none mb-1">On Time Today</p>
               <h4 className="text-xl font-medium text-gray-900  ">92%</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-success-light text-success-dark rounded-2xl flex items-center justify-center">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-slate-400   leading-none mb-1">Present Staff</p>
               <h4 className="text-xl font-medium text-gray-900  ">124</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-danger-light text-danger-dark rounded-2xl flex items-center justify-center">
               <XCircle size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-slate-400   leading-none mb-1">On Leave</p>
               <h4 className="text-xl font-medium text-gray-900  ">8</h4>
            </div>
         </div>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-medium text-gray-900  ">Recent Leave Requests</h2>
            <div className="flex gap-2">
               <Button size="sm" variant="outline"><Search size={16}/></Button>
               <Button size="sm" variant="outline"><Filter size={16}/></Button>
            </div>
         </div>

         <div className="overflow-x-auto">
             <div className="overflow-x-auto"><table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-medium   border-b border-slate-100">
                     <th className="px-6 py-4">Staff Member</th>
                     <th className="px-6 py-4">Type</th>
                     <th className="px-6 py-4">Duration</th>
                     <th className="px-6 py-4">Request Date</th>
                     <th className="px-6 py-4 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {leaveRequests.map(req => (
                     <tr key={req.id} className="group hover:bg-slate-50/50 transition-all font-sans">
                        <td className="px-6 py-5">
                           <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors   text-sm">{req.name}</p>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600  ">{req.type}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-400  ">{req.duration}</td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-500  ">{req.date}</td>
                        <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                           <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'danger' : 'warning'}>
                              {req.status}
                           </Badge>
                           <button className="p-2 text-gray-400 hover:bg-surface-100 rounded-lg transition-colors">
                              <MoreVertical size={18} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table></div>
         </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Leave Request"
        description="Log a leave application for a staff member."
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Staff Member" placeholder="Search staff..." icon={User} required />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Leave Category</label>
                <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Personal / Casual</option>
                  <option>Maternity / Paternity</option>
                  <option>Unpaid Leave</option>
                </select>
            </div>
            <Input label="Duration (Days)" placeholder="e.g. 3" icon={Clock} required type="number" />
            <Input label="Start Date" icon={Calendar} required type="date" />
            <Input label="Return Date" icon={Calendar} required type="date" />
            <div className="md:col-span-2">
              <Input label="Reason for Leave" placeholder="Brief explanation..." icon={FileText} required />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Discard</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AttendanceLeave;
