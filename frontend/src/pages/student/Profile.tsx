import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { 
  User, Mail, Phone, Calendar, MapPin, Shield, 
  CheckCircle2, XCircle, Clock, Plus, ChevronRight,
  BookOpen, Hash, GraduationCap, FileText
} from 'lucide-react';

const StudentProfile: React.FC = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'leaves'>('overview');

  const student = {
    name: 'Alex Johnson',
    id: 'STU-101-2023',
    grade: 'Grade 10',
    section: 'A',
    email: 'alex.j@student.com',
    phone: '+1 (555) 123-4567',
    dob: 'May 12, 2008',
    address: '123 Academic Lane, EduCity, EC 12345',
    bloodGroup: 'B+',
    admissionDate: 'Sept 01, 2023',
    parentName: 'Mark Johnson',
    parentPhone: '+1 (555) 987-6543',
    attendance: {
      percentage: '94.5%',
      present: 162,
      absent: 8,
      late: 2
    }
  };

  const attendanceHistory = [
    { month: 'September', present: 21, absent: 1, status: '95%' },
    { month: 'October', present: 20, absent: 2, status: '90%' },
    { month: 'November', present: 22, absent: 0, status: '100%' },
  ];

  const leaveRequests = [
    { id: 1, type: 'Medical Leave', from: 'Oct 12', to: 'Oct 14', status: 'Approved', reason: 'Flu symptoms' },
    { id: 2, type: 'Family Event', from: 'Nov 05', to: 'Nov 05', status: 'Pending', reason: 'Sister\'s graduation' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      {/* Header Profile Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 rounded-[40px] bg-brand-500 text-white flex items-center justify-center text-4xl font-bold shadow-premium shrink-0 ring-8 ring-brand-50">
            {student.name.charAt(0)}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-display font-medium text-gray-900 leading-none  ">{student.name}</h1>
                <Badge variant="brand" className="w-fit mx-auto md:mx-0">Active Student</Badge>
              </div>
              <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <Hash size={16} className="text-brand-500" /> {student.id}
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grade / Class</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap size={16} className="text-brand-500" /> {student.grade}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Section</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Layout size={16} className="text-brand-500" /> {student.section}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                <p className="text-sm font-bold text-success-dark flex items-center gap-2">
                  <CheckCircle2 size={16} /> {student.attendance.percentage}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Blood Group</p>
                <p className="text-sm font-bold text-danger flex items-center gap-2">
                  <Shield size={16} /> {student.bloodGroup}
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsLeaveModalOpen(true)} className="rounded-2xl h-14 px-8 shadow-premium shrink-0">
            <Plus size={18} /> Apply Leave
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 w-fit rounded-2xl border border-slate-200">
        {(['overview', 'attendance', 'leaves'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-white text-brand-600 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-brand-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Areas */}
      <div className="animate-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
                <h3 className="text-xl font-medium text-gray-900 mb-8 border-b border-slate-100 pb-4  ">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <InfoItem icon={Mail} label="Official Email" value={student.email} />
                  <InfoItem icon={Phone} label="Primary Phone" value={student.phone} />
                  <InfoItem icon={Calendar} label="Date of Birth" value={student.dob} />
                  <InfoItem icon={MapPin} label="Home Address" value={student.address} fullWidth />
                  <InfoItem icon={User} label="Parent / Guardian" value={student.parentName} />
                  <InfoItem icon={Phone} label="Guardian Contact" value={student.parentPhone} />
                </div>
              </div>

              <div className="bg-brand-50 p-8 rounded-[40px] border border-brand-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-brand-500">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-brand-700 leading-none  ">Academic Summary</h4>
                    <p className="text-brand-600 text-sm mt-2 font-medium">Admission Date: {student.admissionDate}</p>
                  </div>
                </div>
                <Button variant="outline" className="h-12 rounded-xl bg-white border-brand-200 text-brand-600 font-bold text-[10px] uppercase tracking-widest">
                  View Report Card <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
                <h3 className="text-lg font-medium text-gray-900 mb-6 uppercase tracking-tight  ">Session Progress</h3>
                <div className="space-y-6">
                  <StatProgress label="Course Completion" percentage={75} color="brand" />
                  <StatProgress label="Attendance Requirement" percentage={90} color="success" />
                  <StatProgress label="Grade Average" percentage={82} color="warning" />
                </div>
              </div>
              
              <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-premium relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-500 rounded-full -mb-16 -mr-16 opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-lg font-medium mb-2 relative z-10  ">Digital ID Card</h3>
                <p className="text-slate-400 text-xs mb-8 relative z-10">Use this for campus access and library services.</p>
                <div className="bg-white/10 h-1 rounded-full mb-8 relative z-10"><div className="bg-brand-500 h-full w-2/3 rounded-full"></div></div>
                <Button className="w-full h-12 rounded-xl bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all relative z-10">
                  Generate QR
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <AttendanceCard label="Total Working Days" value="172" icon={Calendar} color="brand" />
              <AttendanceCard label="Days Present" value={student.attendance.present.toString()} icon={CheckCircle2} color="success" />
              <AttendanceCard label="Days Absent" value={student.attendance.absent.toString()} icon={XCircle} color="danger" />
              <AttendanceCard label="Late Arrivals" value={student.attendance.late.toString()} icon={Clock} color="warning" />
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
              <h3 className="text-2xl font-medium text-gray-900 mb-8  ">Monthly Breakdown</h3>
              <div className="overflow-x-auto -mx-4 sm:-mx-8">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em]">
                      <th className="px-8 py-4">Month</th>
                      <th className="px-6 py-4">Days Present</th>
                      <th className="px-6 py-4">Days Absent</th>
                      <th className="px-8 py-4 text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {attendanceHistory.map((row) => (
                      <tr key={row.month} className="group hover:bg-slate-50 transition-all">
                        <td className="px-8 py-5 text-sm font-bold text-gray-900 uppercase tracking-tight">{row.month}</td>
                        <td className="px-6 py-5 text-sm font-medium text-gray-700">{row.present}</td>
                        <td className="px-6 py-5 text-sm font-medium text-gray-700">{row.absent}</td>
                        <td className="px-8 py-5 text-right font-bold text-brand-600">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaves' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-medium text-gray-900 uppercase tracking-tight  ">Leave Applications</h3>
               <div className="flex gap-2">
                 <Badge variant="brand" className="px-4 py-2">Available Credits: 4 Days</Badge>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaveRequests.map((leave) => (
                <div key={leave.id} className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200 relative group hover:border-brand-500 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 text-brand-500 rounded-2xl flex items-center justify-center border border-slate-100">
                       <FileText size={24} />
                    </div>
                    <Badge variant={leave.status === 'Approved' ? 'success' : 'warning'}>{leave.status}</Badge>
                  </div>
                  <h4 className="text-xl font-medium text-gray-900 group-hover:text-brand-600 transition-colors mb-1  ">{leave.type}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{leave.from} - {leave.to}</p>
                  
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reason</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{leave.reason}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leave Application Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Apply for Leave"
        description="Submit a formal leave request for administrative approval."
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsLeaveModalOpen(false); }}>
          <div className="space-y-1.5 focus-within:z-10 group">
            <label className="text-xs font-bold text-gray-400 px-1 uppercase tracking-tight">Leave Type</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer">
              <option value="medical">Medical Leave</option>
              <option value="emergency">Emergency Absence</option>
              <option value="event">Family Event / Function</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="From Date" type="date" required />
            <Input label="To Date" type="date" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Reason for Absence</label>
            <textarea 
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-sm outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all resize-none"
              placeholder="Please provide a brief explanation for your leave..."
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsLeaveModalOpen(false)} className="rounded-xl h-12">Discard</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 transition-all active:scale-95">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Helper Components
const InfoItem: React.FC<{ icon: any, label: string, value: string, fullWidth?: boolean }> = ({ icon: Icon, label, value, fullWidth }) => (
  <div className={fullWidth ? 'md:col-span-2' : ''}>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-50 text-brand-500 rounded-xl flex items-center justify-center border border-slate-100/50">
        <Icon size={16} />
      </div>
      <p className="text-sm font-bold text-gray-800 tracking-tight">{value}</p>
    </div>
  </div>
);

const StatProgress: React.FC<{ label: string, percentage: number, color: 'brand' | 'success' | 'warning' }> = ({ label, percentage, color }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={`text-xs font-bold text-${color}${color === 'brand' ? '-500' : '-dark'}`}>{percentage}%</p>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-${color}${color === 'brand' ? '-500' : '-dark'} transition-all duration-1000`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

const AttendanceCard: React.FC<{ label: string, value: string, icon: any, color: 'brand' | 'success' | 'danger' | 'warning' }> = ({ label, value, icon: Icon, color }) => {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-light/50 text-success-dark',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning-light/50 text-warning-dark'
  };
  
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-200 flex flex-col gap-4 shadow-soft">
      <div className={`w-12 h-12 rounded-2xl ${colorMap[color]} flex items-center justify-center shadow-sm`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-medium text-gray-900 mt-1  ">{value}</p>
      </div>
    </div>
  );
};

const Layout: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/>
  </svg>
);

export default StudentProfile;
