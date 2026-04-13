import { Building2, Plus, MapPin, ArrowUpRight } from 'lucide-react';

export function BranchManagement() {
  const branches = [
    { id: 'BR-001', name: 'Main Campus', location: 'New York, Downtown', students: 540, staff: 32, status: 'Active', head: 'Prof. Anderson' },
    { id: 'BR-002', name: 'North Campus', location: 'Seattle, Suburban', students: 320, staff: 24, status: 'Active', head: 'Dr. Stevens' },
    { id: 'BR-003', name: 'East Wing', location: 'New York, Upper East', students: 210, staff: 18, status: 'Active', head: 'Ms. Baker' },
    { id: 'BR-004', name: 'South High', location: 'Miami, Coastal', students: 170, staff: 12, status: 'Maintenance', head: 'Mr. Clarkson' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
          <p className="mt-1 text-muted-foreground ">Managing multiple physical locations under Westfield College</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95">
          <Plus size={18} />
          Create New Branch
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {branches.map((branch) => (
          <div key={branch.id} className="group overflow-hidden rounded-2xl border bg-background shadow-sm transition-all hover:border-primary-600/30 hover:shadow-xl hover:shadow-primary-900/5">
            <div className="flex h-32 w-full items-center justify-center bg-muted/30 group-hover:bg-primary-50 transition-colors">
              <Building2 size={48} className="text-muted-foreground group-hover:text-primary-600 transition-transform group-hover:scale-110" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                   <h3 className="text-xl font-bold tracking-tight text-foreground">{branch.name}</h3>
                   <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground ">
                      <MapPin size={12} /> {branch.location}
                   </div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                  branch.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {branch.status}
                </span>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-muted/20 p-3">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Students</p>
                   <p className="text-lg font-black text-foreground">{branch.students}</p>
                </div>
                <div className="rounded-xl border bg-muted/20 p-3">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Staff</p>
                   <p className="text-lg font-black text-foreground">{branch.staff}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-6 border-t border-dashed">
                 <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${branch.head}`} className="h-8 w-8 rounded-full bg-muted" alt=""/>
                    <div>
                        <p className="text-xs font-bold">{branch.head}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">Branch Head</p>
                    </div>
                 </div>
                 <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-600 group-hover:gap-3 transition-all">
                    View Specs <ArrowUpRight size={14} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
