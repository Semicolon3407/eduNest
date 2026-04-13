import { Banknote, Users, Briefcase, FileText, Clock } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';

export function HRDashboard() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Operations</h1>
        <p className="mt-2 text-muted-foreground">Managing staff lifecycle, payroll, and recruitment.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Staff" 
          value="86" 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="On Leave Today" 
          value="4" 
          icon={<Clock size={24} />} 
          className="ring-2 ring-red-500/5"
        />
        <StatCard 
          title="Pay Date" 
          value="Oct 28" 
          icon={<Banknote size={24} />} 
        />
        <StatCard 
          title="Open Positions" 
          value="3" 
          icon={<Briefcase size={24} />} 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payroll Summary */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Payroll (Next Cycle)</h2>
            <button className="text-xs font-bold text-primary-600 underline">View Report</button>
          </div>
          <div className="space-y-4">
            <PayrollItem label="Basic Salaries" amount="$45,200" />
            <PayrollItem label="Bonuses & Inc" amount="$2,800" />
            <PayrollItem label="Tax Deductions" amount="-$6,400" />
            <div className="pt-4 border-t border-dashed">
                <div className="flex justify-between items-center bg-primary-50 px-3 py-2 rounded-lg">
                    <span className="font-bold text-sm text-primary-900">Net Payable</span>
                    <span className="font-extrabold text-xl text-primary-600">$41,600</span>
                </div>
            </div>
          </div>
          <button className="w-full mt-6 bg-foreground text-background py-2 rounded-xl text-sm font-bold shadow-lg shadow-foreground/10 hover:opacity-90 active:scale-95 transition-all">
            Generate Payslips
          </button>
        </div>

        {/* Recent Leave Requests */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
           <h2 className="text-xl font-bold mb-6">Leave Requests</h2>
           <div className="space-y-4">
              {[
                { name: 'David Jones', role: 'IT Support', date: '24-26 Sept', status: 'Pending' },
                { name: 'Alice Wong', role: 'Chemistry Tutor', date: '28 Sept', status: 'Approved' },
                { name: 'Robert Fox', role: 'Office Admin', date: '01 Oct', status: 'Pending' },
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.name}`} className="h-9 w-9 bg-muted rounded-full" alt=""/>
                         <div>
                            <p className="font-bold text-sm tracking-tight">{req.name}</p>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">{req.role}</p>
                         </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-muted-foreground">{req.date}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${req.status === 'Approved' ? 'text-green-500' : 'text-yellow-600'}`}>
                            {req.status}
                        </span>
                    </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-8 border py-2 rounded-xl text-sm font-bold hover:bg-muted transition-colors">
            Manage All Requests
           </button>
        </div>

        {/* Recruitment Activity */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-6">Recruitment</h2>
            <div className="space-y-5 flex-1">
                <RecruitmentCard title="Senior Math Teacher" applicants={12} newOnes={3} />
                <RecruitmentCard title="Lab Assistant" applicants={8} newOnes={0} />
                <RecruitmentCard title="HR Assistant" applicants={24} newOnes={5} />
            </div>
            <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-dashed text-center">
                <FileText className="mx-auto mb-2 text-muted-foreground" size={24} />
                <p className="text-[11px] font-bold text-muted-foreground">Post a new internal job opening to begin formal onboarding.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

function PayrollItem({ label, amount }: { label: string, amount: string }) {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="text-sm font-bold text-foreground tracking-tight">{amount}</span>
        </div>
    )
}

function RecruitmentCard({ title, applicants, newOnes }: { title: string, applicants: number, newOnes: number }) {
    return (
        <div className="relative group cursor-pointer">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-sm group-hover:text-primary-600 transition-colors">{title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{applicants} active applicants</p>
                </div>
                {newOnes > 0 && (
                    <span className="bg-primary-600 text-[10px] font-black text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1 animate-pulse">
                        +{newOnes} NEW
                    </span>
                )}
            </div>
        </div>
    )
}
