import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { LifeBuoy, MessageSquare, Clock, Filter, ChevronRight, Send, ShieldCheck } from 'lucide-react';
import Modal from '../../components/ui/Modal';

const tickets = [
  { id: '#TK-1082', org: 'Springfield Academy', issue: 'SSO Integration Failed', priority: 'High', status: 'Open', date: '21 mins ago' },
  { id: '#TK-1075', org: 'Lakeside College', issue: 'Monthly Invoice Discrepancy', priority: 'Medium', status: 'In Progress', date: '4 hours ago' },
  { id: '#TK-1064', org: 'Elite International', issue: 'New Branch Provisioning', priority: 'Low', status: 'Resolved', date: 'Yesterday' },
];

const Support: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<any>(null);

  const openReplyModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

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
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openReplyModal(ticket);
                        }}
                        className="p-3 bg-brand-50 text-brand-600 rounded-2xl hover:bg-brand-500 hover:text-white transition-all shadow-sm"
                      >
                        <Send size={18} />
                      </button>
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-600 transition-all translate-x-0 group-hover:translate-x-1" />
                   </div>
               </div>
            ))}
         </div>
         <Button variant="ghost" className="w-full mt-10 text-brand-600 underline text-sm">View Historical Resolution Logs</Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTicket ? `Reply to Ticket ${selectedTicket.id}` : 'Reply to Ticket'}
        description={selectedTicket ? `Responding to issue: ${selectedTicket.issue}` : ''}
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organization</p>
              <p className="text-sm font-bold text-slate-700 mt-1">{selectedTicket?.org}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</p>
              <p className="text-sm font-bold text-danger mt-1">{selectedTicket?.priority}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Internal Resolution Notes</label>
            <textarea 
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none"
              placeholder="Detail the steps taken to resolve this issue..."
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Reply to Organization</label>
            <textarea 
              className="w-full h-40 p-4 bg-white border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none shadow-sm"
              placeholder="Write your response to the administrator..."
              required
            ></textarea>
          </div>

          <div className="flex items-center gap-3 p-4 bg-success-light/30 rounded-2xl border border-success-light">
            <ShieldCheck size={20} className="text-success-dark" />
            <p className="text-xs font-medium text-success-dark">This response will be sent to all organization administrators via email and dashboard notification.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium">Send Response</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Support;
