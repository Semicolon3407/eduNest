import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Save, 
  GraduationCap, BookOpen, 
  Trophy, AlertCircle, Loader2
} from 'lucide-react';
import { getStudentById, getGrades, upsertGrade, deleteGrade } from '../../services/tutorService';

interface MarkEntry {
  _id: string;
  subject: string;
  theoryMarks: number;
  practicalMarks: number;
  totalMarks: number;
  grade: string;
}

const StudentResult: React.FC = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const term = queryParams.get('term') || 'mid-term';
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMark, setEditingMark] = useState<MarkEntry | null>(null);
  const [student, setStudent] = useState<any>(null);
  const [marks, setMarks] = useState<MarkEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = async () => {
    try {
      const [studentRes, gradeRes] = await Promise.all([
        getStudentById(studentId!),
        getGrades({ classId: '', term: term }) 
      ]);
      setStudent(studentRes.data);
      setMarks(gradeRes.data.filter((g: any) => g.student?._id === studentId));
    } catch (error) {
      console.error('Error fetching student results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId, term]);

  const handleSaveMark = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const theoryMarks = Number(formData.get('theoryMarks'));
    const practicalMarks = Number(formData.get('practicalMarks'));

    const payload = {
      student: studentId,
      term: term, 
      subject: formData.get('subject') as string,
      theoryMarks,
      practicalMarks,
      class: student?.class?._id
    };

    try {
      await upsertGrade(payload);
      fetchStudentData();
      setIsModalOpen(false);
      setEditingMark(null);
    } catch (error) {
      console.error('Error saving grade:', error);
    }
  };

  const handleDeleteMark = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteGrade(id);
        fetchStudentData();
      } catch (error) {
        console.error('Error deleting grade:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  const totalPossible = marks.length * 100;
  const totalObtained = marks.reduce((acc, m) => acc + m.totalMarks, 0);
  const percentage = marks.length > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/tutor/grades')}
            className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-500 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">{student?.firstName} {student?.lastName}</h1>
              <Badge variant="brand" className="px-3 py-1 uppercase tracking-widest text-[9px] font-bold">{student?.admissionNumber}</Badge>
            </div>
            <p className="text-gray-500 mt-1 font-medium">Class {student?.class?.name}-{student?.class?.section} • {term.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} 2026</p>
          </div>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-xl h-12 shadow-sm font-bold text-[10px] uppercase tracking-widest">
             <Save size={18} /> Download Transcript
           </Button>
           <Button shadow-premium className="rounded-xl h-12 px-8" onClick={() => { setEditingMark(null); setIsModalOpen(true); }}>
             <Plus size={18} /> Add Subject Score
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-premium relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full -mr-16 -mt-16 opacity-20 blur-2xl"></div>
             <Trophy size={48} className="text-brand-400 mb-6" />
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Overall Performance</p>
             <h2 className="text-5xl font-display font-bold text-white mb-2">{percentage}%</h2>
             <Badge variant="success" className="bg-success/20 text-success border-none text-xs px-3">Distinction</Badge>
             
             <div className="mt-12 space-y-4">
                <div className="flex justify-between items-end">
                   <p className="text-xs text-slate-400 font-medium">Marks Obtained</p>
                   <p className="text-lg font-bold">{totalObtained} / {totalPossible || 0}</p>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-brand-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-soft">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Result Status</h3>
             <ul className="space-y-4">
                <li className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center">
                      <GraduationCap size={16} />
                   </div>
                   <p className="text-sm font-bold text-slate-700 leading-none">Promoted to next term</p>
                </li>
                <li className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center">
                      <BookOpen size={16} />
                   </div>
                   <p className="text-sm font-bold text-slate-700 leading-none">Rank: Competitive</p>
                </li>
             </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
           <div className="bg-white rounded-[40px] shadow-premium border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <h3 className="text-lg font-bold text-slate-800 tracking-tight">Subject-wise Breakdown</h3>
                 <Badge variant="neutral" className="bg-white">Averages Applied</Badge>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-white text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                          <th className="px-8 py-6">Subject</th>
                          <th className="px-6 py-6 text-center">Theory (75)</th>
                          <th className="px-6 py-6 text-center">Practical (25)</th>
                          <th className="px-6 py-6 text-center">Total (100)</th>
                          <th className="px-6 py-6 text-center">Grade</th>
                          <th className="px-8 py-6 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {marks.length > 0 ? marks.map((item) => (
                          <tr key={item._id} className="group hover:bg-slate-50/50 transition-all">
                             <td className="px-8 py-6 font-bold text-slate-800 text-sm">{item.subject}</td>
                             <td className="px-6 py-6 text-center font-medium text-slate-600">{item.theoryMarks}</td>
                             <td className="px-6 py-6 text-center font-medium text-slate-600">{item.practicalMarks}</td>
                             <td className="px-6 py-6 text-center">
                                <span className="inline-block bg-slate-100 px-3 py-1 rounded-lg font-bold text-slate-800 min-w-[3rem]">
                                   {item.totalMarks}
                                </span>
                             </td>
                             <td className="px-6 py-6 text-center">
                                <Badge variant={item.totalMarks >= 80 ? 'success' : item.totalMarks >= 60 ? 'warning' : 'danger'} className="font-bold min-w-[2.5rem] justify-center">
                                   {item.grade}
                                </Badge>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button 
                                     onClick={() => { setEditingMark(item); setIsModalOpen(true); }}
                                     className="p-2 bg-slate-100 hover:bg-brand-500 hover:text-white rounded-xl text-slate-400 transition-all shadow-sm"
                                   >
                                      <Edit2 size={16} />
                                   </button>
                                   <button 
                                     onClick={() => handleDeleteMark(item._id)}
                                     className="p-2 bg-slate-100 hover:bg-danger hover:text-white rounded-xl text-slate-400 transition-all shadow-sm"
                                   >
                                      <Trash2 size={16} />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       )) : (
                          <tr>
                             <td colSpan={6} className="px-8 py-10 text-center text-gray-400 text-sm">No marks recorded yet.</td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>

              <div className="p-8 bg-surface-50/50 border-t border-slate-100">
                 <div className="flex items-start gap-4 p-4 bg-brand-50/50 rounded-2xl border border-brand-100/50">
                    <AlertCircle className="text-brand-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs font-medium text-brand-700 leading-relaxed italic">
                      Note: Practical marks are evaluated out of 25 strictly following the institutional board guidelines. Theoretical marks are out of 75 including internal assessments.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMark ? "Edit Subject Score" : "Add New Subject Score"}
        description="Enter the detailed marks breakdown for the selected subject."
        maxWidth="md"
      >
        <form onSubmit={handleSaveMark} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Subject Name</label>
              <div className="relative">
                 <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={18} />
                 <input 
                   name="subject"
                   defaultValue={editingMark?.subject}
                   required 
                   placeholder="e.g. Mathematics"
                   className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 pl-12 pr-4 font-bold text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all outline-none"
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <Input 
                name="theoryMarks"
                label="Theory (Max 75)" 
                type="number" 
                max={75} 
                min={0}
                required
                defaultValue={editingMark?.theoryMarks}
              />
              <Input 
                name="practicalMarks"
                label="Practical (Max 25)" 
                type="number" 
                max={25} 
                min={0}
                required
                defaultValue={editingMark?.practicalMarks}
              />
           </div>

           <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Calculated Grade</p>
              <Badge variant="brand" className="h-8 px-4 font-black">---</Badge>
           </div>

           <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl h-11">Cancel</Button>
              <Button type="submit" shadow-premium className="rounded-xl h-11 px-8">
                 {editingMark ? "Update Record" : "Save Entry"}
              </Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentResult;
