import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { 
  FileText, Shield, Briefcase, Download, Search, MoreVertical, 
  Paperclip, Plus, User, FileUp, Loader2, GitBranch, CheckCircle2,
  Eye, Edit3, Trash2
} from 'lucide-react';
import { hrService } from '../../services/hrService';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const DocumentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalBranch, setModalBranch] = useState('All Branches');
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffResults, setShowStaffResults] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  
  // Filters
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    staffId: '',
    documents: [
      { id: Date.now().toString(), title: '', category: 'Employment Contract', file: null as File | null }
    ]
  });
  const [globalStatus, setGlobalStatus] = useState('Pending Verification');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [docRes, branchRes, staffRes] = await Promise.all([
        hrService.getDocuments(),
        hrService.getBranches(),
        hrService.getStaff()
      ]);
      if (docRes.success) setDocuments(docRes.data);
      if (branchRes.success) setBranches(branchRes.data);
      if (staffRes.success) setStaffList(staffRes.data);
    } catch (error) {
      toast.error('Vault synchronization failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const departments = Array.from(new Set(staffList.map(s => s.designation || 'General'))).sort();

  const filteredDocuments = documents.filter(doc => {
    const branchMatch = branchFilter === 'All Branches' || doc.staff?.branch?.name === branchFilter;
    const deptMatch = deptFilter === 'All Departments' || doc.staff?.designation === deptFilter;
    const searchMatch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      `${doc.staff?.firstName} ${doc.staff?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    return branchMatch && deptMatch && searchMatch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.staffId) {
      toast.error('Please select a staff member from the search results');
      return;
    }
    try {
      setIsSubmitting(true);
      
      const processedDocs = await Promise.all(formData.documents.map(async (doc) => {
        let fileUrl = (isEditMode && doc.id === editingDocId) ? documents.find(d => d._id === editingDocId)?.url : '#';
        const docTitle = (doc.title || doc.category).trim();
        
        if (doc.file) {
          const fileKey = `eduNest_doc_${Date.now()}_${Math.random().toString(36).substring(7)}_${docTitle.replace(/[^a-z0-9]/gi, '_')}`;
          
          try {
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(doc.file!);
            });
            
            localStorage.setItem(fileKey, base64);
            fileUrl = fileKey;
          } catch (e) {
            console.error('LocalStorage upload failed:', e);
            toast.error('File too large for local demo. Try a smaller PDF.');
          }
        }

        return {
          title: docTitle,
          category: doc.category,
          status: globalStatus,
          url: fileUrl,
          size: doc.file ? `${(doc.file.size / (1024 * 1024)).toFixed(2)} MB` : '0.1 MB',
          type: doc.file?.type || 'application/pdf'
        };
      }));

      if (isEditMode && editingDocId) {
        // Update the existing document (first in list)
        const updateRes = await hrService.updateDocument(editingDocId, processedDocs[0]);
        
        // If there are additional documents, upload them as new
        if (processedDocs.length > 1) {
          const newDocsPayload = {
            staffId: formData.staffId,
            documents: processedDocs.slice(1)
          };
          await hrService.uploadStaffDocument(newDocsPayload);
        }

        if (updateRes.success) {
          toast.success('Institutional archive updated');
          closeModal();
          fetchData();
        }
      } else {
        const payload = {
          staffId: formData.staffId,
          documents: processedDocs
        };
        
        const response = await hrService.uploadStaffDocument(payload);
        if (response.success) {
          toast.success(`${payload.documents.length} institutional documents archived`);
          closeModal();
          fetchData();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (doc: any) => {
    setIsEditMode(true);
    setEditingDocId(doc._id);
    setFormData({
      staffId: doc.staff?._id || '',
      documents: [
        { id: doc._id, title: doc.title, category: doc.category, file: null }
      ]
    });
    setStaffSearch(`${doc.staff?.firstName} ${doc.staff?.lastName} (${doc.staff?.employeeId})`);
    setModalBranch(doc.staff?.branch?.name || 'All Branches');
    setGlobalStatus(doc.status || 'Pending Verification');
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingDocId(null);
    setFormData({
      staffId: '',
      documents: [{ id: Date.now().toString(), title: '', category: 'Employment Contract', file: null }]
    });
    setStaffSearch('');
    setModalBranch('All Branches');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document record?')) return;
    try {
       const response = await hrService.deleteDocument(id);
       if (response.success) {
         toast.success('Document purged from archive');
         fetchData();
       }
    } catch (error) {
       toast.error('Failed to purge archive');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-brand-500" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Document Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Document Center</h1>
          <p className="text-gray-500 mt-1 font-medium">Compliance and verification vault for staff credentials</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
           <Button variant="outline" className="rounded-xl h-11 flex-1 sm:flex-none whitespace-nowrap"><Paperclip size={18} /> Upload Archive</Button>
           <Button onClick={() => { setIsEditMode(false); setIsModalOpen(true); }} className="rounded-xl h-11 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex-1 sm:flex-none whitespace-nowrap"><Plus size={18} /> Add New Document</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center">
               <FileText size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-slate-400   leading-none mb-1">Total Files</p>
               <h4 className="text-xl font-medium text-gray-900  ">{documents.length}</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-success-light text-success-dark rounded-2xl flex items-center justify-center">
               <Shield size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-slate-400   leading-none mb-1">Verified</p>
               <h4 className="text-xl font-medium text-gray-900  ">100%</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
               <Briefcase size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-slate-400   leading-none mb-1">Storage</p>
               <h4 className="text-xl font-medium text-gray-900  ">0.8 GB</h4>
            </div>
         </div>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200 font-sans mt-8">
         <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4 overflow-visible font-sans">
            <h2 className="text-xl font-medium text-gray-900  ">Staff Credentials</h2>
            <div className="flex flex-wrap items-center gap-3 font-sans">
               <div className="flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 min-w-[200px]">
                  <Search size={16} className="text-slate-400 font-sans" />
                  <input 
                    type="text" 
                    placeholder="Search files or staff..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-2 w-full outline-none font-sans" 
                  />
               </div>
               
               <select 
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:border-brand-500/50 transition-all cursor-pointer"
               >
                  <option>All Branches</option>
                  {branches.map(b => (
                    <option key={b._id} value={b.name}>{b.name}</option>
                  ))}
               </select>

               <select 
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-xs font-bold text-slate-600 outline-none focus:border-brand-500/50 transition-all cursor-pointer"
               >
                  <option>All Departments</option>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
               </select>
            </div>
         </div>

         <div className="overflow-visible font-sans relative">
              <table className="w-full text-left font-sans">
                <thead>
                   <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100 font-sans">
                      <th className="px-6 py-4">Staff Member</th>
                      <th className="px-6 py-4">Document Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                   {filteredDocuments.map((doc: any) => (
                      <tr key={doc._id} className="group hover:bg-slate-50/50 transition-all font-sans">
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-[10px]">
                                  {doc.staff?.firstName?.charAt(0) || 'D'}
                               </div>
                               <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight text-sm font-sans">
                                 {doc.staff?.firstName} {doc.staff?.lastName}
                               </p>
                            </div>
                         </td>
                         <td className="px-6 py-5 text-sm font-medium text-slate-600 italic font-sans">{doc.title}</td>
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                               <Badge variant="neutral" className="font-bold text-[10px] uppercase tracking-widest">{doc.category}</Badge>
                            </div>
                         </td>
                         <td className="px-6 py-5 text-right relative">
                            <div className="flex items-center justify-end gap-2">
                               <Badge variant={doc.status === 'Verified & Active' ? 'success' : 'brand'} className="font-black tracking-tighter text-[10px]">{doc.status?.toUpperCase() || 'PENDING'}</Badge>
                               <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><Download size={18}/></button>
                               <div className="relative">
                                  <button 
                                    onClick={() => setActiveDropdown(activeDropdown === doc._id ? null : doc._id)}
                                    className={cn(
                                      "p-2 rounded-lg transition-all",
                                      activeDropdown === doc._id ? "bg-brand-50 text-brand-600" : "text-slate-400 hover:text-brand-600"
                                    )}
                                  >
                                    <MoreVertical size={18}/>
                                  </button>
                                  
                                  {activeDropdown === doc._id && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setActiveDropdown(null)}
                                      />
                                      <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-premium z-20 py-2 animate-in fade-in zoom-in-95 duration-100">
                                        <button 
                                          onClick={() => {
                                            navigate(`/hr/documents/staff/${doc.staff?._id}`);
                                            setActiveDropdown(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-600 flex items-center gap-3 transition-colors uppercase tracking-widest"
                                        >
                                          <Eye size={16} /> View Documents
                                        </button>
                                        <button 
                                          onClick={() => handleEdit(doc)}
                                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-600 flex items-center gap-3 transition-colors uppercase tracking-widest"
                                        >
                                          <Edit3 size={16} /> Edit Record
                                        </button>
                                        <div className="h-px bg-slate-100 my-1" />
                                        <button 
                                          onClick={() => {
                                            handleDelete(doc._id);
                                            setActiveDropdown(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors uppercase tracking-widest"
                                        >
                                          <Trash2 size={16} /> Delete Archive
                                        </button>
                                      </div>
                                    </>
                                  )}
                               </div>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
         </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditMode ? "Edit Staff Document" : "Upload Staff Document"}
        description={isEditMode ? "Update the existing credential or contract details." : "Verify and archive a new credential or contract for a staff member."}
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 focus-within:z-10 group font-sans">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Filter by Branch</label>
                <div className="relative">
                  <select 
                    value={modalBranch}
                    onChange={(e) => setModalBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-[13px] px-4 text-sm font-bold outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer"
                  >
                    <option>All Branches</option>
                    {branches.map(b => (
                      <option key={b._id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <GitBranch size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="space-y-1.5 focus-within:z-10 group font-sans relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Select Staff Member</label>
                <div className="relative">
                  <Input 
                    placeholder="Type to search staff..." 
                    icon={User} 
                    required 
                    value={staffSearch}
                    onFocus={() => setShowStaffResults(true)}
                    onChange={(e) => {
                      setStaffSearch(e.target.value);
                      setShowStaffResults(true);
                      if (formData.staffId) setFormData({...formData, staffId: ''});
                    }}
                  />
                  {showStaffResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {staffList
                        .filter(s => modalBranch === 'All Branches' || s.branch?.name === modalBranch)
                        .filter(s => {
                          const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
                          return fullName.includes(staffSearch.toLowerCase()) || s.employeeId.toLowerCase().includes(staffSearch.toLowerCase());
                        })
                        .map(s => (
                          <div 
                            key={s._id}
                            onClick={() => {
                              setStaffSearch(`${s.firstName} ${s.lastName} (${s.employeeId})`);
                              setFormData({...formData, staffId: s._id});
                              setShowStaffResults(false);
                            }}
                            className="p-4 hover:bg-brand-50 cursor-pointer border-b border-slate-50 last:border-none group transition-all"
                          >
                            <p className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{s.firstName} {s.lastName}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 group-hover:text-brand-400">{s.employeeId} • {s.branch?.name || 'Main'}</p>
                          </div>
                        ))}
                      {staffList.filter(s => modalBranch === 'All Branches' || s.branch?.name === modalBranch).length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">No staff found</div>
                      )}
                    </div>
                  )}
                </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Documents to Upload</label>
                <button 
                  type="button"
                  onClick={() => setFormData({
                    ...formData, 
                    documents: [...formData.documents, { id: Date.now().toString(), title: '', category: 'Employment Contract', file: null }]
                  })}
                  className="text-[10px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> Add Another
                </button>
              </div>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.documents.map((doc, index) => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative group/item transition-all hover:border-brand-200">
                    {formData.documents.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          documents: formData.documents.filter(d => d.id !== doc.id)
                        })}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                      >
                         <MoreVertical size={16} />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 font-sans">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                        <select 
                          value={doc.category}
                          onChange={(e) => {
                            const newDocs = [...formData.documents];
                            newDocs[index].category = e.target.value;
                            setFormData({...formData, documents: newDocs});
                          }}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-brand-500 cursor-pointer"
                        >
                          <option>CV / Resume</option>
                          <option>Transcripts / Degree</option>
                          <option>Citizenship / ID</option>
                          <option>PAN Card</option>
                          <option>Employment Contract</option>
                          <option>Professional License</option>
                          <option>Police Clearance</option>
                          <option>Health Records</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 font-sans">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Document Title</label>
                        <input 
                          type="text"
                          placeholder="e.g. Master's Degree"
                          value={doc.title}
                          onChange={(e) => {
                            const newDocs = [...formData.documents];
                            newDocs[index].title = e.target.value;
                            setFormData({...formData, documents: newDocs});
                          }}
                          className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>
                    <label className="block">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const newDocs = [...formData.documents];
                            newDocs[index].file = file;
                            if (!newDocs[index].title) newDocs[index].title = file.name;
                            setFormData({...formData, documents: newDocs});
                          }
                        }}
                      />
                      <div className={cn(
                        "border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-white transition-all cursor-pointer group/upload",
                        doc.file ? "border-success-dark/30 bg-success-light/10" : "border-slate-200 hover:border-brand-400"
                      )}>
                         {doc.file ? (
                           <CheckCircle2 size={16} className="text-success-dark" />
                         ) : (
                           <FileUp size={16} className="text-slate-400 group-hover/upload:text-brand-500 transition-colors" />
                         )}
                         <p className="text-[10px] font-bold text-slate-500">
                           {doc.file ? doc.file.name : `Pick file for ${doc.category}`}
                         </p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Global Verification Status</label>
                <select 
                  value={globalStatus}
                  onChange={(e) => setGlobalStatus(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans"
                >
                  <option>Pending Verification</option>
                  <option>Verified & Active</option>
                  <option>Expired / Needs Renewal</option>
                </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={closeModal} className="rounded-xl h-12 px-6 font-bold text-[10px] uppercase tracking-widest">Discard</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
               {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (isEditMode ? <Edit3 size={18} /> : <FileUp size={18} />)} {isEditMode ? 'Update' : 'Archive'} {formData.documents.length} Documents
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DocumentManagement;
