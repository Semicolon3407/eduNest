import { History, CreditCard, ArrowRight, CheckCircle2, Search } from 'lucide-react';

export function Payroll() {
  const staffPayroll = [
    { name: 'Prof. Miller', role: 'Mathematics', salary: '$5,200', deductions: '$450', net: '$4,750', status: 'Generated' },
    { name: 'Dr. Stark', role: 'Physics', salary: '$6,000', deductions: '$600', net: '$5,400', status: 'Pending' },
    { name: 'Ms. Croft', role: 'History', salary: '$4,800', deductions: '$400', net: '$4,400', status: 'Generated' },
    { name: 'Mr. Wayne', role: 'Night Watchman', salary: '$3,500', deductions: '$250', net: '$3,250', status: 'Paid' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="mt-1 text-muted-foreground ">Generate slips, handle tax deductions, and automate payments.</p>
        </div>
        <div className="flex gap-4">
             <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-bold hover:bg-muted transition-all">
                <History size={18} /> History
             </button>
             <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95">
                <CreditCard size={18} /> Bulk Generate
             </button>
        </div>
      </div>

      <div className="rounded-3xl border bg-background p-8 shadow-sm">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Cycle</span>
                    <span className="text-xl font-black  text-primary-900 underline decoration-primary-200 underline-offset-4 tracking-tighter">October 2025</span>
                </div>
                <div className="h-10 w-px bg-muted"></div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Status</span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-yellow-600">
                        <span className="h-2 w-2 rounded-full bg-yellow-600 animate-pulse"></span> Draft Mode
                    </span>
                </div>
            </div>
            <div className="flex-1 max-w-sm relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search staff member..." className="w-full rounded-full border bg-muted/20 py-2.5 pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" />
            </div>
         </div>

         <div className="overflow-x-auto overflow-visible">
            <table className="w-full text-left">
                 <thead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-dashed">
                    <tr>
                        <th className="pb-4 min-w-[200px]">Staff Member</th>
                        <th className="pb-4 min-w-[120px]">Salary (Gross)</th>
                        <th className="pb-4 min-w-[120px]">Deductions</th>
                        <th className="pb-4 min-w-[120px]">Net Payable</th>
                        <th className="pb-4 min-w-[100px] text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dashed">
                    {staffPayroll.map((s, i) => (
                        <tr key={i} className="group hover:bg-primary-50/30 transition-colors">
                            <td className="py-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-muted text-muted-foreground font-bold group-hover:bg-primary-600 group-hover:text-white transition-all">
                                        {s.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-extrabold tracking-tight underline  decoration-transparent group-hover:decoration-primary-300 transition-all">{s.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.role}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6  font-bold text-foreground/80">{s.salary}</td>
                            <td className="py-6  font-bold text-red-500/80">{s.deductions}</td>
                            <td className="py-6  font-black text-primary-700 group-hover:text-primary-900 group-hover:scale-110 origin-left transition-all">{s.net}</td>
                            <td className="py-6 text-right">
                                <span className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                                    s.status === 'Paid' ? 'bg-green-50 text-green-600' : s.status === 'Generated' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'bg-muted text-muted-foreground'
                                }`}>
                                    {s.status === 'Paid' && <CheckCircle2 size={10} />}
                                    {s.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>

         <div className="mt-10 p-6 rounded-3xl bg-foreground text-background shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-primary-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h3 className="text-xl font-black  tracking-tighter">Ready for Disbursement?</h3>
                    <p className="text-xs font-bold text-muted-foreground/80 mt-1 uppercase tracking-widest  leading-relaxed">System-wide audit will run before funds are marked as "Paid".</p>
                </div>
                <button className="flex items-center gap-3 bg-primary-600 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-500 hover:gap-6 transition-all shadow-xl shadow-primary-600/30">
                    Process All Slips <ArrowRight size={16} />
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}
