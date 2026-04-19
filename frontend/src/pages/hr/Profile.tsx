import React from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
  UserRound, Mail, Phone, Briefcase, 
  MapPin, Shield, Calendar, Users, 
  Camera, Edit2, FileText, PieChart
} from 'lucide-react';

const HRProfile: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">My Professional Profile</h1>
          <p className="text-gray-500 mt-1">Manage your administrative credentials and HR portfolio</p>
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
                  ED
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-500 text-white rounded-2xl border-4 border-white flex items-center justify-center shadow-premium hover:bg-brand-600 transition-all active:scale-90">
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800 tracking-tight text-uppercase uppercase">Emily Davis</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Senior HR Manager</p>
              
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                 <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Mail className="text-brand-500 shrink-0" size={16} />
                    <p className="text-xs font-bold text-slate-600 truncate uppercase tracking-tighter">emily.d@school.com</p>
                 </div>
                 <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Shield className="text-brand-500 shrink-0" size={16} />
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest">HR-EXEC-22</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="bg-slate-900 rounded-[40px] shadow-premium p-8 text-white">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6">HR Operational Audit</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand-400">
                    <Users size={18} />
                  </div>
                  <span className="text-xs font-medium text-white/80">Staff Oversight</span>
                </div>
                <span className="text-lg font-bold">128</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-success">
                    <PieChart size={18} />
                  </div>
                  <span className="text-xs font-medium text-white/80">Payroll Accuracy</span>
                </div>
                <span className="text-lg font-bold">100%</span>
              </div>
              <div className="pt-4 border-t border-white/10 text-center">
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Next Review: Oct 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3 uppercase">
                <Briefcase className="text-brand-500" size={20} /> Professional Details
              </h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" defaultValue="Emily Davis" icon={UserRound} />
              <Input label="Staff ID" defaultValue="EMP-003" icon={Shield} />
              <Input label="Official Email" defaultValue="emily.d@school.com" icon={Mail} />
              <Input label="Contact Number" defaultValue="+1 (555) 888-2222" icon={Phone} />
              <Input label="Department" defaultValue="Human Resources" icon={Briefcase} />
              <Input label="Joined Date" defaultValue="Aug 01, 2022" icon={Calendar} />
              <div className="md:col-span-2">
                <Input label="Office Location" defaultValue="HR Suite, North Wing, Level 2" icon={MapPin} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3 uppercase">
                <FileText className="text-brand-500" size={20} /> Access & Documents
              </h3>
            </div>
            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-brand-50 hover:border-brand-100 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand-600 shadow-sm border border-slate-100">
                           <FileText size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Employment Contract</p>
                           <p className="text-[10px] text-slate-400 font-medium">Verified Oct 2023</p>
                        </div>
                     </div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-brand-50 hover:border-brand-100 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand-600 shadow-sm border border-slate-100">
                           <Shield size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Access Credentials</p>
                           <p className="text-[10px] text-slate-400 font-medium">Level 4 Clearance</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="mt-8 p-6 bg-brand-50/50 rounded-[32px] border border-brand-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm border border-brand-200">
                      <Shield size={22} />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-brand-600 uppercase tracking-tight leading-none mb-1">Secure HR Access</h5>
                      <p className="text-[10px] font-medium text-brand-700 opacity-70">Your employee data is protected by institutional-grade encryption.</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRProfile;
