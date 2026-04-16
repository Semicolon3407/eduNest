import React from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Save, Server } from 'lucide-react';

const SuperAdminSettings: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900">System Settings</h1>
          <p className="text-gray-500 mt-2 font-medium uppercase tracking-widest text-[10px]">Manage the global platform and server settings</p>
        </div>
        <Button className="rounded-full shadow-premium"><Save size={18} /> Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 p-2 uppercase tracking-widest">Navigation</h3>
            {['General Settings', 'API Keys', 'System Logs', 'Billing Plans', 'Server Health'].map((tab, idx) => (
               <button key={tab} className={`w-full text-left px-6 py-5 rounded-[28px] font-bold text-[10px] uppercase tracking-widest transition-all ${idx === 0 ? 'bg-brand-500 text-white shadow-premium' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}>
                  {tab}
               </button>
            ))}
         </div>

         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-soft border border-slate-200">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                     <Server size={28} />
                  </div>
                  <div>
                     <h3 className="text-xl font-medium text-gray-900">Server Information</h3>
                     <p className="text-[10px] font-bold text-success-dark uppercase tracking-widest mt-1">Status: Online</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-8">
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Name</p>
                     <Input placeholder="eduNest" />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support Email</p>
                     <Input placeholder="support@edunest.com" />
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 p-6 sm:p-10 rounded-[40px] shadow-premium text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
               <div className="flex items-center justify-between relative z-10">
                  <div>
                     <h4 className="text-xl font-medium">Maintenance Mode</h4>
                     <p className="text-sm text-brand-200 mt-2 font-sans">Temporarily disable access to the platform for updates.</p>
                  </div>
                  <button className="px-8 py-4 bg-danger text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-premium active:scale-95 transition-all">Enable Now</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
