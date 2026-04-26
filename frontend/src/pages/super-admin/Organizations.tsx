import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Search, Plus, Filter, MoreVertical, Building2, MapPin, Calendar, CheckCircle2, Mail, Phone, Eye, Edit3, Ban, Lock, Trash2 } from 'lucide-react';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { superAdminService } from '../../services/superAdminService.ts';
import type { OrganizationData } from '../../services/superAdminService.ts';
import { subscriptionService } from '../../services/subscriptionService';
import type { SubscriptionData } from '../../services/subscriptionService';
import { ChevronDown } from 'lucide-react';

const Organizations: React.FC = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<any>(null);
  const [orgToDelete, setOrgToDelete] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const navigate = useNavigate();

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      const response = await superAdminService.getOrganizations();
      if (response.success) {
        setOrganizations(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await subscriptionService.getSubscriptions();
      if (response.success) {
        setSubscriptions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchSubscriptions();
  }, []);

  const openEditModal = (org: any) => {
    setEditingOrg(org);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingOrg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Partial<OrganizationData> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      personalEmail: formData.get('personalEmail') as string,
      phone: formData.get('phone') as string,
      location: formData.get('location') as string,
      subscription: formData.get('subscription') as string,
      type: 'Academy', 
    };

    const password = formData.get('password') as string;
    if (password) data.password = password;

    try {
      if (editingOrg) {
        const response = await superAdminService.updateOrganization(editingOrg._id, data);
        if (response.success) {
          setIsModalOpen(false);
          fetchOrganizations();
        }
      } else {
        const response = await superAdminService.createOrganization(data as OrganizationData);
        if (response.success) {
          setIsModalOpen(false);
          fetchOrganizations();
        }
      }
    } catch (error) {
      console.error('Failed to save organization:', error);
    }
  };

  const confirmDelete = (org: any) => {
    setOrgToDelete(org);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!orgToDelete) return;
    try {
      setIsDeleting(true);
      const response = await superAdminService.deleteOrganization(orgToDelete._id);
      if (response.success) {
        setIsDeleteModalOpen(false);
        setOrgToDelete(null);
        fetchOrganizations();
      }
    } catch (error) {
      console.error('Failed to delete organization:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await superAdminService.updateOrganizationStatus(id, status);
      if (response.success) {
        fetchOrganizations();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Organization Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Review, approve, and manage multi-tenant school instances</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl shadow-premium" onClick={openAddModal}>
          <Plus size={18} /> Add Organization
        </Button>
      </div>

      <div className="bg-surface p-4 sm:p-6 rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by name, location..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none py-3 rounded-xl border-surface-200">
              <Filter size={18} /> Filters
            </Button>
          </div>
        </div>

        <div className="overflow-visible">
          <div className="px-0 relative">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Organizations...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6">
                    <th className="px-6 py-4">Organization Name</th>
                    <th className="px-6 py-4">Branch Count</th>
                    <th className="px-6 py-4">Subscription</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredOrgs.map((org) => (
                    <tr key={org._id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center text-brand-600 transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                            <Building2 size={22} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight">{org.name}</p>
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                              <MapPin size={12} /> {org.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-gray-900">{org.branchCount || 0} Active Sites</span>
                          <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1"><Calendar size={10} /> Since {new Date(org.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-brand-600">{org.subscription?.name || 'No Plan'}</span>
                          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{org.subscription?.duration || '---'} Cycle</span>
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
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {org.status === 'Pending' && (
                            <button 
                              onClick={() => handleUpdateStatus(org._id, 'Active')}
                              className="p-2 bg-success-light text-success-dark rounded-lg hover:bg-success transition-all hover:text-white" 
                              title="Approve"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          <Dropdown
                            trigger={
                              <button className="p-2 text-gray-400 hover:bg-surface-100 rounded-lg transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            }
                          >
                            <DropdownItem icon={Eye} onClick={() => navigate(`/super-admin/organizations/${org._id}`)}>View Details</DropdownItem>
                            <DropdownItem icon={Edit3} onClick={() => openEditModal(org)}>Edit Organization</DropdownItem>
                            {org.status === 'Suspended' ? (
                              <DropdownItem icon={CheckCircle2} onClick={() => handleUpdateStatus(org._id, 'Active')} variant="default">Unblock</DropdownItem>
                            ) : (
                              <DropdownItem icon={Ban} onClick={() => handleUpdateStatus(org._id, 'Suspended')} variant="warning">Block</DropdownItem>
                            )}
                            <DropdownItem icon={Trash2} onClick={() => confirmDelete(org)} variant="danger">Delete</DropdownItem>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Main Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOrg ? "Edit Organization" : "Add Organization"}
        description={editingOrg ? "Update information for " + editingOrg.name : "Add a new organization to the system."}
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Organization Name" name="name" defaultValue={editingOrg?.name} placeholder="e.g. Springfield Academy" icon={Building2} required />
            </div>
            <Input label="Business Email" name="email" defaultValue={editingOrg?.email} placeholder="admin@academy.com" icon={Mail} required type="email" />
            <Input label="Personal Email" name="personalEmail" defaultValue={editingOrg?.personalEmail} placeholder="owner@personal.com" icon={Mail} required type="email" />
            <div className="md:col-span-2">
              <Input label="Phone Number" name="phone" defaultValue={editingOrg?.phone} placeholder="+1 (555) 000-0000" icon={Phone} required />
            </div>
            <div className="md:col-span-2">
              <Input label="Address" name="location" defaultValue={editingOrg?.location} placeholder="123 Education St, Knowledge City" icon={MapPin} required />
            </div>
            {!editingOrg && (
              <div className="md:col-span-2">
                <Input label="Set Admin Password" name="password" type="password" placeholder="••••••••" icon={Lock} required />
              </div>
            )}
            
            <div className="md:col-span-2 space-y-1.5 group font-sans">
              <label className="text-xs font-bold text-gray-400 px-1 uppercase tracking-tight">Subscription Plan</label>
              <div className="relative">
                <select 
                  name="subscription"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer"
                  defaultValue={editingOrg?.subscription?._id || editingOrg?.subscription}
                >
                  <option value="">Select a Plan</option>
                  {subscriptions.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name} ({sub.duration} - Rs {sub.price})</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium">
              {editingOrg ? "Save Changes" : "Create Organization"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Organization"
        message={`Are you sure you want to delete ${orgToDelete?.name}? This action cannot be undone and all associated data will be removed.`}
        confirmText="Delete Organization"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Organizations;

