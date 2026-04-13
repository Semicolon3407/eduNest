import { Building2, Users, CreditCard, Activity } from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';

export function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Overview</h1>
        <p className="mt-2 text-muted-foreground">Monitor the entire EduNest platform performance.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Schools" 
          value="124" 
          icon={<Building2 size={24} />} 
          trend={{ value: 12, isUp: true }}
        />
        <StatCard 
          title="Active Users" 
          value="45.2k" 
          icon={<Users size={24} />} 
          trend={{ value: 8, isUp: true }}
        />
        <StatCard 
          title="Total Revenue" 
          value="$128,430" 
          icon={<CreditCard size={24} />} 
          trend={{ value: 15, isUp: true }}
        />
        <StatCard 
          title="System Uptime" 
          value="99.99%" 
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
            {[
              { name: 'Westfield College', status: 'Active', plan: 'Enterprise', date: '2 hours ago' },
              { name: 'Green Valley School', status: 'Pending', plan: 'Pro', date: '5 hours ago' },
              { name: 'St. Mary\'s Academy', status: 'Active', plan: 'Basic', date: '1 day ago' },
              { name: 'Horizon Institute', status: 'Suspended', plan: 'Pro', date: '2 days ago' },
            ].map((org, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground font-bold">
                    {org.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{org.name}</p>
                    <p className="text-xs text-muted-foreground">{org.plan} Plan</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className={`rounded-full px-2 py-1 font-bold ${
                    org.status === 'Active' ? 'bg-green-50 text-green-600' : 
                    org.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {org.status}
                  </span>
                  <p className="mt-1 text-muted-foreground">{org.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold">System Health</h2>
          </div>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span>Database Load</span>
                <span>24%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary-600 transition-all" style={{ width: '24%' }}></div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span>Storage Utilization</span>
                <span>68%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary-600 transition-all" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span>Support Tickets (Open)</span>
                <span>12</span>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="" className="rounded-full" />
                  </div>
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold">
                  +8
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
