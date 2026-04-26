import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import SecurityTab from '../../components/profile/SecurityTab';
import { 
  Mail, Phone, Calendar, Shield, 
  CheckCircle2, XCircle, Clock, Plus,
  BookOpen, Hash, GraduationCap, FileText, Loader2
} from 'lucide-react';
import { getStudentProfile, applyLeave, getLeaveHistory } from '../../services/studentService';

const StudentProfile: React.FC = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'leaves' | 'security'>('overview');
  const [student, setStudent] = useState<any>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profRes, leaveRes] = await Promise.all([
        getStudentProfile(),
        getLeaveHistory()
      ]);
      setStudent(profRes.data);
      setLeaves(leaveRes.data);
    } catch (error) {
      console.error('Error fetching student profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await applyLeave({
        type: formData.get('type'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        reason: formData.get('reason')
      });
      setIsLeaveModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error applying leave:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  const attendancePercentage = student?.attendanceRecords ? 
    ((student.attendanceRecords.filter((a: any) => a.status === 'Present').length / student.attendanceRecords.length) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      {/* Header Profile Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 rounded-[40px] bg-brand-500 text-white flex items-center justify-center text-4xl font-bold shadow-premium shrink-0 ring-8 ring-brand-50">
            {student?.firstName?.charAt(0)}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-display font-medium text-gray-900 leading-none  ">{student?.firstName} {student?.lastName}</h1>
                <Badge variant="brand" className="w-fit mx-auto md:mx-0">Active Student</Badge>
              </div>
              <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <Hash size={16} className="text-brand-500" /> {student?.admissionNumber}
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grade / Class</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap size={16} className="text-brand-500" /> {student?.class?.name}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Section</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <CustomLayoutIcon size={16} className="text-brand-500" /> {student?.class?.section}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                <div className="text-sm font-bold text-success-dark flex items-center gap-2">
                  <CheckCircle2 size={16} /> {attendancePercentage}%
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <div className="text-sm font-bold text-brand-600 flex items-center gap-2">
                  <Shield size={16} /> {student?.status}
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsLeaveModalOpen(true)} className="rounded-2xl h-14 px-8 shadow-premium shrink-0">
            <Plus size={18} /> Apply Leave
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 w-fit rounded-2xl border border-slate-200 font-sans">
        {(['overview', 'attendance', 'leaves', 'security'] as const).map((tab) => (
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
      <div className="animate-in slide-in-from-bottom-4 duration-500 font-sans">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
                <h3 className="text-xl font-medium text-gray-900 mb-8 border-b border-slate-100 pb-4  ">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <InfoItem icon={Mail} label="Student Email" value={student?.studentEmail || 'N/A'} />
                  <InfoItem icon={Mail} label="Personal Email" value={student?.personalEmail || 'N/A'} />
                  <InfoItem icon={Calendar} label="Date of Birth" value={student?.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'} />
                  <InfoItem icon={Shield} label="Admission Number" value={student?.admissionNumber || 'N/A'} />
                  <InfoItem icon={Phone} label="Emergency Contact" value={student?.emergencyContact || 'N/A'} />
                  <InfoItem icon={Calendar} label="Enrolled Date" value={student?.enrolledDate ? new Date(student.enrolledDate).toLocaleDateString() : 'N/A'} />
                </div>
              </div>

              <div className="bg-brand-50 p-8 rounded-[40px] border border-brand-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-brand-500">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-brand-700 leading-none  ">Academic Record</h4>
                    <p className="text-brand-600 text-sm mt-2 font-medium">Academic Year: {student?.academicYear || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
                <h3 className="text-lg font-medium text-gray-900 mb-6 uppercase tracking-tight  ">Identity Context</h3>
                <div className="space-y-6">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Affiliated Branch</p>
                      <p className="text-sm font-bold text-slate-800 uppercase tracking-tight leading-none mb-2">{student?.branch?.name || 'Main Campus'}</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Identity Status</p>
                      <p className="text-sm font-bold text-success uppercase tracking-tight leading-none mb-2">Verified</p>
                   </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-premium relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-500 rounded-full -mb-16 -mr-16 opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-lg font-medium mb-2 relative z-10  ">Digital ID Card</h3>
                <p className="text-slate-400 text-xs mb-8 relative z-10">Institutional identifier for campus and resource access.</p>
                <div className="bg-white/10 h-1 rounded-full mb-8 relative z-10"><div className="bg-brand-500 h-full w-full rounded-full"></div></div>
                <Button className="w-full h-12 rounded-xl bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all relative z-10">
                   {student?.admissionNumber}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <AttendanceCard label="Total Working Days" value={student?.attendanceRecords?.length.toString() || '0'} icon={Calendar} color="brand" />
              <AttendanceCard label="Days Present" value={student?.attendanceRecords?.filter((a: any) => a.status === 'Present').length.toString() || '0'} icon={CheckCircle2} color="success" />
              <AttendanceCard label="Days Absent" value={student?.attendanceRecords?.filter((a: any) => a.status === 'Absent').length.toString() || '0'} icon={XCircle} color="danger" />
              <AttendanceCard label="Late Arrivals" value={student?.attendanceRecords?.filter((a: any) => a.status === 'Late').length.toString() || '0'} icon={Clock} color="warning" />
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
               <h3 className="text-2xl font-medium text-gray-900 mb-8  ">Detailed Attendance History</h3>
               <div className="overflow-x-auto -mx-4 sm:-mx-8">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em]">
                       <th className="px-8 py-4">Date</th>
                       <th className="px-6 py-4">Day</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-8 py-4 text-right">Remark</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-surface-100">
                     {student?.attendanceRecords?.slice(0, 10).map((row: any) => (
                       <tr key={row._id} className="group hover:bg-slate-50 transition-all font-sans">
                         <td className="px-8 py-5 text-sm font-bold text-gray-900 uppercase tracking-tight">{new Date(row.date).toLocaleDateString()}</td>
                         <td className="px-6 py-5 text-sm font-medium text-gray-700">{new Date(row.date) ? new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' }) : '---'}</td>
                         <td className="px-6 py-5">
                            <Badge variant={row.status === 'Present' ? 'success' : row.status === 'Late' ? 'warning' : 'danger'}>{row.status}</Badge>
                         </td>
                         <td className="px-8 py-5 text-right font-medium text-slate-400 italic">{row.remarks || '---'}</td>
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
                 <Badge variant="brand" className="px-4 py-2">Account Status: Active</Badge>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaves.length > 0 ? leaves.map((leave) => (
                <div key={leave._id} className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200 relative group hover:border-brand-500 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 text-brand-500 rounded-2xl flex items-center justify-center border border-slate-100">
                       <FileText size={24} />
                    </div>
                    <Badge variant={leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'}>{leave.status}</Badge>
                  </div>
                  <h4 className="text-xl font-medium text-gray-900 group-hover:text-brand-600 transition-colors mb-1  ">{leave.type}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                  
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reason</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{leave.reason}"</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center text-gray-400 italic">No leave applications submitted yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && <SecurityTab />}
      </div>

      {/* Leave Application Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Apply for Leave"
        description="Submit a formal leave request for administrative approval."
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={handleApplyLeave}>
          <div className="space-y-1.5 focus-within:z-10 group">
            <label className="text-xs font-bold text-gray-400 px-1 uppercase tracking-tight">Leave Type</label>
            <select name="type" required className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer">
              <option value="Medical">Medical Leave</option>
              <option value="Emergency">Emergency Absence</option>
              <option value="Family Event">Family Event / Function</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input name="startDate" label="From Date" type="date" required />
            <Input name="endDate" label="To Date" type="date" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Reason for Absence</label>
            <textarea 
              name="reason"
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

const AttendanceCard: React.FC<{ label: string, value: string, icon: any, color: 'brand' | 'success' | 'danger' | 'warning' }> = ({ label, value, icon: Icon, color }) => {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-light/50 text-success-dark',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning-light/50 text-warning-dark'
  };
  
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-200 flex flex-col gap-4 shadow-soft font-sans">
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

const CustomLayoutIcon: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/>
  </svg>
);

export default StudentProfile;
