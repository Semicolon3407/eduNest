import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Building2, Calendar, Users, Settings, Plus, ArrowUpRight, ShieldCheck, History } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';
import { cn } from '../../hooks/utils';
import { organizationService } from '../../services/organizationService';
import { useAuth } from '../../hooks/useAuth';

export function OrganizationDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, logsRes] = await Promise.all([
        organizationService.getDashboard(),
        organizationService.getAuditLogs()
      ]);
      setData(metricsRes.data);
      setAuditLogs(logsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch organization data:", error);
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

  const { metrics, branches, financialSummary, currentYear } = data || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institutional Overview</h1>
          <p className="mt-2 text-muted-foreground ">
            Managing <span className="font-bold text-foreground">{user?.organization?.name || 'Your Institution'}</span> • {currentYear?.name || 'Academic Year'}
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95">
          <Plus size={18} />
          New Branch
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Branches" 
          value={metrics?.totalBranches || 0} 
          icon={<Building2 size={24} />} 
        />
        <StatCard 
          title="Total Staff" 
          value={metrics?.totalStaff || 0} 
          icon={<Users size={24} />} 
          trend={{ value: 4, isUp: true }}
        />
        <StatCard 
          title="Active Students" 
          value={metrics?.activeStudents || 0} 
          icon={<Users size={24} />} 
          trend={{ value: 12, isUp: true }}
        />
        <StatCard 
          title="Term Start" 
          value={metrics?.nextTermDate || 'N/A'} 
          icon={<Calendar size={24} />} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Branch Performance */}
        <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl border bg-background p-6 shadow-sm overflow-hidden relative">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Institutional Performance</h2>
                <select className="text-xs font-semibold border rounded-lg px-2 py-1 outline-none">
                    <option>All Branches</option>
                    {branches?.map((b: any) => <option key={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="space-y-6">
                {(branches || []).map((branch: any, i: number) => (
                  <div key={i} className="group relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{branch.name}</span>
                      <span className="text-xs font-bold text-primary-600">{branch.students} Students</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full transition-all duration-1000 group-hover:opacity-80", i % 2 === 0 ? "bg-primary-600" : "bg-emerald-500")} style={{ width: `${(branch.students/500)*100}%` }}></div>
                    </div>
                    <div className="mt-2 flex gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>{branch.revenue} Term Revenue</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Logs */}
            <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
                    <h2 className="text-sm font-bold flex items-center gap-2">
                        <History size={16} className="text-primary-600" />
                        Internal Audit Logs
                    </h2>
                    <span className="text-[10px] uppercase font-black text-muted-foreground">Recent Activity</span>
                </div>
                <div className="divide-y max-h-[300px] overflow-y-auto">
                    {auditLogs.length > 0 ? auditLogs.map((log: any, i: number) => (
                        <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                                <span className="text-xs font-bold">{log.action}</span>
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-xs text-muted-foreground italic">No audit records found.</div>
                    )}
                </div>
            </div>
        </div>

        {/* Financial Oversight & RBAC Quick Actions */}
        <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Financial Oversight</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Total Collected Fees</p>
                            <p className="text-3xl font-black mt-1">${financialSummary?.revenue?.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-6 pt-4 border-t border-slate-800">
                             <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Expenditure</p>
                                <p className="text-lg font-bold text-red-400 mt-1">${financialSummary?.expenditure?.toLocaleString()}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Net Surplus</p>
                                <p className="text-lg font-bold text-green-400 mt-1">${financialSummary?.profit?.toLocaleString()}</p>
                             </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck size={120} />
                </div>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Settings size={18} className="text-primary-600" />
                    Quick Configuration
                </h3>
                <div className="space-y-3">
                    <ActionButton icon={<Calendar size={18}/>} title="Academic Term Logic" />
                    <ActionButton icon={<Settings size={18}/>} title="GPA Grading System" />
                    <ActionButton icon={<Users size={18}/>} title="Onboard HR / Admins" />
                    <ActionButton icon={<Plus size={18}/>} title="Expand Branches" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, title }: { icon: ReactNode, title: string }) {
    return (
        <button className="flex w-full items-center justify-between rounded-xl border border-transparent bg-muted/30 px-4 py-3 text-sm font-bold transition-all hover:border-primary-100 hover:bg-primary-50 hover:text-primary-700 active:scale-[0.98]">
            <div className="flex items-center gap-3">
                <span className="text-primary-600">{icon}</span>
                {title}
            </div>
            <ArrowUpRight size={14} className="text-muted-foreground" />
        </button>
    )
}
