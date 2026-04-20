import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { 
  Building2, MapPin, Users, Phone, Mail, 
  Search, Filter, MoreVertical, 
  Shield, Loader2, Edit, Trash2, 
  Eye, ChevronDown, AlertCircle, Link
} from 'lucide-react';
import { tenantService } from '../../services/tenantService';
import toast from 'react-hot-toast';

const Branches: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Main Campus (Headquarters)',
    location: '',
    phone: '',
    email: ''
  });

  const [editingBranch, setEditingBranch] = useState<any | null>(null);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await tenantService.getBranches();
      setBranches(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingBranch) {
        await tenantService.updateBranch(editingBranch._id, formData);
        toast.success('Branch updated successfully');
      } else {
        await tenantService.addBranch(formData);
        toast.success('Branch deployed successfully');
      }
      handleCloseModal();
      fetchBranches();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${editingBranch ? 'update' : 'deploy'} branch`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      type: branch.type,
      location: branch.location,
      phone: branch.phone,
      email: branch.email
    });
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    setFormData({
      name: '',
      code: '',
      type: 'Main Campus (Headquarters)',
      location: '',
      phone: '',
      email: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;
    try {
      await tenantService.deleteBranch(id);
      toast.success('Branch deleted successfully');
      fetchBranches();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete branch');
    }
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
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
            <p className="text-2xl font-display font-medium text-gray-900">{branches.length}</p>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-warning/30">
          <div className="w-14 h-14 rounded-2xl bg-warning-light/50 text-warning-dark flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Main Campus</p>
            <p className="text-2xl font-display font-medium text-gray-900">
              {branches.filter(b => b.type === 'Main Campus (Headquarters)').length}
            </p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-success/30">
          <div className="w-14 h-14 rounded-2xl bg-success-light/50 text-success-dark flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Satellite Units</p>
            <p className="text-2xl font-display font-medium text-gray-900">
              {branches.filter(b => b.type !== 'Main Campus (Headquarters)').length}
            </p>
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
                  <th className="px-6 py-4">Branch Name</th>
                  <th className="px-6 py-4">System ID & Type</th>
                  <th className="px-6 py-4">Students Enrolled</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                      <Loader2 size={32} className="animate-spin mx-auto mb-4 text-brand-600" />
                      <p className="text-sm font-medium">Synchronizing institutional nodes...</p>
                    </td>
                  </tr>
                ) : branches.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500 uppercase tracking-widest text-xs font-bold">
                      No campuses deployed yet
                    </td>
                  </tr>
                ) : (
                  branches.map((branch) => (
                    <tr key={branch._id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
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
                          <p className="text-sm font-medium text-gray-900 uppercase">{branch.code}</p>
                          <p className="text-[10px] text-brand-500 font-medium italic">{branch.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-gray-900">Analytical Data Pending</span>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant={
                          branch.status === 'Active' ? 'success' :
                            branch.status === 'Pending' ? 'warning' : 'danger'
                        }>
                          {branch.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => toggleMenu(branch._id, e)}
                            className="p-2 text-gray-400 hover:bg-surface-100 rounded-lg transition-all"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {openMenuId === branch._id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)}></div>
                              <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-premium border border-surface-100 p-2 z-50 animate-in zoom-in-95 duration-200 text-left">
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-all">
                                   <Eye size={16} /> View Scope
                                </button>
                                <button 
                                  onClick={() => handleEdit(branch)}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-slate-50 rounded-xl transition-all"
                                >
                                   <Edit size={16} /> Edit Node
                                </button>
                                <div className="my-1 border-t border-surface-50"></div>
                                <button 
                                  onClick={() => handleDelete(branch._id)}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-danger hover:bg-danger/5 rounded-xl transition-all"
                                >
                                   <Trash2 size={16} /> Decommission
                                </button>
                              </div>
                            </>
                          )}
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
          <p className="text-xs font-medium text-gray-400">Showing 1 to 3 of 3 branches</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Next</Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBranch ? "Update Institutional Node" : "Institutional Branch Deployment"}
        description={editingBranch ? "Modify current campus configurations and administrative settings." : "Initialize a new campus instance with independent scope and administrative controls."}
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input 
                label="Branch Name" 
                placeholder="e.g. West Coast Technical" 
                icon={Building2} 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <Input 
              label="Branch Code" 
              placeholder="WCT-01" 
              icon={Link} 
              required 
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
            />
            <div className="space-y-1.5 group font-sans">
              <label className="text-xs font-medium text-gray-400 px-1">Branch Type</label>
              <div className="relative">
                <select 
                  className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>Main Campus (Headquarters)</option>
                  <option>Satellite Branch</option>
                  <option>Vocational Wing</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="md:col-span-2">
              <Input 
                label="Location" 
                placeholder="San Francisco, CA" 
                icon={MapPin} 
                required 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <Input 
              label="Phone Number" 
              placeholder="+1 (555) 0123" 
              icon={Phone} 
              required 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <Input 
              label="Email Address" 
              placeholder="sf@institution.com" 
              icon={Mail} 
              required 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="bg-brand-50/50 p-6 rounded-3xl border border-brand-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
               <Shield size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-brand-600 leading-tight uppercase tracking-tight">Scope & Security Protocol</p>
               <p className="text-xs text-brand-700/70 mt-1 leading-relaxed italic">This branch will have its own independent scope and local access roles securely within the institutional perimeter.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={handleCloseModal} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 shadow-premium">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Building2 size={18} className="mr-2" /> {editingBranch ? 'Update Node' : 'Deploy Instance'}</>}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Branches;
