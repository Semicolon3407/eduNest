import React, { useEffect, useState } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { FileText, Trophy, Calendar, Download, Star, Award, Loader2 } from 'lucide-react';
import { getExamRoutine, getResults } from '../../services/studentService';

const Exams: React.FC = () => {
  const [routine, setRoutine] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routRes, resRes] = await Promise.all([
          getExamRoutine(),
          getResults()
        ]);
        setRoutine(routRes.data);
        setResults(resRes.data);
      } catch (error) {
        console.error('Error fetching exam data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  const avgGpa = results.length > 0 ? (results.reduce((acc, r) => acc + (r.totalMarks / 25), 0) / results.length).toFixed(2) : '0.00';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Academic Performance</h1>
          <p className="text-gray-500 mt-1">Review exam schedules, final results, and official transcripts</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline"><FileText size={18} /> Past Papers</Button>
           <Button><Download size={18} /> Download Transcript</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-8">
         {/* Exam Schedule */}
         <div className="bg-surface p-4 sm:p-8 rounded-[40px] shadow-soft border border-surface-200">
            <h2 className="text-2xl font-medium text-gray-900 mb-8   flex items-center gap-3 font-display leading-none">
               <Calendar className="text-brand-500" /> Exam Routine
            </h2>
            <div className="space-y-4">
               {routine.length > 0 ? routine.map(exam => (
                 <div key={exam._id} className="p-6 rounded-3xl border border-surface-100 bg-surface-50 flex items-center justify-between group hover:border-brand-200 transition-all">
                    <div>
                       <h4 className="font-medium text-gray-900   group-hover:text-brand-600 transition-colors ">{exam.subject}</h4>
                       <p className="text-xs text-gray-400 font-medium mt-1  ">{new Date(exam.date).toLocaleDateString()} • {exam.time}</p>
                    </div>
                    <div className="text-right">
                       <Badge variant="brand">{exam.room}</Badge>
                       <p className="text-[10px] text-gray-400 mt-1 font-medium">Admit Card Active</p>
                    </div>
                 </div>
               )) : (
                 <div className="text-center py-10 text-gray-400">No exams scheduled.</div>
               )}
            </div>
         </div>

         {/* Results Overview */}
         <div className="bg-brand-500 text-white p-4 sm:p-8 rounded-[40px] shadow-premium relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
               <Badge variant="neutral" className="bg-white/10 text-white border-white/20 mb-4 tracking-[0.2em] ">Session results 2023</Badge>
               <h3 className="text-2xl sm:text-3xl font-medium  mb-2">GPA: {avgGpa}</h3>
               <p className="text-brand-200 font-medium">Ranked competitive in your class. Keep up the excellent work in Sciences!</p>
            </div>
            
            <div className="relative z-10 mt-8 grid grid-cols-3 gap-4">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                  <Trophy size={20} className="mx-auto text-warning mb-2" />
                  <p className="text-[10px]  font-medium text-brand-300">Credits</p>
                  <p className="text-lg font-medium">18/20</p>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                  <Star size={20} className="mx-auto text-success mb-2" />
                  <p className="text-[10px]  font-medium text-brand-300">Merits</p>
                  <p className="text-lg font-medium">12</p>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                  <Award size={20} className="mx-auto text-white mb-2" />
                  <p className="text-[10px]  font-medium text-brand-300">Exams</p>
                  <p className="text-lg font-medium">{results.length}/{routine.length || 5}</p>
               </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl"></div>
         </div>
      </div>

      {/* Result Table */}
      <div className="bg-surface p-6 rounded-[32px] shadow-soft border border-surface-200">
         <h3 className="text-lg font-medium text-gray-900 mb-6 px-2  ">Detailed Scorecard</h3>
         <div className="overflow-x-auto">
             <div className="overflow-x-auto"><table className="w-full text-left">
                <thead>
                   <tr className="bg-surface-50 text-gray-400 text-[10px] font-medium  tracking-[0.2em]">
                      <th className="px-6 py-4 rounded-l-2xl">Subject</th>
                      <th className="px-6 py-4">Grade</th>
                      <th className="px-6 py-4">Total Marks</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right rounded-r-2xl">Remarks</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                   {results.length > 0 ? results.map(res => (
                      <tr key={res._id} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                         <td className="px-6 py-5 font-medium text-gray-900 group-hover:text-brand-600 transition-colors   text-sm">{res.subject}</td>
                         <td className="px-6 py-5">
                            <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-medium text-lg shadow-sm border border-brand-100">{res.grade || 'N/A'}</span>
                         </td>
                         <td className="px-6 py-5 text-sm font-medium text-gray-900">{res.totalMarks}/100</td>
                         <td className="px-6 py-5 text-sm font-medium text-gray-500">
                            <Badge variant={res.totalMarks >= 40 ? 'success' : 'danger'}>{res.totalMarks >= 40 ? 'Passed' : 'Failed'}</Badge>
                         </td>
                         <td className="px-6 py-5 text-right font-medium text-slate-400 italic">Term {res.term}</td>
                      </tr>
                   )) : (
                     <tr>
                        <td colSpan={5} className="py-10 text-center text-gray-400">No results recorded yet.</td>
                     </tr>
                   )}
                </tbody>
             </table></div>
         </div>
      </div>
    </div>
  );
};

export default Exams;
