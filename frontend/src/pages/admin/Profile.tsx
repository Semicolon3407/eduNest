import React from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
  UserRound, Mail, Building, 
  Shield, Calendar, 
  Camera, Edit2, GraduationCap, Trophy,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex items-center justify-center h-full text-slate-400 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Encrypting Channel...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Administrator Portfolio</h1>
          <p className="text-gray-500 mt-1">Manage institutional operations and administrative oversight</p>
        </div>
        <Button className="rounded-xl shadow-premium h-12 flex items-center gap-2">
          <Edit2 size={18} /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-brand-500/5 transition-all group-hover:bg-brand-500/10"></div>
            <div className="relative pt-4">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-slate-100 rounded-[48px] border-4 border-white shadow-soft flex items-center justify-center text-brand-600 text-4xl font-display font-medium transition-transform group-hover:scale-105">
                  {user?.name?.charAt(0)}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-500 text-white rounded-2xl border-4 border-white flex items-center justify-center shadow-premium hover:bg-brand-600 transition-all active:scale-90">
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800 tracking-tight uppercase">{user?.name}</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">{user?.role}</p>
              
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                 <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Mail className="text-brand-500 shrink-0" size={16} />
                    <p className="text-xs font-bold text-slate-600 truncate uppercase tracking-tighter">{user?.email}</p>
                 </div>
                 <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Building className="text-brand-500 shrink-0" size={16} />
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Main Campus Cluster</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[40px] shadow-premium p-8 text-white">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Administrative Audit</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand-400">
                    <GraduationCap size={18} />
                  </div>
                  <span className="text-xs font-medium text-white/80">System Access</span>
                </div>
                <span className="text-lg font-bold">Lvl 4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-warning">
                    <Shield size={18} />
                  </div>
                  <span className="text-xs font-medium text-white/80">Security Protocol</span>
                </div>
                <span className="text-lg font-bold">AES-256</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                 <div className="flex items-center gap-3 text-brand-400">
                    <Activity size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Session: Active</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3 uppercase">
                <Building className="text-brand-500" size={20} /> Identity Profile
              </h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" value={user?.name || ''} readOnly icon={UserRound} />
              <Input label="Administrator ID" value={`ADM-${(user?._id || user?.id || '').slice(-4).toUpperCase()}`} readOnly icon={Shield} />
              <Input label="Official Email" value={user?.email || ''} readOnly icon={Mail} />
              <Input label="Role" value={user?.role || ''} readOnly icon={Shield} />
              <Input label="Responsible Wing" defaultValue="Main Campus Administration" icon={Building} />
              <Input label="Joined Date" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} readOnly icon={Calendar} />
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3 uppercase">
                <Trophy className="text-brand-500" size={20} /> Operational Milestones
              </h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-3">Admission Cycle</p>
                  <p className="text-sm font-bold text-slate-800 uppercase tracking-tight leading-none mb-2 underline decoration-brand-500 decoration-2">Status: Automated</p>
                  <p className="text-xs text-slate-500 font-medium">95% of initial onboarding completed successfully.</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-3">Security Audit</p>
                  <p className="text-sm font-bold text-slate-800 uppercase tracking-tight leading-none mb-2 underline decoration-success decoration-2">Status: Passed</p>
                  <p className="text-xs text-slate-500 font-medium">Administrative credential verification completed.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
