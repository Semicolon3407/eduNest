import { Plus, Search, Filter, MoreVertical, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function OrganizationManagement() {
  const organizations = [
    { id: '1', name: 'Westfield College', owner: 'Jane Doe', email: 'jane@westfield.com', status: 'Active', plan: 'Enterprise', branches: 4, joined: 'Mar 12, 2025' },
    { id: '2', name: 'Green Valley School', owner: 'John Smith', email: 'john@greenvalley.com', status: 'Pending', plan: 'Pro', branches: 1, joined: 'Apr 02, 2025' },
    { id: '3', name: 'St. Mary\'s Academy', owner: 'Sr. Catherine', email: 'info@stmarys.edu', status: 'Active', plan: 'Basic', branches: 2, joined: 'Jan 15, 2025' },
    { id: '4', name: 'Horizon Institute', owner: 'Dr. Brown', email: 'contact@horizon.ac', status: 'Suspended', plan: 'Pro', branches: 3, joined: 'Feb 20, 2025' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Management</h1>
          <p className="mt-1 text-muted-foreground">Approve, suspend, or manage institutions on the platform.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95">
          <Plus size={18} />
          Add Organization
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, owner, or email..." 
            className="w-full rounded-xl border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-bold hover:bg-muted">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-muted/50 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-4 ">Organization</th>
                <th className="px-6 py-4 ">Owner</th>
                <th className="px-6 py-4 ">Status</th>
                <th className="px-6 py-4 ">Plan</th>
                <th className="px-6 py-4 ">Branches</th>
                <th className="px-6 py-4 ">Joined</th>
                <th className="px-6 py-4 "></th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {organizations.map((org) => (
                <tr key={org.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-bold group-hover:scale-110 transition-transform">
                        {org.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{org.name}</p>
                        <p className="text-xs text-muted-foreground">{org.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{org.owner}</p>
                    <p className="text-xs text-muted-foreground">{org.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold",
                      org.status === 'Active' ? "bg-green-50 text-green-600" :
                      org.status === 'Pending' ? "bg-yellow-50 text-yellow-600" :
                      "bg-red-50 text-red-600"
                    )}>
                      {org.status === 'Active' ? <CheckCircle2 size={12} /> : 
                       org.status === 'Pending' ? <Clock size={12} /> : <XCircle size={12} />}
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded text-xs">{org.plan}</span>
                  </td>
                  <td className="px-6 py-4 font-medium">{org.branches}</td>
                  <td className="px-6 py-4 text-muted-foreground">{org.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
