import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SecurityTab from '../../components/profile/SecurityTab';
import { 
  Building2, Globe, Shield, 
  Edit2, Loader2
} from 'lucide-react';
import { tenantService } from '../../services/tenantService';
import toast from 'react-hot-toast';

const OrganizationProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'security'>('overview');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    personalEmail: '',
    phone: '',
    location: '',
    taxId: 'VAT-9988-1122', // Placeholder as not in schema yet
    website: 'www.edunest.com' // Placeholder
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await tenantService.getProfile();
      if (response.success) {
        setProfile({
          ...profile,
          ...response.data
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const response = await tenantService.updateProfile(profile);
      if (response.success) {
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      {/* Header Profile Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 rounded-[40px] bg-brand-500 text-white flex items-center justify-center text-4xl font-bold shadow-premium shrink-0 ring-8 ring-brand-50">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-display font-medium text-gray-900 leading-none  ">{profile.name}</h1>
                <Badge variant="brand" className="w-fit mx-auto md:mx-0">Institutional Network</Badge>
              </div>
              <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <Globe size={16} className="text-brand-500" /> {profile.website}
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tax Identity</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Shield size={16} className="text-brand-500" /> {profile.taxId}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-success-dark flex items-center gap-2 uppercase tracking-tight">
                  <div className="w-2 h-2 rounded-full bg-success"></div> Verified
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Official Node</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2 font-display">
                  Root Entity
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Network</p>
                <p className="text-sm font-bold text-brand-600 flex items-center gap-2">
                  <Globe size={16} /> EduNest Global
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            className="rounded-2xl h-14 px-8 shadow-premium shrink-0 flex items-center gap-2"
          >
            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Edit2 size={18} />} 
            Update Profile
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 w-fit rounded-2xl border border-slate-200 font-sans">
        {(['overview', 'security'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-white text-brand-600 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-brand-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="animate-in slide-in-from-bottom-4 duration-500 font-sans">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Corporate Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
                <h3 className="text-xl font-medium text-gray-900 mb-8 border-b border-slate-100 pb-4  ">Corporate Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Organization Name</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl h-12 px-4 text-sm font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tax Identification</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl h-12 px-4 text-sm font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                        value={profile.taxId}
                        onChange={(e) => setProfile({...profile, taxId: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Official Email</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl h-12 px-4 text-sm font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Business Phone</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl h-12 px-4 text-sm font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Website</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl h-12 px-4 text-sm font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                        value={profile.website}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Organization Type</label>
                      <input 
                        className="w-full bg-slate-100 border border-slate-100 rounded-xl h-12 px-4 text-sm font-bold text-slate-400 cursor-not-allowed"
                        value={(profile as any).type || 'N/A'}
                        readOnly
                      />
                   </div>
                   <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Headquarters Address</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl h-12 px-4 text-sm font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                      />
                   </div>
                </div>
              </div>

              <div className="bg-brand-50 p-8 rounded-[40px] border border-brand-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-brand-500">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-brand-700 leading-none  ">Institutional Standing</h4>
                    <p className="text-brand-600 text-sm mt-2 font-medium">Verified Root Node in the EduNest Ecosystem</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Context */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
                <h3 className="text-lg font-medium text-gray-900 mb-6 uppercase tracking-tight  ">Institutional Status</h3>
                <div className="space-y-6">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verification Node</p>
                      <p className="text-sm font-bold text-slate-800 uppercase tracking-tight leading-none mb-2">Authenticated</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Network Health</p>
                      <p className="text-sm font-bold text-success uppercase tracking-tight leading-none mb-2 font-display">Optimal</p>
                   </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-premium relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-500 rounded-full -mb-16 -mr-16 opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-lg font-medium mb-2 relative z-10  ">Root Access Key</h3>
                <p className="text-slate-400 text-xs mb-8 relative z-10">Institutional identifier for global API and node access.</p>
                <div className="bg-white/10 h-1 rounded-full mb-8 relative z-10"><div className="bg-brand-500 h-full w-full rounded-full"></div></div>
                <Button className="w-full h-12 rounded-xl bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all relative z-10">
                   {(profile as any)._id?.slice(-8).toUpperCase() || 'ORG-ROOT-001'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
};

export default OrganizationProfile;
