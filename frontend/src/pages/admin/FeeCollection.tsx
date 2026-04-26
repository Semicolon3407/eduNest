import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { 
  Search, Filter, ChevronDown, Download, CheckCircle2, AlertCircle, 
  User, CreditCard, Calendar, ArrowUpRight, History, MoreVertical, X, Bell, Eye, Trash2
} from 'lucide-react';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';
import { adminService } from '../../services/adminService';
import { tenantService } from '../../services/tenantService';
import toast from 'react-hot-toast';

const FeeCollection: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [viewRecord, setViewRecord] = useState<any>(null);

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds so eSewa payments appear without manual refresh
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsRes, classesRes, branchesRes] = await Promise.all([
        adminService.getFeeRecords(),
        adminService.getClasses(),
        tenantService.getBranches()
      ]);
      
      if (recordsRes.success) setRecords(recordsRes.data);
      if (classesRes.success) setClasses(classesRes.data);
      if (branchesRes.success) setBranches(branchesRes.data);
    } catch (error) {
      console.error('Failed to fetch fee collection data:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const student = record.student || {};
    const matchesSearch = 
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || record.status === statusFilter;
    const matchesGrade = !selectedGrade || student.class?.name === selectedGrade;
    const matchesSection = !selectedSection || student.class?.section === selectedSection;
    // branch can be populated object or just an id string
    const branchId = student.branch?._id || student.branch;
    const matchesBranch = !selectedBranch || branchId === selectedBranch;

    return matchesSearch && matchesStatus && matchesGrade && matchesSection && matchesBranch;
  });

  const handleConfirmPayment = async (record: any) => {
    if (!window.confirm(`Mark Rs. ${record.amount} as Paid for ${record.student.firstName}?`)) return;
    
    const loadingToast = toast.loading('Updating record...');
    try {
      const res = await adminService.updateFeeRecordStatus(record._id, {
        status: 'Paid',
        method: 'Manual/Cash',
        transactionId: `MAN-${Date.now()}`,
        studentId: record.student?._id || record.student,
        amount: record.amount,
        description: record.description
      });
      if (res.success) {
        toast.success('Payment confirmed successfully', { id: loadingToast });
        fetchData();
      }
    } catch (error: any) {
      toast.error('Failed to update record', { id: loadingToast });
    }
  };

  const handleDeleteRecord = async (record: any) => {
    if (!window.confirm(`Remove this fee record for ${record.student?.firstName} ${record.student?.lastName}? This cannot be undone.`)) return;
    
    const loadingToast = toast.loading('Removing record...');
    try {
      const res = await adminService.deleteFeeRecord(record._id);
      if (res.success) {
        toast.success('Record removed successfully', { id: loadingToast });
        fetchData();
      }
    } catch (error: any) {
      toast.error('Failed to remove record', { id: loadingToast });
    }
  };

  const handleSendReminder = async (recordId: string) => {
    const loadingToast = toast.loading('Sending reminder email...');
    try {
      const res = await adminService.sendFeeReminder(recordId);
      if (res.success) {
        toast.success('Reminder sent successfully', { id: loadingToast });
      }
    } catch (error: any) {
      toast.error('Failed to send reminder', { id: loadingToast });
    }
  };

  const handleExport = () => {
    const headers = ['Student', 'Admission #', 'Grade', 'Section', 'Description', 'Amount', 'Status', 'Method', 'Ref ID', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(r => [
        `"${r.student?.firstName} ${r.student?.lastName}"`,
        `"${r.student?.admissionNumber}"`,
        `"${r.student?.class?.name}"`,
        `"${r.student?.class?.section}"`,
        `"${r.description}"`,
        r.amount,
        `"${r.status}"`,
        `"${r.method || '-'}"`,
        `"${r.transactionId || '-'}"`,
        `"${new Date(r.date).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Fee_Collection_Report_${new Date().toLocaleDateString()}.csv`);
    link.click();
    toast.success('Report exported to CSV');
  };

  const stats = {
    total: records.length,
    paid: records.filter(r => r.status === 'Paid').length,
    pending: records.filter(r => r.status === 'Pending').length,
    overdue: records.filter(r => r.status === 'Overdue').length,
    totalAmount: records.reduce((acc, r) => acc + (r.status === 'Paid' ? r.amount : 0), 0)
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Fee Collection</h1>
          <p className="text-gray-500 mt-1 font-medium">Track payments, manage pending dues, and verify transactions</p>
        </div>
        <Button variant="outline" className="rounded-2xl h-12 shadow-premium bg-white border-slate-200" onClick={handleExport}>
          <Download size={18} className="mr-2" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft transition-all hover:border-brand-100 group">
            <div className="flex items-center gap-3 text-brand-600 mb-4">
               <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <CreditCard size={20} />
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Collected</span>
            </div>
            <h3 className="text-2xl font-medium text-gray-900">Rs. {stats.totalAmount.toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-success mt-1 uppercase tracking-widest flex items-center gap-1">
              <ArrowUpRight size={12} /> Validated Payments
            </p>
         </div>

         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft transition-all hover:border-success-100 group">
            <div className="flex items-center gap-3 text-success mb-4">
               <div className="w-10 h-10 bg-success-light text-success-dark rounded-xl flex items-center justify-center group-hover:bg-success group-hover:text-white transition-all">
                  <CheckCircle2 size={20} />
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cleared Students</span>
            </div>
            <h3 className="text-2xl font-medium text-gray-900">{stats.paid}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Completed Receipts</p>
         </div>

         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft transition-all hover:border-warning-100 group">
            <div className="flex items-center gap-3 text-warning mb-4">
               <div className="w-10 h-10 bg-warning-light text-warning-dark rounded-xl flex items-center justify-center group-hover:bg-warning group-hover:text-white transition-all">
                  <History size={20} />
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Dues</span>
            </div>
            <h3 className="text-2xl font-medium text-gray-900">{stats.pending}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Awaiting Transaction</p>
         </div>

         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft transition-all hover:border-error-100 group">
            <div className="flex items-center gap-3 text-error mb-4">
               <div className="w-10 h-10 bg-error-light text-error rounded-xl flex items-center justify-center group-hover:bg-error group-hover:text-white transition-all">
                  <AlertCircle size={20} />
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overdue Accounts</span>
            </div>
            <h3 className="text-2xl font-medium text-gray-900">{stats.overdue}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Exceeded Deadline</p>
         </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[40px] shadow-soft border border-slate-200">
         <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-[2]">
              <Input 
                placeholder="Search by student name, admission #, or invoice..." 
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-2xl h-12 shadow-sm border-slate-200"
              />
            </div>
            <div className="flex flex-wrap gap-3">
               <div className="relative min-w-[140px]">
                 <select 
                   value={selectedBranch}
                   onChange={(e) => setSelectedBranch(e.target.value)}
                   className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl px-10 py-2 text-sm font-bold text-slate-600 outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer pr-10"
                 >
                   <option value="">All Branches</option>
                   {branches.map(b => (
                     <option key={b._id} value={b._id}>{b.name}</option>
                   ))}
                 </select>
                 <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
               </div>

               <div className="relative min-w-[140px]">
                 <select 
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                   className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl px-10 py-2 text-sm font-bold text-slate-600 outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer pr-10"
                 >
                   <option value="">All Status</option>
                   <option value="Paid">Paid / Cleared</option>
                   <option value="Pending">Pending</option>
                   <option value="Overdue">Overdue</option>
                 </select>
                 <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
               </div>

               <div className="relative min-w-[140px]">
                 <select 
                   value={selectedGrade}
                   onChange={(e) => {
                      setSelectedGrade(e.target.value);
                      setSelectedSection('');
                   }}
                   className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl px-10 py-2 text-sm font-bold text-slate-600 outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer pr-10"
                 >
                   <option value="">All Grades</option>
                   {[...new Set(classes.map(c => c.name))].sort().map(grade => (
                     <option key={grade} value={grade}>{grade}</option>
                   ))}
                 </select>
                 <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
               </div>

               <div className="relative min-w-[140px]">
                 <select 
                   value={selectedSection}
                   onChange={(e) => setSelectedSection(e.target.value)}
                   className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl px-10 py-2 text-sm font-bold text-slate-600 outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer pr-10"
                   disabled={!selectedGrade}
                 >
                   <option value="">All Sections</option>
                   {classes
                     .filter(c => c.name === selectedGrade)
                     .map(c => (
                       <option key={c._id} value={c.section}>{c.section}</option>
                     ))
                   }
                 </select>
                 <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
               </div>

               {(searchTerm || statusFilter || selectedGrade || selectedSection || selectedBranch) && (
                 <Button 
                   variant="outline" 
                   onClick={() => { 
                      setSearchTerm(''); 
                      setStatusFilter(''); 
                      setSelectedGrade(''); 
                      setSelectedSection(''); 
                      setSelectedBranch(''); 
                   }}
                   className="h-12 rounded-2xl text-slate-500 hover:text-error border-slate-200"
                 >
                   <X size={18} /> Clear
                 </Button>
               )}
            </div>
         </div>

         <div className="overflow-x-auto">
            <div className="flex items-center justify-between mb-6 px-2">
               <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                  Transaction Log
                  <Badge variant="neutral" className="bg-slate-100 text-slate-500 border-none">{filteredRecords.length}</Badge>
               </h2>
               <div className="flex items-center gap-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Real-time Synchronization</p>
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
               </div>
            </div>
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-4">Student & Details</th>
                  <th className="px-6 py-4">Description / Invoice</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-8 py-8 h-20 bg-slate-50/50"></td>
                    </tr>
                  ))
                ) : filteredRecords.map(record => (
                  <tr key={record._id} className="group hover:bg-slate-50/50 transition-all font-sans">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-all">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                            {record.student?.firstName} {record.student?.lastName}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {record.student?.admissionNumber} • {record.student?.class?.name} ({record.student?.class?.section})
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-gray-700">{record.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Ref: {record.transactionId || '---'}
                        </p>
                        {record.method && record.method !== '-' && (
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md ${record.method === 'eSewa' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {record.method}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-900">Rs. {record.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={record.status === 'Paid' ? 'success' : (record.status === 'Overdue' ? 'danger' : 'warning')} className="uppercase tracking-widest text-[9px] font-bold">
                        {record.status === 'Paid' ? 'Cleared' : record.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-300" />
                          {new Date(record.date).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <Dropdown 
                         trigger={
                           <button className="p-2 rounded-xl hover:bg-white hover:shadow-soft text-slate-400 hover:text-brand-600 transition-all">
                             <MoreVertical size={20} />
                           </button>
                         }
                       >
                         <DropdownItem icon={Eye} onClick={() => setViewRecord(record)}>View Details</DropdownItem>
                         {record.status !== 'Paid' && (
                           <>
                             <DropdownItem icon={Bell} onClick={() => handleSendReminder(record._id)}>Send Reminder</DropdownItem>
                             <DropdownItem icon={CheckCircle2} onClick={() => handleConfirmPayment(record)}>Confirm Payment</DropdownItem>
                           </>
                         )}
                         <DropdownItem icon={Trash2} variant="danger" onClick={() => handleDeleteRecord(record)}>Remove Record</DropdownItem>
                       </Dropdown>
                    </td>
                  </tr>
                ))}
                {!loading && filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-3 italic">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                            <History size={32} />
                         </div>
                         <p className="text-sm font-medium">No records found matching your current filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>

      {/* View Details Modal */}
      {viewRecord && (
        <Modal
          isOpen={!!viewRecord}
          onClose={() => setViewRecord(null)}
          title="Transaction Details"
          description="Full breakdown of the selected fee record."
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Student info */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {viewRecord.student?.firstName} {viewRecord.student?.lastName}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {viewRecord.student?.admissionNumber} • {viewRecord.student?.class?.name} ({viewRecord.student?.class?.section})
                </p>
              </div>
              <div className="ml-auto">
                <Badge
                  variant={viewRecord.status === 'Paid' ? 'success' : (viewRecord.status === 'Overdue' ? 'danger' : 'warning')}
                  className="uppercase tracking-widest text-[9px] font-bold"
                >
                  {viewRecord.status === 'Paid' ? 'Cleared' : viewRecord.status}
                </Badge>
              </div>
            </div>

            {/* Fee details grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</p>
                <p className="text-sm font-medium text-gray-800">{viewRecord.description}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</p>
                <p className="text-sm font-bold text-gray-900">Rs. {viewRecord.amount?.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</p>
                <p className="text-sm font-medium text-gray-800">{viewRecord.method || '—'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                <p className="text-sm font-medium text-gray-800">{new Date(viewRecord.date).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction / Ref ID</p>
                <p className="text-sm font-mono text-gray-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 break-all">
                  {viewRecord.transactionId || '—'}
                </p>
              </div>
              {viewRecord.student?.branch?.name && (
                <div className="col-span-2 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch</p>
                  <p className="text-sm font-medium text-gray-800">{viewRecord.student.branch.name}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setViewRecord(null)} className="rounded-xl h-11">
                Close
              </Button>
              {viewRecord.status !== 'Paid' && (
                <Button
                  onClick={() => { setViewRecord(null); handleConfirmPayment(viewRecord); }}
                  className="rounded-xl h-11 px-6"
                >
                  <CheckCircle2 size={16} className="mr-2" /> Confirm Payment
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FeeCollection;
