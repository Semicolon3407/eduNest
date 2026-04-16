import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Building2, MapPin, Phone, Mail, Globe, Save, Trash2, ShieldCheck, Plus, Link, Map, Shield } from 'lucide-react';

const Branches: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Branch Configuration</h1>
          <p className="text-gray-500 mt-1">Configure individual campus settings and administrative controls</p>
        </div>
        <Button className="h-11 px-6 rounded-2xl shadow-premium" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create New Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Branch Selection List */}
         <div className="lg:col-span-1 space-y-4">
            {['Main Campus (Primary)', 'North Branch', 'West Side Academy'].map((branch, i) => (
              <div key={branch} className={`p-5 rounded-[32px] border transition-all cursor-pointer ${i === 0 ? 'bg-surface shadow-premium border-brand-500 ring-2 ring-brand-500/10' : 'bg-surface border-surface-200 opacity-60 hover:opacity-100 hover:border-brand-200'}`}>
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${i === 0 ? 'bg-brand-500 text-white' : 'bg-surface-100 text-gray-400'}`}>
                       <Building2 size={24} />
                    </div>
                    <div>
                       <h3 className="font-medium text-gray-900   text-sm">{branch}</h3>
                       <p className="text-[10px] text-gray-400 font-medium   leading-none mt-1">{i === 0 ? 'Headquarters' : 'Satellite Branch'}</p>
                    </div>
                 </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => setIsModalOpen(true)} className="w-full h-14 border-dashed rounded-[32px] font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-brand-500 hover:border-brand-500 transition-all">+ Add New Site</Button>
         </div>

         {/* Branch Editor */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200">
               <div className="flex items-center justify-between mb-10 pb-8 border-b border-surface-100">
                  <h2 className="text-2xl font-medium text-gray-900 ">Basic Information</h2>
                  <Button size="sm" variant="danger" className="rounded-xl"><Trash2 size={16} /> Decommission Branch</Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Branch Name" defaultValue="Main Campus" icon={Building2} />
                  <Input label="Display Code" defaultValue="EDU-MC-01" placeholder="e.g. LON-01" />
                  <div className="md:col-span-2">
                    <Input label="Physical Address" defaultValue="128 Academy Way, Knowledge District" icon={MapPin} />
                  </div>
                  <Input label="Admin Email" defaultValue="admin@main.edunest.com" icon={Mail} />
                  <Input label="Contact Number" defaultValue="+1 (555) 0123" icon={Phone} />
                  <Input label="Website / Portal" defaultValue="main.edunest.com" icon={Globe} />
                  <div className="md:col-span-2">
                     <p className="text-xs font-medium text-gray-400   px-1 mb-4">Security Policies</p>
                     <div className="flex items-center gap-4 bg-brand-50 p-4 rounded-2xl border border-brand-100">
                        <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                           <ShieldCheck size={20} />
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-medium text-brand-900  ">Active Multi-factor Auth</p>
                           <p className="text-xs text-brand-700 font-medium">Require identity verification for all staff in this branch.</p>
                        </div>
                        <button className="w-12 h-6 bg-brand-500 rounded-full relative transition-all active:scale-90"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></button>
                     </div>
                  </div>
               </div>

               <div className="mt-12 flex justify-end gap-4">
                  <Button variant="outline" className="rounded-xl h-12 px-6">Discard Changes</Button>
                  <Button className="h-12 px-10 rounded-xl shadow-premium"><Save size={18} /> Update Configuration</Button>
               </div>
            </div>
         </div>
      </div>

      {/* Required Form: Create Branch */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Establish New Branch"
        description="Deploy a new campus instance with integrated regional management."
        maxWidth="2xl"
      >
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Campus / Branch Name" placeholder="e.g. West Coast Technical" icon={Building2} required />
            </div>
            <Input label="Internal Code" placeholder="WCT-01" icon={Link} required />
            <Input label="Campus Type" placeholder="Satellite / Main" icon={Map} required />
            <div className="md:col-span-2">
              <Input label="Geographic Location" placeholder="San Francisco, CA" icon={MapPin} required />
            </div>
            <Input label="Primary Phone" placeholder="+1 (555) 0123" icon={Phone} required />
            <Input label="Branch Email" placeholder="sf@institution.com" icon={Mail} required type="email" />
          </div>

          <div className="bg-success-light p-6 rounded-3xl border border-success/10 flex items-start gap-4">
             <div className="w-10 h-10 bg-success text-white rounded-xl flex items-center justify-center shrink-0">
               <Shield size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-success-dark leading-tight">Branch Isolation</p>
               <p className="text-xs text-success-dark/70 mt-1 leading-relaxed">This branch will have its own independent academic term cycles and local administrator roles.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium">Deploy Campus Infrastructure</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Branches;
