import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import Badge from '../../components/ui/Badge';
import { School, Users, CreditCard, LifeBuoy, ArrowRight, MoreVertical } from 'lucide-react';


const organizations = [
  { id: 1, name: 'Springfield Academy', owner: 'John Smith', plan: 'Enterprise', status: 'Active', schools: 4, revenue: '$4,200', date: 'Oct 12, 2023' },
  { id: 2, name: 'Lakeside College', owner: 'Sarah Johnson', plan: 'Standard', status: 'Pending', schools: 1, revenue: '$1,500', date: 'Oct 14, 2023' },
  { id: 3, name: 'Elite International', owner: 'Michael Brown', plan: 'Enterprise', status: 'Active', schools: 2, revenue: '$3,800', date: 'Oct 15, 2023' },
  { id: 4, name: 'Greenwood High', owner: 'Emma Wilson', plan: 'Standard', status: 'Suspended', schools: 1, revenue: '$1,200', date: 'Oct 16, 2023' },
];

const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Global Overview</h1>
        <p className="text-gray-500 mt-1">Real-time analytics across all registered organizations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Schools" value="1,284" icon={School} trend={{ value: '+12%', isUp: true }} color="brand" />
        <StatCard title="Active Users" value="48.5k" icon={Users} trend={{ value: '+5.4%', isUp: true }} color="success" />
        <StatCard title="Total Revenue" value="$142,400" icon={CreditCard} trend={{ value: '-2.1%', isUp: false }} color="warning" />
        <StatCard title="Support Tickets" value="24" icon={LifeBuoy} trend={{ value: '4 Urgent', isUp: false }} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-8">
        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-soft border border-surface-200 overflow-hidden">
          <div className="p-6 border-b border-surface-200 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Recent Organizations</h2>
            <button className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1 group">
              View All <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
             <div className="overflow-x-auto"><table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 text-gray-500 text-sm  tracking-wider font-medium">
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Schools</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-brand-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center font-medium text-brand-600">
                          {org.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors   text-sm">{org.name}</p>
                          <p className="text-xs text-gray-500">{org.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 font-medium">{org.schools} Branches</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">
                      {org.revenue}
                    </td>
                    <td className="px-6 py-4 font-sans">
                      <Badge 
                        variant={org.status === 'Active' ? 'success' : org.status === 'Pending' ? 'warning' : 'danger'}
                      >
                        {org.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-surface-100 rounded-lg text-gray-400">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-soft border border-surface-200 p-6">
          <h2 className="text-xl font-medium text-gray-900">Subscription Mix</h2>
          <p className="text-sm text-gray-500 mt-1">Platform-wide plan distribution</p>
          
          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Enterprise</span>
                <span className="font-medium text-gray-900">65%</span>
              </div>
              <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Standard</span>
                <span className="font-medium text-gray-900">25%</span>
              </div>
              <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Free Trial</span>
                <span className="font-medium text-gray-900">10%</span>
              </div>
              <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-4 bg-brand-50 rounded-xl border border-brand-100">
            <h4 className="font-medium text-brand-900 text-sm">Pro Tip from System</h4>
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
