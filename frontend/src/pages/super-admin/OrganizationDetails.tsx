import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, Users, UserRound, GraduationCap, Briefcase, ShieldCheck, 
  ArrowLeft, MapPin, Calendar, Mail, Phone, Clock, Ban, CheckCircle2,
  CreditCard, RefreshCw
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { superAdminService } from '../../services/superAdminService';
import toast from 'react-hot-toast';

const OrganizationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [org, setOrg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const fetchOrganization = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await superAdminService.getOrganizationById(id);
      if (response.success) {
        setOrg(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch organization:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  // Auto-backfill when org has a subscription but no dates yet
  useEffect(() => {
    if (
      org &&
      org.subscription &&
      !org.subscriptionExpiry &&
      id
    ) {
      superAdminService.recalculateSubscriptionDates(id).then((res) => {
        if (res.success) {
          setOrg(res.data);
        }
      }).catch(() => { /* silent */ });
    }
  }, [org?.subscription, org?.subscriptionExpiry, id]);

  const handleUpdateStatus = async (status: string) => {
    if (!org) return;
    try {
      const response = await superAdminService.updateOrganizationStatus(org._id, status);
      if (response.success) {
        setOrg(response.data);
        toast.success(`Organization ${status === 'Active' ? 'unblocked' : 'suspended'}`);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleRecalculate = async () => {
    if (!id) return;
    try {
      setIsRecalculating(true);
      const response = await superAdminService.recalculateSubscriptionDates(id);
      if (response.success) {
        setOrg(response.data);
        toast.success('Subscription dates recalculated');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to recalculate dates');
    } finally {
      setIsRecalculating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Retrieving Details...</p>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900">Organization not found</h2>
        <Button onClick={() => navigate('/super-admin/organizations')} className="mt-4 rounded-xl">
          Back to List
        </Button>
      </div>
    );
  }

  // Subscription date helpers
  const now = new Date();
  const subExpiry = org.subscriptionExpiry ? new Date(org.subscriptionExpiry) : null;
  const isExpired = subExpiry ? subExpiry < now : false;
  const daysLeft = subExpiry ? Math.ceil((subExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

  const fmtDate = (d: string | Date | null) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/super-admin/organizations')}
            className="p-2 hover:bg-surface-100 rounded-xl text-gray-400 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900">{org.name}</h1>
              <Badge variant={
                org.status === 'Active' ? 'success' :
                org.status === 'Pending' ? 'warning' : 'danger'
              }>
                {org.status}
              </Badge>
            </div>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Building2 size={16} /> {org.type} • <MapPin size={16} /> {org.location}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-surface-200">
            Edit Details
          </Button>
          <Button className="rounded-xl shadow-premium">
            Manage System
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        <StatCard title="Branches" value={(org.branchCount || 0).toString()} icon={Building2} color="brand" />
        <StatCard title="Total Students" value="--" icon={Users} color="success" />
        <StatCard title="Administrative" value="--" icon={ShieldCheck} color="warning" />
        <StatCard title="Total Staffs" value="--" icon={UserRound} color="brand" />
        <StatCard title="Expert Tutors" value="--" icon={GraduationCap} color="success" />
        <StatCard title="HR Personnel" value="--" icon={Briefcase} color="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Card */}
        <div className="lg:col-span-1 bg-surface rounded-3xl p-6 shadow-soft border border-surface-200 h-full">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-brand-500" /> Organization Info
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-gray-400 shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary Email</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{org.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-gray-400 shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Email</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{org.personalEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-gray-400 shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{org.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-gray-400 shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registered Since</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{fmtDate(org.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions / More Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface rounded-3xl p-8 shadow-soft border border-surface-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Administrative Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                   <ShieldCheck size={18} className="text-brand-500" /> Account Status
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Maintain and monitor the institutional access to the EduNest platform.
                </p>
                <div className="mt-4">
                   <Badge variant={org.status === 'Active' ? 'success' : 'danger'}>{org.status}</Badge>
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Ban size={18} className="text-red-500" /> Resource Lock
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-sans">Toggle tenant accessibility</p>
                </div>
                <div className="mt-4">
                  {org.status === 'Suspended' ? (
                    <Button onClick={() => handleUpdateStatus('Active')} className="w-full rounded-xl bg-success hover:bg-success-dark">
                      <CheckCircle2 size={16} className="mr-2" /> Unblock Organization
                    </Button>
                  ) : (
                    <Button onClick={() => handleUpdateStatus('Suspended')} className="w-full rounded-xl bg-red-500 hover:bg-red-600">
                      <Ban size={16} className="mr-2" /> Block Organization
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plan Card */}
          <div className="bg-surface rounded-3xl p-8 shadow-soft border border-surface-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CreditCard size={20} className="text-brand-500" /> Subscription Plan
              </h2>
              {org.subscription && (
                <button
                  onClick={handleRecalculate}
                  disabled={isRecalculating}
                  title="Recalculate start & expiry dates from plan duration"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-all"
                >
                  <RefreshCw size={12} className={isRecalculating ? 'animate-spin' : ''} />
                  {isRecalculating ? 'Calculating...' : 'Recalculate Dates'}
                </button>
              )}
            </div>

            {org.subscription ? (
              <div className="space-y-4">
                {/* Plan header */}
                <div className="flex items-center justify-between p-4 bg-brand-50 rounded-2xl border border-brand-100">
                  <div>
                    <p className="text-xs font-bold text-brand-400 uppercase tracking-widest">Active Plan</p>
                    <p className="text-xl font-bold text-brand-700 mt-1">{org.subscription.name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isExpired ? 'bg-red-100 text-red-700' : 'bg-brand-100 text-brand-700'}`}>
                    {isExpired ? 'Expired' : 'Active'}
                  </span>
                </div>

                {/* 2×3 info grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Billing Cycle */}
                  <div className="p-4 bg-surface-50 rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Billing Cycle</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{org.subscription.duration}</p>
                  </div>

                  {/* Price */}
                  <div className="p-4 bg-surface-50 rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">Rs {org.subscription.price?.toLocaleString()}</p>
                  </div>

                  {/* Start Date */}
                  <div className="p-4 bg-surface-50 rounded-xl">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={10} /> Start Date
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {fmtDate(org.subscriptionStartDate)}
                    </p>
                  </div>

                  {/* Expiry Date — color-coded */}
                  <div className={`p-4 rounded-xl ${isExpired ? 'bg-red-50 border border-red-100' : isExpiringSoon ? 'bg-amber-50 border border-amber-100' : 'bg-surface-50'}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1 ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-500' : 'text-gray-400'}`}>
                      <Calendar size={10} /> Expiry Date
                    </p>
                    <p className={`text-sm font-bold mt-1 ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-gray-900'}`}>
                      {fmtDate(subExpiry)}
                    </p>
                    {isExpired && (
                      <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block" />
                        Plan Expired
                      </p>
                    )}
                    {isExpiringSoon && !isExpired && (
                      <p className="text-[10px] font-bold text-amber-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse inline-block" />
                        {daysLeft}d remaining
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-surface-50 rounded-2xl flex items-center justify-center mb-4">
                  <CreditCard size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Plan Assigned</p>
                <p className="text-xs text-gray-400 mt-1">This organization has not purchased a subscription plan yet.</p>
              </div>
            )}
          </div>

          <div className="bg-surface rounded-3xl p-8 shadow-soft border border-surface-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Statistics</h2>
            <p className="text-sm text-gray-500 mb-6">Detailed breakdown of institutional resources.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                 <span className="text-sm font-medium text-gray-600">Total Branches Created</span>
                 <span className="font-bold text-gray-900">{org.branchCount || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                 <span className="text-sm font-medium text-gray-600">Subscription Status</span>
                 <span className={`font-bold text-xs uppercase tracking-widest ${isExpired ? 'text-red-500' : org.subscription ? 'text-success' : 'text-gray-400'}`}>
                   {isExpired ? 'Expired' : org.subscription ? org.subscription.name : 'No Plan'}
                 </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                 <span className="text-sm font-medium text-gray-600">Expiry Date</span>
                 <span className={`font-bold text-xs uppercase tracking-widest ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-gray-700'}`}>
                   {fmtDate(subExpiry)}
                 </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                 <span className="text-sm font-medium text-gray-600">Staff Capacity</span>
                 <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">Full Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
