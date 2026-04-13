import { FileText, Plus, Search, MoreVertical, Clock, Download, Share2 } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function VirtualClassroom() {
  const materials = [
    { id: '1', title: 'Calculus Introduction - Notes', type: 'PDF', size: '2.4 MB', date: '2 hours ago', downloads: 24, highlighted: true },
    { id: '2', title: 'Thermodynamics Lab Video', type: 'Video', size: '142 MB', date: '5 hours ago', downloads: 18, highlighted: false },
    { id: '3', title: 'Algebra Practice Quiz', type: 'Quiz', size: '12 Questions', date: '1 day ago', downloads: 45, highlighted: false },
    { id: '4', title: 'Semester Syllabus 25/26', type: 'PDF', size: '1.1 MB', date: '2 days ago', downloads: 120, highlighted: false },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase  tracking-tighter">Virtual Classroom</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Post announcements, study materials, and manage digital learning.</p>
        </div>
        <div className="flex gap-4">
             <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-600/30 hover:scale-105 transition-all active:scale-95">
                <Plus size={18} /> Upload Material
             </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
         <StatCardSmall label="Tutor Files" value={24} icon={<FileText size={18} />} />
         <StatCardSmall label="Total Students" value={118} icon={<UsersIcon />} />
         <StatCardSmall label="AssignmentsDue" value={3} icon={<Clock size={18} />} color="text-red-500" />
         <StatCardSmall label="avg. Viewership" value="86%" icon={<Share2 size={18} />} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold ">Resources & Materials</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input type="text" placeholder="Search resources..." className="w-48 rounded-full border bg-background py-1.5 pl-8 pr-3 text-xs focus:ring-2 focus:ring-primary-500/20" />
            </div>
        </div>
        
        <div className="grid gap-4">
            {materials.map((m) => (
                <div key={m.id} className={cn(
                    "group flex items-center justify-between p-5 rounded-2xl border bg-background transition-all hover:border-primary-600/30",
                    m.highlighted ? "border-primary-600/20 bg-primary-50/10 shadow-sm" : ""
                )}>
                    <div className="flex items-center gap-5">
                        <div className={cn(
                            "h-12 w-12 flex items-center justify-center rounded-xl font-black text-[10px] uppercase transition-all group-hover:scale-110",
                            m.type === 'PDF' ? "bg-red-50 text-red-600" : m.type === 'Video' ? "bg-primary-50 text-primary-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                            {m.type}
                        </div>
                        <div>
                            <h4 className="font-extrabold tracking-tight group-hover:text-primary-900 transition-colors ">{m.title}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{m.size} • Uploaded {m.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                        <div className="hidden sm:block">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Downloads</p>
                            <p className="text-sm font-black ">{m.downloads}</p>
                        </div>
                        <div className="flex gap-2">
                             <button className="h-9 w-9 flex items-center justify-center rounded-lg border bg-background text-muted-foreground hover:text-primary-600 transition-all"><Download size={16} /></button>
                             <button className="h-9 w-9 flex items-center justify-center rounded-lg border bg-background text-muted-foreground hover:text-foreground transition-all"><MoreVertical size={16} /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function StatCardSmall({ label, value, icon, color = "text-primary-600" }: { label: string, value: string | number, icon: React.ReactNode, color?: string }) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border bg-background p-4 shadow-sm">
            <div className={cn("h-10 w-10 flex items-center justify-center rounded-xl bg-muted/30", color)}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">{label}</p>
                <p className="text-lg font-black  leading-none">{value}</p>
            </div>
        </div>
    )
}

function UsersIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
