import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import SecurityTab from '../../components/profile/SecurityTab';
import { 
  Building2, Globe, Shield, 
  Edit2, Loader2, CreditCard, CheckCircle2, DollarSign, Calendar, RefreshCw, LifeBuoy
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../../components/profile/StripePaymentForm';
import { tenantService } from '../../services/tenantService';
import toast from 'react-hot-toast';

const stripePromise = loadStripe('pk_test_51SwPjgHiNWGpwACsRbwV9NSNTvU2QRQqemUXNBeAb3dTfCeLYd3rM2Kzef5jxRTeY85fy2dbkpHxqCmkCrATNfy200j7edhMu4');

const OrganizationProfile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'buy_plan'>('overview');
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isBuying, setIsBuying] = useState<string | null>(null);
  const [paymentIntentData, setPaymentIntentData] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
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

  const fetchSubscriptions = async () => {
    try {
      const response = await tenantService.getSubscriptions();
      if (response.success) {
        setSubscriptions(response.data.filter((s: any) => s.status === 'Active'));
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSubscriptions();

    // Check for payment status in URL
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Subscription upgraded successfully! Your plan is being activated.');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'cancel') {
      toast.error('Payment cancelled. Your subscription was not changed.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Auto-backfill: if subscription exists but dates are missing, silently recalculate
  useEffect(() => {
    const p = profile as any;
    if (p.subscription && !p.subscriptionExpiry && !loading) {
      tenantService.recalculateDates()
        .then((res) => {
          if (res.success) {
            setProfile((prev) => ({ ...prev, ...res.data }));
          }
        })
        .catch(() => { /* silent */ });
    }
  }, [(profile as any).subscription, (profile as any).subscriptionExpiry, loading]);

  const handleRecalculateDates = async () => {
    try {
      setIsRecalculating(true);
      const res = await tenantService.recalculateDates();
      if (res.success) {
        setProfile((prev) => ({ ...prev, ...res.data }));
        toast.success('Subscription dates recalculated');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to recalculate dates');
    } finally {
      setIsRecalculating(false);
    }
  };

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

  const handleBuyPlan = async (id: string) => {
    try {
      setIsBuying(id);
      const response = await tenantService.createPaymentIntent(id);
      if (response.success) {
        // Store subscriptionId so we can update DB directly after payment
        setPaymentIntentData({ ...response, subscriptionId: id });
        setIsPaymentModalOpen(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setIsBuying(null);
    }
  };

  const handlePaymentSuccess = async () => {
    // Directly update DB subscription (webhooks don't fire in local dev)
    if (paymentIntentData?.subscriptionId) {
      try {
        await tenantService.buyPlan(paymentIntentData.subscriptionId);
      } catch (err) {
        console.error('Failed to update subscription after payment:', err);
      }
    }
    setIsPaymentModalOpen(false);
    setPaymentIntentData(null);
    fetchData();
    toast.success('Subscription activated successfully!');
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
                <div className="text-sm font-bold text-success-dark flex items-center gap-2 uppercase tracking-tight">
                  <div className="w-2 h-2 rounded-full bg-success"></div> Verified
                </div>
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
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => navigate('/organization/support')}
              className="rounded-2xl h-14 px-8 bg-amber-500 hover:bg-amber-600 text-white shadow-sm shrink-0 flex items-center justify-center gap-2"
            >
              <LifeBuoy size={18} />
              Raise Problem Ticket
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating}
              className="rounded-2xl h-14 px-8 shadow-premium shrink-0 flex items-center justify-center gap-2"
            >
              {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Edit2 size={18} />} 
              Update Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 w-fit rounded-2xl border border-slate-200 font-sans">
        {(['overview', 'security', 'buy_plan'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-white text-brand-600 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-brand-500'
            }`}
          >
            {tab.replace('_', ' ')}
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

              {/* Subscription Plan Section */}
              <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 uppercase tracking-tight">Subscription Plan</h3>
                  {(profile as any).subscription && (
                    <button
                      onClick={handleRecalculateDates}
                      disabled={isRecalculating}
                      title="Recalculate start & expiry dates from plan duration"
                      className="flex items-center gap-1.5 text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <RefreshCw size={12} className={isRecalculating ? 'animate-spin' : ''} />
                      {isRecalculating ? 'Calculating...' : 'Recalculate'}
                    </button>
                  )}
                </div>
                {(() => {
                  const sub = (profile as any).subscription;
                  const startDate = (profile as any).subscriptionStartDate ? new Date((profile as any).subscriptionStartDate) : null;
                  const expiryDate = (profile as any).subscriptionExpiry ? new Date((profile as any).subscriptionExpiry) : null;
                  const now = new Date();
                  const isExpired = expiryDate ? expiryDate < now : false;
                  const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
                  const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
                  return (
                    <div className={`p-6 rounded-3xl border ${isExpired ? 'bg-red-50 border-red-100' : isExpiringSoon ? 'bg-amber-50 border-amber-100' : 'bg-brand-50 border-brand-100'}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-600">
                          <Shield size={22} />
                        </div>
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-500' : 'text-brand-400'}`}>Active Plan</p>
                          <h4 className={`text-lg font-bold leading-none ${isExpired ? 'text-red-900' : isExpiringSoon ? 'text-amber-900' : 'text-brand-900'}`}>
                            {sub?.name || 'Standard Tier'}
                          </h4>
                        </div>
                      </div>
                      <div className={`space-y-3 border-t pt-4 ${isExpired ? 'border-red-100' : isExpiringSoon ? 'border-amber-100' : 'border-brand-100'}`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-medium uppercase tracking-tight ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-600' : 'text-brand-600'}`}>Billing Cycle</span>
                          <span className={`font-bold uppercase ${isExpired ? 'text-red-900' : isExpiringSoon ? 'text-amber-900' : 'text-brand-900'}`}>{sub?.duration || 'Monthly'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-medium uppercase tracking-tight ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-600' : 'text-brand-600'}`}>Status</span>
                          <span className={`font-bold uppercase tracking-widest ${isExpired ? 'text-red-600' : 'text-success'}`}>
                            {isExpired ? 'Expired' : sub?.status || 'Active'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-medium uppercase tracking-tight ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-600' : 'text-brand-600'}`}>Institutional Rate</span>
                          <span className={`font-bold uppercase ${isExpired ? 'text-red-900' : isExpiringSoon ? 'text-amber-900' : 'text-brand-900'}`}>Rs {sub?.price?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="h-px bg-brand-100 opacity-60 my-1" />
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-medium uppercase tracking-tight ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-600' : 'text-brand-600'}`}>Start Date</span>
                          <span className={`font-bold ${isExpired ? 'text-red-900' : isExpiringSoon ? 'text-amber-900' : 'text-brand-900'}`}>
                            {startDate ? startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-medium uppercase tracking-tight ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-600' : 'text-brand-600'}`}>Expiry Date</span>
                          <span className={`font-bold ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-brand-900'}`}>
                            {expiryDate ? expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                          </span>
                        </div>
                        {isExpired && (
                          <div className="mt-2 flex items-center gap-2 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            Plan Expired — Renewal Required
                          </div>
                        )}
                        {isExpiringSoon && !isExpired && (
                          <div className="mt-2 flex items-center gap-2 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                            {daysLeft} Day{daysLeft !== 1 ? 's' : ''} Until Expiry
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
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

        {activeTab === 'buy_plan' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
              <h3 className="text-xl font-medium text-gray-900 mb-2 font-display">Available Subscription Plans</h3>
              <p className="text-slate-500 text-sm mb-8">Select a plan that fits your institution's growth and scale.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((sub) => {
                  const isCurrent = (profile as any).subscription?._id === sub._id;
                  return (
                    <div 
                      key={sub._id} 
                      className={`relative p-8 rounded-[32px] border-2 transition-all duration-300 ${
                        isCurrent 
                          ? 'border-brand-500 bg-brand-50/30' 
                          : 'border-slate-100 bg-white hover:border-brand-200 hover:shadow-premium'
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute top-4 right-4 bg-brand-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-sm">
                          <CheckCircle2 size={12} /> Current
                        </div>
                      )}
                      
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-500 mb-6 border border-slate-100">
                        <CreditCard size={24} />
                      </div>
                      
                      <h4 className="text-lg font-bold text-slate-800 uppercase tracking-tight mb-2">{sub.name}</h4>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-2xl font-display font-bold text-slate-900">Rs {sub.price.toLocaleString()}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ {sub.duration}</span>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <DollarSign size={16} className="text-brand-500" /> Professional Grade
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Calendar size={16} className="text-brand-500" /> {sub.duration} Billing
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Shield size={16} className="text-brand-500" /> Root Access Node
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleBuyPlan(sub._id)}
                        disabled={isCurrent || (isBuying !== null)}
                        className={`w-full rounded-2xl h-12 text-xs font-bold uppercase tracking-widest transition-all ${
                          isCurrent 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-none' 
                            : 'shadow-premium'
                        }`}
                      >
                        {isBuying === sub._id ? <Loader2 size={18} className="animate-spin" /> : (isCurrent ? 'Active Plan' : 'Purchase Plan')}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stripe Payment Modal */}
      {paymentIntentData && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title="Complete Subscription"
          description={`Securely finalize your upgrade to the ${paymentIntentData.subscriptionName} plan.`}
          maxWidth="xl"
        >
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret: paymentIntentData.clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#4f46e5',
                  borderRadius: '12px'
                }
              }
            }}
          >
            <StripePaymentForm 
              subscriptionName={paymentIntentData.subscriptionName}
              amount={paymentIntentData.amount}
              onSuccess={handlePaymentSuccess}
              onCancel={() => {
                setIsPaymentModalOpen(false);
                setPaymentIntentData(null);
              }}
            />
          </Elements>
        </Modal>
      )}
    </div>
  );
};

export default OrganizationProfile;
