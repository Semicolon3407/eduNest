import type { ReactNode } from 'react';
import { Building2, Calendar, Users, Settings, Plus, ArrowUpRight } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';
import { cn } from '../../hooks/utils';

export function OrganizationDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institutional Overview</h1>
          <p className="mt-2 text-muted-foreground ">Managing Westfield College • 2025-2026 Academic Year</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95">
          <Plus size={18} />
          New Branch
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Branches" 
          value="4" 
          icon={<Building2 size={24} />} 
        />
        <StatCard 
          title="Total Staff" 
          value="86" 
          icon={<Users size={24} />} 
          trend={{ value: 4, isUp: true }}
        />
        <StatCard 
          title="Active Students" 
          value="1,240" 
          icon={<Users size={24} />} 
          trend={{ value: 12, isUp: true }}
        />
        <StatCard 
          title="Next Term" 
          value="Sept 15" 
          icon={<Calendar size={24} />} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Branch Performance */}
        <div className="lg:col-span-2 rounded-2xl border bg-background p-6 shadow-sm overflow-hidden relative">
           <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Branch Performance</h2>
            <select className="text-xs font-semibold border rounded-lg px-2 py-1 outline-none">
                <option>All Branches</option>
                <option>Main Campus</option>
                <option>North Campus</option>
            </select>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Main Campus', students: 540, staff: 32, revenue: '$45k', color: 'bg-primary-600' },
              { name: 'North Campus', students: 320, staff: 24, revenue: '$28k', color: 'bg-emerald-500' },
              { name: 'East Wing', students: 210, staff: 18, revenue: '$18k', color: 'bg-green-400' },
              { name: 'South High', students: 170, staff: 12, revenue: '$12k', color: 'bg-primary-400' },
            ].map((branch, i) => (
              <div key={i} className="group relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{branch.name}</span>
                  <span className="text-xs font-bold text-primary-600">{branch.students} Students</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full transition-all duration-1000 group-hover:opacity-80", branch.color)} style={{ width: `${(branch.students/600)*100}%` }}></div>
                </div>
                <div className="mt-2 flex gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span>{branch.staff} Staff</span>
                    <span>{branch.revenue} Term Revenue</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Configuration */}
        <div className="space-y-6">
            <div className="rounded-2xl border bg-background p-6 shadow-sm ring-2 ring-primary-500/5">
                <h3 className="font-bold mb-4">Quick Setup</h3>
                <div className="space-y-3">
                    <ActionButton icon={<Calendar size={18}/>} title="Define Academic Terms" />
                    <ActionButton icon={<Settings size={18}/>} title="Grading Policy (GPA)" />
                    <ActionButton icon={<Plus size={18}/>} title="Onboard HR Admin" />
                    <ActionButton icon={<Plus size={18}/>} title="Onboard Department HODs" />
                </div>
            </div>

            <div className="rounded-2xl bg-primary-600 p-6 text-white shadow-xl shadow-primary-600/20">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg">System Audit</h3>
                        <p className="text-xs text-primary-100 mt-1 opacity-80">Last check: 1 hour ago</p>
                    </div>
                    <ActivityIcon />
                </div>
                <div className="mt-8 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tighter">100%</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary-100">Integrity</span>
                </div>
                <p className="mt-2 text-xs text-primary-100 font-medium">All student data across 4 branches are isolated and secure.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, title }: { icon: ReactNode, title: string }) {
    return (
        <button className="flex w-full items-center justify-between rounded-xl border border-transparent bg-muted/30 px-4 py-3 text-sm font-semibold transition-all hover:border-primary-100 hover:bg-primary-50 hover:text-primary-700 active:scale-[0.98]">
            <div className="flex items-center gap-3">
                <span className="text-primary-600">{icon}</span>
                {title}
            </div>
            <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
    )
}

function ActivityIcon() {
    return (
        <div className="flex gap-1 h-5 items-end">
            <div className="w-1 bg-white h-2 animate-pulse"></div>
            <div className="w-1 bg-white h-4 animate-pulse delay-75"></div>
            <div className="w-1 bg-white h-3 animate-pulse delay-150"></div>
            <div className="w-1 bg-white h-5 animate-pulse delay-300"></div>
        </div>
    )
}
