import { Save, Upload, Shield, Globe, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function GlobalSettings() {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black  tracking-tighter uppercase">Institutional Configuration</h1>
        <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Manage logos, grading scales, and school-wide operational rules.</p>
      </div>

      <div className="grid gap-8">
        {/* Branding Section */}
        <section className="rounded-3xl border bg-background p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3  tracking-tighter uppercase">
                <ImageIcon size={24} className="text-primary-600" /> Identity Branding
            </h2>
            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="relative group">
                    <div className="h-40 w-40 rounded-3xl bg-muted border-4 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center text-muted-foreground group-hover:border-primary-600/50 group-hover:bg-primary-50 transition-all cursor-pointer overflow-hidden">
                        <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload School Logo</span>
                    </div>
                </div>
                <div className="flex-1 space-y-6 w-full">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Institutional Name</label>
                        <input type="text" defaultValue="Westfield College Analytics Hub" className="w-full rounded-2xl border bg-muted/20 py-3.5 px-5 text-sm font-extrabold outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Institutional Tagline</label>
                        <input type="text" defaultValue="Excellence in Academic Research" className="w-full rounded-2xl border bg-muted/20 py-3.5 px-5 text-sm font-bold  outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" />
                    </div>
                </div>
            </div>
        </section>

        {/* Global Rules Section */}
        <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border bg-background p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3  tracking-tighter uppercase">
                    <Globe size={20} className="text-primary-600" /> Regional & Localization
                </h3>
                <div className="space-y-4">
                    <SettingToggle label="Multi-Language Support" enabled />
                    <SettingToggle label="Global UTC Corrections" enabled />
                    <SettingToggle label="Legacy Date Formatting" />
                </div>
            </div>
            <div className="rounded-3xl border bg-background p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3  tracking-tighter uppercase">
                    <Shield size={20} className="text-primary-600" /> Security Policies
                </h3>
                <div className="space-y-4">
                    <SettingToggle label="Two-Factor Auth (Staff)" enabled />
                    <SettingToggle label="Audit Trail Logging" enabled />
                    <SettingToggle label="Public API Access" />
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4 p-4">
            <button className="px-8 py-3 rounded-2xl border-2 font-black uppercase tracking-widest text-xs hover:bg-muted transition-all">Cancel Discovery</button>
            <button className="px-10 py-3 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-xs shadow-xl shadow-foreground/20 flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                <Save size={16} /> Deploy Changes
            </button>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({ label, enabled }: { label: string, enabled?: boolean }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors  tracking-tight">{label}</span>
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
