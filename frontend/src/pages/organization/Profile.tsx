import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
  Building2, Mail, Phone, MapPin, 
  Globe, Shield, 
  Camera, Edit2, Loader2
} from 'lucide-react';
import { tenantService } from '../../services/tenantService';
import toast from 'react-hot-toast';

const OrganizationProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-brand-500" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Institutional Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Organization Profile</h1>
          <p className="text-gray-500 mt-1">Manage institutional branding and administrative credentials</p>
        </div>
        <Button 
          onClick={handleUpdate}
          disabled={isUpdating}
          className="rounded-xl shadow-premium h-12 flex items-center gap-2"
        >
          {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Edit2 size={18} />} 
          Update Profile
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
                  {profile.name.charAt(0)}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-500 text-white rounded-2xl border-4 border-white flex items-center justify-center shadow-premium hover:bg-brand-600 transition-all active:scale-90">
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800 tracking-tight">{profile.name}</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Institutional Network</p>
              
              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Mail className="text-brand-500 shrink-0" size={16} />
                  <p className="text-xs font-bold text-slate-600 truncate">{profile.email}</p>
                </div>
                <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Globe className="text-brand-500 shrink-0" size={16} />
                  <p className="text-xs font-bold text-slate-600">{profile.website}</p>
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
                <Building2 className="text-brand-500" size={20} /> Corporate Identity
              </h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Organization Name" 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                icon={Building2} 
              />
              <Input 
                label="Tax Identification (VAT)" 
                value={profile.taxId} 
                onChange={(e) => setProfile({...profile, taxId: e.target.value})}
                icon={Shield} 
              />
              <Input 
                label="Official Email" 
                value={profile.email} 
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                icon={Mail} 
              />
              <Input 
                label="Business Phone" 
                value={profile.phone} 
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                icon={Phone} 
              />
              <Input 
                label="Organization Type" 
                value={(profile as any).type} 
                readOnly
                icon={Shield} 
              />
              <Input 
                label="Website" 
                value={profile.website} 
                onChange={(e) => setProfile({...profile, website: e.target.value})}
                icon={Globe} 
              />
              <div className="md:col-span-2">
                <Input 
                  label="Headquarters Address" 
                  value={profile.location} 
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  icon={MapPin} 
                />
              </div>
            </div>
          </div>

          <div className="bg-brand-50 p-8 rounded-[32px] border border-brand-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm border border-brand-200">
              <Shield size={22} />
            </div>
            <div>
              <h5 className="text-sm font-bold text-brand-600 uppercase tracking-tight leading-none mb-1">Institutional Node Status</h5>
              <p className="text-[10px] font-medium text-brand-700 opacity-70">This organization is currently verified and active within the EduNest network.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
