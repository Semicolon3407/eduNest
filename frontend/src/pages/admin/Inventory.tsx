import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { Smartphone, Laptop, Microscope, Plus, History, Package, Tag, Hash, Box, AlertTriangle, PenTool } from 'lucide-react';

const assets = [
  { id: 1, name: 'MacBook Air M2', category: 'IT Assets', status: 'Allocated', count: '14 Units', icon: Laptop },
  { id: 2, name: 'Smart Projector G20', category: 'Multimedia', status: 'Available', count: '6 Units', icon: Smartphone },
  { id: 3, name: 'Olympus Microscope', category: 'Lab Equipment', status: 'Maintenance', count: '12 Units', icon: Microscope },
];

const Inventory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Inventory & Assets</h1>
          <p className="text-gray-500 mt-1 font-medium">Track and manage institutional properties and lab items</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-xl font-bold text-[10px] uppercase tracking-widest"><History size={18} /> Logs</Button>
           <Button className="rounded-xl shadow-premium h-12 px-6" onClick={() => setIsModalOpen(true)}><Plus size={18} /> Add Asset</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Categories Sidebar */}
         <div className="lg:col-span-1 space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 p-2 uppercase tracking-widest ">Categories</h3>
            {['All Assets', 'IT Equipment', 'Lab Tools', 'Classroom Furniture', 'General Office'].map((cat, idx) => (
               <button key={cat} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${idx === 0 ? 'bg-brand-500 text-white shadow-premium' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}>
                  {cat}
               </button>
            ))}
         </div>

         {/* Assets Grid */}
         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {assets.map(asset => (
               <div key={asset.id} className="bg-white p-6 rounded-[32px] sm:rounded-[48px] border border-slate-200 shadow-soft group hover:border-brand-500 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-14 h-14 bg-slate-50 text-brand-600 rounded-2xl flex items-center justify-center group-hover:bg-brand-50 transition-all border border-slate-100 group-hover:border-brand-100">
                        <asset.icon size={28} />
                     </div>
                     <div>
                        <h4 className="text-lg font-medium text-gray-900 group-hover:text-brand-600 transition-colors ">{asset.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 ">{asset.category}</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-tight ">{asset.count}</span>
                     <Badge variant={asset.status === 'Available' ? 'success' : asset.status === 'Maintenance' ? 'danger' : 'neutral'}>
                        {asset.status}
                     </Badge>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Required Form: Add Asset */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Asset"
        description="Add institutional property to the centralized asset management system."
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Asset Name / Model" placeholder="e.g. Dell Latitude 5430" icon={Package} required />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Asset Category</label>
                <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all appearance-none cursor-pointer font-sans">
                  <option>IT Equipment</option>
                  <option>Lab Infrastructure</option>
                  <option>Classroom Audio/Visual</option>
                  <option>Office Supplies</option>
                </select>
            </div>
            <Input label="Internal SKU / Tag ID" placeholder="AST-2023-001" icon={Tag} required />
            <Input label="Initial Quantity" placeholder="10" icon={Hash} required type="number" />
            <Input label="Acquisition Cost" placeholder="$1,200.00" icon={Box} required />
            <div className="md:col-span-2">
              <Input label="Storage Location / Room" placeholder="IT Dept - Storage B" icon={PenTool} required />
            </div>
          </div>

          <div className="bg-warning-light p-6 rounded-3xl border border-warning/10 flex items-start gap-4">
             <div className="w-10 h-10 bg-warning text-white rounded-xl flex items-center justify-center shrink-0">
               <AlertTriangle size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-warning-dark leading-tight">Maintenance Schedule</p>
               <p className="text-xs text-warning-dark/70 mt-1 leading-relaxed">System will automatically flag this asset for review after 12 months of allocation.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 transition-all active:scale-95">Register Asset</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
