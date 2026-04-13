import { Briefcase, Plus, Search, FileText } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function RecruitmentPortal() {
  const jobs = [
    { title: 'Senior Physics Tutor', dept: 'Sciences', type: 'Full-time', applicants: 12, status: 'Active' },
    { title: 'Mathematics Lab Assistant', dept: 'Mathematics', type: 'Part-time', applicants: 4, status: 'Draft' },
    { title: 'Principal Secretary', dept: 'Administration', type: 'Full-time', applicants: 28, status: 'Active' },
    { title: 'Sports Coach', dept: 'Physical Edu', type: 'Contract', applicants: 8, status: 'Closed' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase">Recruitment & Hiring</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Post internal openings, manage applicant data, and scale your faculty.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-primary-600/20 hover:scale-105 transition-all">
          <Plus size={16} /> Post New Opening
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Jobs */}
        <div className="lg:col-span-2 space-y-4">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold  tracking-tighter uppercase">Active Vacancies</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input type="text" placeholder="Search postings..." className="w-48 rounded-full border bg-background py-1.5 pl-8 pr-3 text-[10px] font-black focus:ring-2 focus:ring-primary-500/20 outline-none" />
                </div>
             </div>
             
             <div className="grid gap-4">
                {jobs.map((job, i) => (
                    <div key={i} className="group flex items-center justify-between p-5 rounded-3xl border bg-background hover:border-primary-600/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-muted text-muted-foreground group-hover:bg-primary-600 group-hover:text-white transition-all">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h4 className="font-extrabold tracking-tight  uppercase text-sm leading-none">{job.title}</h4>
                                <div className="mt-2 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                    <span className="text-primary-600">{job.dept}</span>
                                    <span>•</span>
                                    <span>{job.type}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                             <div className="text-center">
                                <p className="text-[9px] font-black uppercase text-muted-foreground leading-none">Applicants</p>
                                <p className="mt-1 text-sm font-black  leading-none">{job.applicants}</p>
                             </div>
                             <span className={cn(
                                 "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                 job.status === 'Active' ? "bg-green-50 text-green-600" : "bg-muted text-muted-foreground"
                             )}>
                                 {job.status}
                             </span>
                             <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-muted/30 text-muted-foreground hover:bg-foreground hover:text-white transition-all">
                                <FileText size={16} />
                             </button>
                        </div>
                    </div>
                ))}
             </div>
        </div>

        {/* Applicants Stream */}
        <div className="rounded-3xl border bg-background p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-8  underline decoration-primary-200 decoration-4 underline-offset-8">Fresh Candidates</h2>
            <div className="space-y-6">
                <ApplicantItem name="John Wick" role="Security Head" date="2h ago" />
                <ApplicantItem name="Jane Foster" role="Physics Tutor" date="4h ago" />
                <ApplicantItem name="Bruce Banner" role="Lab Manager" date="1d ago" />
                <ApplicantItem name="Tony Stark" role="Tech Lead" date="2d ago" />
            </div>
            <button className="w-full mt-10 rounded-2xl bg-primary-50 py-3 text-[10px] font-black uppercase tracking-widest text-primary-700 hover:bg-primary-100 transition-all">
                View All Candidates
            </button>
        </div>
      </div>
    </div>
  );
}

function ApplicantItem({ name, role, date }: { name: string, role: string, date: string }) {
    return (
        <div className="group flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 overflow-hidden rounded-2xl bg-muted ring-2 ring-primary-50">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt=""/>
                </div>
                <div>
                     <p className="text-sm font-extrabold  text-foreground tracking-tight group-hover:text-primary-600 transition-colors">{name}</p>
                     <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none mt-1">{role}</p>
                </div>
            </div>
            <span className="text-[9px] font-black uppercase text-muted-foreground  text-right whitespace-nowrap">{date}</span>
        </div>
    )
}
