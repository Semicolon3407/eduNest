import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Search, Plus, Filter, MoreVertical, Building2, MapPin, Calendar, CheckCircle2, Globe, Mail, Phone, Shield } from 'lucide-react';

const organizations = [
  { id: 1, name: 'Springfield Academy', type: 'High School', location: 'New York, USA', schools: 4, status: 'Active', plan: 'Enterprise', created: '2023-01-12' },
  { id: 2, name: 'Lakeside College', type: 'University', location: 'Oxford, UK', schools: 1, status: 'Pending', plan: 'Standard', created: '2023-05-24' },
  { id: 3, name: 'Elite International', type: 'Primary School', location: 'Dubai, UAE', schools: 2, status: 'Active', plan: 'Enterprise', created: '2023-08-02' },
  { id: 4, name: 'Greenwood High', type: 'High School', location: 'Sydney, AU', schools: 1, status: 'Suspended', plan: 'Free', created: '2023-09-15' },
  { id: 5, name: 'Tech Prep Institute', type: 'Vocational', location: 'Berlin, DE', schools: 1, status: 'Active', plan: 'Standard', created: '2023-10-01' },
];

const Organizations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Organization Management</h1>
          <p className="text-gray-500 mt-1">Review, approve, and manage multi-tenant school instances</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl shadow-premium" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Organization
        </Button>
      </div>

      <div className="bg-surface p-4 sm:p-6 rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by name, location, or plan..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none py-3 rounded-xl border-surface-200">
              <Filter size={18} /> Filters
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none py-3 rounded-xl border-surface-200">
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:-mx-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold  tracking-[0.2em] px-6">
                  <th className="px-6 py-4">Organization Name</th>
                  <th className="px-6 py-4">Branch Count</th>
                  <th className="px-6 py-4">Subscription</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {organizations.map((org) => (
                  <tr key={org.id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center text-brand-600 transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                          <Building2 size={22} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900  text-sm  group-hover:text-brand-600 transition-colors uppercase tracking-tight">{org.name}</p>
                          <p className="text-xs text-gray-400 font-medium  flex items-center gap-1 mt-0.5">
                            <MapPin size={12} /> {org.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-900">{org.schools} Active Sites</span>
                        <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1"><Calendar size={10} /> Since {org.created}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-gray-900">{org.plan}</p>
                        <p className="text-[10px] text-brand-500 font-medium  ">Annual Billing</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={
                        org.status === 'Active' ? 'success' :
                          org.status === 'Pending' ? 'warning' : 'danger'
                      }>
                        {org.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {org.status === 'Pending' && (
                          <button className="p-2 bg-success-light text-success-dark rounded-lg hover:bg-success transition-all hover:text-white" title="Approve">
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:bg-surface-100 rounded-lg">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
        </div>

        <div className="mt-8 flex items-center justify-between px-2">
          <p className="text-xs font-medium text-gray-400">Showing 1 to 5 of 128 organizations</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-9">Next</Button>
          </div>
        </div>
      </div>

      {/* Required Form: Add Organization */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Organization"
        description="Add a new organization to the system."
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Organization Name" placeholder="e.g. Springfield Academy" icon={Building2} required />
            </div>
            <Input label="Email Address" placeholder="admin@academy.com" icon={Mail} required type="email" />
            <Input label="Phone Number" placeholder="+1 (555) 000-0000" icon={Phone} required />
            <div className="md:col-span-2">
              <Input label="Address" placeholder="123 Education St, Knowledge City" icon={MapPin} required />
            </div>
            <Input label="Domain Name" placeholder="academy.edunest.com" icon={Globe} required />
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Subscription Plan</label>
              <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer">
                <option>Standard Plan ($49/mo)</option>
                <option>Professional Plan ($99/mo)</option>
                <option>Enterprise Elite (Custom)</option>
              </select>
            </div>
          </div>

          <div className="bg-brand-50 p-6 rounded-3xl border border-brand-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-900 leading-tight">Secure Data Storage</p>
              <p className="text-xs text-brand-700 mt-1 leading-relaxed">Each organization gets its own separate database and file storage securely.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium">Create Organization</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Organizations;

