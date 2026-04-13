import { Layers, Plus, Settings, CheckCircle2, AlertCircle } from 'lucide-react';

export function AcademicSetup() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Year & Term Setup</h1>
        <p className="mt-1 text-muted-foreground">Define sessions, semesters, and global grading policies.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Current Session */}
        <div className="rounded-3xl border-2 border-primary-600/20 bg-background p-8 shadow-xl shadow-primary-900/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
                 <span className="flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white animate-pulse">
                    <CheckCircle2 size={12} /> Active Session
                 </span>
            </div>
            <h2 className="text-2xl font-black  text-primary-900 mb-2 underline decoration-primary-200 underline-offset-8">2025-2026 Season</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-10">Started: June 15, 2025 • Ends: May 30, 2026</p>
            
            <div className="space-y-4">
                <TermCard label="Term 1 (Fall)" date="Sept - Dec" status="Current" progress={45} />
                <TermCard label="Term 2 (Spring)" date="Jan - Mar" status="Upcoming" progress={0} />
                <TermCard label="Term 3 (Summar)" date="Apr - Jun" status="Upcoming" progress={0} />
            </div>

            <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3 text-sm font-black uppercase tracking-widest text-background shadow-lg shadow-foreground/20 hover:opacity-90 transition-all">
                <Plus size={18} /> Add Evaluation Term
            </button>
        </div>

        {/* Global Academic Rules */}
        <div className="space-y-6">
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Settings size={20} className="text-primary-600" /> Global Grading Policy
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <button className="flex items-center justify-center gap-3 rounded-xl border-2 border-primary-600 bg-primary-50 p-6 text-center shadow-lg shadow-primary-900/5 transition-all">
                        <div>
                             <p className="text-2xl font-black text-primary-900">GPA</p>
                             <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">Scale 4.0</p>
                        </div>
                    </button>
                    <button className="flex items-center justify-center gap-3 rounded-xl border-2 border-transparent bg-muted/30 p-6 text-center hover:border-muted transition-all opacity-60">
                         <div>
                             <p className="text-2xl font-black text-muted-foreground">PERCENT</p>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Legacy 100%</p>
                        </div>
                    </button>
                </div>
                <div className="mt-6 flex items-start gap-4 rounded-xl bg-primary-50 p-4 border border-primary-100">
                    <AlertCircle size={20} className="text-primary-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-primary-800  leading-relaxed">Changing the grading policy mid-session will trigger a global recount for all students. This action is recorded in the Audit Log.</p>
                </div>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Layers size={20} className="text-primary-600" /> Dept & Faculty
                </h3>
                <div className="space-y-3">
                    {['Faculty of Sciences', 'Department of Arts', 'Business School'].map((dept, i) => (
                        <div key={i} className="flex justify-between items-center bg-muted/20 px-4 py-3 rounded-xl border border-transparent hover:border-muted transition-all cursor-pointer">
                            <span className="text-sm font-bold tracking-tight">{dept}</span>
                            <span className="text-xs font-bold text-primary-600">8 Tutors</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function TermCard({ label, date, status, progress }: { label: string, date: string, status: string, progress: number }) {
    return (
        <div className={`p-4 rounded-2xl border transition-all ${status === 'Current' ? 'bg-primary-50 border-primary-100 shadow-sm' : 'bg-muted/10 border-transparent opacity-60'}`}>
            <div className="flex justify-between items-center mb-3">
                <div>
                     <p className="text-sm font-black  text-foreground tracking-tight">{label}</p>
                     <p className="text-[10px] font-black text-muted-foreground uppercase">{date}</p>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'Current' ? 'text-primary-700' : 'text-muted-foreground'}`}>
                    {status}
                </span>
            </div>
            {progress > 0 && (
                <div className="h-1.5 w-full rounded-full bg-primary-100 overflow-hidden">
                    <div className="h-full bg-primary-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </div>
    )
}
