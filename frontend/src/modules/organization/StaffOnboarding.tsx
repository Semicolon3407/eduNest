import { useState } from 'react';
import { UserPlus, Search, MoreVertical, Mail, Shield, Briefcase } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function StaffOnboarding() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Invited' | 'Pending'>('Active');

  const staff = [
    { id: 'ST-001', name: 'Emily Blunt', role: 'HR Manager', email: 'emily@westfield.com', status: 'Active', joined: 'Mar 2025' },
    { id: 'ST-002', name: 'Robert Downey', role: 'Administrator', email: 'robert@westfield.com', status: 'Active', joined: 'Jan 2025' },
    { id: 'ST-003', name: 'Chris Evans', role: 'Tutor', email: 'chris@westfield.com', status: 'Invited', joined: '--' },
    { id: 'ST-004', name: 'Scarlett J.', role: 'Tutor', email: 'scarlett@westfield.com', status: 'Active', joined: 'Feb 2025' },
  ];

  const filteredStaff = staff.filter(s => 
    activeTab === 'Active' ? s.status === 'Active' : 
    activeTab === 'Invited' ? s.status === 'Invited' : s.status === 'Pending'
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase  tracking-tighter">Staff Onboarding</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Invite and manage accounts for HR, Administrators, and Tutors.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary-600/20 hover:scale-105 transition-all active:scale-95">
          <UserPlus size={18} /> Invite New Staff
        </button>
      </div>

      <div className="flex flex-col gap-6 rounded-3xl border bg-background p-8 shadow-sm">
        <div className="flex items-center justify-between border-b pb-6">
            <div className="flex gap-8">
                {['Active', 'Invited', 'Pending'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                            "text-xs font-black uppercase tracking-widest transition-all relative pb-2",
                            activeTab === tab ? "text-primary-600" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab} Staff
                        {activeTab === tab && <div className="absolute bottom-0 left-0 h-1 w-full bg-primary-600 rounded-full animate-in zoom-in duration-300"></div>}
                    </button>
                ))}
            </div>
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search staff members..." className="w-64 rounded-full border bg-muted/20 py-2.5 pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <tr>
                        <th className="py-4 ">Full Name</th>
                        <th className="py-4 ">Role/Permissions</th>
                        <th className="py-4 ">Email Address</th>
                        <th className="py-4 ">Onboarding Date</th>
                        <th className="py-4  text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dashed">
                    {filteredStaff.map((s) => (
                        <tr key={s.id} className="group hover:bg-primary-50/20 transition-colors">
                            <td className="py-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 overflow-hidden rounded-2xl bg-muted ring-2 ring-primary-50 group-hover:ring-primary-100 transition-all">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt=""/>
                                    </div>
                                    <div>
                                        <p className="font-extrabold  tracking-tight text-foreground">{s.name}</p>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">{s.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-5">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary-700">
                                    <Shield size={10} /> {s.role}
                                </span>
                            </td>
                            <td className="py-5 text-sm font-medium text-muted-foreground">{s.email}</td>
                            <td className="py-5 font-bold  text-foreground/80">{s.joined}</td>
                            <td className="py-5 text-right">
                                <div className="flex justify-end gap-2">
                                     <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary-600 hover:text-white transition-all"><Mail size={14}/></button>
                                     <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-white transition-all"><MoreVertical size={14}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredStaff.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-muted-foreground  font-medium">No {activeTab.toLowerCase()} staff members found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <div className="mt-6 flex items-start gap-4 rounded-2xl bg-primary-50 p-6 border border-primary-100">
            <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
                <Briefcase size={24} />
            </div>
            <div>
                <h4 className="font-black  text-primary-900 tracking-tighter">Institutional Security Advisory</h4>
                <p className="text-xs font-bold text-primary-800/80 mt-1 leading-relaxed">Staff accounts are secured with Two-Factor Authentication (2FA) by default. Admin accounts can only be created by the Organization Owner.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
