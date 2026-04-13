import { FileText, Calendar, Clock, Download, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function StudentExams() {
  const schedule = [
    { subject: 'Advanced Calculus', date: 'Oct 15, 2025', time: '09:00 AM', room: 'Hall A', status: 'Upcoming' },
    { subject: 'Applied Physics', date: 'Oct 18, 2025', time: '11:00 AM', room: 'Lab 2', status: 'Upcoming' },
    { subject: 'World History', date: 'Oct 22, 2025', time: '02:00 PM', room: 'Room 304', status: 'Upcoming' },
    { subject: 'Intro to Philosophy', date: 'Sept 28, 2025', time: '10:00 AM', room: 'Online', status: 'Completed', result: '92%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase">Examination Portal</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">View schedules, results, and download digital transcripts.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-xs font-black uppercase tracking-widest text-background shadow-xl shadow-foreground/20 hover:scale-105 transition-all">
          <Download size={16} /> Exam Slip
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Exam Schedule */}
        <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 uppercase  tracking-tighter">
                <Calendar size={20} className="text-primary-600" /> Upcoming Assessments
            </h2>
            <div className="space-y-4">
               {schedule.map((ex, i) => (
                   <div key={i} className={cn(
                       "group flex items-center justify-between p-6 rounded-3xl border bg-background transition-all hover:border-primary-600/30",
                       ex.status === 'Completed' ? "opacity-60 grayscale-[0.5]" : "ring-4 ring-primary-500/5 shadow-lg shadow-primary-900/5 border-primary-100"
                   )}>
                       <div className="flex items-center gap-5">
                            <div className={cn(
                                "h-14 w-14 flex items-center justify-center rounded-2xl font-black text-xl  tracking-tighter transition-all group-hover:scale-110",
                                ex.status === 'Completed' ? "bg-muted text-muted-foreground" : "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                            )}>
                                {ex.subject[0]}
                            </div>
                            <div>
                                <h4 className="font-extrabold tracking-tight text-foreground  uppercase leading-none">{ex.subject}</h4>
                                <div className="mt-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><Clock size={10}/> {ex.time}</span>
                                    <span>•</span>
                                    <span>{ex.room}</span>
                                </div>
                            </div>
                       </div>
                       <div className="text-right">
                            {ex.status === 'Completed' ? (
                                <div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest leading-none">Result</p>
                                    <p className="text-xl font-black  text-emerald-600 tracking-tighter leading-none">{ex.result}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-end">
                                    <p className="text-[10px] font-black uppercase text-primary-600 tracking-widest leading-none">{ex.date}</p>
                                    <span className="mt-2 flex items-center gap-1 text-[9px] font-black text-muted-foreground  uppercase tracking-widest">
                                        <AlertCircle size={10} /> Active
                                    </span>
                                </div>
                            )}
                       </div>
                   </div>
               ))}
            </div>
        </div>

        {/* Results & Guidelines */}
        <div className="space-y-8">
             <div className="rounded-3xl border-2 border-primary-50 bg-background p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6  underline decoration-primary-200 decoration-4 underline-offset-8">Results & Transcripts</h3>
                <div className="space-y-4">
                    <TranscriptItem label="Term 1 Final Report Card" date="Sept 30, 2025" />
                    <TranscriptItem label="Advanced Physics Quiz Result" date="Oct 02, 2025" />
                    <TranscriptItem label="Pre-Mid Term Analytics" date="Sept 15, 2025" />
                </div>
                <button className="w-full mt-10 rounded-2xl bg-primary-50 py-3 text-xs font-black uppercase tracking-widest text-primary-700 hover:bg-primary-100 transition-all">
                    Request Verified Transcript
                </button>
             </div>

             <div className="rounded-3xl bg-foreground p-8 text-background shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                    <AlertCircle size={64} />
                </div>
                <h4 className="text-lg font-black  mb-4 tracking-tighter uppercase">Board Guidelines</h4>
                <ul className="space-y-3">
                    {[
                        'Standard Hall Tickets must be carried.',
                        'Calculators are allowed for Physics/Math only.',
                        'Digital integrity monitoring is active.',
                    ].map((g, i) => (
                        <li key={i} className="flex gap-3 text-xs font-medium text-muted-foreground/80 ">
                            <span className="text-primary-600 font-black">•</span> {g}
                        </li>
                    ))}
                </ul>
             </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptItem({ label, date }: { label: string, date: string }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                    <FileText size={18} />
                </div>
                <div>
                     <p className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary-600 transition-colors">{label}</p>
                     <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{date}</p>
                </div>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </div>
    )
}
