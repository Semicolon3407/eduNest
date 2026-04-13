import { MessageSquare, Search, Filter, Plus, CheckCircle2, AlertCircle, Clock, Send } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function SupportTicketing() {
  const tickets = [
    { id: 'TIC-1024', org: 'Westfield College', subject: 'API Latency Issues', priority: 'High', status: 'Open', date: '10m ago' },
    { id: 'TIC-1025', org: 'Green Valley', subject: 'Logo Upload Error', priority: 'Medium', status: 'In Progress', date: '1h ago' },
    { id: 'TIC-1026', org: 'St. Mary\'s', subject: 'Invoice Discrepancy', priority: 'Low', status: 'Resolved', date: '1d ago' },
    { id: 'TIC-1027', org: 'Horizon Inst.', subject: 'New Branch Activation', priority: 'High', status: 'Open', date: '2h ago' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase">Support & Ticketing</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Handle technical support requests from institutions across the platform.</p>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-primary-600/20 hover:scale-105 transition-all">
                <Plus size={16} /> New System Alert
             </button>
        </div>
      </div>

      <div className="rounded-3xl border bg-background overflow-hidden shadow-sm">
        <div className="border-b bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-6">
                 <h2 className="font-bold uppercase  tracking-widest text-xs text-primary-900">Active Support Queue</h2>
             </div>
             <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input type="text" placeholder="Search by Ticket ID..." className="w-48 rounded-full border bg-background py-1.5 pl-8 pr-3 text-[10px] font-black focus:ring-2 focus:ring-primary-500/20 outline-none" />
                </div>
                <button className="p-2 rounded-lg border bg-background text-muted-foreground hover:text-foreground">
                    <Filter size={14}/>
                </button>
             </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-muted/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <tr>
                        <th className="px-8 py-5 ">Organization / Ticket</th>
                        <th className="px-8 py-5  text-center">Priority</th>
                        <th className="px-8 py-5  text-center">Status</th>
                        <th className="px-8 py-5  text-right">Age</th>
                        <th className="px-8 py-5  text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dashed">
                    {tickets.map((t, i) => (
                        <tr key={i} className="group hover:bg-primary-50/10 transition-colors">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-muted-foreground font-black text-xs group-hover:bg-primary-600 group-hover:text-white transition-all">
                                        <MessageSquare size={18}/>
                                    </div>
                                    <div>
                                        <p className="font-extrabold  tracking-tight text-foreground uppercase leading-none">{t.subject}</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-1.5">{t.org} • {t.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-center">
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                    t.priority === 'High' ? "text-red-600" : t.priority === 'Medium' ? "text-yellow-600" : "text-primary-600"
                                )}>
                                    {t.priority}
                                </span>
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex justify-center">
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest",
                                        t.status === 'Open' ? "bg-red-50 text-red-600" : 
                                        t.status === 'In Progress' ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"
                                    )}>
                                        {t.status === 'Open' ? <Clock size={10}/> : t.status === 'In Progress' ? <AlertCircle size={10}/> : <CheckCircle2 size={10}/>}
                                        {t.status}
                                    </span>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-right font-bold text-[10px] text-muted-foreground uppercase">{t.date}</td>
                            <td className="px-8 py-5 text-right">
                                <button className="text-primary-600 hover:text-primary-700">
                                    <Send size={18}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
