import { UserCheck, Clock, Calendar, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function StaffAttendance() {
  const attendanceData = [
    { name: 'Prof. Miller', role: 'Economics', punchIn: '08:45 AM', punchOut: '--', status: 'Present', late: false },
    { name: 'Dr. Stark', role: 'Physics', punchIn: '09:15 AM', punchOut: '--', status: 'Late', late: true },
    { name: 'Ms. Croft', role: 'History', punchIn: '--', punchOut: '--', status: 'On Leave', late: false },
    { name: 'Mr. Wayne', role: 'Security', punchIn: '07:30 AM', punchOut: '04:00 PM', status: 'Present', late: false },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Attendance Tracking</h1>
          <p className="mt-1 text-muted-foreground  font-medium">Monitoring real-time clock-in/out and leave records.</p>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-600/30 hover:scale-105 transition-all active:scale-95">
                <Calendar size={18} /> Attendance Report
             </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <UserCheck size={20} />
                </div>
                <div>
                   <p className="text-2xl font-black">74</p>
                   <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Clocked In</p>
                </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: '86%' }}></div>
            </div>
        </div>
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Clock size={20} />
                </div>
                <div>
                   <p className="text-2xl font-black">8</p>
                   <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Arrived Late</p>
                </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: '12%' }}></div>
            </div>
        </div>
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <XCircle size={20} />
                </div>
                <div>
                   <p className="text-2xl font-black">4</p>
                   <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Unplanned Absences</p>
                </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: '6%' }}></div>
            </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-background overflow-hidden">
        <div className="border-b bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <h3 className="font-bold text-foreground">Record Log: Oct 09, 2025</h3>
            </div>
            <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input type="text" placeholder="Search staff name..." className="w-48 rounded-lg border bg-background py-1.5 pl-8 pr-3 text-xs focus:ring-2 focus:ring-primary-500/20" />
                 </div>
                 <button className="p-2 rounded-lg border bg-background text-muted-foreground hover:text-foreground">
                    <Filter size={14} />
                 </button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-muted/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <tr>
                        <th className="px-6 py-4 ">Staff Detail</th>
                        <th className="px-6 py-4  text-center">In</th>
                        <th className="px-6 py-4  text-center">Out</th>
                        <th className="px-6 py-4 ">Status</th>
                        <th className="px-6 py-4 ">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y text-sm">
                    {attendanceData.map((s, i) => (
                        <tr key={i} className="group hover:bg-muted/20 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-primary-50">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt=""/>
                                   </div>
                                   <div>
                                       <p className="font-bold tracking-tight">{s.name}</p>
                                       <p className="text-[10px] uppercase font-bold text-muted-foreground">{s.role}</p>
                                   </div>
                                </div>
                            </td>
                            <td className={cn("px-6 py-4 text-center font-bold font-mono tracking-tighter", s.late ? "text-red-500" : "text-foreground")}>
                                {s.punchIn}
                            </td>
                            <td className="px-6 py-4 text-center font-bold font-mono tracking-tighter text-muted-foreground ">
                                {s.punchOut}
                            </td>
                            <td className="px-6 py-4">
                               <span className={cn(
                                   "inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest",
                                   s.status === 'Present' ? "bg-green-50 text-green-600" :
                                   s.status === 'Late' ? "bg-red-50 text-red-600" :
                                   "bg-yellow-50 text-yellow-600"
                               )}>
                                   {s.status === 'Present' ? <CheckCircle2 size={10} /> : s.status === 'Late' ? <Clock size={10} /> : <Calendar size={10} />}
                                   {s.status}
                               </span>
                            </td>
                            <td className="px-6 py-4">
                                <button className="text-xs font-bold text-primary-600 hover:underline">Edit Entry</button>
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
