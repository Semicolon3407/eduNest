import { UserCheck, Search, Filter, CheckCircle2, XCircle, Clock, Save, ArrowLeft } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function AttendanceMarking() {
  const students = [
    { id: 'S001', name: 'Alex Smith', grade: '10A', status: 'Present' },
    { id: 'S002', name: 'Emma Wilson', grade: '10A', status: 'Absent' },
    { id: 'S003', name: 'John Doe', grade: '10A', status: 'Present' },
    { id: 'S004', name: 'Sarah Connor', grade: '10A', status: 'Late' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase">Daily Attendance Register</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Grade 10A • Mathematics Class • Oct 09, 2025</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-xs font-black uppercase tracking-widest text-background shadow-xl shadow-foreground/20 hover:scale-105 transition-all">
          <Save size={16} /> Save Register
        </button>
      </div>

      <div className="rounded-3xl border bg-background overflow-hidden">
        <div className="border-b bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
                 <button className="text-xs font-black uppercase tracking-widest text-primary-600 flex items-center gap-1 hover:underline">
                    <ArrowLeft size={14}/> All Classes
                 </button>
                 <div className="h-4 w-px bg-muted"></div>
                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest ">{students.length} Students Listed</span>
            </div>
            <div className="flex gap-2">
                 <button className="rounded-lg bg-green-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-green-700 hover:bg-green-100 transition-all">Mark All Present</button>
                 <button className="rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all">Reset All</button>
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-muted/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <tr>
                        <th className="px-8 py-5 ">Student Detail</th>
                        <th className="px-8 py-5  text-center">ID</th>
                        <th className="px-8 py-5  text-center">Status</th>
                        <th className="px-8 py-5  text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dashed">
                    {students.map((s, i) => (
                        <tr key={i} className="group hover:bg-primary-50/10 transition-colors">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 overflow-hidden rounded-2xl bg-muted ring-2 ring-primary-50">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt=""/>
                                    </div>
                                    <p className="font-extrabold  tracking-tight text-foreground">{s.name}</p>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-center font-mono font-bold text-muted-foreground text-xs">{s.id}</td>
                            <td className="px-8 py-5">
                                <div className="flex justify-center gap-3">
                                    <StatusButton icon={<CheckCircle2 size={16}/>} label="Present" active={s.status === 'Present'} color="text-green-600 bg-green-50" />
                                    <StatusButton icon={<XCircle size={16}/>} label="Absent" active={s.status === 'Absent'} color="text-red-600 bg-red-50" />
                                    <StatusButton icon={<Clock size={16}/>} label="Late" active={s.status === 'Late'} color="text-yellow-600 bg-yellow-50" />
                                </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <button className="text-xs font-bold text-primary-600 hover:underline">Add Note</button>
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

function StatusButton({ icon, label, active, color }: { icon: React.ReactNode, label: string, active: boolean, color: string }) {
    return (
        <button className={cn(
            "flex flex-col items-center gap-1 rounded-xl p-2 transition-all min-w-[70px]",
            active ? color + " ring-1 ring-inset ring-current shadow-sm" : "text-muted-foreground hover:bg-muted/50"
        )}>
            {icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </button>
    )
}
