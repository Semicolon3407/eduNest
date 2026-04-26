import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { 
  Plus, FileText, CheckCircle2, 
  Trash2, MoreVertical, Eye, Edit3, Search, ChevronDown, Filter, X 
} from 'lucide-react';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';


const Fees: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [fees, setFees] = React.useState<any[]>([]);

  const [loading, setLoading] = React.useState(true);
  const [formData, setFormData] = React.useState({
    name: '',
    amount: '',
    frequency: 'Annual',
    category: 'Academic',
    targetGrade: '',
    description: ''
  });
  const [classes, setClasses] = React.useState<any[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isViewOnly, setIsViewOnly] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedGrade, setSelectedGrade] = React.useState('');

  React.useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const [feesRes, classesRes] = await Promise.all([
        adminService.getFees(),
        adminService.getClasses()
      ]);
      
      if (feesRes.success) setFees(feesRes.data);
      if (classesRes.success) setClasses(classesRes.data);
    } catch (error) {
      console.error('Failed to fetch fees:', error);
      toast.error('Failed to load fee management data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateFee(editingId, formData);
        toast.success('Fee structure updated');
      } else {
        await adminService.createFee(formData);
        toast.success('Fee structure created');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setIsViewOnly(false);
      setFormData({ name: '', amount: '', frequency: 'Annual', category: 'Academic', targetGrade: '', description: '' });
      fetchFees();
    } catch (error) {
      toast.error('Failed to save fee structure');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this fee structure?')) return;
    try {
      const response = await adminService.deleteFee(id);
      if (response.success) {
        toast.success('Fee structure removed');
        fetchFees();
      }
    } catch (error) {
      toast.error('Failed to delete fee');
    }
  };

  const handleEdit = (fee: any) => {
    setEditingId(fee._id);
    setIsViewOnly(false);
    setFormData({
      name: fee.name,
      amount: fee.amount.toString(),
      frequency: fee.frequency,
      category: fee.category,
      targetGrade: fee.targetGrade || '',
      description: fee.description || ''
    });
    setIsModalOpen(true);
  };

  const handleView = (fee: any) => {
    handleEdit(fee);
    setIsViewOnly(true);
  };

  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         fee.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !selectedGrade || fee.targetGrade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Fee Management</h1>
          <p className="text-gray-500 mt-1">Configure fee structures, track collections, and manage liabilities</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Add Fee Structure</Button>
      </div>



      <div className="bg-surface p-4 sm:p-8 rounded-[48px] shadow-soft border border-surface-200">
         <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-[2]">
              <Input 
                placeholder="Search fees by name or category..." 
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl h-12"
              />
            </div>
            <div className="flex flex-wrap gap-2">
               <div className="relative min-w-[200px]">
                 <select 
                   value={selectedGrade}
                   onChange={(e) => setSelectedGrade(e.target.value)}
                   className="w-full h-12 bg-surface-50 border border-surface-200 rounded-xl px-10 py-2 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer pr-10"
                 >
                   <option value="">All Grades</option>
                   {[...new Set(classes.map(c => c.name))].sort().map(grade => (
                     <option key={grade} value={grade}>{grade}</option>
                   ))}
                 </select>
                 <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
               </div>
               {(searchTerm || selectedGrade) && (
                 <Button 
                   variant="outline" 
                   onClick={() => { setSearchTerm(''); setSelectedGrade(''); }}
                   className="h-12 rounded-xl text-gray-500 hover:text-danger"
                 >
                   <X size={18} /> Clear
                 </Button>
               )}
            </div>
         </div>

         <div className="overflow-visible">
            <div className="flex items-center justify-between mb-6 px-2">
               <h2 className="text-xl font-medium text-gray-900 font-display uppercase tracking-tight">Fee Structures</h2>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing {filteredFees.length} Results</p>
            </div>
           <table className="w-full text-left border-collapse min-w-[600px]">
             <thead>
               <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-8 uppercase">
                 <th className="px-8 py-4">Name / Category / Grade</th>
                 <th className="px-6 py-4">Amount</th>
                 <th className="px-6 py-4">Frequency</th>
                 <th className="px-8 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-surface-100">
               {loading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                   <tr key={i} className="animate-pulse">
                     <td colSpan={4} className="px-8 py-8 h-16 bg-slate-50/50"></td>
                   </tr>
                 ))
               ) : filteredFees.map(fee => (
                 <tr key={fee._id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                   <td className="px-8 py-5">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs shadow-sm border border-brand-100 group-hover:bg-white group-hover:scale-110 transition-all">
                         {fee.category.charAt(0)}
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{fee.name}</p>
                         <div className="flex items-center gap-2 mt-0.5">
                           <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">{fee.category}</p>
                           {fee.targetGrade && (
                             <>
                               <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fee.targetGrade}</p>
                             </>
                           )}
                         </div>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-5">
                     <span className="text-sm font-bold text-gray-900">Rs. {(Number(fee.amount) || 0).toLocaleString()}</span>
                   </td>
                   <td className="px-6 py-5">
                     <Badge variant="brand" className="uppercase tracking-widest text-[9px] font-bold">{fee.frequency}</Badge>
                   </td>
                   <td className="px-8 py-5 text-right">
                     <Dropdown 
                       trigger={
                         <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                           <MoreVertical size={20} />
                         </button>
                       }
                     >
                        <DropdownItem icon={Eye} onClick={() => handleView(fee)}>View Details</DropdownItem>
                        <DropdownItem icon={Edit3} onClick={() => handleEdit(fee)}>Edit Structure</DropdownItem>
                        <DropdownItem icon={Trash2} variant="danger" onClick={() => handleDelete(fee._id)}>Remove Fee</DropdownItem>
                     </Dropdown>
                   </td>
                 </tr>
               ))}
               {filteredFees.length === 0 && (
                 <tr>
                   <td colSpan={4} className="px-8 py-20 text-center text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                     No fee structures defined yet
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
          setIsViewOnly(false);
          setFormData({ name: '', amount: '', frequency: 'Annual', category: 'Academic', targetGrade: '', description: '' });
        }}
        title={isViewOnly ? "Fee Structure Details" : (editingId ? "Update Fee Structure" : "Create Fee Structure")}
        description={isViewOnly ? "Overview of administrative and academic charges." : "Define or modify fee structures for institutional resource management."}
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <fieldset disabled={isViewOnly} className="space-y-6">
            <Input 
              label="Fee Name" 
              placeholder="e.g. Transportation Fee" 
              icon={FileText} 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Amount (Rs.)" 
              placeholder="200" 
              type="number" 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required 
            />
            <div className="space-y-1.5 focus-within:z-10 group">
              <label className="text-xs font-bold text-gray-400 px-1 uppercase tracking-tight">Billing Frequency</label>
              <select 
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer"
              >
                <option value="Annual">Annual</option>
                <option value="Termly">Termly</option>
                <option value="Monthly">Monthly</option>
                <option value="One-time">One-time</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Category" 
              placeholder="e.g. Academic, Lab" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required 
            />
            <div className="space-y-1.5 focus-within:z-10 group">
              <label className="text-xs font-bold text-gray-400 px-1 uppercase tracking-tight">Target Grade</label>
              <select 
                value={formData.targetGrade}
                onChange={(e) => setFormData({...formData, targetGrade: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer"
              >
                <option value="">All Grades</option>
                {[...new Set(classes.map(c => c.name))].sort().map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Description / Notes</label>
            <textarea 
              className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none"
              placeholder="Provide details about what this fee covers..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </fieldset>
          <div className="flex items-center gap-3 p-4 bg-success-light/30 rounded-2xl border border-success-light">
            <CheckCircle2 size={20} className="text-success-dark" />
            <p className="text-xs font-medium text-success-dark text-[10px] uppercase tracking-wider">
              {isViewOnly ? "This fee is currently active for selected student groups." : "This fee will be applied to selected student groups upon save."}
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">
              {isViewOnly ? "Close" : "Cancel"}
            </Button>
            {!isViewOnly && (
              <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white">
                {editingId ? "Update Fee" : "Create Fee"}
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fees;
