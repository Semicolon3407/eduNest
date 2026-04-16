import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { LifeBuoy, MessageSquare, Clock, Filter, ChevronRight } from 'lucide-react';

const tickets = [
  { id: '#TK-1082', org: 'Springfield Academy', issue: 'SSO Integration Failed', priority: 'High', status: 'Open', date: '21 mins ago' },
  { id: '#TK-1075', org: 'Lakeside College', issue: 'Monthly Invoice Discrepancy', priority: 'Medium', status: 'In Progress', date: '4 hours ago' },
  { id: '#TK-1064', org: 'Elite International', issue: 'New Branch Provisioning', priority: 'Low', status: 'Resolved', date: 'Yesterday' },
];

const Support: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Global Support Desk</h1>
          <p className="text-gray-500 mt-1">Manage technical support requests and service tickets from organization admins</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="danger" className="h-10 px-4 flex items-center justify-center font-medium">2 Critical unresolved</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-surface p-6 rounded-3xl border border-surface-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-xl flex items-center justify-center">
               <MessageSquare size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-gray-400   leading-none mb-1">Total Tickets</p>
               <h4 className="text-xl font-medium text-gray-900  ">1,284</h4>
            </div>
         </div>
         <div className="bg-surface p-6 rounded-3xl border border-surface-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-warning-light text-warning-dark rounded-xl flex items-center justify-center">
               <Clock size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-gray-400   leading-none mb-1">Avg. Response</p>
               <h4 className="text-xl font-medium text-gray-900  ">12 Mins</h4>
            </div>
         </div>
         <div className="bg-surface p-6 rounded-3xl border border-surface-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-success-light text-success-dark rounded-xl flex items-center justify-center">
               <LifeBuoy size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-gray-400   leading-none mb-1">SLA Compliance</p>
               <h4 className="text-xl font-medium text-gray-900  ">99.2%</h4>
            </div>
         </div>
      </div>

      <div className="bg-surface p-4 sm:p-8 rounded-[40px] shadow-soft border border-surface-200">
         <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="flex-1">
               <input type="text" placeholder="Search by ticket ID, organization or topic..." className="w-full h-14 bg-surface-50 border border-surface-200 rounded-2xl px-6 outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-sm" />
            </div>
            <Button variant="outline" className="h-14 px-8"><Filter size={18} /> Filters</Button>
         </div>

         <div className="space-y-4">
            {tickets.map(ticket => (
               <div key={ticket.id} className="p-6 rounded-[32px] border border-surface-100 bg-surface-50/50 hover:bg-white hover:border-brand-200 transition-all cursor-pointer group shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                     <div className="text-center shrink-0">
                        <p className="text-xs font-medium text-brand-600">{ticket.id}</p>
                        <p className="text-[10px] text-gray-400 font-medium  mt-1">{ticket.date}</p>
                     </div>
                     <div className="w-px h-10 bg-surface-200"></div>
                     <div>
                        <h4 className="font-medium text-gray-900   group-hover:text-brand-600 transition-colors ">{ticket.issue}</h4>
                        <p className="text-xs text-gray-400 font-medium">By {ticket.org}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <p className="text-[10px] font-medium text-gray-400  ">Priority</p>
                        <p className={`text-xs font-medium ${ticket.priority === 'High' ? 'text-danger' : 'text-gray-600'}`}>{ticket.priority}</p>
                     </div>
                     <Badge variant={ticket.status === 'Open' ? 'brand' : ticket.status === 'In Progress' ? 'warning' : 'success'}>
                        {ticket.status}
                     </Badge>
                     <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-600 transition-all translate-x-0 group-hover:translate-x-1" />
                  </div>
               </div>
            ))}
         </div>
         <Button variant="ghost" className="w-full mt-10 text-brand-600 underline text-sm">View Historical Resolution Logs</Button>
      </div>
    </div>
  );
};

export default Support;
