import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Clock, Calendar, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

const leaveRequests = [
  { id: 1, name: 'Alice Johnson', type: 'Sick Leave', duration: '2 Days', status: 'Pending', date: 'Oct 20, 2023' },
  { id: 2, name: 'Robert Fox', type: 'Annual Leave', duration: '5 Days', status: 'Approved', date: 'Oct 18, 2023' },
  { id: 3, name: 'Sarah Wilson', type: 'Personal', duration: '1 Day', status: 'Rejected', date: 'Oct 15, 2023' },
];

const AttendanceLeave: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Attendance & Leave</h1>
          <p className="text-gray-500 mt-1 font-medium">Monitor staff clock-ins and manage leave lifecycle</p>
        </div>
        <Button className="rounded-full shadow-premium"><Calendar size={18} /> Leave Policy</Button>
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
                        <td className="px-6 py-5 text-right flex items-center justify-end gap-2 pt-6">
                           <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'danger' : 'warning'}>
                              {req.status}
                           </Badge>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table></div>
         </div>
      </div>
    </div>
  );
};

export default AttendanceLeave;
