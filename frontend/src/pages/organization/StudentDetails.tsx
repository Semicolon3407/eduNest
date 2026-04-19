import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { 
  ArrowLeft, Mail, Phone, MapPin, 
  CreditCard, ClipboardList, Trophy, 
  AlertCircle, FileText, TrendingUp
} from 'lucide-react';

const StudentDetails: React.FC = () => {
  const { studentId: _studentId } = useParams();
  const navigate = useNavigate();

  // Mock student data
  const student = {
    id: 'STU-101',
    name: 'Alex Johnson',
    email: 'alex.j@student.com',
    phone: '+1 (555) 123-4567',
    address: '123 Academic Way, North Campus',
    branch: 'Main Campus',
    grade: 'Grade 10',
    section: 'A',
    enrolled: 'Sep 01, 2023',
    status: 'Active',
    guardian: 'Robert Johnson',
    attendance: '94.5%',
    gpa: '3.8/4.0',
    fees: {
      total: '$12,000',
      paid: '$8,500',
      pending: '$3,500',
      status: 'Partial'
    }
  };

  const academicHistory = [
    { term: 'Midterm 2023', gpa: '3.7', rank: '05/40', status: 'Completed' },
    { term: 'Final Term 2022', gpa: '3.9', rank: '02/42', status: 'Completed' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/organization/students')}
            className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">{student.name}</h1>
              <Badge variant="success" className="px-3 py-1 uppercase tracking-widest text-[9px] font-bold">{student.status}</Badge>
            </div>
            <p className="text-gray-500 mt-1 font-medium">{student.id} • {student.branch}</p>
          </div>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-xl h-12 shadow-sm font-bold text-[10px] uppercase tracking-widest">
             <FileText size={18} /> Export Full Report
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-soft text-center group">
              <div className="w-24 h-24 bg-brand-50 rounded-[32px] mx-auto flex items-center justify-center text-brand-600 text-3xl font-display font-medium group-hover:scale-110 transition-transform shadow-sm">
                 {student.name.charAt(0)}
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-800">{student.name}</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">{student.grade} - Section {student.section}</p>
              
              <div className="mt-8 space-y-4 text-left">
                 <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Mail size={16} className="text-brand-500" />
                    <span className="text-xs font-medium text-slate-600 truncate">{student.email}</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <Phone size={16} className="text-brand-500" />
                    <span className="text-xs font-medium text-slate-600">{student.phone}</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <MapPin size={16} className="text-brand-500" />
                    <span className="text-xs font-medium text-slate-600 truncate">{student.address}</span>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-premium">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Enrollment Info</h4>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] text-white/40 block mb-1">Enrolled Since</label>
                    <p className="font-bold">{student.enrolled}</p>
                 </div>
                 <div>
                    <label className="text-[10px] text-white/40 block mb-1">Guardian Name</label>
                    <p className="font-bold">{student.guardian}</p>
                 </div>
                 <div className="pt-4 border-t border-white/10">
                    <Badge variant="brand" className="bg-brand-500/20 text-brand-400 border-none">Institutional Resident</Badge>
                 </div>
              </div>
           </div>
        </div>

        {/* Core Details */}
        <div className="lg:col-span-3 space-y-8">
           {/* Summary Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Trophy size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global GPA</p>
                    <p className="text-lg font-bold text-slate-800">{student.gpa}</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center">
                    <ClipboardList size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</p>
                    <p className="text-lg font-bold text-slate-800">{student.attendance}</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-warning/10 text-warning-dark flex items-center justify-center">
                    <CreditCard size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fee Balance</p>
                    <p className="text-lg font-bold text-slate-800">{student.fees.pending}</p>
                 </div>
              </div>
           </div>

           {/* Tabs-like Content Sections */}
           <div className="space-y-6">
              {/* Fee Details Section */}
              <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 overflow-hidden">
                 <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3">
                       <CreditCard className="text-brand-500" size={20} /> Financial Overview
                    </h3>
                    <Badge variant="neutral" className="bg-slate-50 text-slate-500">AY 2023-24</Badge>
                 </div>
                 <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tuition Total</p>
                       <p className="text-2xl font-display font-medium text-slate-800">{student.fees.total}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-success">Total Cleared</p>
                       <p className="text-2xl font-display font-medium text-success-dark">{student.fees.paid}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-danger">Amount Payable</p>
                       <p className="text-2xl font-display font-medium text-danger">{student.fees.pending}</p>
                    </div>
                 </div>
                 <div className="px-8 pb-8">
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-success rounded-full" style={{ width: '70.8%' }}></div>
                    </div>
                    <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">70.8% of fees cleared</p>
                 </div>
              </div>

              {/* Academic Performance Table */}
              <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 overflow-hidden">
                 <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3">
                       <TrendingUp className="text-brand-500" size={20} /> Examination Performance
                    </h3>
                    <button className="text-[10px] font-bold text-brand-500 uppercase tracking-widest hover:underline">Full Transcript</button>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                             <th className="px-8 py-5">Assessment Term</th>
                             <th className="px-6 py-5 text-center">GPA Score</th>
                             <th className="px-6 py-5 text-center">Section Rank</th>
                             <th className="px-8 py-5 text-right">Review Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {academicHistory.map((item, idx) => (
                             <tr key={idx} className="hover:bg-slate-50/30 transition-all">
                                <td className="px-8 py-5 font-bold text-slate-700 text-sm">{item.term}</td>
                                <td className="px-6 py-5 text-center text-sm font-medium text-slate-600">{item.gpa}</td>
                                <td className="px-6 py-5 text-center text-sm font-medium text-slate-600">{item.rank}</td>
                                <td className="px-8 py-5 text-right">
                                   <Badge variant="neutral" className="bg-slate-50 text-slate-400 font-bold uppercase text-[9px]">Verified & Sealed</Badge>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-brand-50/50 rounded-[32px] border border-brand-100/50">
                 <AlertCircle className="text-brand-500 shrink-0 mt-0.5" size={20} />
                 <div>
                    <h5 className="text-sm font-bold text-brand-600 uppercase tracking-tight">Access Control & Sensitivity</h5>
                    <p className="text-xs font-medium text-brand-700 leading-relaxed mt-1 opacity-80 italic">
                      This institutional profile contains PII (Personally Identifiable Information). Viewing activities are automatically logged at the organization level for security audits.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
