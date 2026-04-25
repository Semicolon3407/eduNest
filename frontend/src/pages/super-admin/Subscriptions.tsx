import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { 
  CreditCard, Plus, Search, Filter, MoreVertical, 
  CheckCircle2, Edit3, Trash2, Loader2, DollarSign, 
  Calendar, X, ChevronDown
} from 'lucide-react';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { subscriptionService } from '../../services/subscriptionService';
import type { SubscriptionData } from '../../services/subscriptionService';
import toast from 'react-hot-toast';

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubscriptionData | null>(null);
  const [subToDelete, setSubToDelete] = useState<SubscriptionData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: 'Monthly' as SubscriptionData['duration'],
    features: [''],
    status: 'Active' as SubscriptionData['status']
  });

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionService.getSubscriptions();
      if (response.success) {
        setSubscriptions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const openAddModal = () => {
    setEditingSub(null);
    setFormData({
      name: '',
      price: 0,
      duration: 'Monthly',
      features: [''],
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sub: SubscriptionData) => {
    setEditingSub(sub);
    setFormData({
      name: sub.name,
      price: sub.price,
      duration: sub.duration,
      features: sub.features.length > 0 ? [...sub.features] : [''],
      status: sub.status
    });
    setIsModalOpen(true);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const dataToSave = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== '')
      };

      if (editingSub?._id) {
        await subscriptionService.updateSubscription(editingSub._id, dataToSave);
        toast.success('Subscription updated successfully');
      } else {
        await subscriptionService.createSubscription(dataToSave as SubscriptionData);
        toast.success('Subscription created successfully');
      }
      setIsModalOpen(false);
      fetchSubscriptions();
    } catch (error) {
      console.error('Failed to save subscription:', error);
      toast.error('Failed to save subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (sub: SubscriptionData) => {
    setSubToDelete(sub);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!subToDelete?._id) return;
    try {
      setIsDeleting(true);
      await subscriptionService.deleteSubscription(subToDelete._id);
      toast.success('Subscription deleted');
      setIsDeleteModalOpen(false);
      fetchSubscriptions();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete subscription');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSubs = subscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.duration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900">Subscription Plans</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage tiered access plans and regional pricing</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl shadow-premium" onClick={openAddModal}>
          <Plus size={18} className="mr-2" /> Create Plan
        </Button>
      </div>

      <div className="bg-surface p-4 sm:p-6 rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search plans or durations..."
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
          </div>
        </div>

        <div className="overflow-visible">
          <div className="px-0 relative">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-brand-500" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Plans...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6">
                    <th className="px-6 py-4">Plan Description</th>
                    <th className="px-6 py-4">Duration & Pricing</th>
                    <th className="px-6 py-4">Features</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredSubs.map((sub) => (
                    <tr key={sub._id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center text-brand-600 transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                            <CreditCard size={22} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight">{sub.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 italic">Institutional License</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-gray-900">Rs {sub.price} USD</span>
                          <span className="text-[10px] font-medium text-brand-500 flex items-center gap-1 uppercase tracking-wider"><Calendar size={10} /> {sub.duration}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          {sub.features.slice(0, 2).map((feature, i) => (
                            <span key={i} className="text-xs text-gray-500 flex items-center gap-1 truncate">
                              <CheckCircle2 size={12} className="text-success-dark shrink-0" /> {feature}
                            </span>
                          ))}
                          {sub.features.length > 2 && (
                            <span className="text-[10px] font-bold text-brand-500">+{sub.features.length - 2} more features</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant={sub.status === 'Active' ? 'success' : 'danger'}>
                          {sub.status}
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
                            <DropdownItem icon={Edit3} onClick={() => openEditModal(sub)}>Edit Plan</DropdownItem>
                            <DropdownItem icon={Trash2} onClick={() => confirmDelete(sub)} variant="danger">Delete</DropdownItem>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSubs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-gray-400 uppercase tracking-widest text-xs font-bold">
                        No subscription plans found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSub ? "Edit Subscription Plan" : "Create New Plan"}
        description={editingSub ? "Modify pricing and duration for " + editingSub.name : "Initialize a new subscription tier for organizations."}
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input 
                label="Plan Name" 
                placeholder="e.g. Standard, Professional, Elite" 
                icon={CreditCard} 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <Input 
              label="Price (USD)" 
              type="number" 
              placeholder="0.00" 
              icon={DollarSign} 
              required 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            />
            
            <div className="space-y-1.5 group font-sans">
              <label className="text-xs font-medium text-gray-400 px-1">Duration Cycle</label>
              <div className="relative">
                <select 
                  className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value as SubscriptionData['duration']})}
                >
                  <option>Monthly</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>Annual</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Included Features</label>
                <button type="button" onClick={addFeature} className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">
                  <Plus size={14} /> Add Feature
                </button>
              </div>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 group">
                    <div className="flex-1">
                      <Input 
                        placeholder="Feature description..." 
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    {formData.features.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeFeature(index)}
                        className="p-3 text-gray-400 hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5 group font-sans">
              <label className="text-xs font-medium text-gray-400 px-1">Plan Visibility</label>
              <div className="relative">
                <select 
                  className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as SubscriptionData['status']})}
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 shadow-premium">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (editingSub ? "Save Changes" : "Deploy Subscription")}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Plan"
        message={`Are you sure you want to delete the ${subToDelete?.name} plan? Organizations using this plan will not be affected until their current cycle ends.`}
        confirmText="Delete Plan"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Subscriptions;
