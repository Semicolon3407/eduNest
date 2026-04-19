import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { 
  UserPlus, Mail, Shield, Phone, Briefcase, Hash, 
  Search, Filter, MoreVertical, Users, CheckCircle2, 
  AlertCircle, Eye, Edit, Trash2, ChevronDown 
} from 'lucide-react';

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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
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
              className="rounded-xl h-12"
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
                          <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight leading-none mb-1">{staff.name}</p>
                          <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
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
                        <p className="text-[10px] text-brand-500 font-medium uppercase tracking-wide">{staff.role}</p>
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
                    <td className="px-6 py-5 text-right relative">
                      <div className="flex items-center justify-end gap-2 text-left">
                        {staff.status === 'Pending' && (
                          <button className="p-2 bg-success/10 text-success-dark rounded-lg hover:bg-success transition-all hover:text-white" title="Approve">
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => toggleMenu(staff.id, e)}
                          className={`p-2 rounded-lg transition-all ${openMenuId === staff.id ? 'bg-brand-500 text-white' : 'text-gray-400 hover:bg-surface-100'}`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === staff.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)}></div>
                            <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-premium border border-surface-100 p-2 z-50 animate-in zoom-in-95 duration-200">
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all">
                                 <Eye size={16} /> View Profile
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-slate-50 rounded-xl transition-all">
                                 <Edit size={16} /> Edit Records
                              </button>
                              <div className="my-1 border-t border-surface-50"></div>
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-danger hover:bg-danger/5 rounded-xl transition-all">
                                 <Trash2 size={16} /> Terminate
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between px-2">
          <p className="text-xs font-medium text-gray-400">Showing 1 to 5 of 128 staff records</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-9">Next</Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Institutional Staff Onboarding"
        description="Invite new educators, administrators, and HR personnel to the institution."
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

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Department" icon={Briefcase} placeholder="e.g. Science" required />
              
              <div className="space-y-1.5 focus-within:z-10 group">
                <label className="text-xs font-medium text-gray-400 px-1">Branch Allocation</label>
                <div className="relative">
                  <select className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer">
                    <option value="">Select Branch</option>
                    <option value="main">Main Campus</option>
                    <option value="north">North Branch</option>
                    <option value="west">West Side</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
           </div>
           
           <div className="space-y-1.5 focus-within:z-10 group">
              <label className="text-xs font-medium text-gray-400 px-1">Institutional Role</label>
              <div className="relative">
                <select className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer">
                  <option value="">Select Role</option>
                  <option value="hr">HR Manager</option>
                  <option value="admin">Administrator</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
           </div>

           <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
                 <Shield size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-brand-500 uppercase tracking-tight">Access Control Protocol</h4>
                <p className="text-xs text-brand-700 font-medium italic opacity-80 mt-1">Institutional permissions and system scope will be automatically initialized based on the assigned role.</p>
              </div>
           </div>

           <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Discard</Button>
              <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium text-[10px] uppercase font-black tracking-widest">Send Commission</Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffOnboarding;
