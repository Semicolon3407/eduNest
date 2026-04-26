import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { 
  UserPlus, Mail, Shield, Phone, Hash, Search, 
  MoreVertical, Users, CheckCircle2, BookOpen,
  ChevronDown, Edit3, Trash2, Eye, Loader2
} from 'lucide-react';
import { Dropdown, DropdownItem } from '../../components/ui/Dropdown';
import { adminService } from '../../services/adminService';
import { tenantService } from '../../services/tenantService';
import toast from 'react-hot-toast';

const Admissions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const getAcademicYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    if (month >= 3) {
      return `${year}-${(year + 1).toString().slice(-2)}`;
    } else {
      return `${year - 1}-${year.toString().slice(-2)}`;
    }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentEmail: '',
    classId: '',
    section: '',
    personalEmail: '',
    emergencyContact: '',
    branchId: '',
    dob: '',
    password: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, classesRes, branchesRes] = await Promise.all([
        adminService.getStudents(),
        adminService.getClasses(),
        tenantService.getBranches()
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
      setBranches(branchesRes.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingStudentId) {
        await adminService.updateStudent(editingStudentId, {
          ...formData,
          class: formData.classId,
          branch: formData.branchId
        });
        toast.success('Student updated successfully');
      } else {
        await adminService.enrollStudent({
          ...formData,
          class: formData.classId,
          branch: formData.branchId
        });
        toast.success('Student enrolled successfully');
      }
      setIsModalOpen(false);
      setEditingStudentId(null);
      fetchData();
      setFormData({
        firstName: '', lastName: '', studentEmail: '',
        classId: '', section: '', personalEmail: '',
        emergencyContact: '', branchId: '', dob: '', password: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStudent = (student: any) => {
    setEditingStudentId(student._id);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      studentEmail: student.studentEmail || '',
      classId: student.class?._id || '',
      section: student.class?.section || '',
      personalEmail: student.personalEmail || '',
      emergencyContact: student.emergencyContact,
      branchId: student.branch?._id || '',
      dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;
    try {
      const response = await adminService.deleteStudent(id);
      if (response.success) {
        toast.success('Student removed successfully');
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove student');
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !selectedBranch || s.branch?._id === selectedBranch || s.branch === selectedBranch;
    const matchesClass = !selectedClass || s.class?._id === selectedClass;
    return matchesSearch && matchesBranch && matchesClass;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Student Admission</h1>
          <p className="text-gray-500 mt-1">Enroll and manage student records for the school</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl shadow-premium" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Add Student
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-brand-200 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 leading-none mb-2">Total Enrollment</p>
            <p className="text-2xl font-display font-medium text-gray-900">{students.length.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-brand-200 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-success-light/50 text-success-dark flex items-center justify-center shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 leading-none mb-2">Active Students</p>
            <p className="text-2xl font-display font-medium text-gray-900">
              {students.filter(s => s.status === 'Active').length.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-brand-200 shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 text-brand-600 flex items-center justify-center shadow-sm">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 leading-none mb-2">Academic Years</p>
            <p className="text-2xl font-display font-medium text-gray-900">{getAcademicYear()}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface p-4 sm:p-6 rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-[2]">
            <Input
              placeholder="Search by name, ID..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl h-12"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[160px]">
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full h-12 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer pr-10"
              >
                <option value="">All Branches</option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative min-w-[160px]">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-12 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer pr-10"
              >
                <option value="">All Grade & Sections</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <Button variant="outline" className="h-12 py-3 rounded-xl border-surface-200" onClick={() => { setSelectedBranch(''); setSelectedClass(''); setSearchTerm(''); }}>
              Clear
            </Button>
            <Button variant="outline" className="h-12 py-3 rounded-xl border-surface-200">
              Bulk Upload
            </Button>
          </div>
        </div>

        <div className="overflow-visible min-h-[400px]">
          <div className="px-0 relative overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6 uppercase">
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Admission ID</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">Grade & Section</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                      <Loader2 size={32} className="animate-spin mx-auto mb-4 text-brand-600" />
                      <p className="text-sm font-medium uppercase tracking-widest">Synchronizing student records...</p>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500 uppercase tracking-widest text-xs font-bold font-sans">
                      No student records found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
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
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                              <Mail size={12} /> {student.studentEmail || student.personalEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-gray-900">{student.admissionNumber}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{student.branch?.name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5 text-left">
                          <p className="text-sm font-medium text-gray-900">{student.class?.name}</p>
                          <p className="text-[10px] text-brand-500 font-medium uppercase tracking-wide leading-none">Section {student.class?.section}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant={
                          student.status === 'Active' ? 'success' :
                          student.status === 'Pending' ? 'warning' : 'danger'
                        }>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Dropdown
                            trigger={
                              <button className="p-2 text-gray-400 hover:bg-surface-100 rounded-lg transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            }
                          >
                            <DropdownItem icon={Eye} onClick={() => handleEditStudent(student)}>View Details</DropdownItem>
                            <DropdownItem icon={Edit3} onClick={() => handleEditStudent(student)}>Edit Student</DropdownItem>
                            <DropdownItem icon={Trash2} variant="danger" onClick={() => handleDeleteStudent(student._id)}>Remove Student</DropdownItem>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between px-2">
          <p className="text-xs font-medium text-gray-400">
            Showing {filteredStudents.length} of {students.length} students
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-9">Next</Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudentId(null);
          setFormData({
            firstName: '', lastName: '', studentEmail: '',
            classId: '', section: '', personalEmail: '',
            emergencyContact: '', branchId: '', dob: '', password: ''
          });
        }}
        title={editingStudentId ? "Update Student Profile" : "Student Registration"}
        description={editingStudentId ? "Modify existing student records and class assignments." : "Register a new student and assign them to a grade."}
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={handleEnrollStudent}>
           <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="e.g. John" required />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="e.g. Doe" required />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Student Email" name="studentEmail" value={formData.studentEmail} onChange={handleInputChange} icon={Mail} placeholder="student@edu.com" type="email" />
              <Input label="Admission Number" value="AUTO-GENERATED" icon={Hash} readOnly={true} disabled className="bg-slate-50 cursor-not-allowed" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 focus-within:z-10 group">
                <label className="text-xs font-medium text-gray-400 px-1 uppercase tracking-tight">Target Branch</label>
                <div className="relative">
                  <select 
                    name="branchId" 
                    value={formData.branchId} 
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, branchId: e.target.value, classId: '' }));
                    }}
                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-10 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                  <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5 focus-within:z-10 group">
                <label className="text-xs font-medium text-gray-400 px-1 uppercase tracking-tight">Grade / Class</label>
                <div className="relative">
                  <select 
                    name="classId" 
                    value={formData.classId} 
                    onChange={handleInputChange}
                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-10 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={!formData.branchId}
                  >
                    <option value="">{formData.branchId ? "Select Class" : "Select Branch First"}</option>
                    {classes
                      .filter(c => c.branch === formData.branchId || c.branch?._id === formData.branchId)
                      .map(c => (
                        <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
                      ))
                    }
                  </select>
                  <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Emergency Phone" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} icon={Phone} placeholder="+1 (555) 000-0000" required />
              <Input label="Personal Email" name="personalEmail" value={formData.personalEmail} onChange={handleInputChange} icon={Mail} placeholder="personal@email.com" type="email" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Date of Birth" name="dob" value={formData.dob} onChange={handleInputChange} placeholder="YYYY-MM-DD" type="date" required />
              <Input 
                label="Initial Password" 
                name="password" 
                type="password"
                value={formData.password} 
                onChange={handleInputChange} 
                icon={Shield} 
                placeholder={editingStudentId ? "Leave blank to keep unchanged" : "Enter initial password"}
                required={!editingStudentId}
              />
           </div>

           <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
                 <Shield size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-brand-500 uppercase tracking-tight leading-none mb-1">Student Portal Access</h4>
                <p className="text-xs text-brand-700 font-medium mt-1 leading-relaxed italic opacity-80">Security credentials will be initialized upon enrollment. Invitation sent to official email.</p>
              </div>
           </div>

           <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Discard Changes</Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 shadow-premium font-black text-[10px] uppercase tracking-widest">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (editingStudentId ? 'Update Records' : 'Enroll Student')}
              </Button>
           </div>
        </form>
      </Modal>

    </div>
  );
};

export default Admissions;
