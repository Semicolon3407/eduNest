import React, { useState, useEffect } from 'react';
import StatCard from '../../components/dashboard/StatCard';
import { CreditCard, ClipboardList, Briefcase, FileText, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { hrService } from '../../services/hrService';

const HRDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, leavesRes] = await Promise.all([
        hrService.getStats(),
        hrService.getLeaves()
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (leavesRes.success) setLeaves(leavesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Dashboard fetch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-brand-500" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compiling HR Insights...</p>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">People & Culture</h1>
        <p className="text-gray-500 mt-1">Manage staff lifecycle, payroll, and organizational wellness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Staff" value={stats?.totalStaff || '0'} icon={Briefcase} color="brand" />
        <StatCard title="Active Payroll" value={`$${stats?.lastPayroll?.toLocaleString() || '0'}`} icon={CreditCard} color="success" />
        <StatCard title="Leave Requests" value={`${stats?.pendingLeaves || '0'} Pending`} icon={ClipboardList} color="warning" />
        <StatCard title="Verified Docs" value="98%" icon={FileText} color="brand" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:p-8">
        {/* Leave Requests */}
        <div className="bg-surface rounded-2xl shadow-soft border border-surface-200">
           <div className="p-6 border-b border-surface-200 flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900  ">Leave Approvals</h2>
              <button className="text-brand-600 font-medium text-sm">View History</button>
           </div>
           <div className="p-4 space-y-4">
              {leaves.map((request) => (
                <div key={request._id} className="flex items-center justify-between p-4 rounded-2xl border border-surface-100 hover:bg-surface-50 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-medium text-sm uppercase">
                         {request.staff?.firstName?.[0]}{request.staff?.lastName?.[0]}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm whitespace-nowrap">{request.staff?.firstName} {request.staff?.lastName}</h4>
                        <p className="text-xs text-gray-500 font-medium truncate max-w-[150px]">{request.staff?.designation} • {request.type}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right mr-4 hidden sm:block">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Date</p>
                        <p className="text-xs font-medium text-gray-900">{new Date(request.appliedDate).toLocaleDateString()}</p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
                        request.status === 'Approved' ? 'bg-success-light text-success-dark border-success/20' :
                        request.status === 'Pending' ? 'bg-warning-light text-warning-dark border-warning/20' :
                        'bg-danger-light text-danger-dark border-danger/20'
                      )}>
                        {request.status === 'Approved' ? <CheckCircle2 size={12} /> : 
                         request.status === 'Pending' ? <Clock size={12} /> : <XCircle size={12} />}
                        <span className="capitalize">{request.status}</span>
                      </div>
                   </div>
                </div>
              ))}
              {leaves.length === 0 && (
                <div className="py-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                  No pending leave requests
                </div>
              )}
           </div>
        </div>

        {/* Payroll Summary */}
        <div className="bg-surface rounded-2xl shadow-soft border border-surface-200 p-6 flex flex-col justify-between">
           <div>
              <h2 className="text-xl font-medium text-gray-900  underline mb-2 ">Payroll Insights</h2>
              <p className="text-sm text-gray-500 mb-8 font-medium">Monthly distribution summary for Oct 2023</p>
              
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <span className="w-3 h-3 bg-brand-500 rounded-full"></span>
                       <span className="text-sm font-medium text-gray-700">Base Salary</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">$38,200</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <span className="w-3 h-3 bg-success rounded-full"></span>
                       <span className="text-sm font-medium text-gray-700">Bonuses</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">$2,450</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <span className="w-3 h-3 bg-danger rounded-full"></span>
                       <span className="text-sm font-medium text-gray-700">Tax Deductions</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">$1,850</span>
                 </div>
              </div>
           </div>

           <div className="mt-12 p-5 bg-surface-50 rounded-2xl border border-surface-200">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-brand-100">
                 <div>
                    <p className="text-[10px] font-medium text-gray-400  ">Next Payout Date</p>
                    <p className="text-lg font-medium text-brand-600">Oct 28, 2023</p>
                 </div>
                 <button className="bg-brand-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-brand-600 transition-all shadow-premium">
                    Run Payroll
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
