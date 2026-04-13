import { ClipboardList, Search, Filter, Save, Download, MoreVertical, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function Gradebook() {
  const gradeData = [
    { name: 'Alex Smith', quiz: '85', exam: '92', participation: 'A', total: '91%', rank: 4 },
    { name: 'Emma Wilson', quiz: '78', exam: '84', participation: 'B+', total: '82%', rank: 12 },
    { name: 'John Doe', quiz: '92', exam: '88', participation: 'A+', total: '90%', rank: 6 },
    { name: 'Sarah Connor', quiz: '64', exam: '72', participation: 'C', total: '68%', rank: 45 },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase">Academic Gradebook</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Mathematics • Grade 10 • Final Assessment Flow</p>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-muted transition-all"><Download size={14}/> Export CSV</button>
             <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-primary-600/20 hover:scale-105 transition-all"><Save size={16}/> Lock Grades</button>
        </div>
      </div>

      <div className="rounded-3xl border bg-background overflow-hidden shadow-sm">
        <div className="border-b bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-black uppercase tracking-widest">
            <div className="flex items-center gap-6">
                <span className="text-primary-600 ">Term 1 Assessment</span>
                <div className="h-4 w-px bg-muted"></div>
                <span className="text-muted-foreground ">48 Students Categorized</span>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input type="text" placeholder="Filter by student..." className="w-48 rounded-full border bg-background py-1.5 pl-8 pr-3 font-bold focus:ring-2 focus:ring-primary-500/20" />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-muted/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <tr>
                        <th className="px-8 py-5 ">Student Name</th>
                        <th className="px-8 py-5  text-center">Quiz (20%)</th>
                        <th className="px-8 py-5  text-center">Exam (60%)</th>
                        <th className="px-8 py-5  text-center">Participation (20%)</th>
                        <th className="px-8 py-5  text-center">Final Score</th>
                        <th className="px-8 py-5 ">Trend</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dashed">
                    {gradeData.map((s, i) => (
                        <tr key={i} className="group hover:bg-primary-50/10 transition-colors">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-muted-foreground font-black ">{s.rank}</div>
                                    <p className="font-extrabold  tracking-tight text-foreground">{s.name}</p>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-center">
                                <input type="text" value={s.quiz} className="w-12 rounded-lg border-2 border-transparent bg-muted/20 py-1 text-center font-black text-sm focus:border-primary-600 focus:bg-background transition-all outline-none" />
                            </td>
                            <td className="px-8 py-5 text-center">
                                <input type="text" value={s.exam} className="w-12 rounded-lg border-2 border-transparent bg-muted/20 py-1 text-center font-black text-sm focus:border-primary-600 focus:bg-background transition-all outline-none" />
                            </td>
                            <td className="px-8 py-5 text-center font-black text-xs text-primary-600">{s.participation}</td>
                            <td className="px-8 py-5 text-center font-black  text-lg tracking-tighter text-foreground">{s.total}</td>
                            <td className="px-8 py-5">
                                <div className={cn(
                                    "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
                                    parseInt(s.total) > 80 ? "text-green-600" : "text-red-500"
                                )}>
                                    {parseInt(s.total) > 80 ? <TrendingUp size={14}/> : <AlertCircle size={14}/>}
                                    {parseInt(s.total) > 80 ? 'Improving' : 'Attention'}
                                </div>
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
