import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import SecurityTab from '../../components/profile/SecurityTab';
import { 
  Mail, Shield, Calendar, Loader2, Hash, User, Building2, CheckCircle2, XCircle, Clock, Plus
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'leaves' | 'security'>('overview');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const leaveData = {
      type: formData.get('type'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      reason: formData.get('reason')
    };

    try {
      setIsSubmittingLeave(true);
      const response = await adminService.requestLeave(leaveData);
      if (response.success) {
        toast.success('Leave application submitted successfully');
        setIsLeaveModalOpen(false);
        fetchData(); // Refresh to show new leave
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit leave');
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  const InfoItem: React.FC<{ icon: any, label: string, value: string, fullWidth?: boolean }> = ({ icon: Icon, label, value, fullWidth }) => (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-50 text-brand-500 rounded-xl flex items-center justify-center border border-slate-100/50">
          <Icon size={16} />
        </div>
        <p className="text-sm font-bold text-gray-800 tracking-tight">{value || '---'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      {/* Header Profile Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-soft border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 rounded-[40px] bg-brand-500 text-white flex items-center justify-center text-4xl font-bold shadow-premium shrink-0 ring-8 ring-brand-50">
            {profile?.firstName?.charAt(0)}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-display font-medium text-gray-900 leading-none  ">{profile?.firstName} {profile?.lastName}</h1>
                <Badge variant="brand" className="w-fit mx-auto md:mx-0 uppercase tracking-widest text-[10px] py-1 px-3">System Administrator</Badge>
              </div>
              <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <Building2 size={16} className="text-brand-500" /> {profile?.department} &bull; {profile?.branch?.name}
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Employee ID</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Hash size={16} className="text-brand-500" /> {profile?.employeeId}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <div className="text-sm font-bold text-success-dark flex items-center gap-2 uppercase tracking-tight">
                  <div className="w-2 h-2 rounded-full bg-success"></div> Active
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2 font-display">
                  {profile?.attendanceStats?.rate || 100}%
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Joined Date</p>
                <p className="text-sm font-bold text-brand-600 flex items-center gap-2">
                  <Calendar size={16} /> {new Date(profile?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsLeaveModalOpen(true)} className="rounded-2xl h-14 px-8 shadow-premium shrink-0 flex items-center gap-2">
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

      {/* Content Area */}
      <div className="animate-in slide-in-from-bottom-4 duration-500 font-sans">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Identity Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
                <h3 className="text-xl font-medium text-gray-900 mb-8 border-b border-slate-100 pb-4  ">Administrative Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                   <InfoItem icon={User} label="Full Legal Name" value={`${profile?.firstName} ${profile?.lastName}`} />
                   <InfoItem icon={Mail} label="Professional Email" value={profile?.personalEmail} />
                   <InfoItem icon={Shield} label="Security Clearance" value="Root Privileged" />
                   <InfoItem icon={Hash} label="System Access Key" value={profile?.employeeId} />
                   <InfoItem icon={Calendar} label="Last Audit" value="Active" />
                   <InfoItem icon={Building2} label="Branch Node" value={profile?.branch?.name} />
                </div>
              </div>

              <div className="bg-brand-50 p-8 rounded-[40px] border border-brand-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-brand-500">
                    <Shield size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-brand-700 leading-none  ">Root Administrator</h4>
                    <p className="text-brand-600 text-sm mt-2 font-medium">Verified System Administrator for {profile?.branch?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Context */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
                <h3 className="text-lg font-medium text-gray-900 mb-6 uppercase tracking-tight  ">Identity Context</h3>
                <div className="space-y-6">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">System Status</p>
                      <p className="text-sm font-bold text-slate-800 uppercase tracking-tight leading-none mb-2">Authenticated</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Network Permissions</p>
                      <p className="text-sm font-bold text-brand-600 uppercase tracking-tight leading-none mb-2 font-display">Super User</p>
                   </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-premium relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-500 rounded-full -mb-16 -mr-16 opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-lg font-medium mb-2 relative z-10  ">Digital ID Card</h3>
                <p className="text-slate-400 text-xs mb-8 relative z-10">Use this code for institutional physical access and node verification.</p>
                <div className="bg-white/10 h-1 rounded-full mb-8 relative z-10"><div className="bg-brand-500 h-full w-full rounded-full"></div></div>
                <Button className="w-full h-12 rounded-xl bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all relative z-10">
                   {profile?.employeeId}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
            <h3 className="text-xl font-medium text-gray-900 mb-8 border-b border-slate-100 pb-4">Attendance Log</h3>
            <div className="space-y-4">
              {profile?.attendanceRecords?.length > 0 ? (
                profile.attendanceRecords.map((record: any) => (
                  <div key={record._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        record.status === 'Present' ? 'bg-success/10 text-success' : 
                        record.status === 'Late' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                      }`}>
                        {record.status === 'Present' ? <CheckCircle2 size={18} /> : 
                         record.status === 'Late' ? <Clock size={18} /> : <XCircle size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In: {record.clockIn || '--:--'} | Out: {record.clockOut || '--:--'}</p>
                      </div>
                    </div>
                    <Badge variant={record.status === 'Present' ? 'success' : record.status === 'Late' ? 'warning' : 'danger'}>
                      {record.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-400 font-medium">No attendance records found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'leaves' && (
          <div className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-200">
            <h3 className="text-xl font-medium text-gray-900 mb-8 border-b border-slate-100 pb-4">Leave History</h3>
            <div className="space-y-4">
              {profile?.leaveHistory?.length > 0 ? (
                profile.leaveHistory.map((leave: any) => (
                  <div key={leave._id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800">{leave.reason}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={leave.status === 'Approved' ? 'success' : leave.status === 'Pending' ? 'warning' : 'danger'}>
                      {leave.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-400 font-medium">No leave requests found.</p>
                </div>
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
        description="Submit a formal leave request for system administrative records."
        maxWidth="xl"
      >
        <form className="space-y-6" onSubmit={handleApplyLeave}>
          <div className="space-y-1.5 focus-within:z-10 group">
            <label className="text-xs font-bold text-gray-400 px-1 uppercase tracking-tight">Leave Type</label>
            <select name="type" required className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500 appearance-none cursor-pointer">
              <option value="Sick">Sick Leave</option>
              <option value="Annual">Annual Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Maternity">Maternity Leave</option>
              <option value="Paternity">Paternity Leave</option>
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
            <Button type="submit" disabled={isSubmittingLeave} className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 transition-all active:scale-95">
              {isSubmittingLeave ? <Loader2 className="animate-spin" size={20} /> : 'Submit Application'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProfile;
