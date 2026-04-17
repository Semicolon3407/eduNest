import React from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Globe, Shield, Bell, Database, Save, Upload } from 'lucide-react';

const GeneralSettings: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 leading-none">Global Configuration</h1>
          <p className="text-gray-500 mt-2 font-medium   text-[10px]">Manage organization policies and system-wide parameters</p>
        </div>
        <Button className="rounded-full shadow-premium"><Save size={18} /> Save All Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-8">
         {/* Sidebar Tabs */}
         <div className="lg:col-span-1 space-y-3">
            {[
               { icon: Globe, label: 'General Info', active: true },
               { icon: Shield, label: 'Grading Scales', active: false },
               { icon: Bell, label: 'Notifications', active: false },
               { icon: Database, label: 'Backup & Recovery', active: false },
            ].map(tab => (
               <button key={tab.label} className={`w-full flex items-center gap-4 px-6 py-5 rounded-[32px] font-medium text-xs   transition-all ${tab.active ? 'bg-brand-500 text-white shadow-premium' : 'bg-white text-slate-50 border border-slate-100 opacity-60 hover:opacity-100 hover:bg-slate-50 text-slate-600'}`}>
                  <tab.icon size={20} />
                  {tab.label}
               </button>
            ))}
         </div>

         {/* Settings Form */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200">
               <h3 className="text-xl font-medium text-gray-900   mb-8">Organization Branding</h3>
               <div className="flex items-center gap-4 sm:p-8 mb-10">
                  <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 group hover:border-brand-500 hover:text-brand-500 transition-all cursor-pointer">
                     <Upload size={24} />
                     <span className="text-[8px] font-medium  mt-1  text-[8px]">Logo</span>
                  </div>
                  <div className="flex-1 space-y-2">
                     <p className="text-sm font-medium text-gray-900  ">Organization Logo</p>
                     <p className="text-xs font-medium text-slate-500">Recommended size: 512x512px (PNG or SVG). This will appear on all reports and payslips.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Organization Name" placeholder="eduNest International School" />
                  <Input label="System Currency" placeholder="USD ($)" />
                  <Input label="Primary Timezone" placeholder="UTC (GMT+0)" />
                  <Input label="Contact Email" placeholder="admin@edunest.org" />
               </div>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200">
               <h3 className="text-xl font-medium text-gray-900   mb-8">Academic Policy</h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                     <div>
                        <h4 className="font-medium text-xs text-gray-900  ">Grading System</h4>
                        <p className="text-xs font-medium text-slate-500">Choose between GPA (4.0) or Percentage based grading.</p>
                     </div>
                     <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium   outline-none focus:border-brand-500 transition-all">
                        <option>GPA Model</option>
                        <option>Percentage</option>
                        <option>Letter Grade</option>
                     </select>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                     <div>
                        <h4 className="font-medium text-xs text-gray-900  ">Maintenance Mode</h4>
                        <p className="text-xs font-medium text-slate-500">Restrict access during system updates.</p>
                     </div>
                     <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer group">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all group-hover:bg-slate-50 shadow-sm"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
