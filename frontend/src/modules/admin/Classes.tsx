import { Plus, MoreVertical, Users } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function ClassManagement() {
  const categories = ['Junior School', 'Middle School', 'Senior High', 'Faculty'];
  const classes = [
    { name: 'Grade 10-A', room: '302', tutor: 'Prof. Miller', students: 32, category: 'Senior High' },
    { name: 'Grade 10-B', room: '304', tutor: 'Dr. Stark', students: 28, category: 'Senior High' },
    { name: 'Grade 11-A', room: 'Lab 1', tutor: 'Ms. Croft', students: 24, category: 'Senior High' },
    { name: 'Grade 8-C', room: '201', tutor: 'Mr. Wayne', students: 30, category: 'Middle School' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase">Academic Orbit</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Manage grades, sections, and classroom allocations.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-primary-600/20 hover:scale-105 transition-all">
          <Plus size={16} /> Create Section
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat, i) => (
            <button key={i} className={cn(
                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2",
                i === 0 ? "bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/20" : "bg-background text-muted-foreground border-transparent hover:border-primary-100"
            )}>
                {cat}
            </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls, i) => (
            <div key={i} className="group overflow-hidden rounded-3xl border bg-background shadow-sm hover:border-primary-600/30 hover:shadow-xl hover:shadow-primary-900/5 transition-all cursor-pointer">
                <div className="bg-muted/30 p-6 flex items-center justify-between group-hover:bg-primary-50 transition-colors">
                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white text-muted-foreground font-black  text-xl shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                        {cls.name.split(' ')[1][0]}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary-600">{cls.category}</span>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-black  uppercase tracking-tighter text-foreground leading-none">{cls.name}</h3>
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase  tracking-widest">
                        Room: <span className="text-foreground">{cls.room}</span>
                    </p>
                    
                    <div className="mt-8 flex items-center gap-12">
                         <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-full bg-muted border-2 border-white ring-1 ring-primary-50">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cls.tutor}`} alt=""/>
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Tutor</p>
                                <p className="text-xs font-bold  text-foreground leading-none">{cls.tutor}</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                                <Users size={14} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Size</p>
                                <p className="text-xs font-bold  text-foreground leading-none">{cls.students}</p>
                             </div>
                         </div>
                    </div>
                    
                    <button className="mt-10 flex w-full items-center justify-between border-t border-dashed pt-6 text-[10px] font-black uppercase tracking-widest text-primary-600 hover:gap-8 transition-all">
                        Section Analytics <MoreVertical size={14} className="text-muted-foreground" />
                    </button>
                </div>
            </div>
        ))}

        <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-3xl border-4 border-dashed border-primary-50 bg-primary-50/10 p-8 text-center group cursor-pointer hover:bg-primary-50/20 transition-all">
            <div className="h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 flex group-hover:scale-110 transition-transform mb-6">
                <Plus size={32} />
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-primary-900 leading-tight">Initialize New Section Flow</p>
        </div>
      </div>
    </div>
  );
}
