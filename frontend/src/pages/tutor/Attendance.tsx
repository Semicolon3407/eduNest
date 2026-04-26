import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { 
  Clock, Calendar, CheckCircle2, XCircle, Search, Filter, 
  UserCheck, UserX, 
  Clock3, ChevronDown, GraduationCap, Loader2, ShieldCheck
} from 'lucide-react';
import { tutorService } from '../../services/tutorService';
import toast from 'react-hot-toast';

const TutorAttendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'leave'>('attendance');
  const [markedStatus, setMarkedStatus] = useState<Record<string, string>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await tutorService.getTutorClasses();
      setClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClassId(res.data[0]._id);
      }
    } catch (error) {
      toast.error('Failed to fetch assigned classes');
    }
  };

  const fetchData = async () => {
    if (!selectedClassId) return;
    try {
      setIsLoading(true);
      const [studentRes, attendanceRes, leaveRes] = await Promise.all([
        tutorService.getStudentsByClass(selectedClassId),
        tutorService.checkAttendance(selectedClassId, attendanceDate),
        tutorService.getStudentLeaves()
      ]);

      setStudents(studentRes.data);
      
      const currentLeaves = leaveRes.data.filter((l: any) => l.student?.class === selectedClassId);
      setLeaveRequests(currentLeaves);

      const initialStatus: Record<string, string> = {};
      studentRes.data.forEach((s: any) => {
        const record = attendanceRes.data.find((a: any) => a.student === s._id);
        initialStatus[s._id] = record ? record.status : 'Present';
      });
      setMarkedStatus(initialStatus);

    } catch (error) {
      toast.error('Failed to sync institutional records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClassId, attendanceDate]);

  const handleMark = async (studentId: string, status: string) => {
    try {
      setMarkedStatus(prev => ({ ...prev, [studentId]: status }));
      const response = await tutorService.markAttendance({
        date: attendanceDate,
        records: [{
          student: studentId,
          status,
          class: selectedClassId
        }]
      });
      if (response.success) {
        toast.success(`Record updated for ${students.find(s => s._id === studentId)?.firstName}`);
      }
    } catch (error) {
      toast.error('Critical sync failure');
    }
  };

  const updateLeave = async (id: string, status: string) => {
    try {
      const response = await tutorService.updateStudentLeaveStatus(id, status);
      if (response.success) {
        toast.success(`Leave request authorized: ${status}`);
        fetchData();
      }
    } catch (error) {
      toast.error('Authorization rejected by system');
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStats = () => {
    const present = Object.values(markedStatus).filter(s => s === 'Present').length;
    const absent = Object.values(markedStatus).filter(s => s === 'Absent').length;
    const pendingLeave = leaveRequests.filter(l => l.status === 'Pending').length;
    return { present, absent, pendingLeave };
  };

  const stats = getStats();

  if (isLoading && classes.length > 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-brand-500" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Secure Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900  ">Digital Register</h1>
          <p className="text-gray-500 mt-1 font-medium">Institutional attendance protocol for assigned classrooms</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
           <Badge variant="success" className="px-6 py-2 rounded-xl border border-success/20 flex items-center gap-2">
              <ShieldCheck size={14} /> Authorized Personnel Only
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 group hover:border-brand-200 transition-all">
            <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
               <Clock size={24} />
            </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Present</p>
               <h4 className="text-xl font-medium text-gray-900  ">{stats.present} Students</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 group hover:border-danger-200 transition-all">
            <div className="w-12 h-12 bg-danger-light text-danger-dark rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
               <XCircle size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Absent</p>
               <h4 className="text-xl font-medium text-gray-900  ">{stats.absent} Students</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-soft flex items-center gap-4 group hover:border-warning-200 transition-all">
            <div className="w-12 h-12 bg-warning-light text-warning-dark rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
               <Calendar size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Pending Leaves</p>
               <h4 className="text-xl font-medium text-gray-900  ">{stats.pendingLeave} Requests</h4>
            </div>
         </div>
      </div>

      <div className="bg-surface rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200 overflow-hidden">
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
                 <div className="shrink-0">
                    <h2 className="text-xl font-medium text-gray-900 leading-none mb-2">Classroom Registry</h2>
                    <p className="text-xs text-slate-400 font-medium">Grade/Sections assigned to your institutional profile</p>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-grow justify-end max-w-4xl">
                    <div className="relative flex-grow max-w-md">
                      <Input 
                        placeholder="Search student identity..." 
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
                    
                    <div className="relative min-w-[180px]">
                        <select 
                          value={selectedClassId}
                          onChange={(e) => setSelectedClassId(e.target.value)}
                          className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-tight outline-none focus:bg-white focus:border-brand-500 transition-all appearance-none cursor-pointer font-sans"
                        >
                          {classes.map(c => (
                            <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
                          ))}
                        </select>
                        <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500" />
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <Button variant="outline" className="rounded-xl h-11 w-11 p-0 shrink-0 border-slate-200">
                      <Filter size={18} className="mx-auto" />
                    </Button>
                 </div>
              </div>

              <div className="overflow-visible">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em]">
                      <th className="px-6 py-4">Student Participant</th>
                      <th className="px-6 py-4">Admission Details</th>
                      <th className="px-6 py-4">Identity Status</th>
                      <th className="px-6 py-4">Attendance Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredStudents.map((student) => (
                      <tr key={student._id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                              {student.firstName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight leading-none mb-1">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{student.personalEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex flex-col gap-0.5">
                              <p className="text-sm font-bold text-slate-700 uppercase tracking-tighter">{student.admissionNumber}</p>
                              <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Enrolled: {new Date(student.enrolledDate).toLocaleDateString()}</p>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <Badge variant="success" className="h-6 px-3 text-[9px] font-black uppercase">Verified</Badge>
                        </td>
                        <td className="px-6 py-5">
                           <Badge variant={
                             (markedStatus[student._id] || 'Pending') === 'Present' ? 'success' :
                             (markedStatus[student._id] || 'Pending') === 'Absent' ? 'danger' :
                             (markedStatus[student._id] || 'Pending') === 'Late' ? 'warning' : 'neutral'
                           }>
                             {(markedStatus[student._id] || 'Pending').toUpperCase()}
                           </Badge>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleMark(student._id, 'Present')}
                              className={`p-2 rounded-xl transition-all shadow-sm ${markedStatus[student._id] === 'Present' ? 'bg-success text-white' : 'bg-success/10 text-success-dark hover:bg-success hover:text-white border border-success/20'}`}
                              title="Mark Present"
                            >
                              <UserCheck size={18} />
                            </button>
                            <button 
                              onClick={() => handleMark(student._id, 'Absent')}
                              className={`p-2 rounded-xl transition-all shadow-sm ${markedStatus[student._id] === 'Absent' ? 'bg-danger text-white' : 'bg-danger/10 text-danger-dark hover:bg-danger hover:text-white border border-danger/20'}`}
                              title="Mark Absent"
                            >
                              <UserX size={18} />
                            </button>
                            <button 
                              onClick={() => handleMark(student._id, 'Late')}
                              className={`p-2 rounded-xl transition-all shadow-sm ${markedStatus[student._id] === 'Late' ? 'bg-warning text-white' : 'bg-warning/10 text-warning-dark hover:bg-warning hover:text-white border border-warning/20'}`}
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
                <div>
                  <h2 className="text-xl font-medium text-gray-900 leading-none mb-2">Institutional Leave Management</h2>
                  <p className="text-xs text-slate-400 font-medium">Authorize and monitor student absence requests</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-end">
                   <Button size="sm" variant="outline" className="rounded-xl h-10 w-10"><Search size={16}/></Button>
                   <Button size="sm" variant="outline" className="rounded-xl h-10 w-10"><Filter size={16}/></Button>
                </div>
              </div>

              <div className="overflow-visible">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em]">
                       <th className="px-6 py-4">Student Identity</th>
                       <th className="px-6 py-4">Leave Category</th>
                       <th className="px-6 py-4">Period Duration</th>
                       <th className="px-6 py-4">Strategic Reason</th>
                       <th className="px-6 py-4 text-right">Decision Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {leaveRequests.map(req => (
                       <tr key={req._id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                          <td className="px-6 py-5">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                                 {req.student?.firstName?.charAt(0)}
                               </div>
                               <div>
                                 <p className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight text-sm leading-none mb-1">{req.student?.firstName} {req.student?.lastName}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{req.student?.admissionNumber}</p>
                               </div>
                             </div>
                          </td>
                          <td className="px-6 py-5 text-xs font-bold text-slate-600 uppercase tracking-widest italic">{req.type}</td>
                          <td className="px-6 py-5 text-xs font-medium text-slate-400">
                            {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5 text-xs font-medium text-slate-500 italic max-w-xs truncate">"{req.reason}"</td>
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
    </div>
  );
};

export default TutorAttendance;
