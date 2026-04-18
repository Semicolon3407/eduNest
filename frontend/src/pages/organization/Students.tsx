import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { 
  UserPlus, Mail, Shield, Phone, Hash, Search, Filter, 
  MoreVertical, Users, CheckCircle2, BookOpen 
} from 'lucide-react';

const students = [
  { id: 'STU-101', name: 'Alex Johnson', email: 'alex.j@student.com', grade: 'Grade 10', section: 'A', status: 'Active', enrolled: '2023-09-01' },
  { id: 'STU-102', name: 'Maria Garcia', email: 'maria.g@student.com', grade: 'Grade 9', section: 'B', status: 'Active', enrolled: '2023-09-05' },
  { id: 'STU-103', name: 'David Chen', email: 'david.c@student.com', grade: 'Grade 11', section: 'A', status: 'Active', enrolled: '2023-09-02' },
  { id: 'STU-104', name: 'Sarah Miller', email: 'sarah.m@student.com', grade: 'Grade 10', section: 'C', status: 'Pending', enrolled: '2023-11-15' },
  { id: 'STU-105', name: 'Kevin Brown', email: 'kevin.b@student.com', grade: 'Grade 12', section: 'A', status: 'Active', enrolled: '2022-09-01' },
];

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Student Management</h1>
          <p className="text-gray-500 mt-1">Enroll and manage student records across all branches</p>
        </div>
        <Button className="w-full sm:w-auto rounded-xl shadow-premium" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Add Student
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-brand-200">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Enrollment</p>
            <p className="text-2xl font-display font-medium text-gray-900">2,482</p>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-brand-200">
          <div className="w-14 h-14 rounded-2xl bg-success-light/50 text-success-dark flex items-center justify-center shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Students</p>
            <p className="text-2xl font-display font-medium text-gray-900">2,410</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-[32px] border border-surface-200 flex items-center gap-4 transition-all hover:border-brand-200">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 text-brand-600 flex items-center justify-center shadow-sm">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Academic Years</p>
            <p className="text-2xl font-display font-medium text-gray-900">2023-24</p>
          </div>
        </div>
      </div>

      <div className="bg-surface p-4 sm:p-6 rounded-[32px] sm:rounded-[48px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by name, ID, or grade..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none py-3 rounded-xl border-surface-200">
              <Filter size={18} /> Filters
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none py-3 rounded-xl border-surface-200">
              Bulk Upload
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:-mx-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-surface-50 text-gray-400 text-[10px] font-bold tracking-[0.2em] px-6">
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Admission ID</th>
                  <th className="px-6 py-4">Grade & Section</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {students.map((student) => (
                  <tr key={student.id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-surface-100 flex items-center justify-center text-brand-600 font-medium text-sm transition-all group-hover:bg-white group-hover:scale-110 shadow-sm border border-transparent group-hover:border-brand-100">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors uppercase tracking-tight">{student.name}</p>
                          <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-gray-900">{student.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-gray-900">{student.grade}</p>
                        <p className="text-[10px] text-brand-500 font-medium">Section {student.section}</p>
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
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:bg-surface-100 rounded-lg">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between px-2">
          <p className="text-xs font-medium text-gray-400">Showing 1 to 5 of 2,482 students</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg h-9" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-lg h-9">Next</Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Student Registration"
        description="Register a new student and assign them to a grade."
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
           <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="e.g. John" required />
              <Input label="Last Name" placeholder="e.g. Doe" required />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Student Email" icon={Mail} placeholder="student@edu.com" type="email" />
              <Input label="Admission Number" icon={Hash} placeholder="ADM-2023-001" required />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 focus-within:z-10 group">
                <label className="text-xs font-medium text-gray-400 px-1">Grade / Class</label>
                <select className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 appearance-none cursor-pointer">
                  <option value="">Select Grade</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="10">Grade 10</option>
                </select>
              </div>
              <div className="space-y-1.5 focus-within:z-10 group">
                <label className="text-xs font-medium text-gray-400 px-1">Section</label>
                <select className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 appearance-none cursor-pointer">
                  <option value="">Select Section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Personal Email" icon={Mail} placeholder="personal@email.com" type="email" />
              <Input label="Emergency Contact" icon={Phone} placeholder="+1 (555) 000-0000" required />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 focus-within:z-10 group">
                <label className="text-xs font-medium text-gray-400 px-1">Branch</label>
                <select className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-[13px] px-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 appearance-none cursor-pointer">
                  <option value="">Select Branch</option>
                  <option value="main">Main Campus</option>
                  <option value="north">North Branch</option>
                </select>
              </div>
              <Input label="Date of Birth" placeholder="YYYY-MM-DD" type="date" />
           </div>

           <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center shrink-0">
                 <Shield size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-brand-500">Student Portal Access</h4>
                <p className="text-xs text-brand-700 font-medium">An invitation will be sent to the student and parent emails to set up their portals.</p>
              </div>
           </div>

           <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12">Cancel</Button>
              <Button type="submit" className="rounded-xl h-12 px-8 shadow-premium"><UserPlus size={18} className="mr-2" /> Enroll Student</Button>
           </div>
        </form>
      </Modal>

    </div>
  );
};

export default StudentManagement;
