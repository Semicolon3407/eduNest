import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { 
  CreditCard, Download, Send, Plus, 
  DollarSign, Briefcase, Calculator, ChevronDown,
  ShieldCheck, Percent, Search, Filter, GitBranch, Loader2, MoreVertical, User,
  Calendar, Clock3
} from 'lucide-react';
import { hrService } from '../../services/hrService';
import toast from 'react-hot-toast';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';

const Payroll: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedRole, setSelectedRole] = useState('All Designations');
  
  const [isLoading, setIsLoading] = useState(true);
  const [payrollRecords, setPayrollRecords] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [filterMonth, setFilterMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  // Form State for Setup
  const [modalBranch, setModalBranch] = useState('All Branches');
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffResults, setShowStaffResults] = useState(false);
  const [setupForm, setSetupForm] = useState({
    staffId: '',
    baseSalary: '',
    bonuses: '',
    deductions: '',
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString()
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [payrollRes, staffRes, branchRes] = await Promise.all([
        hrService.getPayroll(filterMonth, filterYear),
        hrService.getStaff(),
        hrService.getBranches()
      ]);
      if (payrollRes.success) setPayrollRecords(payrollRes.data);
      if (staffRes.success) setStaffList(staffRes.data);
      if (branchRes.success) setBranches(branchRes.data);
    } catch (error) {
      toast.error('Failed to sync financial ledger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterMonth, filterYear]);

  const handleGeneratePayroll = async () => {
    try {
      setIsProcessing(true);
      const month = new Date().toLocaleString('default', { month: 'long' });
      const year = new Date().getFullYear();
      
      const response = await hrService.runPayroll(month, year);
      if (response.success) {
        toast.success(`Payroll ledger generated for ${month} ${year}`);
        fetchData();
      }
    } catch (error) {
      toast.error('Ledger generation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisburseAll = async () => {
    if (!window.confirm('Are you sure you want to disburse salaries to ALL employees for this cycle?')) return;
    try {
      setIsProcessing(true);
      const month = new Date().toLocaleString('default', { month: 'long' });
      const year = new Date().getFullYear();
      const response = await hrService.disburseAll(month, year);
      if (response.success) {
        toast.success(`Salary disbursement successful for ${response.modifiedCount || payrollRecords.filter(p => p.status === 'Pending').length} employees`);
        fetchData();
      }
    } catch (error) {
      toast.error('Batch disbursement failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisburseIndividual = async (id: string) => {
    try {
      const response = await hrService.disburseIndividual(id);
      if (response.success) {
        toast.success('Salary disbursed successfully');
        fetchData();
      }
    } catch (error) {
      toast.error('Manual distribution failed');
    }
  };

  const handleSetupPayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      const response = await hrService.setupPayroll({
        ...setupForm,
        baseSalary: Number(setupForm.baseSalary),
        bonuses: Number(setupForm.bonuses),
        deductions: Number(setupForm.deductions),
        year: Number(setupForm.year)
      });
      if (response.success) {
        toast.success('Salary configuration updated');
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update ledger');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPayroll = payrollRecords.filter(item => {
    const fullName = `${item.staff?.firstName} ${item.staff?.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.staff?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'All Branches' || item.staff?.branch?.name === selectedBranch;
    const matchesRole = selectedRole === 'All Designations' || item.staff?.designation === selectedRole;
    return matchesSearch && matchesBranch && matchesRole;
  });

  const downloadPayslip = (item: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Payslip - ${item.staff?.firstName} ${item.staff?.lastName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Outfit', sans-serif; padding: 40px; color: #1e293b; background: #fff; }
            .container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #6366f1; padding-bottom: 30px; margin-bottom: 40px; }
            .logo-area h1 { color: #6366f1; margin: 0; font-size: 32px; letter-spacing: -1px; }
            .logo-area p { color: #64748b; margin: 5px 0 0 0; font-weight: 500; }
            .period-badge { background: #f1f5f9; padding: 10px 20px; border-radius: 12px; font-weight: 600; color: #475569; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 50px; }
            .info-box { background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; }
            .info-box b { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 5px; }
            .info-box span { font-size: 16px; font-weight: 600; color: #1e293b; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .table th { text-align: left; padding: 15px; background: #f1f5f9; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 8px 0 0 8px; }
            .table th:last-child { border-radius: 0 8px 8px 0; text-align: right; }
            .table td { padding: 20px 15px; border-bottom: 1px solid #f1f5f9; font-weight: 500; }
            .table td:last-child { text-align: right; font-weight: 700; }
            .total-row td { background: #6366f1; color: white !important; font-size: 1.25rem; padding: 25px 20px; }
            .total-row td:first-child { border-radius: 16px 0 0 16px; }
            .total-row td:last-child { border-radius: 0 16px 16px 0; text-align: right; }
            .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 30px; }
            @media print {
              body { padding: 0; }
              .container { border: none; box-shadow: none; max-width: 100%; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-area">
                <h1>eduNest</h1>
                <p>Official Salary Advice</p>
              </div>
              <div class="period-badge">
                ${item.month} ${item.year}
              </div>
            </div>
            
            <div class="info-grid">
              <div class="info-box"><b>Employee Name</b><span>${item.staff?.firstName} ${item.staff?.lastName}</span></div>
              <div class="info-box"><b>Employee ID</b><span>${item.staff?.employeeId}</span></div>
              <div class="info-box"><b>Current Role</b><span>${item.staff?.designation || 'Staff Member'}</span></div>
              <div class="info-box"><b>Branch/Campus</b><span>${item.staff?.branch?.name || 'Main Campus'}</span></div>
            </div>

            <table class="table">
              <thead>
                <tr><th>Description</th><th>Amount (Rs.)</th></tr>
              </thead>
              <tbody>
                <tr><td>Monthly Base Salary</td><td>${item.baseSalary?.toLocaleString()}</td></tr>
                <tr><td>Periodic Performance Bonuses</td><td style="color: #10b981;">+ ${item.bonuses?.toLocaleString()}</td></tr>
                <tr><td>Statutory Taxes & Deductions</td><td style="color: #ef4444;">- ${item.deductions?.toLocaleString()}</td></tr>
                <tr class="total-row">
                  <td>Net Payout Amount</td>
                  <td>Rs. ${item.netPay?.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              <p>This document is digitally verified. No physical signature is required.</p>
              <p>Generated on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString()}</p>
              <p>© ${new Date().getFullYear()} eduNest Academic Solutions</p>
            </div>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const totalPayout = payrollRecords.reduce((sum, item) => sum + (item.netPay || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-brand-500" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Financial Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Payroll Engine</h1>
          <p className="text-gray-500 mt-1 font-medium">Process salaries, handle statutory deductions and generate payslips</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
           <Button onClick={handleGeneratePayroll} variant="outline" className="rounded-xl h-11 flex-1 sm:flex-none" disabled={isProcessing}>
             {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Calculator size={18} />} Generate Ledger
           </Button>
           <Button onClick={() => setIsModalOpen(true)} className="rounded-xl h-11 bg-brand-500 text-white hover:bg-brand-600 shadow-premium flex-1 sm:flex-none whitespace-nowrap"><Plus size={18} /> Add Adjustment</Button>
           <Button 
              onClick={handleDisburseAll}
              disabled={isProcessing || payrollRecords.every(p => p.status === 'Processed')}
              className="rounded-xl h-11 bg-brand-500 text-white hover:bg-brand-600 shadow-premium flex-1 sm:flex-none whitespace-nowrap"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />} 
              Disburse Salaries
            </Button>
        </div>
      </div>

      <div className="bg-brand-500 text-white rounded-[40px] p-4 sm:p-8 lg:p-12 shadow-premium relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 sm:p-8">
          <div className="relative z-10 max-w-lg">
            <Badge variant="neutral" className="bg-white/10 text-white border-white/20 mb-4 tracking-[0.2em] ">Period: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</Badge>
            <h2 className="text-3xl sm:text-4xl font-medium ">Total Payout: Rs. {totalPayout.toLocaleString()}.00</h2>
            <p className="mt-2 text-brand-200 font-medium">{payrollRecords.length} employees identified for this cycle. Payroll is compiled from active staff records.</p>
         </div>
         <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
               <p className="text-[10px] uppercase font-bold tracking-widest text-brand-300 ">Gross Payout</p>
               <h4 className="text-xl font-medium mt-1">Rs. {totalPayout.toLocaleString()}</h4>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
               <p className="text-[10px] uppercase font-bold tracking-widest text-brand-300 ">Cycle Status</p>
               <h4 className="text-xl font-medium mt-1">{payrollRecords.some(p => p.status === 'Processed') ? 'Compiled' : 'Estimated'}</h4>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200 overflow-visible">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
           <h3 className="text-xl font-medium text-gray-900 shrink-0">Detailed Payslip Preview</h3>
           
            <div className="flex flex-col gap-4 flex-grow max-w-5xl">
               {/* Global Search */}
               <div className="relative">
                  <Input 
                    placeholder="Search by candidate name or Institutional ID..." 
                    icon={Search} 
                    className="h-12 rounded-2xl bg-slate-50/50 border-slate-200/60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               
               {/* Multi-Dimensional Filters */}
               <div className="flex flex-wrap items-center gap-3 justify-end">
                  {/* Period Group */}
                  <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                    <div className="relative min-w-[130px]">
                      <select 
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="w-full h-10 pl-9 pr-8 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-tight outline-none focus:border-brand-500 transition-all appearance-none cursor-pointer"
                      >
                        <option>All Months</option>
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                      <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500" />
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative min-w-[100px]">
                      <select 
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="w-full h-10 pl-9 pr-8 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-tight outline-none focus:border-brand-500 transition-all appearance-none cursor-pointer"
                      >
                        <option>All Years</option>
                        {[2023, 2024, 2025, 2026, 2027].map(y => (
                          <option key={y}>{y}</option>
                        ))}
                      </select>
                      <Clock3 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500" />
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Institutional Group */}
                  <div className="flex items-center gap-2">
                    <div className="relative min-w-[150px]">
                       <select 
                         value={selectedBranch}
                         onChange={(e) => setSelectedBranch(e.target.value)}
                         className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-bold uppercase tracking-tight outline-none focus:bg-white focus:border-brand-500 transition-all appearance-none cursor-pointer font-sans"
                       >
                         <option>All Branches</option>
                         {branches.map(b => (
                           <option key={b._id} value={b.name}>{b.name}</option>
                         ))}
                       </select>
                       <GitBranch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
                       <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative min-w-[160px]">
                       <select 
                         value={selectedRole}
                         onChange={(e) => setSelectedRole(e.target.value)}
                         className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-bold uppercase tracking-tight outline-none focus:bg-white focus:border-brand-500 transition-all appearance-none cursor-pointer font-sans"
                       >
                         <option>All Designations</option>
                         <option>Tutor</option>
                         <option>Administrator</option>
                         <option>HR Manager</option>
                         <option>Librarian</option>
                       </select>
                       <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
                       <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <Button 
                      variant="outline" 
                      className="rounded-2xl h-11 w-11 p-0 shrink-0 border-slate-200 hover:bg-brand-50 hover:text-brand-600 transition-all shadow-sm" 
                      onClick={() => { 
                        setFilterMonth('All Months'); 
                        setFilterYear('All Years'); 
                        setSelectedBranch('All Branches'); 
                        setSelectedRole('All Designations'); 
                        setSearchTerm(''); 
                      }}
                    >
                       <Filter size={18} className="mx-auto" />
                    </Button>
                  </div>
               </div>
            </div>
        </div>

        <div className="w-full">
           <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Basic Salary</th>
                <th className="px-6 py-4">Periodic Bonus</th>
                <th className="px-6 py-4">Tax Deduction</th>
                <th className="px-6 py-4">Net Payout</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
             <tbody className="divide-y divide-slate-100">
              {filteredPayroll.map((item) => (
                <tr key={item._id} className="group hover:bg-brand-50/20 transition-all font-sans">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-brand-600 font-bold shadow-sm group-hover:scale-110 transition-all">
                          {item.staff?.firstName?.charAt(0)}
                       </div>
                       <div>
                          <p className="font-medium text-sm text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{item.staff?.firstName} {item.staff?.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.staff?.employeeId}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-2 text-slate-600">
                        <GitBranch size={14} className="text-brand-400" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{item.staff?.branch?.name || 'Main'}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">Rs. {item.baseSalary?.toLocaleString()}</td>
                  <td className="px-6 py-5 text-sm font-bold text-success-dark">
                    {item.bonuses === 0 ? <span className="opacity-30">N/A</span> : `Rs. ${item.bonuses}`}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-danger-dark">Rs. {item.deductions?.toLocaleString()}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                      <span className="bg-brand-50 text-brand-600 px-4 py-2 rounded-xl font-bold text-xs border border-brand-100/50 inline-block whitespace-nowrap">
                         Rs. {item.netPay?.toLocaleString()}
                      </span>
                   </td>
                  <td className="px-6 py-5">
                    {item.status === 'Processed' ? (
                      <Badge variant="success" className="bg-success-50 text-success-600 border-success-100 uppercase tracking-widest text-[10px]">Paid</Badge>
                    ) : (
                      <Badge variant="warning" className="bg-warning-50 text-warning-600 border-warning-100 uppercase tracking-widest text-[10px]">Pending</Badge>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Dropdown 
                      trigger={
                        <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all border border-transparent hover:border-brand-100">
                          <MoreVertical size={20} />
                        </button>
                      }
                      align="right"
                    >
                       {item.status === 'Pending' && (
                         <DropdownItem 
                           icon={DollarSign} 
                           onClick={() => handleDisburseIndividual(item._id)}
                         >
                           Pay Now
                         </DropdownItem>
                       )}
                       <DropdownItem icon={Calculator}>
                         Edit Details
                       </DropdownItem>
                       <DropdownItem 
                         icon={Download} 
                         onClick={() => downloadPayslip(item)}
                       >
                         Download Payslip
                       </DropdownItem>
                       <DropdownItem 
                         icon={Send}
                         onClick={() => handleDisburseIndividual(item._id)}
                       >
                         Resend Advice
                       </DropdownItem>
                    </Dropdown>
                  </td>
                </tr>
              ))}
              {filteredPayroll.length === 0 && (
                <tr>
                   <td colSpan={7} className="px-6 py-20 text-center text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                      No payroll records identified for this criteria
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Institutional Salary Setup"
        description="Configure basic salary, periodic bonuses, and statutory tax deductions for faculty members."
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={handleSetupPayroll}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 focus-within:z-10 group font-sans">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Branch Selection</label>
                <div className="relative">
                  <select 
                    value={modalBranch}
                    onChange={(e) => setModalBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-[13px] px-4 text-sm font-bold outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer"
                  >
                    <option>All Branches</option>
                    {branches.map(b => (
                      <option key={b._id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <GitBranch size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="space-y-1.5 focus-within:z-10 group font-sans relative">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Staff Selection</label>
                <div className="relative">
                  <Input 
                    placeholder="Type to search staff Member..." 
                    icon={User} 
                    required 
                    value={staffSearch}
                    onFocus={() => setShowStaffResults(true)}
                    onChange={(e) => {
                      setStaffSearch(e.target.value);
                      setShowStaffResults(true);
                    }}
                  />
                  {showStaffResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {staffList
                        .filter(s => modalBranch === 'All Branches' || s.branch?.name === modalBranch)
                        .filter(s => {
                          const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
                          return fullName.includes(staffSearch.toLowerCase()) || s.employeeId.toLowerCase().includes(staffSearch.toLowerCase());
                        })
                        .map(s => (
                          <div 
                            key={s._id}
                            onClick={() => {
                              setStaffSearch(`${s.firstName} ${s.lastName} (${s.employeeId})`);
                              setSetupForm({
                                ...setupForm, 
                                staffId: s._id,
                                baseSalary: s.salary?.toString() || ''
                              });
                              setShowStaffResults(false);
                            }}
                            className="p-4 hover:bg-brand-50 cursor-pointer border-b border-slate-50 last:border-none group transition-all"
                          >
                            <p className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{s.firstName} {s.lastName}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 group-hover:text-brand-400">{s.employeeId} • {s.branch?.name || 'Main'}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
            </div>

            <Input 
              label="Basic Salary (Rs.)" 
              placeholder="e.g. 4500.00" 
              icon={DollarSign} 
              required 
              type="number" 
              value={setupForm.baseSalary}
              onChange={(e) => setSetupForm({...setupForm, baseSalary: e.target.value})}
            />
            <Input 
              label="Performance Bonus (Rs.)" 
              placeholder="e.g. 500.00" 
              icon={Plus} 
              required 
              type="number" 
              value={setupForm.bonuses}
              onChange={(e) => setSetupForm({...setupForm, bonuses: e.target.value})}
            />
            <Input 
              label="Tax Deduction (Rs.)" 
              placeholder="e.g. 450.00" 
              icon={Percent} 
              required 
              type="number" 
              value={setupForm.deductions}
              onChange={(e) => setSetupForm({...setupForm, deductions: e.target.value})}
            />
            
            <div className="space-y-1.5 group font-sans">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Disbursement Cycle</label>
                <div className="relative">
                  <select 
                    value={setupForm.month}
                    onChange={(e) => setSetupForm({...setupForm, month: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-[13px] px-4 text-sm font-bold outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer"
                  >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="md:col-span-2">
              <Input label="Adjustment Remarks" placeholder="Reason for salary change or bonus..." icon={Briefcase} required />
            </div>
          </div>

          <div className="bg-brand-50/50 p-6 rounded-[32px] border border-brand-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
               <ShieldCheck size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-brand-600 leading-tight uppercase tracking-tight">Financial Audit Lock</p>
               <p className="text-[10px] text-brand-700/70 mt-1 leading-relaxed italic uppercase font-medium tracking-tight">Changes to salary components require institutional audit clearance. This update will be logged for the quarterly financial review.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6 font-sans font-bold text-xs uppercase tracking-widest">Discard</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-widest">
               <ShieldCheck size={18} /> Update Ledger
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payroll;
