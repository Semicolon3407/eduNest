import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Building2, MapPin, Phone, Mail, Link, Map, Shield, Search, Filter, MoreVertical, Users, CheckCircle2, AlertCircle } from 'lucide-react';

const branchesData = [
  { id: 'EDU-MC-01', name: 'Main Campus', location: 'Knowledge District', type: 'Headquarters', status: 'Active', students: 1200 },
  { id: 'EDU-NB-02', name: 'North Branch', location: 'Tech Park', type: 'Satellite', status: 'Active', students: 450 },
  { id: 'EDU-WS-03', name: 'West Side Academy', location: 'Riverside', type: 'Satellite', status: 'Pending', students: 0 },
];

const Branches: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Branch Management</h1>
          <p className="text-gray-500 mt-1">Configure individual campus settings and administrative controls</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl shadow-premium" onClick={() => setIsModalOpen(true)}>
          <Building2 size={18} className="mr-2" /> Add Branch
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-brand-200">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Branches</p>
            <p className="text-2xl font-display font-medium text-gray-900">3</p>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-warning/30">
          <div className="w-14 h-14 rounded-2xl bg-warning-light/50 text-warning-dark flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Setup</p>
            <p className="text-2xl font-display font-medium text-gray-900">1</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-success/30">
          <div className="w-14 h-14 rounded-2xl bg-success-light/50 text-success-dark flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <p className="text-2xl font-display font-medium text-gray-900">1,650</p>
          </div>
        </div>
      </div>

      <div className="bg-surface p-4 sm:p-6 rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by branch name or location..."
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
                <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6">
                  <th className="px-6 py-4">Branch Name</th>
                  <th className="px-6 py-4">System ID & Type</th>
                  <th className="px-6 py-4">Students Enrolled</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {branchesData.map((branch) => (
                  <tr key={branch.id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-surface-100 flex items-center justify-center text-brand-600 font-medium text-sm transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight">{branch.name}</p>
                          <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                            <MapPin size={12} /> {branch.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-gray-900">{branch.id}</p>
                        <p className="text-[10px] text-brand-500 font-medium">{branch.type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-gray-900">{branch.students}</span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={
                        branch.status === 'Active' ? 'success' :
                          branch.status === 'Pending' ? 'warning' : 'danger'
                      }>
                        {branch.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {branch.status === 'Pending' && (
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
            </table>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between px-2">
          <p className="text-xs font-medium text-gray-400">Showing 1 to 3 of 3 branches</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Next</Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Branch"
        description="Add a new campus instance to the system."
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Branch Name" placeholder="e.g. West Coast Technical" icon={Building2} required />
            </div>
            <Input label="Branch Code" placeholder="WCT-01" icon={Link} required />
            <Input label="Branch Type" placeholder="Satellite / Main" icon={Map} required />
            <div className="md:col-span-2">
              <Input label="Location" placeholder="San Francisco, CA" icon={MapPin} required />
            </div>
            <Input label="Phone Number" placeholder="+1 (555) 0123" icon={Phone} required />
            <Input label="Email Address" placeholder="sf@institution.com" icon={Mail} required type="email" />
          </div>

          <div className="bg-success-light p-6 rounded-3xl border border-success/10 flex items-start gap-4">
             <div className="w-10 h-10 bg-success text-white rounded-xl flex items-center justify-center shrink-0">
               <Shield size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-success-dark leading-tight">Branch Data Privacy</p>
               <p className="text-xs text-success-dark/70 mt-1 leading-relaxed">This branch will have its own independent scope and local access roles securely.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium"><Building2 size={18} className="mr-2" /> Add Branch</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Branches;
