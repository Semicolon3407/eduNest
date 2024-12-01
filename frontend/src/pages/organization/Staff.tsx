import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import {
  UserPlus, Mail, Shield, Phone, Briefcase,
  Search, MoreVertical, Users,
  AlertCircle, Eye, Trash2, ChevronDown, Loader2, Edit3, Lock
} from 'lucide-react';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';
import { tenantService } from '../../services/tenantService';
import toast from 'react-hot-toast';

const StaffOnboarding: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBranch, setFilterBranch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    personalEmail: '',
    phone: '',
    employeeId: '',
    department: '',
    branch: '',
    role: '',
    password: ''
  });

  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffRes, branchRes] = await Promise.all([
        tenantService.getStaff(),
        tenantService.getBranches()
      ]);
      setStaff(staffRes.data);
      setBranches(branchRes.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch directory');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch || !formData.role) {
      toast.error('Please assign a branch and role');
      return;
    }
    try {
      setIsSubmitting(true);
      if (editingStaff) {
        await tenantService.updateStaff(editingStaff._id, formData);
        toast.success('Staff records updated');
      } else {
        await tenantService.onboardStaff(formData);
        toast.success('Commission sent successfully');
      }
      handleCloseModal();
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${editingStaff ? 'update' : 'onboard'} staff`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member: any) => {
    setEditingStaff(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.user?.email || '',
      personalEmail: member.personalEmail || '',
      phone: member.phone || '',
      employeeId: member.employeeId,
      department: member.department,
      branch: member.branch || '',
      role: member.user?.role || '',
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      personalEmail: '',
      phone: '',
      employeeId: '',
      department: '',
      branch: '',
      role: '',
      password: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to terminate this staff member? All access will be revoked immediately.')) return;
    try {
      await tenantService.deleteStaff(id);
      toast.success('Staff records terminated');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to terminate records');
    }
  };


  const filteredStaff = staff.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      member.department.toLowerCase().includes(searchLower) ||
      member.user?.role?.toLowerCase().includes(searchLower);

    const matchesBranch = !filterBranch || member.branch?._id === filterBranch;
    const matchesDepartment = !filterDepartment || member.department === filterDepartment;

    return matchesSearch && matchesBranch && matchesDepartment;
  });

  const departments = Array.from(new Set(staff.map(s => s.department))).filter(Boolean);

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
            <p className="text-2xl font-display font-medium text-gray-900">{staff.length}</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-warning/30">
          <div className="w-14 h-14 rounded-2xl bg-warning-light/50 text-warning-dark flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Setup</p>
            <p className="text-2xl font-display font-medium text-gray-900">
              {staff.filter(s => s.status === 'Pending').length}
            </p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-success/30">
          <div className="w-14 h-14 rounded-2xl bg-success-light/50 text-success-dark flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Departments</p>
            <p className="text-2xl font-display font-medium text-gray-900">
              {new Set(staff.map(s => s.department)).size}
            </p>
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
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[160px]">
              <select
                className="w-full h-12 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer pr-10"
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
              >
                <option value="">All Branches</option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative min-w-[160px]">
              <select
                className="w-full h-12 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer pr-10"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <Button variant="outline" className="h-12 py-3 rounded-xl border-surface-200" onClick={() => { setFilterBranch(''); setFilterDepartment(''); setSearchTerm(''); }}>
              Clear
            </Button>
            <Button variant="outline" className="h-12 py-3 rounded-xl border-surface-200">
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-visible">
          <div className="px-0 relative">
            <table className="w-full text-left border-collapse">
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                      <Loader2 size={32} className="animate-spin mx-auto mb-4 text-brand-600" />
                      <p className="text-sm font-medium uppercase tracking-widest">Synchronizing staff directory...</p>
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500 uppercase tracking-widest text-xs font-bold">
                      No staff members match the current filters
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((member) => (
                    <tr key={member._id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                            {member.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight leading-none mb-1">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                              <Mail size={12} /> {member.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-gray-900">{member.employeeId}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5 text-left">
                          <p className="text-sm font-medium text-gray-900">{member.department}</p>
                          <p className="text-[10px] text-brand-500 font-medium uppercase tracking-wide">{member.user?.role}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant={
                          member.status === 'Active' ? 'success' :
                            member.status === 'Pending' ? 'warning' : 'danger'
                        }>
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Dropdown
                            trigger={
                              <button className="p-2 text-gray-400 hover:bg-surface-100 rounded-lg transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            }
                          >
                            <DropdownItem icon={Eye} onClick={() => { }}>View Profile</DropdownItem>
                            <DropdownItem icon={Edit3} onClick={() => handleEdit(member)}>Edit Records</DropdownItem>
                            <DropdownItem icon={Trash2} onClick={() => handleDelete(member._id)} variant="danger">Terminate</DropdownItem>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between px-2">
          <p className="text-xs font-medium text-gray-400">Showing {filteredStaff.length} of {staff.length} staff records</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-9">Next</Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStaff ? "Edit Staff Configuration" : "Institutional Staff Onboarding"}
        description={editingStaff ? "Modify institutional roles, departments, and campus allocations." : "Invite new educators, administrators, and HR personnel to the institution."}
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="e.g. John"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              placeholder="e.g. Doe"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Official Email"
              icon={Mail}
              placeholder="name@school.com"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Personal Email"
              icon={Mail}
              placeholder="name@personal.com"
              type="email"
              value={formData.personalEmail}
              onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              icon={Phone}
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div className="space-y-1.5 group text-left">
              <label className="text-xs font-medium text-gray-400 px-1">Staff ID Status</label>
              <div className="bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-xs font-medium text-gray-400 italic">
                {editingStaff ? `Fixed ID: ${formData.employeeId}` : "Auto-generated on creation"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Department"
              icon={Briefcase}
              placeholder="e.g. Science"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />

            <div className="space-y-1.5 focus-within:z-10 group text-left">
              <label className="text-xs font-medium text-gray-400 px-1">Branch Allocation</label>
              <div className="relative">
                <select
                  className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                >
                  <option value="">Select Branch</option>
                  {branches.map(b => (
                    <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="space-y-1.5 focus-within:z-10 group text-left">
            <label className="text-xs font-medium text-gray-400 px-1">Institutional Role</label>
            <div className="relative">
              <select
                className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="">Select Role</option>
                <option value="HR">HR Manager</option>
                <option value="ADMIN">Administrator</option>
                <option value="TUTOR">Academic Tutor</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <Input
            label={editingStaff ? "Reset Access Password" : "Set Admin Password"}
            name="password"
            type="password"
            placeholder={editingStaff ? "Leave blank to keep unchanged" : "••••••••"}
            icon={Lock}
            required={!editingStaff}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
              <Shield size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-medium text-brand-500 uppercase tracking-tight leading-none mb-1">Access Control Protocol</h4>
              <p className="text-xs text-brand-700 font-medium italic opacity-80 mt-1 leading-relaxed">Institutional permissions and system scope will be automatically initialized based on the assigned role. Password: EduNest@123</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={handleCloseModal} className="rounded-xl h-12">Discard</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 shadow-premium text-[10px] uppercase font-black tracking-widest flex items-center justify-center">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (editingStaff ? 'Update Records' : 'Send Commission')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffOnboarding;
