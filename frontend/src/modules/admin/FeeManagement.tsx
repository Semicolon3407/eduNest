import { Banknote, CheckCircle2, AlertCircle, Plus, Send, Filter } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';
import { cn } from '../../hooks/utils';

export function FeeManagement() {
  const feeStructures = [
    { title: 'Standard Tuition', type: 'Academic', amount: '$4,500', interval: 'Per Term' },
    { title: 'Computer/IT Lab', type: 'Facility', amount: '$250', interval: 'Per Session' },
    { title: 'Library Access', type: 'Service', amount: '$100', interval: 'Per Term' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground  uppercase">Fee & Lifecycle Management</h1>
        <p className="mt-1 text-muted-foreground font-medium ">Configure fee structures, track payments, and manage defaulters.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Collected" value="$842k" icon={<Banknote size={24} />} trend={{ value: 8, isUp: true }} />
        <StatCard title="Pending Outstanding" value="$12.4k" icon={<AlertCircle size={24} />} className="ring-2 ring-red-500/5 text-red-600" />
        <StatCard title="Today\'s Revenue" value="$4,200" icon={<Banknote size={24} />} />
        <StatCard title="Scholarship/Disc" value="8%" icon={<CheckCircle2 size={24} />} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Fee Structures */}
        <div className="lg:col-span-1 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <LayersIcon /> Active Structures
                </h2>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white transition-all">
                    <Plus size={18} />
                </button>
            </div>
            <div className="space-y-4">
                {feeStructures.map((f, i) => (
                    <div key={i} className="group p-5 rounded-2xl border bg-background border-dashed hover:border-solid hover:border-primary-600/30 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                             <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold group-hover:bg-primary-600 group-hover:text-white transition-all text-xs">F</div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary-600">{f.type}</span>
                        </div>
                        <h4 className="font-extrabold text-foreground tracking-tight ">{f.title}</h4>
                        <div className="mt-4 flex items-baseline gap-2">
                             <span className="text-2xl font-black  text-primary-900 leading-none">{f.amount}</span>
                             <span className="text-[10px] font-bold text-muted-foreground uppercase">{f.interval}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Global Collection Stats */}
        <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border bg-background p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <h2 className="text-xl font-bold  underline decoration-primary-200 decoration-4 underline-offset-8 transition-all hover:decoration-primary-600">Real-time Defaulter Audit</h2>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
                            <Filter size={14}/> Filter
                        </button>
                        <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-600/20">
                            <Send size={14}/> Remind All
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {[
                        { name: 'John Doe', amount: '$4,200', date: 'Sept 15, 2025', risk: 'High' },
                        { name: 'Sarah Wilson', amount: '$850', date: 'Oct 02, 2025', risk: 'Medium' },
                        { name: 'Marcus Miller', amount: '$2,100', date: 'Sept 20, 2025', risk: 'High' },
                        { name: 'Alex Wong', amount: '$150', date: 'Oct 08, 2025', risk: 'Low' },
                    ].map((def, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-muted group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary-50">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${def.name}`} alt=""/>
                                </div>
                                <div>
                                    <p className="font-extrabold tracking-tight  text-foreground leading-none">{def.name}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Due: {def.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                    def.risk === 'High' ? "bg-red-50 text-red-600" : def.risk === 'Medium' ? "bg-yellow-50 text-yellow-600" : "bg-primary-50 text-primary-600"
                                )}>
                                    {def.risk} Risk
                                </span>
                                <div className="text-right min-w-[80px]">
                                    <p className="font-black  text-foreground tracking-tighter truncate group-hover:text-primary-600 transition-colors">{def.amount}</p>
                                </div>
                                <button className="text-xs font-black  text-primary-600 hover:underline">Settle</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <button className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">View all 42 defaulters</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function LayersIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
        </svg>
    )
}
