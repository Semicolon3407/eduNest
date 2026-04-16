import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { FileText, Shield, Briefcase, Download, Search, MoreVertical, Paperclip } from 'lucide-react';

const staffDocs = [
  { id: 1, name: 'Robert Fox', document: 'Employment Contract', type: 'PDF', size: '1.2 MB', status: 'Verified' },
  { id: 2, name: 'Alice Smith', document: 'Teaching Certification', type: 'JPG', size: '4.5 MB', status: 'Pending' },
  { id: 3, name: 'Marcus Reeves', document: 'Government ID', type: 'PDF', size: '0.8 MB', status: 'Verified' },
];

const DocumentManagement: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Document Center</h1>
          <p className="text-gray-500 mt-1 font-medium">Compliance and verification vault for staff credentials</p>
        </div>
        <Button className="rounded-full shadow-premium"><Paperclip size={18} /> Upload Archive</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center">
               <FileText size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-slate-400   leading-none mb-1">Total Files</p>
               <h4 className="text-xl font-medium text-gray-900  ">1,240</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-success-light text-success-dark rounded-2xl flex items-center justify-center">
               <Shield size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-slate-400   leading-none mb-1">Verified</p>
               <h4 className="text-xl font-medium text-gray-900  ">98%</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
               <Briefcase size={24} />
            </div>
            <div>
               <p className="text-[10px] font-medium text-slate-400   leading-none mb-1">Storage</p>
               <h4 className="text-xl font-medium text-gray-900  ">4.2 GB</h4>
            </div>
         </div>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200">
         <div className="flex items-center justify-between mb-8 overflow-hidden">
            <h2 className="text-xl font-medium text-gray-900  ">Staff Credentials</h2>
            <div className="flex gap-2">
               <div className="hidden sm:flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100">
                  <Search size={16} className="text-slate-400" />
                  <input type="text" placeholder="Search files..." className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-2 w-48" />
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
             <div className="overflow-x-auto"><table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-medium   border-b border-slate-100">
                     <th className="px-6 py-4">Staff Member</th>
                     <th className="px-6 py-4">Document Title</th>
                     <th className="px-6 py-4">Format</th>
                     <th className="px-6 py-4">Size</th>
                     <th className="px-6 py-4 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 font-sans">
                  {staffDocs.map(doc => (
                     <tr key={doc.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-6 py-5">
                           <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors   text-sm">{doc.name}</p>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-600  ">{doc.document}</td>
                        <td className="px-6 py-5">
                           <Badge variant="neutral">{doc.type}</Badge>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-slate-400  ">{doc.size}</td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <Badge variant={doc.status === 'Verified' ? 'success' : 'brand'}>{doc.status}</Badge>
                              <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><Download size={18}/></button>
                              <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><MoreVertical size={18}/></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table></div>
         </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
