import React from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { UserPlus, Mail, Shield } from 'lucide-react';

const StaffOnboarding: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Staff Onboarding</h1>
          <p className="text-gray-500 mt-1">Invite new educators, administrators, and HR personnel to your institution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8">
         {/* Form Section */}
         <div className="bg-surface p-4 sm:p-8 lg:p-6 sm:p-10 rounded-[40px] shadow-soft border border-surface-200">
            <h2 className="text-2xl font-medium text-gray-900 mb-8  ">Create Account</h2>
            
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" placeholder="e.g. John" />
                  <Input label="Last Name" placeholder="e.g. Doe" />
               </div>
               
               <Input label="Institutional Email" icon={Mail} placeholder="name@school.com" />
               
               <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400   px-1">Role Assignment</label>
                  <div className="grid grid-cols-2 gap-3">
                     {['HR Manager', 'Administrator', 'Tutor', 'Registrar'].map(role => (
                       <button key={role} className="p-4 rounded-2xl border border-surface-200 text-sm font-medium text-gray-600 hover:border-brand-500 hover:bg-brand-50 transition-all text-left flex items-center justify-between transition-all group">
                         {role}
                         <div className="w-2 h-2 rounded-full border-2 border-surface-200 group-hover:border-brand-500 group-hover:bg-brand-500 transition-all"></div>
                       </button>
                     ))}
                  </div>
               </div>

               <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
                     <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-brand-500  ">Permissions Template</h4>
                    <p className="text-xs text-brand-700 font-medium">Standard access rights will be applied based on the selected role.</p>
                  </div>
               </div>

               <div className="pt-4">
                  <Button className="w-full h-14 shadow-premium"><UserPlus size={18} /> Send Invitation Email</Button>
               </div>
            </div>
         </div>

         {/* Content/Help Section */}
         <div className="flex flex-col gap-6">
            <div className="bg-brand-500 text-white p-4 sm:p-8 rounded-[40px] shadow-premium flex-1 relative overflow-hidden">
               <h3 className="text-2xl font-medium  mb-4">Onboarding Guidelines</h3>
               <div className="space-y-4 text-brand-200 text-sm font-medium">
                  <div className="flex gap-3">
                     <div className="shrink-0 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-[10px] text-white font-medium">1</div>
                     <p>Use institutional emails to ensure multi-factor authentication works correctly.</p>
                  </div>
                  <div className="flex gap-3">
                     <div className="shrink-0 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-[10px] text-white font-medium">2</div>
                     <p>Assign secondary roles only after initial account verification.</p>
                  </div>
                  <div className="flex gap-3">
                     <div className="shrink-0 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-[10px] text-white font-medium">3</div>
                     <p>New staff will receive a digital onboarding packet automatically.</p>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-surface p-4 sm:p-8 rounded-[40px] shadow-soft border border-surface-200">
               <h3 className="text-lg font-medium text-gray-900   mb-4">Pending Invites</h3>
               <div className="space-y-4">
                  {[
                    { name: 'Sarah Wilson', role: 'Tutor', date: '2 hours ago' },
                    { name: 'Michael Brown', role: 'Admin', date: 'Yesterday' },
                  ].map(invite => (
                    <div key={invite.name} className="flex items-center justify-between p-4 bg-surface-50 rounded-2xl border border-surface-100">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center font-medium text-xs">{invite.name[0]}</div>
                          <div>
                             <p className="text-sm font-medium text-gray-900">{invite.name}</p>
                             <p className="text-[10px] font-medium text-gray-400   leading-none mt-1">{invite.role}</p>
                          </div>
                       </div>
                       <Button variant="ghost" className="text-xs font-medium text-brand-500">Resend</Button>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StaffOnboarding;
