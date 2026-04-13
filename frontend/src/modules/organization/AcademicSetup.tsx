import { useState, useEffect } from 'react';
import { Plus, Settings, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { organizationService } from '../../services/organizationService';

export function AcademicSetup() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSetup();
  }, []);

  const fetchSetup = async () => {
    try {
      const res = await organizationService.getAcademicSetup();
      setSessions(res.data || []);
    } catch (error) {
      console.error("Failed to fetch academic setup:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const currentSession = sessions.find(s => s.isCurrent);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Year & Term Setup</h1>
        <p className="mt-1 text-muted-foreground">Define sessions, semesters, and global grading policies for the institution.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Current Session */}
        <div className="rounded-3xl border-2 border-primary-600/20 bg-background p-8 shadow-xl shadow-primary-900/5 overflow-hidden relative">
            {currentSession ? (
                <>
                    <div className="absolute top-0 right-0 p-4">
                        <span className="flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white animate-pulse">
                            <CheckCircle2 size={12} /> Active Session
                        </span>
                    </div>
                    <h2 className="text-2xl font-black text-primary-900 mb-2 underline decoration-primary-200 underline-offset-8 italic">{currentSession.name}</h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-10">
                        Started: {new Date(currentSession.startDate).toLocaleDateString()} • Ends: {new Date(currentSession.endDate).toLocaleDateString()}
                    </p>
                    
                    <div className="space-y-4">
                        <TermCard label="Term 1 (Fall)" date="Sept - Dec" status="Current" progress={45} />
                        <TermCard label="Term 2 (Spring)" date="Jan - Mar" status="Upcoming" progress={0} />
                        <TermCard label="Term 3 (Summer)" date="Apr - Jun" status="Upcoming" progress={0} />
                    </div>
                </>
            ) : (
                <div className="text-center py-20">
                    <Calendar className="mx-auto text-muted-foreground mb-4" size={48} />
                    <p className="text-sm font-bold text-muted-foreground uppercase">No active academic session found.</p>
                </div>
            )}

            <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3.5 text-xs font-black uppercase tracking-widest text-background shadow-lg shadow-foreground/20 hover:opacity-90 active:scale-95 transition-all">
                <Plus size={18} /> Add Evaluation Term
            </button>
        </div>

        {/* Global Academic Rules */}
        <div className="space-y-6">
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Settings size={20} className="text-primary-600" /> Session History
                    </h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:underline">Setup New Year</button>
                </div>
                <div className="space-y-3">
                    {sessions.map((session, i) => (
                        <div key={i} className="flex justify-between items-center bg-muted/10 px-4 py-3 rounded-xl border hover:border-primary-100 transition-all cursor-pointer group">
                           <div>
                                <p className="text-sm font-bold tracking-tight group-hover:text-primary-600">{session.name}</p>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase">{new Date(session.startDate).getFullYear()} - {new Date(session.endDate).getFullYear()}</p>
                           </div>
                           {session.isCurrent && <CheckCircle2 size={16} className="text-primary-600" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-3xl bg-primary-600 p-8 text-white shadow-xl shadow-primary-900/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <AlertCircle size={20} /> Mid-Session Alert
                </h3>
                <p className="text-xs font-bold text-primary-50 leading-relaxed opacity-90">
                    You are currently in the middle of <span className="underline decoration-white/30 decoration-2">{currentSession?.name || 'Active Term'}</span>. 
                    Changes to the grading scale or term durations will require a system-wide recount of student evaluations.
                </p>
                <div className="mt-6 flex gap-4">
                    <div className="px-3 py-1.5 rounded-lg bg-white/10 text-[9px] font-black uppercase tracking-widest border border-white/20 italic">
                        Integrity Verified
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function TermCard({ label, date, status, progress }: { label: string, date: string, status: string, progress: number }) {
    return (
        <div className={`p-4 rounded-2xl border transition-all ${status === 'Current' ? 'bg-primary-50 border-primary-200 shadow-sm' : 'bg-muted/10 border-transparent opacity-60'}`}>
            <div className="flex justify-between items-center mb-3">
                <div>
                     <p className="text-sm font-black text-foreground tracking-tight italic">{label}</p>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">{date}</p>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'Current' ? 'text-primary-700' : 'text-muted-foreground'}`}>
                    {status}
                </span>
            </div>
            {progress > 0 && (
                <div className="h-2 w-full rounded-full bg-primary-100 overflow-hidden">
                    <div className="h-full bg-primary-600 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </div>
    )
}
