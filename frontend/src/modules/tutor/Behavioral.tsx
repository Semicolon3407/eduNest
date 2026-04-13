import { AlertTriangle, Plus, Search, Filter, MoreVertical, Star, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function BehavioralTracking() {
  const incidents = [
    { student: 'Arya Stark', type: 'Disciplinary', info: 'Unexplained absence from lab.', level: 'Low', date: '2h ago' },
    { student: 'Alex Smith', type: 'Commendation', info: 'Student of the Month nomination.', level: 'High', date: '1d ago', reward: true },
    { student: 'John Doe', type: 'Disciplinary', info: 'Missed final math submission.', level: 'Medium', date: '2d ago' },
    { student: 'Sarah Connor', type: 'Commendation', info: 'Helped peers in history project.', level: 'Low', date: 'Mon', reward: true },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase tracking-tighter">Behavioral & Commendation</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Tracking disciplinary issues and excellence commendations for Grade 10-A.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-xs font-black uppercase tracking-widest text-background shadow-xl shadow-foreground/20 hover:scale-105 transition-all">
          <Plus size={16} /> Log Observation
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <StatCardSmall label="Total Logs" value={14} icon={<ShieldAlert size={18}/>} />
        <StatCardSmall label="Commendations" value={6} icon={<Award size={18}/>} color="text-green-600 bg-green-50" />
        <StatCardSmall label="Critical Alerts" value={2} icon={<AlertTriangle size={18}/>} color="text-red-600 bg-red-50" />
        <StatCardSmall label="Active Reports" value={4} icon={<ArrowUpRight size={18}/>} />
      </div>

      <div className="rounded-3xl border bg-background overflow-hidden shadow-sm">
        <div className="border-b bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                 <h2 className="font-black uppercase  tracking-widest text-xs text-primary-900">Observational Journal Flow</h2>
             </div>
             <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input type="text" placeholder="Filter by student..." className="w-48 rounded-full border bg-background py-1.5 pl-8 pr-3 text-[10px] font-black outline-none" />
                </div>
                <button className="p-2 rounded-lg border bg-background text-muted-foreground hover:text-foreground"><Filter size={14}/></button>
             </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-muted/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-dashed">
                    <tr>
                        <th className="px-8 py-5  text-primary-900/40 tracking-tighter">Student</th>
                        <th className="px-8 py-5  text-primary-900/40 tracking-tighter">Category</th>
                        <th className="px-8 py-5  text-primary-900/40 tracking-tighter">Observation Detail</th>
                        <th className="px-8 py-5  text-primary-900/40 tracking-tighter">Priority</th>
                        <th className="px-8 py-5  text-center text-primary-900/40 tracking-tighter">Recorded</th>
                        <th className="px-8 py-5 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dashed">
                    {incidents.map((inc, i) => (
                        <tr key={i} className="group hover:bg-primary-50/10 transition-colors">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 overflow-hidden rounded-2xl bg-muted ring-2 ring-primary-50 group-hover:ring-primary-100 transition-all">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${inc.student}`} alt=""/>
                                    </div>
                                    <p className="font-extrabold  tracking-tight text-foreground">{inc.student}</p>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest",
                                    inc.type === 'Commendation' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                )}>
                                    {inc.type === 'Commendation' ? <Star size={10} className="fill-current"/> : <ShieldAlert size={10}/>}
                                    {inc.type}
                                </div>
                            </td>
                            <td className="px-8 py-5 max-w-xs font-bold text-xs  text-muted-foreground truncate group-hover:text-foreground transition-colors">{inc.info}</td>
                            <td className="px-8 py-5">
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-2",
                                    inc.level === 'High' ? "text-red-500 underline" : inc.level === 'Medium' ? "text-yellow-600" : "text-primary-600"
                                )}>
                                    {inc.level} Priority
                                </span>
                            </td>
                            <td className="px-8 py-5 text-center font-black text-[10px] text-muted-foreground uppercase">{inc.date}</td>
                            <td className="px-8 py-5 text-right">
                                <button className="text-muted-foreground hover:text-foreground">
                                    <MoreVertical size={18}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-foreground text-background shadow-2xl relative overflow-hidden group">
        <div className="absolute right-0 top-0 h-40 w-40 bg-primary-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="relative z-10 flex items-center justify-between">
            <div>
                <h3 className="text-xl font-black  tracking-tighter uppercase leading-none">Student Monitoring Policy</h3>
                <p className="mt-2 text-xs font-bold text-muted-foreground/80  leading-relaxed max-w-2xl">All logs are strictly confidential and shared only with legal guardians and administrative leadership. Every entry forms part of the verified student behavioral profile for university transcripts.</p>
            </div>
            <div className="flex gap-4">
                <button className="h-12 px-8 rounded-2xl bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/30">Generate Report</button>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCardSmall({ label, value, icon, color = "text-primary-600 bg-primary-50" }: { label: string, value: string | number, icon: React.ReactNode, color?: string }) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border bg-background p-4 shadow-sm">
            <div className={cn("h-10 w-10 flex items-center justify-center rounded-xl", color)}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">{label}</p>
                <p className="text-xl font-black  leading-none">{value}</p>
            </div>
        </div>
    )
}
