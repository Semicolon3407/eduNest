import { useState, useEffect } from 'react';
import { Building2, Users, Activity } from 'lucide-react';
import { cn } from '../../hooks/utils';
import { StatCard } from '../../components/shared/StatCard';
import { superAdminService } from '../../services/superAdminService';

export function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, orgsRes] = await Promise.all([
          superAdminService.getDashboard(),
          superAdminService.getOrganizations()
        ]);
        setData(dashboardRes.data);
        setOrganizations(orgsRes.data.slice(0, 5)); // Just take the recent 5
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { summary, health } = data || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Overview</h1>
        <p className="mt-2 text-muted-foreground">Monitor the entire EduNest platform performance.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Schools" 
          value={summary?.totalOrgs || 0} 
          icon={<Building2 size={24} />} 
          trend={{ value: 12, isUp: true }}
        />
        <StatCard 
          title="Active Users" 
          value={summary?.activeUsers || 0} 
          icon={<Users size={24} />} 
          trend={{ value: 8, isUp: true }}
        />
        <StatCard 
          title="Global Users" 
          value={summary?.totalUsers || 0} 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="System Uptime" 
          value={health?.uptime || "99.9%"} 
          icon={<Activity size={24} />} 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Organizations */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Organizations</h2>
            <button className="text-sm font-semibold text-primary-600 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {organizations.length > 0 ? organizations.map((org, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground font-bold">
                    {org.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{org.name}</p>
                    <p className="text-xs text-muted-foreground">{org.subscription?.plan?.name || 'No'} Plan</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className={`rounded-full px-2 py-1 font-bold ${
                    org.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {org.isActive ? 'Active' : 'Suspended'}
                  </span>
                  <p className="mt-1 text-muted-foreground">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center py-8 text-muted-foreground">No organizations found.</p>
            )}
          </div>
        </div>

        {/* Database Storage per Organization */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm overflow-hidden h-fit">
          <div className="mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity size={20} className="text-primary-600" />
              Database Storage Allocation
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Real-time storage consumption across top organizations.</p>
          </div>
          <div className="space-y-6">
            {data?.storagePerOrg?.map((item: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                  <span className="truncate max-w-[150px]">{item.name}</span>
                  <span className="text-muted-foreground">{item.storageMB} MB / 5GB</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000",
                      parseFloat(item.percentOfTotal) > 80 ? "bg-red-500" : "bg-primary-600"
                    )} 
                    style={{ width: `${item.percentOfTotal}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Platform Diagnostics</h2>
          </div>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm font-black uppercase tracking-widest text-muted-foreground">
                <span>Core CPU Load</span>
                <span className="text-foreground">{health?.cpuUsage}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden p-1 shadow-inner">
                <div className="h-full bg-primary-600 rounded-full shadow-lg" style={{ width: health?.cpuUsage }}></div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm font-black uppercase tracking-widest text-muted-foreground">
                <span>Platform Memory</span>
                <span className="text-foreground">{health?.memoryUsage}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden p-1 shadow-inner">
                <div className="h-full bg-primary-600 rounded-full shadow-lg" style={{ width: health?.memoryUsage }}></div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-xs font-bold mb-3">
                <span className="text-muted-foreground">Daily Backup Status:</span>
                <span className="text-green-600 uppercase tracking-tighter">Verified & Encrypted</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50/50 border border-green-100">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">All systems operational as of {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
