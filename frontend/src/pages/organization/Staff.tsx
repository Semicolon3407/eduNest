import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { UserPlus, Mail, Shield, Phone, Briefcase, Hash, Search, Filter, MoreVertical, Users, CheckCircle2, AlertCircle } from 'lucide-react';

const staffMembers = [
  { id: 'EMP-001', name: 'Sarah Wilson', email: 'sarah.w@school.com', role: 'Tutor', department: 'Science', status: 'Active', joined: '2023-01-15' },
  { id: 'EMP-002', name: 'Michael Brown', email: 'michael.b@school.com', role: 'Administrator', department: 'Administration', status: 'Pending', joined: '2023-11-20' },
  { id: 'EMP-003', name: 'Emily Davis', email: 'emily.d@school.com', role: 'HR Manager', department: 'Human Resources', status: 'Active', joined: '2022-08-01' },
  { id: 'EMP-004', name: 'James Wilson', email: 'james.w@school.com', role: 'Registrar', department: 'Admissions', status: 'Active', joined: '2022-09-10' },
  { id: 'EMP-005', name: 'Linda Taylor', email: 'linda.t@school.com', role: 'Tutor', department: 'Mathematics', status: 'Inactive', joined: '2021-05-22' },
];

const StaffOnboarding: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage educators, administrators, and HR personnel</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl shadow-premium" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Invite Staff
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-brand-200">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Active Staff</p>
            <p className="text-2xl font-display font-medium text-gray-900">128</p>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-warning/30">
          <div className="w-14 h-14 rounded-2xl bg-warning-light/50 text-warning-dark flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Invites</p>
            <p className="text-2xl font-display font-medium text-gray-900">12</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-success/30">
          <div className="w-14 h-14 rounded-2xl bg-success-light/50 text-success-dark flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Departments</p>
            <p className="text-2xl font-display font-medium text-gray-900">8</p>
          </div>
        </div>
      </div>

      <div className="bg-surface p-4 sm:p-6 rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by name, role, or department..."
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
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Department & Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {staffMembers.map((staff) => (
                  <tr key={staff.id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-medium text-sm transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight">{staff.name}</p>
                          <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {staff.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-gray-900">{staff.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-gray-900">{staff.department}</p>
                        <p className="text-[10px] text-brand-500 font-medium">{staff.role}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={
                        staff.status === 'Active' ? 'success' :
                          staff.status === 'Pending' ? 'warning' : 'danger'
                      }>
                        {staff.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {staff.status === 'Pending' && (
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
          <p className="text-xs font-medium text-gray-400">Showing 1 to 5 of 128 staff</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-9">Next</Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Account"
        description="Invite new educators, administrators, and HR personnel."
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
           <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="e.g. John" required />
              <Input label="Last Name" placeholder="e.g. Doe" required />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Official Email" icon={Mail} placeholder="name@school.com" type="email" required />
              <Input label="Personal Email" icon={Mail} placeholder="name@personal.com" type="email" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Phone Number" icon={Phone} placeholder="+1 (555) 000-0000" />
              <Input label="Employee ID" icon={Hash} placeholder="EMP-001" required />
           </div>

           <div className="grid grid-cols-1 gap-4">
              <Input label="Department" icon={Briefcase} placeholder="e.g. Science" required />
           </div>
           
           <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 px-1">Role</label>
              <div className="grid grid-cols-2 gap-3">
                 {['HR Manager', 'Administrator', 'Tutor', 'Registrar'].map(role => (
                   <label key={role} className="cursor-pointer">
                     <input type="radio" name="role" value={role} className="peer hidden" defaultChecked={role === 'Tutor'} />
                     <div className="p-4 rounded-2xl border border-surface-200 text-sm font-medium text-gray-600 peer-checked:border-brand-500 peer-checked:bg-brand-50 hover:border-brand-500 hover:bg-brand-50 transition-all text-left flex items-center justify-between group">
                       {role}
                       <div className="w-2 h-2 rounded-full border-2 border-surface-200 peer-checked:border-brand-500 peer-checked:bg-brand-500 group-hover:border-brand-500 transition-all"></div>
                     </div>
                   </label>
                 ))}
              </div>
           </div>

           <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
                 <Shield size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-brand-500">Permissions</h4>
                <p className="text-xs text-brand-700 font-medium">Default permissions will be assigned based on the selected role.</p>
              </div>
           </div>

           <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
              <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium"><UserPlus size={18} className="mr-2" /> Send Invite</Button>
           </div>
        </form>
      </Modal>

    </div>
  );
};

export default StaffOnboarding;
