import { Search, Filter, Plus, MoreVertical, Download, Mail, Phone } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function Admissions() {
  const candidates = [
    { name: 'Alex Smith', parent: 'Robert Smith', email: 'alex@student.com', grade: 'Grade 9-A', status: 'Applied', date: '2 hours ago' },
    { name: 'Emma Wilson', parent: 'Sarah Wilson', email: 'emma@family.org', grade: 'Grade 10-C', status: 'Interview', date: '5 hours ago' },
    { name: 'Liam Neeson', parent: 'B. Neeson', email: 'liam@private.co', grade: 'Grade 12-B', status: 'Admitted', date: '1 day ago' },
    { name: 'Arya Stark', parent: 'Ned Stark', email: 'arya@winterfell.ca', grade: 'Grade 8-D', status: 'Waitlist', date: '2 days ago' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase ">Admission Pipeline</h1>
          <p className="mt-1 text-muted-foreground font-medium ">Manage the full enrollment process from Application to Admission.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary-600/20 hover:scale-105 transition-all">
          <Plus size={18} /> New Application
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input type="text" placeholder="Search by candidate or parent name..." className="w-full rounded-2xl border-2 border-primary-50 bg-background py-3 pl-12 pr-4 text-sm font-bold focus:border-primary-600/50 outline-none transition-all" />
        </div>
        <button className="flex h-12 items-center gap-2 rounded-2xl border-2 bg-background px-6 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl border-2 border-primary-50 bg-background overflow-hidden shadow-sm">
            <div className="hidden md:grid md:grid-cols-4 border-b-2 border-primary-50 bg-primary-50/30 p-4">
                {['Applied', 'Interview', 'Waitlist', 'Admitted'].map((status) => (
                    <div key={status} className="text-center font-black uppercase tracking-widest text-[10px] text-primary-900/60 ">{status}</div>
                ))}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <tbody className="divide-y-2 divide-primary-50">
                    {candidates.map((can, i) => (
                        <tr key={i} className="group hover:bg-primary-50/20 transition-all">
                            <td className="px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 overflow-hidden rounded-2xl bg-muted ring-4 ring-primary-50 group-hover:ring-primary-100 transition-all">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${can.name}`} alt=""/>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black tracking-tighter  text-foreground leading-none">{can.name}</h3>
                                            <p className="mt-1 text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none truncate w-48">Parent: {can.parent}</p>
                                            <div className="mt-3 flex gap-3">
                                                <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white transition-all"><Mail size={14}/></button>
                                                <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white transition-all"><Phone size={14}/></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Applying For</p>
                                            <p className="text-sm font-black text-primary-900 tracking-tight ">{can.grade}</p>
                                        </div>
                                        <div className="min-w-[120px] text-center">
                                            <span className={cn(
                                                "inline-flex items-center gap-2 rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest",
                                                can.status === 'Applied' ? "bg-primary-50 text-primary-700 shadow-sm" :
                                                can.status === 'Interview' ? "bg-yellow-50 text-yellow-600" :
                                                can.status === 'Admitted' ? "bg-green-50 text-green-600 shadow-sm" :
                                                "bg-muted text-muted-foreground"
                                            )}>
                                                {can.status}
                                            </span>
                                        </div>
                                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/30 text-muted-foreground hover:bg-muted transition-all">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
        </div>
        
        <div className="flex justify-between items-center px-4">
            <p className="text-xs font-bold text-muted-foreground ">Total 128 active applications in current pipeline.</p>
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-600 hover:underline">
                <Download size={14} /> Download Admission Report
            </button>
        </div>
      </div>
    </div>
  );
}
