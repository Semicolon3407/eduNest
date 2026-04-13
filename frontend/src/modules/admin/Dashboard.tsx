import { UserCheck, Boxes, Banknote, Calendar, ArrowRight, Download, CreditCard, Layers } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';
import { cn } from '../../hooks/utils';

export function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase  text-foreground/90">Main Control Center</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse"></span>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Administrator View • Session 25/26</p>
          </div>
        </div>
        <div className="flex gap-3">
             <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border-2 border-primary-600 bg-primary-600/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-700 hover:bg-primary-600 hover:text-white transition-all">
                <Calendar size={14} /> Schedule
             </button>
             <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-600/20 hover:scale-105 transition-all">
                <UserCheck size={14} /> New Admission
             </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Daily Admission" 
          value="14" 
          icon={<UserCheck size={24} />} 
          trend={{ value: 24, isUp: true }}
        />
        <StatCard 
          title="Fee Collection" 
          value="$12,8K" 
          icon={<Banknote size={24} />} 
          trend={{ value: 5, isUp: true }}
        />
        <StatCard 
          title="Low Inventory" 
          value="8" 
          icon={<Boxes size={24} />} 
          className="ring-2 ring-red-500/5"
        />
        <StatCard 
          title="Active Classes" 
          value="42" 
          icon={<Layers size={24} />} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Admission Pipeline */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm overflow-hidden relative">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Admission Pipeline</h2>
                <span className="text-xs font-bold text-muted-foreground">This Week</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PipelineStep label="Applied" value={45} color="bg-primary-200" />
                <PipelineStep label="Interview" value={28} color="bg-primary-400" />
                <PipelineStep label="Waitlist" value={12} color="bg-primary-600" />
                <PipelineStep label="Admitted" value={8} color="bg-emerald-600" />
            </div>
            <div className="mt-8 rounded-xl bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+50}`} className="h-10 w-10 bg-white rounded-full ring-2 ring-background shadow-sm" alt=""/>
                            ))}
                        </div>
                        <p className="text-sm font-bold">3 candidates waiting for approval</p>
                    </div>
                    <button className="rounded-lg bg-foreground text-background px-4 py-2 text-xs font-bold hover:opacity-90">Review</button>
                </div>
            </div>
        </div>

        {/* Financial Defaulters */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                    <CreditCard size={20} /> Defaulter Alerts
                </h2>
                <button className="flex items-center gap-1 text-xs font-bold text-primary-600">
                    <Download size={14} /> Export List
                </button>
            </div>
            <div className="space-y-4">
                {[
                    { name: 'Marcus Aurelius', class: 'Grade 10-A', amount: '$1,200', days: 12 },
                    { name: 'Sarah Connor', class: 'Grade 12-C', amount: '$850', days: 8 },
                    { name: 'John Wick', class: 'Grade 9-B', amount: '$2,100', days: 24 },
                ].map((def, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50/30 transition-colors border-b border-muted last:border-0 border-dashed">
                        <div>
                            <p className="font-bold text-sm tracking-tight">{def.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{def.class}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-black text-red-600">{def.amount}</p>
                             <p className="text-[10px] font-bold text-muted-foreground">{def.days} days overdue</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-2 text-sm font-black uppercase tracking-widest transition-all hover:gap-4">
                Send Mass Reminders <ArrowRight size={16} />
            </button>
        </div>
      </div>

      {/* Inventory & Assets Snapshot */}
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Asset Monitoring</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <AssetIndicator label="School Supplies" percent={88} status="Adequate" color="bg-emerald-500" />
            <AssetIndicator label="IT Equipment" percent={42} status="Low Stock" color="bg-primary-600" />
            <AssetIndicator label="Lab Chemicals" percent={12} status="Critical" color="bg-red-500" />
          </div>
      </div>
    </div>
  );
}

function PipelineStep({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="text-center">
            <div className={cn("inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm mb-2", color)}>
                <span className="text-xl font-black text-white">{value}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
        </div>
    )
}

function AssetIndicator({ label, percent, status, color }: { label: string, percent: number, status: string, color: string }) {
    return (
        <div className="p-4 rounded-2xl bg-muted/20 border-2 border-transparent hover:border-muted-foreground/10 transition-all">
            <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold tracking-tight">{label}</p>
                <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded-full", status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-700')}>
                    {status}
                </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${percent}%` }}></div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                <span>Usage</span>
                <span>{percent}%</span>
            </div>
        </div>
    )
}
