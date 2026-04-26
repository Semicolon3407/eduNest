import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { LifeBuoy, Plus, Clock, FileText, ChevronRight } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { tenantService } from '../../services/tenantService';
import toast from 'react-hot-toast';

const OrganizationSupport: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  
  // Create Form State
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await tenantService.getTickets();
      if (res.success) {
        setTickets(res.data);
      }
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openViewModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await tenantService.createTicket({ issue, description, priority });
      if (res.success) {
        toast.success('Problem ticket raised successfully');
        setIsModalOpen(false);
        setIssue('');
        setDescription('');
        setPriority('Medium');
        fetchTickets();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Support & Problem Tickets</h1>
          <p className="text-gray-500 mt-1">Raise issues, track ticket status, and communicate with global support</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsModalOpen(true)} className="rounded-xl shadow-premium h-12 px-6">
            <Plus size={20} className="mr-2" /> Raise Problem Ticket
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-surface p-6 rounded-3xl border border-surface-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-xl flex items-center justify-center">
               <FileText size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-gray-400 leading-none mb-1">Total Tickets</p>
               <h4 className="text-xl font-medium text-gray-900">{tickets.length}</h4>
            </div>
         </div>
         <div className="bg-surface p-6 rounded-3xl border border-surface-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-warning-light text-warning-dark rounded-xl flex items-center justify-center">
               <Clock size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-gray-400 leading-none mb-1">Open Issues</p>
               <h4 className="text-xl font-medium text-gray-900">{openTicketsCount}</h4>
            </div>
         </div>
         <div className="bg-surface p-6 rounded-3xl border border-surface-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-success-light text-success-dark rounded-xl flex items-center justify-center">
               <LifeBuoy size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-gray-400 leading-none mb-1">Support Status</p>
               <h4 className="text-xl font-medium text-gray-900">Active</h4>
            </div>
         </div>
      </div>

      <div className="bg-surface p-4 sm:p-8 rounded-[40px] shadow-soft border border-surface-200">
         {loading ? (
           <div className="flex justify-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
           </div>
         ) : tickets.length === 0 ? (
           <div className="text-center py-10">
             <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-500">
               <LifeBuoy size={32} />
             </div>
             <h3 className="text-lg font-bold text-gray-900">No Tickets Yet</h3>
             <p className="text-gray-500 mt-2">You haven't raised any problem tickets.</p>
           </div>
         ) : (
           <div className="space-y-4">
              {tickets.map((ticket) => (
                 <div 
                   key={ticket._id} 
                   onClick={() => openViewModal(ticket)}
                   className="p-6 rounded-[32px] border border-surface-100 bg-surface-50/50 hover:bg-white hover:border-brand-200 transition-all cursor-pointer group shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                 >
                    <div className="flex items-center gap-5">
                       <div className="text-center shrink-0">
                          <p className="text-xs font-medium text-brand-600">#TK-{ticket._id.toString().slice(-4).toUpperCase()}</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-1">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                       </div>
                       <div className="w-px h-10 bg-surface-200"></div>
                       <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors ">{ticket.issue}</h4>
                          <p className="text-xs text-gray-400 font-medium line-clamp-1 max-w-md">{ticket.description}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="text-[10px] font-medium text-gray-400  ">Priority</p>
                          <p className={`text-xs font-medium ${ticket.priority === 'High' || ticket.priority === 'Critical' ? 'text-danger' : 'text-gray-600'}`}>{ticket.priority}</p>
                       </div>
                        <Badge variant={ticket.status === 'Open' ? 'brand' : ticket.status === 'In Progress' ? 'warning' : ticket.status === 'Resolved' ? 'success' : 'neutral'}>
                          {ticket.status}
                        </Badge>
                        <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-600 transition-all translate-x-0 group-hover:translate-x-1" />
                     </div>
                 </div>
              ))}
           </div>
         )}
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Raise Problem Ticket"
        description="Describe your issue and our global support team will address it."
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={handleCreateTicket}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Issue Topic</label>
            <input 
              type="text"
              required
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full h-12 px-4 bg-surface-50 border border-surface-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
              placeholder="E.g. Cannot access student records"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Priority Level</label>
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full h-12 px-4 bg-surface-50 border border-surface-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
            >
              <option value="Low">Low - Minor issue, no urgency</option>
              <option value="Medium">Medium - Standard issue</option>
              <option value="High">High - Important function impaired</option>
              <option value="Critical">Critical - System down / severe issue</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Description</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 p-4 bg-surface-50 border border-surface-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none"
              placeholder="Provide detailed steps to reproduce the issue..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 shadow-premium">
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Ticket Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Ticket #TK-${selectedTicket?._id.slice(-4).toUpperCase()}`}
        description="Ticket Details and Support Responses"
        maxWidth="xl"
      >
        {selectedTicket && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                <div className="mt-1">
                  <Badge variant={selectedTicket.status === 'Open' ? 'brand' : selectedTicket.status === 'In Progress' ? 'warning' : 'success'}>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</p>
                <p className={`text-sm font-bold mt-1 ${selectedTicket.priority === 'High' || selectedTicket.priority === 'Critical' ? 'text-danger' : 'text-gray-700'}`}>
                  {selectedTicket.priority}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-1">Issue</p>
              <h3 className="text-lg font-medium text-gray-900">{selectedTicket.issue}</h3>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-1">Description</p>
              <div className="p-4 bg-surface-50 rounded-2xl text-sm text-gray-700 whitespace-pre-wrap border border-surface-100">
                {selectedTicket.description}
              </div>
            </div>

            {selectedTicket.replyMessage && (
              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                    <LifeBuoy size={16} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Support Team Response</h4>
                </div>
                <div className="p-5 bg-brand-50 border border-brand-100 rounded-2xl text-sm text-brand-900 whitespace-pre-wrap">
                  {selectedTicket.replyMessage}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button onClick={() => setIsViewModalOpen(false)} className="rounded-xl h-12 px-8">Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrganizationSupport;
