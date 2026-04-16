import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Award, ShieldAlert, Star, Search, Filter, MoreHorizontal, User } from 'lucide-react';

const behavioralLogs = [
  { id: 1, name: 'Alice Smith', type: 'Excellence', note: 'Demonstrated exceptional leadership in the Science Fair.', date: 'Oct 14', status: 'Approved' },
  { id: 2, name: 'Robert Fox', type: 'Disciplinary', note: 'Inappropriate behavior during laboratory session.', date: 'Oct 12', status: 'Pending Review' },
  { id: 3, name: 'Samantha White', type: 'Academic', note: 'Significant improvement in mathematics proficiency.', date: 'Oct 10', status: 'Acknowledged' },
];

const BehavioralTracking: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Behavioral Tracking</h1>
          <p className="text-gray-500 mt-1 font-medium">Log commendable actions and disciplinary reports</p>
        </div>
        <Button className="rounded-full shadow-premium"><ShieldAlert size={18} /> New Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200 group hover:border-brand-500 transition-all">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center font-medium text-xl">
                  <Star size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-gray-900  ">Student of the Month</h3>
                  <p className="text-[10px] font-medium text-slate-400   leading-none">Nominate excellence</p>
               </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-6 font-sans">Highlight students who show exemplary academic or behavioral performance this session.</p>
            <Button variant="outline" className="w-full rounded-2xl font-medium   text-[10px] h-12">Submit Nomination</Button>
         </div>

         <div className="bg-brand-500 p-4 sm:p-8 rounded-[40px] shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
               <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                  <Award size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-medium text-white  ">Achievement Awards</h3>
                  <p className="text-[10px] font-medium text-brand-300   leading-none text-brand-300">Issue certificates</p>
               </div>
            </div>
            <p className="text-sm font-medium text-brand-100 mb-6 font-sans relative z-10">Reward consistency and progress with official institutional digital certificates.</p>
            <Button className="w-full rounded-2xl font-medium   text-[10px] h-12 bg-white text-brand-500 hover:bg-slate-50 relative z-10 border-none">Browse Award Library</Button>
         </div>
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[40px] shadow-soft border border-slate-200">
         <div className="flex items-center justify-between mb-8 overflow-hidden">
            <h2 className="text-xl font-medium text-gray-900  ">Recent Logs</h2>
            <div className="flex gap-2">
               <Button size="sm" variant="outline"><Search size={16}/></Button>
               <Button size="sm" variant="outline"><Filter size={16}/></Button>
            </div>
         </div>

         <div className="space-y-4">
            {behavioralLogs.map(log => (
               <div key={log.id} className="p-6 bg-slate-50 rounded-[32px] border border-transparent hover:border-slate-200 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-sans">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${log.type === 'Excellence' ? 'bg-success-light text-success-dark' : log.type === 'Disciplinary' ? 'bg-danger-light text-danger-dark' : 'bg-brand-50 text-brand-600'}`}>
                        {log.type === 'Excellence' ? <Award size={20} /> : log.type === 'Disciplinary' ? <ShieldAlert size={20} /> : <User size={20} />}
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <h4 className="font-medium text-gray-900   leading-none">{log.name}</h4>
                           <span className="text-[10px] font-medium text-slate-400  ">({log.date})</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">{log.note}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <Badge variant={log.type === 'Excellence' ? 'success' : log.type === 'Disciplinary' ? 'danger' : 'brand'}>{log.status}</Badge>
                     <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><MoreHorizontal size={18}/></button>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default BehavioralTracking;
