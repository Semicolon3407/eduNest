import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { 
  Building2, Mail, Phone, MapPin, 
  Globe, Shield, CreditCard, Users, 
  GitBranch, Camera, Edit2, Check,
  Zap, Star, Rocket, Loader2
} from 'lucide-react';
import { tenantService } from '../../services/tenantService';
import toast from 'react-hot-toast';

const plans = [
  {
    name: 'Basic Institutional',
    price: 'Rs. 199',
    period: '/month',
    icon: Zap,
    color: 'text-brand-500',
    bg: 'bg-brand-50',
    features: ['Up to 2 Branches', '500 Students', 'Basic Academic ERP', 'Email Support']
  },
  {
    name: 'Premium Network',
    price: 'Rs. 499',
    period: '/month',
    icon: Star,
    color: 'text-warning-dark',
    bg: 'bg-warning-light/30',
    features: ['Up to 10 Branches', '5,000 Students', 'Advanced HR & Payroll', '24/7 Priority Support']
  },
  {
    name: 'Cloud Enterprise',
    price: 'Custom',
    period: '',
    icon: Rocket,
    color: 'text-success-dark',
    bg: 'bg-success-light/30',
    features: ['Unlimited Branches', 'Unlimited Students', 'Full White-labeling', 'Dedicated Account Manager'],
    active: true
  }
];

const OrganizationProfile: React.FC = () => {
  const [currentPlan, _setCurrentPlan] = useState('Cloud Enterprise');
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

          {/* Institutional Stats */}
          <div className="bg-slate-900 rounded-[40px] shadow-premium p-8 text-white group">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Network Statistics</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand-400">
                    <GitBranch size={18} />
                  </div>
                  <span className="text-xs font-medium text-white/80">Active Branches</span>
                </div>
                <span className="text-lg font-bold">--</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-success">
                    <Users size={18} />
                  </div>
                  <span className="text-xs font-medium text-white/80">Total Students</span>
                </div>
                <span className="text-lg font-bold">--</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                 <button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                    System Audit Logs
                 </button>
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

          <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3 uppercase">
                <CreditCard className="text-brand-500" size={20} /> Super Admin Subscriptions
              </h3>
              <Badge variant="success" className="font-black h-7 px-4 uppercase tracking-tighter">Current: {currentPlan}</Badge>
            </div>
            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div 
                      key={plan.name}
                      className={`relative p-6 rounded-[32px] border transition-all hover:scale-[1.02] ${plan.active ? 'border-brand-500 bg-brand-50/10 shadow-soft' : 'border-slate-100 bg-slate-50/50 grayscale hover:grayscale-0'}`}
                    >
                      {plan.active && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-premium">
                          Active Plan
                        </div>
                      )}
                      <div className={`w-12 h-12 ${plan.bg} ${plan.color} rounded-2xl flex items-center justify-center mb-4`}>
                        <plan.icon size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">{plan.name}</h4>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-2xl font-display font-medium text-slate-900">{plan.price}</span>
                        <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-start gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                            <Check size={14} className="text-success-dark shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button 
                        className={`w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${plan.active ? 'bg-brand-500 text-white shadow-premium' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-500 hover:text-brand-500 shadow-sm'}`}
                        disabled={plan.active}
                      >
                        {plan.active ? 'Managed by Admin' : 'Switch Plan'}
                      </button>
                    </div>
                  ))}
               </div>
               
               <div className="mt-8 p-6 bg-slate-900 rounded-[32px] border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white uppercase tracking-tight">Institutional Billing Cycle</h5>
                    <p className="text-xs text-white/50 mt-1">Your next automatic renewal is scheduled for <span className="text-brand-400 font-bold">Dec 15, 2024</span>.</p>
                  </div>
                  <button className="h-10 px-6 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                     View Invoices
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
