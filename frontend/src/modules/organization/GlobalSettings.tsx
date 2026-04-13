import { useState, useEffect } from 'react';
import { Save, Upload, Shield, Globe, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { cn } from '../../hooks/utils';
import { organizationService } from '../../services/organizationService';

export function GlobalSettings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await organizationService.getSettings();
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await organizationService.updateSettings(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateNestedSetting = (category: string, key: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [category]: {
          ...(prev.settings?.[category] || {}),
          [key]: value
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Institutional Hub</h1>
          <p className="mt-1 text-muted-foreground font-medium underline decoration-primary-200 underline-offset-4 decoration-2">Configure institutional identity, RBAC policies, and core educational rules.</p>
        </div>
        {success && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in zoom-in">
                <CheckCircle2 size={16} /> Configuration Deployed
            </div>
        )}
      </div>

      <div className="grid gap-8">
        {/* Branding Section */}
        <section className="rounded-3xl border bg-background p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 tracking-tighter uppercase italic text-primary-600">
                <ImageIcon size={24} /> Institutional Identity
            </h2>
            <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="relative group">
                    <div className="h-40 w-40 rounded-3xl bg-muted border-4 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center text-muted-foreground group-hover:border-primary-600/50 group-hover:bg-primary-50 transition-all cursor-pointer overflow-hidden">
                        {data.logo ? (
                            <img src={data.logo} alt="Logo" className="h-full w-full object-contain p-4" />
                        ) : (
                            <>
                                <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload School Logo</span>
                            </>
                        )}
                        <input 
                            type="text" 
                            placeholder="Logo URL" 
                            value={data.logo || ''} 
                            onChange={(e) => updateSetting('logo', e.target.value)}
                            className="absolute bottom-0 w-full bg-background/90 text-[8px] font-bold p-1 border-t outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                </div>
                <div className="flex-1 space-y-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Institutional Name</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={(e) => updateSetting('name', e.target.value)}
                                className="w-full rounded-2xl border bg-muted/20 py-3.5 px-5 text-sm font-extrabold outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Grading System</label>
                            <select 
                                value={data.gradingScale}
                                onChange={(e) => updateSetting('gradingScale', e.target.value)}
                                className="w-full rounded-2xl border bg-muted/20 py-3.5 px-5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all appearance-none"
                            >
                                <option value="GPA">GPA (4.0 Scale)</option>
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="LETTER">Letter Grade (A-F)</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Mission Quote / Tagline</label>
                        <input 
                            type="text" 
                            value={data.settings?.tagline || ''} 
                            onChange={(e) => updateNestedSetting('general', 'tagline', e.target.value)}
                            placeholder="Innovating Education for the Future"
                            className="w-full rounded-2xl border bg-muted/20 py-3.5 px-5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 transition-all" 
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* RBAC Section */}
        <section className="rounded-3xl border bg-background p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 tracking-tighter uppercase italic text-primary-600">
                <Shield size={24} /> Role-Based Access Control
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
                <RoleCard 
                    role="HR Admin" 
                    description="Payroll, Attendance, Onboarding"
                    permissions={['View Staff', 'Manage Salaries', 'Audit Attendance']}
                />
                <RoleCard 
                    role="Administrator" 
                    description="Admissions, Logistics, Fees"
                    permissions={['Enroll Students', 'Collect Fees', 'Asset Allocation']}
                />
                <RoleCard 
                    role="Tutor" 
                    description="Academic Delivery, Grading"
                    permissions={['Mark Attendance', 'Input Grades', 'View Virtual Classroom']}
                />
            </div>
            <p className="mt-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                Permissions are globally managed. You can toggle specific operational modules below.
            </p>
        </section>

        {/* Functional Toggles */}
        <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border bg-background p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3 tracking-tighter uppercase italic">
                    <Globe size={20} className="text-primary-600" /> Operational Rules
                </h3>
                <div className="space-y-4">
                    <SettingToggle 
                        label="Enable Automatic Fee Reminders" 
                        enabled={data.settings?.rules?.feeReminders}
                        onToggle={(v) => updateNestedSetting('rules', 'feeReminders', v)}
                    />
                    <SettingToggle 
                        label="LMS Integration (Northstar)" 
                        enabled={data.settings?.rules?.lmsEnabled}
                        onToggle={(v) => updateNestedSetting('rules', 'lmsEnabled', v)}
                    />
                    <SettingToggle 
                        label="Audit Log Visibility (Branch Level)" 
                        enabled={data.settings?.rules?.branchAudit}
                        onToggle={(v) => updateNestedSetting('rules', 'branchAudit', v)}
                    />
                </div>
            </div>
            <div className="rounded-3xl border bg-background p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3 tracking-tighter uppercase italic">
                    <Shield size={20} className="text-primary-600" /> Security Policies
                </h3>
                <div className="space-y-4">
                    <SettingToggle 
                        label="Mandatory 2FA for ALL Staff" 
                        enabled={data.settings?.security?.mfa}
                        onToggle={(v) => updateNestedSetting('security', 'mfa', v)}
                    />
                    <SettingToggle 
                        label="Data Encryption for Student Records" 
                        enabled={true}
                        readOnly
                    />
                    <SettingToggle 
                        label="Legacy System API Bridge" 
                        enabled={data.settings?.security?.apiBridge}
                        onToggle={(v) => updateNestedSetting('security', 'apiBridge', v)}
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4">
            <button className="px-8 py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-xs hover:bg-muted transition-all active:scale-95">Discard Changes</button>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="px-10 py-4 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-xs shadow-xl shadow-foreground/20 flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
                {saving ? 'Deploying...' : (
                    <>
                        <Save size={18} /> Push New Configuration
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ role, description, permissions }: { role: string, description: string, permissions: string[] }) {
    return (
        <div className="p-5 rounded-2xl border bg-muted/10 hover:border-primary-200 transition-colors">
            <h4 className="font-bold text-sm mb-1">{role}</h4>
            <p className="text-[10px] text-muted-foreground font-medium mb-4">{description}</p>
            <div className="space-y-2">
                {permissions.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter text-foreground/70">
                        <div className="h-1 w-1 rounded-full bg-primary-600" /> {p}
                    </div>
                ))}
            </div>
        </div>
    )
}

function SettingToggle({ label, enabled, onToggle, readOnly }: { label: string, enabled?: boolean, onToggle?: (v: boolean) => void, readOnly?: boolean }) {
    return (
        <div 
            className={cn("flex items-center justify-between group", readOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer")}
            onClick={() => !readOnly && onToggle && onToggle(!enabled)}
        >
            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors tracking-tight">{label}</span>
            <div className={cn(
                "h-6 w-11 rounded-full relative transition-all duration-300",
                enabled ? "bg-primary-600" : "bg-muted"
            )}>
                <div className={cn(
                    "h-4 w-4 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-sm",
                    enabled ? "left-6" : "left-1"
                )}></div>
            </div>
        </div>
    )
}
