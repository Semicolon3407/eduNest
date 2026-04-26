import React, { useState, useEffect } from 'react';
import StatCard from '../../components/dashboard/StatCard';
import Badge from '../../components/ui/Badge';
import { School, Users, CreditCard, LifeBuoy, ArrowRight } from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard: React.FC = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [orgsRes, ticketsRes] = await Promise.all([
          superAdminService.getOrganizations(),
          superAdminService.getTickets()
        ]);
        
        if (orgsRes.success) setOrganizations(orgsRes.data);
        if (ticketsRes.success) setTickets(ticketsRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate metrics
  const totalBranches = organizations.reduce((sum, org) => sum + (org.branchCount || 0), 0);
  const activeOrgsCount = organizations.filter(org => org.status === 'Active').length;
  const totalRevenue = organizations.reduce((sum, org) => {
    return sum + (org.subscription?.price || 0);
  }, 0);

  const urgentTickets = tickets.filter(t => (t.priority === 'Critical' || t.priority === 'High') && t.status !== 'Resolved' && t.status !== 'Closed').length;

  const recentOrgs = [...organizations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  // Calculate Subscription Mix dynamically based on actual backend plans
  const totalOrgs = organizations.length || 1;
  const planDistribution = organizations.reduce((acc, org) => {
    const planName = org.subscription?.name || 'No Plan';
    acc[planName] = (acc[planName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedPlans = Object.entries(planDistribution)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([name, count]) => ({
      name,
      count: count as number,
      pct: Math.round(((count as number) / totalOrgs) * 100)
    }));

  const topPlans = sortedPlans.slice(0, 3);
  const colors = ['bg-brand-500', 'bg-success', 'bg-warning'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Global Overview</h1>
        <p className="text-gray-500 mt-1">Real-time analytics across all registered organizations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Branches" value={totalBranches.toString()} icon={School} trend={{ value: `${organizations.length} Orgs`, isUp: true }} color="brand" />
        <StatCard title="Active Orgs" value={activeOrgsCount.toString()} icon={Users} trend={{ value: 'Real-time', isUp: true }} color="success" />
        <StatCard title="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} icon={CreditCard} trend={{ value: 'From Subs', isUp: true }} color="warning" />
        <StatCard title="Support Tickets" value={tickets.length.toString()} icon={LifeBuoy} trend={{ value: `${urgentTickets} Urgent`, isUp: urgentTickets === 0 }} color={urgentTickets > 0 ? "danger" : "success"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-8">
        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-soft border border-surface-200 overflow-hidden">
          <div className="p-6 border-b border-surface-200 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Recent Organizations</h2>
            <button 
              onClick={() => navigate('/super-admin/organizations')}
              className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1 group"
            >
              View All <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 text-gray-500 text-sm tracking-wider font-medium">
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Branches</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {recentOrgs.map((org) => (
                  <tr key={org._id} onClick={() => navigate(`/super-admin/organizations/${org._id}`)} className="hover:bg-brand-50/30 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center font-medium text-brand-600">
                          {org.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors text-sm">{org.name}</p>
                          <p className="text-xs text-gray-500">{org.personalEmail || org.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 font-medium">{org.branchCount || 0} Branches</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">
                      Rs. {org.subscription?.price?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 font-sans">
                      <Badge 
                        variant={org.status === 'Active' ? 'success' : org.status === 'Pending' ? 'warning' : 'danger'}
                      >
                        {org.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {recentOrgs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">No organizations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-soft border border-surface-200 p-6">
          <h2 className="text-xl font-medium text-gray-900">Subscription Mix</h2>
          <p className="text-sm text-gray-500 mt-1">Platform-wide plan distribution</p>
          
          <div className="mt-8 space-y-6">
            {topPlans.map((plan, index) => (
              <div key={plan.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{plan.name}</span>
                  <span className="font-medium text-gray-900">{plan.pct}%</span>
                </div>
                <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${colors[index % colors.length]}`} 
                    style={{ width: `${plan.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {topPlans.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No plan data available</p>
            )}
          </div>

          <div className="mt-12 p-4 bg-brand-50 rounded-xl border border-brand-100">
            <h4 className="font-medium text-brand-700 text-sm">Pro Tip from System</h4>
            <p className="text-xs text-brand-700 mt-1 leading-relaxed">
              Enable "Auto-Suspend" for organizations with overdue invoices longer than 30 days to optimize system resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
