import { BookOpen, Download, Search, FileText, CheckCircle2, Star, PlayCircle } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function LearningManagement() {
  const myResources = [
    { title: 'Advanced Calculus Lecture Notes', tutor: 'Prof. Miller', date: '2 days ago', type: 'PDF', completed: true },
    { title: 'Laws of Thermodynamics - Video', tutor: 'Dr. Stark', date: '1 day ago', type: 'Video', completed: false },
    { title: 'History of Western Art Part 1', tutor: 'Ms. Croft', date: '4 hours ago', type: 'PDF', completed: false },
    { title: 'Quarterly Physics Quiz', tutor: 'Dr. Stark', date: 'Upcoming', type: 'Quiz', completed: false },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase  tracking-tighter">My Learning Portal</h1>
          <p className="mt-1 text-muted-foreground font-medium ">Your personalized digital classroom and study materials.</p>
        </div>
        <div className="flex bg-primary-50 px-4 py-2 rounded-2xl border border-primary-100 items-center gap-3">
             <Star className="text-primary-600 fill-primary-600" size={18} />
             <span className="text-sm font-black  text-primary-900 tracking-tighter">Gold Learner Badge</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Resource Stream */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen size={20} className="text-primary-600" /> Recent Learning Flow
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input type="text" placeholder="Filter materials..." className="w-48 rounded-full border bg-background py-1.5 pl-8 pr-3 text-xs font-bold" />
                </div>
            </div>

            <div className="space-y-4">
                {myResources.map((res, i) => (
                    <div key={i} className={cn(
                        "group flex items-center justify-between p-5 rounded-3xl border bg-background transition-all hover:border-primary-600/30 hover:shadow-xl hover:shadow-primary-900/5",
                        res.completed ? "opacity-70 grayscale-[0.5]" : "ring-2 ring-primary-500/5"
                    )}>
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "h-14 w-14 flex items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
                                res.type === 'PDF' ? "bg-red-50 text-red-600" : res.type === 'Video' ? "bg-primary-50 text-primary-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                                {res.type === 'PDF' ? <FileText size={24}/> : res.type === 'Video' ? <PlayCircle size={24}/> : <CheckCircle2 size={24}/>}
                            </div>
                            <div>
                                <h4 className="font-extrabold tracking-tight text-foreground  group-hover:text-primary-900 transition-colors uppercase leading-none">{res.title}</h4>
                                <div className="mt-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span className="text-primary-600">{res.tutor}</span>
                                    <span>•</span>
                                    <span>{res.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                             {res.completed ? (
                                 <span className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                    <CheckCircle2 size={20} />
                                 </span>
                             ) : (
                                 <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/20 hover:scale-110 transition-all active:scale-95">
                                    <Download size={18} />
                                 </button>
                             )}
                        </div>
                    </div>
                ))}
            </div>
            
            <button className="w-full mt-4 py-3 rounded-2xl border-2 border-dashed font-black  text-sm text-muted-foreground tracking-widest hover:bg-muted/10 transition-all">
                Load Architecture Diagrams & Past Papers
            </button>
        </div>

        {/* Learning Metadata */}
        <div className="space-y-6">
            <div className="rounded-3xl border bg-background p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6  underline decoration-primary-200 decoration-4 underline-offset-4">Course Progress</h3>
                <div className="space-y-6">
                    <SubjectProgress name="Calculus" percent={64} color="bg-primary-600" />
                    <SubjectProgress name="Physics" percent={42} color="bg-primary-400" />
                    <SubjectProgress name="Western History" percent={88} color="bg-emerald-500" />
                    <SubjectProgress name="Data Structures" percent={24} color="bg-primary-200" />
                </div>
            </div>

            <div className="rounded-3xl bg-foreground p-8 text-background shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen size={64} />
                </div>
                <h4 className="text-lg font-black  mb-2 tracking-tighter">Digital Library Hub</h4>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Access 14,000+ digital books and academic journals via the official portal.</p>
                <button className="mt-8 flex w-full items-center justify-between rounded-2xl bg-primary-600 p-4 text-xs font-black uppercase tracking-widest text-white hover:bg-primary-500 transition-all">
                    <span>Library Portal</span>
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

function SubjectProgress({ name, percent, color }: { name: string, percent: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold tracking-tight">{name}</span>
                <span className="text-xs font-black ">{percent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    )
}

function ArrowRightIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    )
}
