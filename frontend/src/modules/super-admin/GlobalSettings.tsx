import { useState, useEffect } from 'react';
import { Save, Server, Mail, ShieldCheck, Database } from 'lucide-react';
import { superAdminService } from '../../services/superAdminService';

interface ConfigItem {
  key: string;
  value: string;
}

export function GlobalSettings() {
  const [config, setConfig] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await superAdminService.getConfig();
      setConfig(res.data);
    } catch (error) {
      console.error("Failed to fetch config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: string, value: string) => {
    setSaving(true);
    try {
      await superAdminService.updateConfig(key, value);
      fetchConfig();
    } catch (error) {
      alert("Failed to update setting");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getConfigValue = (key: string, fallback: string) => {
    return config.find(c => c.key === key)?.value || fallback;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Configuration</h1>
        <p className="mt-1 text-muted-foreground">Manage master settings and third-party integrations for the entire platform.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ConfigSection 
            title="System Updates & Maintenance" 
            icon={<Server className="text-primary-600" size={20} />}
            description="Control platform-wide versioning and maintenance windows."
          >
            <SettingItem 
              label="System Version" 
              value="v2.4.0-stable" 
              readOnly 
            />
            <SettingItem 
              label="Maintenance Mode" 
              type="toggle"
              value={false}
              onToggle={(v: boolean) => console.log(v)}
            />
          </ConfigSection>

          <ConfigSection 
            title="Email & Notification Gateways" 
            icon={<Mail className="text-primary-600" size={20} />}
            description="Configure SMTP and SMS providers for all organization notifications."
          >
            <SettingItem 
              label="SMTP Host" 
              value={getConfigValue('smtp_host', 'smtp.postmarkapp.com')} 
              onSave={(v: string) => handleUpdate('smtp_host', v)}
            />
            <SettingItem 
              label="SMS Provider" 
              value={getConfigValue('sms_provider', 'Twilio')} 
              onSave={(v: string) => handleUpdate('sms_provider', v)}
            />
          </ConfigSection>

          <ConfigSection 
            title="Security & Compliance" 
            icon={<ShieldCheck className="text-primary-600" size={20} />}
            description="Global security parameters for user sessions and data encryption."
          >
             <SettingItem 
              label="Session Timeout (Min)" 
              value={getConfigValue('session_timeout', '60')} 
              type="number"
              onSave={(v: string) => handleUpdate('session_timeout', v)}
            />
            <SettingItem 
              label="Max File Upload (MB)" 
              value={getConfigValue('max_upload_size', '10')} 
              type="number"
              onSave={(v: string) => handleUpdate('max_upload_size', v)}
            />
          </ConfigSection>
        </div>

        <div className="space-y-6">
           <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Database size={18} className="text-primary-600" />
                Storage Quota
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                    <span>Used Space</span>
                    <span>1.2TB / 5TB</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary-600" style={{ width: '24%' }}></div>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    Platform storage is automatically scaled based on active organization subscriptions.
                </p>
              </div>
           </div>

           <div className="rounded-2xl border bg-background p-3 shadow-sm border-amber-100 bg-amber-50/20">
              <div className="flex gap-3">
                 <div className="p-2 rounded-lg bg-amber-100 text-amber-600 h-fit">
                    <ShieldCheck size={18} />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-amber-900">Critical Update Available</h4>
                    <p className="text-xs text-amber-700 mt-1">Platform core v2.4.1 is ready for deployment. Schedule maintenance window?</p>
                    <button className="mt-3 px-3 py-1.5 bg-amber-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-amber-600/20">
                        View Changelog
                    </button>
                 </div>
              </div>
           </div>
           
           {saving && (
             <div className="text-center p-4 rounded-xl bg-primary-50 text-primary-600 text-xs font-bold animate-pulse">
               Saving platform changes...
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

interface ConfigSectionProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  children: React.ReactNode;
}

function ConfigSection({ title, icon, description, children }: ConfigSectionProps) {
    return (
        <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-muted/30 flex items-center gap-3">
                {icon}
                <div>
                    <h2 className="text-sm font-bold">{title}</h2>
                    <p className="text-[10px] text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="p-6 space-y-4">
                {children}
            </div>
        </div>
    );
}

interface SettingItemProps {
  label: string;
  value: string | boolean;
  onSave?: (v: string) => void;
  type?: 'text' | 'number' | 'toggle';
  readOnly?: boolean;
  onToggle?: (v: boolean) => void;
}

function SettingItem({ label, value, onSave, type = 'text', readOnly, onToggle }: SettingItemProps) {
    const [val, setVal] = useState(value);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        setVal(value);
    }, [value]);

    return (
        <div className="flex items-center justify-between gap-4 py-1">
            <label className="text-xs font-bold text-foreground/80 w-1/3">{label}</label>
            <div className="flex-1 flex items-center gap-2">
                {type === 'toggle' ? (
                    <button 
                        onClick={() => onToggle && onToggle(!val as boolean)}
                        className={`h-6 w-11 rounded-full p-1 transition-colors ${val ? 'bg-primary-600' : 'bg-muted'}`}
                    >
                        <div className={`h-4 w-4 rounded-full bg-white transition-transform ${val ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                ) : (
                    <input 
                        type={type}
                        value={val as string}
                        readOnly={readOnly}
                        onChange={(e) => {
                            setVal(e.target.value);
                            setChanged(true);
                        }}
                        className={`flex-1 rounded-lg border bg-muted/50 px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                )}
                {changed && !readOnly && onSave && (
                    <button 
                        onClick={() => {
                            onSave(val as string);
                            setChanged(false);
                        }}
                        className="p-1.5 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                    >
                        <Save size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}
