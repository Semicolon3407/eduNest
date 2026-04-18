import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, Users, UserRound, GraduationCap, Briefcase, ShieldCheck, 
  ArrowLeft, MapPin, Calendar, Globe, Mail, Phone, ExternalLink,
  Crown, Clock, Ban, CheckCircle2
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const organizationsMock = [
  { id: 1, name: 'Springfield Academy', type: 'High School', location: 'New York, USA', schools: 4, status: 'Active', plan: 'Enterprise', created: '2023-01-12', email: 'admin@springfield.edu', phone: '+1 (555) 123-4567', website: 'springfield.edu' },
  { id: 2, name: 'Lakeside College', type: 'University', location: 'Oxford, UK', schools: 1, status: 'Pending', plan: 'Standard', created: '2023-05-24', email: 'contact@lakeside.edu', phone: '+44 20 7123 4567', website: 'lakeside.edu' },
  { id: 3, name: 'Elite International', type: 'Primary School', location: 'Dubai, UAE', schools: 2, status: 'Active', plan: 'Enterprise', created: '2023-08-02', email: 'info@elite-intl.ae', phone: '+971 4 123 4567', website: 'elite-intl.ae' },
  { id: 4, name: 'Greenwood High', type: 'High School', location: 'Sydney, AU', schools: 1, status: 'Suspended', plan: 'Free', created: '2023-09-15', email: 'admin@greenwood.au', phone: '+61 2 1234 5678', website: 'greenwood.au' },
  { id: 5, name: 'Tech Prep Institute', type: 'Vocational', location: 'Berlin, DE', schools: 1, status: 'Active', plan: 'Standard', created: '2023-10-01', email: 'hello@techprep.de', phone: '+49 30 123456', website: 'techprep.de' },
];

const statsMock = {
  1: { branches: 4, students: '1,250', staffs: 85, tutors: 42, hr: 4, admins: 2 },
  2: { branches: 1, students: '450', staffs: 32, tutors: 18, hr: 2, admins: 1 },
  3: { branches: 2, students: '890', staffs: 64, tutors: 35, hr: 3, admins: 2 },
  4: { branches: 1, students: '320', staffs: 24, tutors: 14, hr: 1, admins: 1 },
  5: { branches: 1, students: '560', staffs: 40, tutors: 22, hr: 2, admins: 1 },
};

const OrganizationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const orgId = parseInt(id || '1');
  const org = organizationsMock.find(o => o.id === orgId) || organizationsMock[0];
  const stats = statsMock[orgId as keyof typeof statsMock] || statsMock[1];

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
        <StatCard title="Branches" value={stats.branches.toString()} icon={Building2} color="brand" />
        <StatCard title="Total Students" value={stats.students} icon={Users} color="success" />
        <StatCard title="Administrative" value={stats.admins.toString()} icon={ShieldCheck} color="warning" />
        <StatCard title="Total Staffs" value={stats.staffs.toString()} icon={UserRound} color="brand" />
        <StatCard title="Expert Tutors" value={stats.tutors.toString()} icon={GraduationCap} color="success" />
        <StatCard title="HR Personnel" value={stats.hr.toString()} icon={Briefcase} color="brand" />
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
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{org.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-gray-400 shrink-0">
                <Globe size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Public Domain</p>
                <a href={`https://${org.website}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-600 mt-1 flex items-center gap-1 hover:underline">
                  {org.website} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center text-gray-400 shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registered Since</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{org.created}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-brand-50 rounded-2xl border border-brand-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
              <Crown size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-900">{org.plan} Plan</p>
              <p className="text-[10px] text-brand-700 font-medium">Auto-renewing on {org.created.split('-')[0]}-12-31</p>
            </div>
          </div>
        </div>

        {/* Quick Actions / More Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface rounded-3xl p-8 shadow-soft border border-surface-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Subscription Status</h2>
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-brand-500 shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Current Plan: {org.plan}</h3>
                  <p className="text-sm text-gray-500">All features unlocked for this institutional tenant.</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-white">Upgrade</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</p>
                <p className="text-base font-medium text-gray-900 mt-1">{org.created}</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">End Date</p>
                <p className="text-base font-medium text-gray-900 mt-1">{org.created.split('-')[0]}-12-31</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Next Billing</p>
                <p className="text-base font-medium text-gray-900 mt-1">Oct 12, 2026</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment Method</p>
                <p className="text-base font-medium text-gray-900 mt-1">Visa •••• 4242</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-3xl p-8 shadow-soft border border-surface-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Ban size={20} className="text-red-500" /> Resource Management
              </h2>
              <p className="text-sm text-gray-500 mt-1">Immediate control over organization access and data.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 rounded-xl">
                 Block Tenant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
