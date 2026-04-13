import { Boxes, Plus, Search, Filter, MoreVertical, AlertTriangle, CheckCircle2, Package, Tag } from 'lucide-react';
import { cn } from '../../hooks/utils';

export function InventoryAssets() {
  const inventory = [
    { title: 'Student Desks', category: 'Furniture', stock: 450, status: 'Healthy', location: 'Storage A' },
    { title: 'Dell Optiplex 7050', category: 'Workstations', stock: 12, status: 'Low Stock', location: 'IT Lab 1' },
    { title: 'Projector Lamps', category: 'Maintenance', stock: 3, status: 'Critical', location: 'Storage B' },
    { title: 'Science Lab Kits', category: 'Academic', stock: 84, status: 'Healthy', location: 'Chem Lab' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black  tracking-tighter uppercase tracking-tighter">Inventory & Assets</h1>
          <p className="mt-1 text-muted-foreground font-medium  underline decoration-primary-200 underline-offset-4 decoration-2">Tracking institutional property, IT assets, and academic supplies.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-xs font-black uppercase tracking-widest text-background shadow-xl shadow-foreground/20 hover:scale-105 transition-all">
          <Plus size={16} /> Register Asset
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <InventoryStat label="Total Assets" value="2,480" icon={<Package size={18}/>} />
        <InventoryStat label="Low Stock Items" value="14" icon={<AlertTriangle size={18}/>} color="text-red-500 bg-red-50" />
        <InventoryStat label="Annual Valuation" value="$142k" icon={<Tag size={18}/>} />
      </div>

      <div className="rounded-3xl border bg-background overflow-hidden shadow-sm">
        <div className="border-b bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                 <h2 className="font-bold uppercase  tracking-widest text-xs text-primary-900">Institutional Inventory Ledger</h2>
             </div>
             <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input type="text" placeholder="Search by SKU or Name..." className="w-48 rounded-full border bg-background py-1.5 pl-8 pr-3 text-[10px] font-black focus:ring-2 focus:ring-primary-500/20 outline-none" />
                </div>
                <button className="p-2 rounded-lg border bg-background text-muted-foreground hover:text-foreground">
                    <Filter size={14}/>
                </button>
             </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-muted/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <tr>
                        <th className="px-8 py-5 ">Asset Detail</th>
                        <th className="px-8 py-5  text-center">In Stock</th>
                        <th className="px-8 py-5 ">Location</th>
                        <th className="px-8 py-5 ">Status</th>
                        <th className="px-8 py-5  text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-dashed">
                    {inventory.map((item, i) => (
                        <tr key={i} className="group hover:bg-primary-50/10 transition-colors">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-muted-foreground font-black text-xs transition-all group-hover:bg-primary-600 group-hover:text-white group-hover:scale-110">
                                        <Boxes size={18}/>
                                    </div>
                                    <div>
                                        <p className="font-extrabold  tracking-tight text-foreground uppercase leading-none">{item.title}</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-1.5">{item.category}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-center">
                                <span className="font-black  text-sm">{item.stock}</span>
                            </td>
                            <td className="px-8 py-5 font-bold text-xs  text-muted-foreground">{item.location}</td>
                            <td className="px-8 py-5">
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest",
                                    item.status === 'Healthy' ? "bg-green-50 text-green-600" : 
                                    item.status === 'Low Stock' ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
                                )}>
                                    {item.status === 'Healthy' ? <CheckCircle2 size={10}/> : <AlertTriangle size={10}/>}
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <button className="text-muted-foreground hover:text-foreground">
                                    <MoreVertical size={18}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function InventoryStat({ label, value, icon, color = "text-primary-600 bg-primary-50" }: { label: string, value: string, icon: React.ReactNode, color?: string }) {
    return (
        <div className="flex items-center gap-4 rounded-3xl border bg-background p-6 shadow-sm">
            <div className={cn("h-12 w-12 flex items-center justify-center rounded-2xl", color)}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1.5">{label}</p>
                <p className="text-2xl font-black  tracking-tighter leading-none text-foreground">{value}</p>
            </div>
        </div>
    )
}
