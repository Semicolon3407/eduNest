import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { 
  Clock, Calendar, CheckCircle2, XCircle, Search, Filter, 
  Plus, FileText, UserCheck, UserX, 
  Clock3, ChevronDown, Check, Shield, GitBranch, Briefcase, Loader2, User
} from 'lucide-react';
import { hrService } from '../../services/hrService';
import toast from 'react-hot-toast';

const AttendanceLeave: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'leave'>('attendance');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markedStatus, setMarkedStatus] = useState<Record<string, string>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [attendanceLog, setAttendanceLog] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [branches, setBranches] = useState<any[]>([]);
  const [modalBranch, setModalBranch] = useState('All Branches');
  const [staffSearch, setStaffSearch] = useState('');
  const [showStaffResults, setShowStaffResults] = useState(false);
  const [leaveFormData, setLeaveFormData] = useState({
    staffId: '',
    type: 'Annual Leave',
    days: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveDate, setLeaveDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [staffRes, leavesRes, attendanceRes, branchRes] = await Promise.all([
        hrService.getStaff(),
        hrService.getLeaves(leaveDate),
        hrService.getAttendance(attendanceDate),
        hrService.getBranches()
      ]);

      if (staffRes.success) setStaffList(staffRes.data);
      if (branchRes.success) setBranches(branchRes.data);
      if (leavesRes.success) setLeaveRequests(leavesRes.data);
      if (attendanceRes.success) {
        setAttendanceLog(attendanceRes.data);
        const initialStatus: Record<string, string> = {};
        attendanceRes.data.forEach((a: any) => {
          initialStatus[a.staff._id] = a.status;
        });
        setMarkedStatus(initialStatus);
      }
    } catch (error) {
      toast.error('Failed to sync HR protocol');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [attendanceDate, leaveDate]);

  const handleMark = async (staffId: string, status: string) => {
    try {
      setMarkedStatus(prev => ({ ...prev, [staffId]: status }));
      const response = await hrService.markAttendance({ 
        staffId, 
        status,
        date: attendanceDate 
      });
      if (response.success) {
        toast.success(`Attendance logged for candidate`);
      }
    } catch (error) {
      toast.error('Log entry failed');
    }
  };

  const updateLeave = async (id: string, status: string) => {
    try {
      const response = await hrService.updateLeaveStatus(id, status);
      if (response.success) {
        toast.success(`Leave request ${status.toLowerCase()}`);
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authorization failed');
    }
  };

  const filteredStaff = staffList.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'All Branches' || staff.branch?.name === selectedBranch;
    const matchesDept = selectedDepartment === 'All Departments' || staff.department === selectedDepartment;
    return matchesSearch && matchesBranch && matchesDept;
  });

  const departments = Array.from(new Set(staffList.map(s => s.department))).filter(Boolean);

  const getAttendanceStats = () => {
    const present = attendanceLog.filter(a => a.status === 'Present').length;
    const leave = leaveRequests.filter(l => l.status === 'Approved').length;
    const rate = staffList.length ? Math.round((present / staffList.length) * 100) : 0;
    return { present, leave, rate };
  };

  const stats = getAttendanceStats();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-brand-500" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compiling Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Attendance & Leave</h1>
          <p className="text-gray-500 mt-1 font-medium">Monitor staff clock-ins and manage leave lifecycle</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
           <Button variant="outline" className="rounded-xl h-11 flex-1 sm:flex-none whitespace-nowrap"><Calendar size={18} /> Leave Policy</Button>
           <Button onClick={() => setIsModalOpen(true)} className="rounded-xl h-11 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex-1 sm:flex-none whitespace-nowrap"><Plus size={18} /> Add Leave Request</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 group hover:border-brand-200 transition-all">
            <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
               <Clock size={24} />
            </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">On Time Today</p>
               <h4 className="text-xl font-medium text-gray-900  ">{stats.rate}%</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 group hover:border-success-200 transition-all">
            <div className="w-12 h-12 bg-success-light text-success-dark rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Present Staff</p>
               <h4 className="text-xl font-medium text-gray-900  ">{stats.present}</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 group hover:border-danger-200 transition-all">
            <div className="w-12 h-12 bg-danger-light text-danger-dark rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
               <XCircle size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">On Leave</p>
               <h4 className="text-xl font-medium text-gray-900  ">{stats.leave}</h4>
            </div>
         </div>
      </div>

      <div className="bg-surface rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200 overflow-hidden">
        {/* Tab Header */}
        <div className="flex border-b border-surface-100 p-2 gap-2 bg-surface-50/50">
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'attendance' ? 'bg-white text-brand-500 shadow-sm border border-brand-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <UserCheck size={16} /> Mark Attendance
          </button>
          <button 
            onClick={() => setActiveTab('leave')}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'leave' ? 'bg-white text-brand-500 shadow-sm border border-brand-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Calendar size={16} /> Leave Management
          </button>
        </div>

        <div className="p-4 sm:p-8">
          {activeTab === 'attendance' ? (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                 <h2 className="text-xl font-medium text-gray-900 shrink-0">Daily Attendance Log</h2>
                 
                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-grow justify-end max-w-4xl">
                    <div className="relative flex-grow max-w-md">
                      <Input 
                        placeholder="Search staff..." 
                        icon={Search} 
                        className="h-11 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="relative min-w-[150px]">
                      <Input 
                        type="date"
                        icon={Calendar}
                        className="h-11 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative min-w-[160px]">
                        <select 
                          value={selectedBranch}
                          onChange={(e) => setSelectedBranch(e.target.value)}
                          className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-tight outline-none focus:bg-white focus:border-brand-500 transition-all appearance-none cursor-pointer font-sans"
                        >
                          <option>All Branches</option>
                          {branches.map(b => (
                            <option key={b._id} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                        <GitBranch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>

                      <div className="relative min-w-[170px]">
                        <select 
                          value={selectedDepartment}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-tight outline-none focus:bg-white focus:border-brand-500 transition-all appearance-none cursor-pointer font-sans"
                        >
                          <option>All Departments</option>
                          {departments.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>

                      <Button variant="outline" className="rounded-xl h-11 w-11 p-0 shrink-0 border-slate-200">
                        <Filter size={18} className="mx-auto" />
                      </Button>
                    </div>
                 </div>
              </div>

              <div className="overflow-visible">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6">
                      <th className="px-6 py-4">Staff Member</th>
                      <th className="px-6 py-4">Branch & Logistics</th>
                      <th className="px-6 py-4">Department & Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredStaff.map((staff) => (
                      <tr key={staff._id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                              {staff.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight leading-none mb-1">
                                {staff.firstName} {staff.lastName}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{staff.employeeId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <GitBranch size={14} className="text-brand-400" />
                            <span className="text-xs font-bold uppercase tracking-tight">{staff.branch?.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-medium text-gray-900 uppercase tracking-tighter">{staff.department}</p>
                            <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">{staff.designation}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <Badge variant={
                            (markedStatus[staff._id] || 'Pending') === 'Present' ? 'success' :
                            (markedStatus[staff._id] || 'Pending') === 'Absent' ? 'danger' :
                            (markedStatus[staff._id] || 'Pending') === 'Late' ? 'warning' : 'neutral'
                          }>
                            {(markedStatus[staff._id] || 'Pending').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleMark(staff._id, 'Present')}
                              className={`p-2 rounded-xl transition-all shadow-sm ${markedStatus[staff._id] === 'Present' ? 'bg-success text-white' : 'bg-success/10 text-success-dark hover:bg-success hover:text-white border border-success/20'}`}
                              title="Mark Present"
                            >
                              <UserCheck size={18} />
                            </button>
                            <button 
                              onClick={() => handleMark(staff._id, 'Absent')}
                              className={`p-2 rounded-xl transition-all shadow-sm ${markedStatus[staff._id] === 'Absent' ? 'bg-danger text-white' : 'bg-danger/10 text-danger-dark hover:bg-danger hover:text-white border border-danger/20'}`}
                              title="Mark Absent"
                            >
                              <UserX size={18} />
                            </button>
                            <button 
                              onClick={() => handleMark(staff._id, 'Late')}
                              className={`p-2 rounded-xl transition-all shadow-sm ${markedStatus[staff._id] === 'Late' ? 'bg-warning text-white' : 'bg-warning/10 text-warning-dark hover:bg-warning hover:text-white border border-warning/20'}`}
                              title="Mark Late"
                            >
                              <Clock3 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <h2 className="text-xl font-medium text-gray-900 leading-none">Recent Leave Requests</h2>
                <div className="flex flex-wrap items-center gap-2 justify-end">
                   <div className="relative min-w-[150px]">
                      <Input 
                        type="date"
                        icon={Calendar}
                        className="h-10 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                        value={leaveDate}
                        onChange={(e) => setLeaveDate(e.target.value)}
                      />
                   </div>
                   <Button size="sm" variant="outline" className="rounded-xl h-10 w-10"><Search size={16}/></Button>
                   <Button size="sm" variant="outline" className="rounded-xl h-10 w-10"><Filter size={16}/></Button>
                </div>
              </div>

              <div className="overflow-visible">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6">
                       <th className="px-6 py-4">Staff Member</th>
                       <th className="px-6 py-4">Type</th>
                       <th className="px-6 py-4">Duration</th>
                       <th className="px-6 py-4">Request Date</th>
                       <th className="px-6 py-4 text-right">Status & Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {leaveRequests.map(req => (
                       <tr key={req._id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                          <td className="px-6 py-5">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                                 {req.staff?.firstName?.charAt(0)}
                               </div>
                               <div>
                                 <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight text-sm leading-none mb-1">{req.staff?.firstName} {req.staff?.lastName}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{req.staff?.employeeId}</p>
                               </div>
                             </div>
                          </td>
                          <td className="px-6 py-5 text-xs font-bold text-slate-600 uppercase tracking-widest italic">{req.type}</td>
                          <td className="px-6 py-5 text-xs font-medium text-slate-400">
                            {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5 text-xs font-medium text-slate-500">{new Date(req.appliedDate).toLocaleDateString()}</td>
                          <td className="px-6 py-5 text-right flex items-center justify-end gap-3">
                             <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'danger' : 'warning'} className="font-black h-7 px-4 tracking-tighter">
                                {req.status.toUpperCase()}
                             </Badge>
                             <div className="flex gap-1">
                                {req.status === 'Pending' && (
                                  <>
                                    <button onClick={() => updateLeave(req._id, 'Approved')} className="p-2 text-success hover:bg-success/10 rounded-xl transition-all border border-transparent hover:border-success/20">
                                      <CheckCircle2 size={18} />
                                    </button>
                                    <button onClick={() => updateLeave(req._id, 'Rejected')} className="p-2 text-danger hover:bg-danger/10 rounded-xl transition-all border border-transparent hover:border-danger/20">
                                      <XCircle size={18} />
                                    </button>
                                  </>
                                )}
                             </div>
                          </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Institutional Leave Protocol"
        description="Record and authorize leave applications for faculty and administrative staff."
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 focus-within:z-10 group font-sans">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Branch Selection</label>
                <div className="relative">
                  <select 
                    value={modalBranch}
                    onChange={(e) => setModalBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-[13px] px-4 text-sm font-bold outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer"
                  >
                    <option>All Branches</option>
                    {branches.map(b => (
                      <option key={b._id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <GitBranch size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="space-y-1.5 focus-within:z-10 group font-sans relative">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Select Staff Member</label>
                <div className="relative">
                  <Input 
                    placeholder="Type to search staff..." 
                    icon={User} 
                    required 
                    value={staffSearch}
                    onFocus={() => setShowStaffResults(true)}
                    onChange={(e) => {
                      setStaffSearch(e.target.value);
                      setShowStaffResults(true);
                      if (leaveFormData.staffId) setLeaveFormData({...leaveFormData, staffId: ''});
                    }}
                  />
                  {showStaffResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {staffList
                        .filter(s => modalBranch === 'All Branches' || s.branch?.name === modalBranch)
                        .filter(s => {
                          const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
                          return fullName.includes(staffSearch.toLowerCase()) || s.employeeId.toLowerCase().includes(staffSearch.toLowerCase());
                        })
                        .map(s => (
                          <div 
                            key={s._id}
                            onClick={() => {
                              setStaffSearch(`${s.firstName} ${s.lastName} (${s.employeeId})`);
                              setLeaveFormData({...leaveFormData, staffId: s._id});
                              setShowStaffResults(false);
                            }}
                            className="p-4 hover:bg-brand-50 cursor-pointer border-b border-slate-50 last:border-none group transition-all"
                          >
                            <p className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{s.firstName} {s.lastName}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 group-hover:text-brand-400">{s.employeeId} • {s.branch?.name || 'Main'}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
            </div>
            
            <div className="space-y-1.5 focus-within:z-10 group font-sans">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Leave Category</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-[13px] px-4 text-sm font-bold outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer">
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Personal / Casual</option>
                    <option>Maternity / Paternity</option>
                    <option>Unpaid Leave</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <Input label="Duration (Days)" placeholder="e.g. 3" icon={Clock} required type="number" />
            <Input label="Start Date" icon={Calendar} required type="date" />
            <Input label="Return Date" icon={Calendar} required type="date" />
            <div className="md:col-span-2">
              <Input label="Reason for Leave" placeholder="Strategic justification for absence..." icon={FileText} required />
            </div>
          </div>

          <div className="bg-brand-50/50 p-6 rounded-[32px] border border-brand-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
               <Shield size={20} />
             </div>
             <div>
               <p className="text-sm font-bold text-brand-600 leading-tight uppercase tracking-tight">Institutional Compliance</p>
               <p className="text-[10px] text-brand-700/70 mt-1 leading-relaxed italic">This leave record will be automatically synchronized with the payroll and resource allocation modules.</p>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">Discard</Button>
            <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2">
               <Check size={18} /> Authorize Leave
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AttendanceLeave;
