import { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckCircle2, Trash2, ShieldAlert, X, MoreHorizontal, ExternalLink, Ban, Edit2 } from 'lucide-react';
import { cn } from '../../hooks/utils';
import { superAdminService } from '../../services/superAdminService';

export function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingOrg, setEditingOrg] = useState<any | null>(null);
  
  // Create Form State
  const [form, setForm] = useState({
    name: '',
    slug: '',
    adminEmail: '',
    adminName: '',
    adminPassword: '',
    address: '',
    website: '',
    contactPhone: ''
  });

  useEffect(() => {
    fetchOrganizations();
    
    // Close dropdown on click outside
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await superAdminService.getOrganizations();
      setOrganizations(res.data);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingOrg(null);
    setForm({ 
        name: '', 
        slug: '', 
        adminEmail: '', 
        adminName: '', 
        adminPassword: '',
        address: '',
        website: '',
        contactPhone: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (org: any) => {
    const admin = org.users?.[0];
    setEditingOrg(org);
    setForm({ 
      name: org.name, 
      slug: org.slug, 
      adminEmail: admin?.email || '',
      adminName: admin?.name || '',
      adminPassword: '', // Password not editable
      address: org.address || '',
      website: org.website || '',
      contactPhone: org.contactPhone || ''
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOrg) {
        await superAdminService.updateOrganization(editingOrg.id, {
          name: form.name,
          slug: form.slug,
          adminName: form.adminName,
          adminEmail: form.adminEmail,
          address: form.address,
          website: form.website,
          contactPhone: form.contactPhone
        });
      } else {
        await superAdminService.createOrganization(form);
      }
      setIsModalOpen(false);
      fetchOrganizations();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save organization");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await superAdminService.updateOrgStatus(id, !currentStatus);
      fetchOrganizations();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this organization? This cannot be undone.")) {
      try {
        await superAdminService.deleteOrganization(id);
        fetchOrganizations();
      } catch (error) {
        alert("Failed to delete organization");
      }
    }
  };

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Management</h1>
          <p className="mt-1 text-muted-foreground">Approve, suspend, or manage institutions on the platform.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95"
        >
          <Plus size={18} />
          Add Organization
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name or slug..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm font-bold hover:bg-muted">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading organizations...</p>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead className="border-b bg-muted/50 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 ">Organization</th>
                  <th className="px-6 py-4 ">Slug</th>
                  <th className="px-6 py-4 ">Status</th>
                  <th className="px-6 py-4 ">Plan</th>
                  <th className="px-6 py-4 ">Users</th>
                  <th className="px-6 py-4 ">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredOrgs.map((org) => (
                  <tr key={org.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-bold group-hover:scale-110 transition-transform">
                          {org.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{org.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{org.id.split('-')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{org.slug}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider",
                        org.isActive ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                      )}>
                        {org.isActive ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                        {org.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded text-[10px] uppercase tracking-tighter">
                        {org.subscription?.plan?.name || 'BASIC'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{org._count?.users || 0} users</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {new Date(org.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === org.id ? null : org.id);
                        }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      
                      {activeMenu === org.id && (
                        <div className="absolute right-6 top-12 z-10 w-48 rounded-xl border bg-background p-2 shadow-xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                          <button 
                            onClick={() => {
                              window.open(org.website || `https://${org.slug}.edunest.com`, '_blank');
                              setActiveMenu(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <ExternalLink size={14} />
                            Visit Institution
                          </button>
                          <button 
                            onClick={() => openEditModal(org)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            <Edit2 size={14} />
                            Edit Details
                          </button>
                          <div className="my-1 border-t"></div>
                          <button 
                            onClick={() => {
                              handleToggleStatus(org.id, org.isActive);
                              setActiveMenu(null);
                            }}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors",
                              org.isActive ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                            )}
                          >
                            <ShieldAlert size={14} />
                            {org.isActive ? 'Suspend Org' : 'Activate Org'}
                          </button>
                          <button 
                            onClick={() => {
                              handleDelete(org.id);
                              setActiveMenu(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete Permanent
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrgs.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                No organizations found matching your search.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-background border rounded-3xl shadow-2xl p-8 space-y-6 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {editingOrg ? 'Edit Institution Details' : 'Register Organization'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {editingOrg ? 'Comprehensive update of institutional and administrative data.' : 'Create a new tenant and its primary administrator account.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary-600 border-b pb-2">Institutional Identity</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Organization Name</label>
                    <input 
                      required 
                      className="w-full rounded-xl border bg-muted/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                      placeholder="E.g. Westfield College"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Sub-domain Slug</label>
                    <input 
                      required
                      className="w-full rounded-xl border bg-muted/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                      placeholder="westfield"
                      value={form.slug}
                      onChange={e => setForm({...form, slug: e.target.value})}
                    />
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Website URL</label>
                    <input 
                      className="w-full rounded-xl border bg-muted/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                      placeholder="https://www.college.edu"
                      value={form.website}
                      onChange={e => setForm({...form, website: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary-600 border-b pb-2">Contact & Location</h3>
                   <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Official Address</label>
                    <input 
                      className="w-full rounded-xl border bg-muted/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                      placeholder="City, Country"
                      value={form.address}
                      onChange={e => setForm({...form, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Contact Phone</label>
                    <input 
                      className="w-full rounded-xl border bg-muted/20 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                      placeholder="+1 (555) 000-0000"
                      value={form.contactPhone}
                      onChange={e => setForm({...form, contactPhone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-muted/30 p-4 rounded-2xl border border-dashed border-muted-foreground/20">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                  <Edit2 size={14} /> Administrative Access
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Admin Full Name</label>
                    <input 
                      required 
                      className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                      placeholder="John Doe"
                      value={form.adminName}
                      onChange={e => setForm({...form, adminName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Admin Work Email</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                      placeholder="admin@college.edu"
                      value={form.adminEmail}
                      onChange={e => setForm({...form, adminEmail: e.target.value})}
                    />
                  </div>
                </div>

                {!editingOrg && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Initial Password</label>
                    <input 
                      type="password" 
                      required 
                      className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" 
                      placeholder="••••••••"
                      value={form.adminPassword}
                      onChange={e => setForm({...form, adminPassword: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                 <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl border font-bold text-xs uppercase tracking-widest hover:bg-muted transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="px-10 py-3 bg-primary-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95"
                >
                  {editingOrg ? 'Commit Changes' : 'Launch Institution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
