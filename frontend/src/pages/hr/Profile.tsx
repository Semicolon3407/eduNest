import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
  UserRound, Mail, Phone, Briefcase, 
  MapPin, Shield, Calendar, 
  Camera, Edit2, PieChart, Loader2
} from 'lucide-react';
import { hrService } from '../../services/hrService';
import toast from 'react-hot-toast';

const HRProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await hrService.getMyProfile();
      if (response.success) setProfile(response.data);
    } catch (error) {
      toast.error('Identity verification failed');
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
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verifying Identity...</p>
      </div>
    );
  }

  const initials = profile ? `${profile.firstName?.[0]}${profile.lastName?.[0]}` : '??';
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
                   {initials}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-500 text-white rounded-2xl border-4 border-white flex items-center justify-center shadow-premium hover:bg-brand-600 transition-all active:scale-90">
                   <Camera size={18} />
                </button>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800 tracking-tight text-uppercase uppercase">{profile?.firstName} {profile?.lastName}</h3>
              <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest italic">{profile?.designation}</p>
              
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                 <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Mail className="text-brand-500 shrink-0" size={16} />
                    <p className="text-xs font-bold text-slate-600 truncate uppercase tracking-tighter">{profile?.personalEmail}</p>
                 </div>
                 <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Shield className="text-brand-500 shrink-0" size={16} />
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest">{profile?.employeeId}</p>
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
                <Briefcase className="text-brand-500" size={20} /> Professional Details
              </h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" value={profile?.firstName} icon={UserRound} readOnly />
              <Input label="Last Name" value={profile?.lastName} icon={UserRound} readOnly />
              <Input label="Staff ID" value={profile?.employeeId} icon={Shield} readOnly />
              <Input label="Official Email" value={profile?.personalEmail} icon={Mail} readOnly />
              <Input label="Contact Number" value={profile?.phone || 'N/A'} icon={Phone} readOnly />
              <Input label="Department" value={profile?.department} icon={Briefcase} readOnly />
              <Input label="Designation" value={profile?.designation} icon={Calendar} readOnly />
              <div className="md:col-span-2">
                <Input label="Branch" value={profile?.branch?.name || 'Main Campus'} icon={MapPin} readOnly />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3 uppercase">
                <Shield className="text-brand-500" size={20} /> Security & Status
              </h3>
            </div>
            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-slate-100">
                           <PieChart size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Employment Status</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{profile?.status}</p>
                        </div>
                     </div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-slate-100">
                           <Shield size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Identity Verified</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Multi-Tenant Node</p>
                        </div>
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
