import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { 
  FileText, Shield, Briefcase, Download, Search, MoreVertical, 
  Paperclip, Plus, User, FileUp, Loader2, GitBranch, ChevronDown 
} from 'lucide-react';
import { hrService } from '../../services/hrService';
import toast from 'react-hot-toast';

const DocumentManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalBranch, setModalBranch] = useState('All Branches');
  const [staffSearch, setStaffSearch] = useState('');
  const [selectedStaffName, setSelectedStaffName] = useState('');
  const [showStaffResults, setShowStaffResults] = useState(false);
  const [formData, setFormData] = useState({
    staffId: '',
    title: '',
    category: 'Employment Contract',
    status: 'Pending Verification'
  });

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.staffId) {
      toast.error('Please select a staff member from the search results');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await hrService.uploadStaffDocument(formData);
      if (response.success) {
        toast.success('Institutional document archived');
        setIsModalOpen(false);
        fetchData();
        
        // Audit-safe Reset
        setFormData({
          staffId: '',
          title: '',
          category: 'Employment Contract',
          status: 'Pending Verification'
        });
        setStaffSearch('');
      }
    } catch (error) {
      toast.error('Archive operation failed');
    } finally {
      setIsSubmitting(false);
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
           <Button onClick={() => setIsModalOpen(true)} className="rounded-xl h-11 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex-1 sm:flex-none whitespace-nowrap"><Plus size={18} /> Add New Document</Button>
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

      <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200 font-sans">
         <div className="flex items-center justify-between mb-8 overflow-hidden font-sans">
            <h2 className="text-xl font-medium text-gray-900  ">Staff Credentials</h2>
            <div className="flex gap-2 font-sans">
               <div className="hidden sm:flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100">
                  <Search size={16} className="text-slate-400 font-sans" />
                  <input type="text" placeholder="Search files..." className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-2 w-48 outline-none font-sans" />
               </div>
            </div>
         </div>

         <div className="overflow-x-auto font-sans">
              <div className="overflow-x-auto font-sans"><table className="w-full text-left font-sans">
                <thead>
                   <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100 font-sans">
                      <th className="px-6 py-4">Staff Member</th>
                      <th className="px-6 py-4">Document Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                   {documents.map((doc: any) => (
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
                         <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <Badge variant={doc.status === 'Verified & Active' ? 'success' : 'brand'} className="font-black tracking-tighter text-[10px]">{doc.status?.toUpperCase() || 'PENDING'}</Badge>
                               <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><Download size={18}/></button>
                               <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><MoreVertical size={18}/></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table></div>
         </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Staff Document"
        description="Verify and archive a new credential or contract for a staff member."
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={handleUpload}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
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
                              setSelectedStaffName(`${s.firstName} {s.lastName}`);
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

            <div className="md:col-span-2">
              <Input 
                label="Document Title" 
                placeholder="e.g. Master's Degree Certificate" 
                icon={FileText} 
                required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Document Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans"
                >
                  <option>Employment Contract</option>
                  <option>Identity Proof (Passport/ID)</option>
                  <option>Academic Certification</option>
                  <option>Professional License</option>
                  <option>Police Clearance</option>
                  <option>Health Records</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Verification Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans"
                >
                  <option>Pending Verification</option>
                  <option>Verified & Active</option>
                  <option>Expired / Needs Renewal</option>
                </select>
            </div>
            <div className="md:col-span-2">
               <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-white hover:border-brand-500 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-600 group-hover:border-brand-100">
                    <FileUp size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900 leading-none">Click to upload file</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-2">Maximum file size: 10MB (PDF, JPG, PNG)</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6 font-bold text-[10px] uppercase tracking-widest">Discard</Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
               {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <FileUp size={18} />} Archive Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DocumentManagement;
