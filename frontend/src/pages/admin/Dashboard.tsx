import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/dashboard/StatCard';
import Badge from '../../components/ui/Badge';
import { UserPlus, BookOpen, CreditCard, ArrowUpRight, ArrowDownRight, MoreHorizontal, ArrowRight } from 'lucide-react';
import { adminService } from '../../services/adminService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [admissions, setAdmissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getStudents()
        ]);
        if (statsRes.success) {
          setStats(statsRes.data);
        }
        if (studentsRes.success) {
          setAdmissions(studentsRes.data.slice(0, 5)); // Show latest 5
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Operations Center</h1>
        <p className="text-gray-500 mt-1">Manage admissions, classes, and day-to-day logistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="New Admissions" value={stats?.studentCount?.toString() || "0"} icon={UserPlus} trend={{ value: stats?.admissionTrend || '0%', isUp: (parseInt(stats?.admissionTrend) || 0) >= 0 }} color="brand" />
        <StatCard title="Active Classes" value={stats?.activeClasses?.toString() || "0"} icon={BookOpen} color="success" />
        <StatCard title="Pending Fees" value={`Rs. ${(stats?.fees?.filter((f: any) => f._id === 'Pending' || f._id === 'Overdue').reduce((acc: number, f: any) => acc + f.total, 0) || 0).toLocaleString()}`} icon={CreditCard} color="danger" />
        <StatCard title="Cleared Fees" value={`Rs. ${(stats?.fees?.find((f: any) => f._id === 'Paid')?.total || 0).toLocaleString()}`} icon={CreditCard} color="success" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:p-8">
        {/* Admission Pipeline */}
        <div className="bg-surface rounded-2xl shadow-soft border border-surface-200">
          <div className="p-6 border-b border-surface-200 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Admission Pipeline</h2>
            <button className="text-brand-600 font-medium text-sm  ">Process All</button>
          </div>
          <div className="p-4">
             <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] font-medium  ">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {admissions.map((student) => (
                  <tr key={student._id} className="group hover:bg-surface-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-sm text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight leading-none mb-1">{student.firstName} {student.lastName}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{student.admissionNumber}</p>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-600">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-gray-900 leading-none mb-1">{student.class?.name}</p>
                        <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest leading-none">SEC {student.class?.section}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={
                        student.status === 'Active' ? 'success' :
                        student.status === 'Pending' ? 'warning' : 'danger'
                      }>
                        {student.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-brand-600 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Collection */}
        <div className="bg-surface rounded-2xl shadow-soft border border-surface-200 p-6 flex flex-col">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Fee Collections</h2>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-success/10 to-transparent border border-success/20">
               <div className="flex justify-between items-start">
                 <div className="p-2 bg-success text-white rounded-lg"><ArrowUpRight size={20} /></div>
               </div>
              <p className="mt-4 text-sm text-gray-500 font-medium  ">Collected Today</p>
              <h4 className="text-2xl font-medium text-gray-900">Rs. {(stats?.collectedToday || 0).toLocaleString()}</h4>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-danger/10 to-transparent border border-danger/20">
               <div className="flex justify-between items-start">
                 <div className="p-2 bg-danger text-white rounded-lg"><ArrowDownRight size={20} /></div>
               </div>
              <p className="mt-4 text-sm text-gray-500 font-medium  ">Pending Dues</p>
              <h4 className="text-2xl font-medium text-gray-900">Rs. {(stats?.fees?.filter((f: any) => f._id === 'Pending' || f._id === 'Overdue').reduce((acc: number, f: any) => acc + f.total, 0) || 0).toLocaleString()}</h4>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-surface-100 space-y-3">
             <div className="flex justify-between items-center p-3 hover:bg-surface-50 rounded-xl transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600"><CreditCard size={14}/></div>
                  <span className="text-sm font-medium text-gray-700">Generate Defaulter List</span>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-600 transition-all group-hover:translate-x-1" />
             </div>
             <div className="flex justify-between items-center p-3 hover:bg-surface-50 rounded-xl transition-colors cursor-pointer group" onClick={() => navigate('/admin/fee-collection')}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success-light flex items-center justify-center text-success-dark"><CreditCard size={14}/></div>
                  <span className="text-sm font-medium text-gray-700">View Transaction History</span>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-600 transition-all group-hover:translate-x-1" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
