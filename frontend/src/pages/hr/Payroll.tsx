import React from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CreditCard, FileText, Download, Send } from 'lucide-react';

const staffPayroll = [
  { name: 'Robert Fox', role: 'Teacher', base: '$4,200', bonus: '$200', tax: '$420', net: '$3,980' },
  { name: 'Jane Cooper', role: 'HR Manager', base: '$3,800', bonus: '$500', tax: '$380', net: '$3,920' },
  { name: 'Guy Hawkins', role: 'Librarian', base: '$2,200', bonus: '-', tax: '$220', net: '$1,980' },
];

const Payroll: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Payroll Engine</h1>
          <p className="text-gray-500 mt-1">Process salaries, handle statutory deductions and generate payslips</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline"><FileText size={18} /> Tax Reports</Button>
           <Button><CreditCard size={18} /> Disburse Salaries</Button>
        </div>
      </div>

      <div className="bg-brand-500 text-white rounded-[40px] p-4 sm:p-8 lg:p-12 shadow-premium relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 sm:p-8">
         <div className="relative z-10 max-w-lg">
            <Badge variant="neutral" className="bg-white/10 text-white border-white/20 mb-4 tracking-[0.2em] ">Current Period: October 2023</Badge>
            <h2 className="text-3xl sm:text-4xl font-medium ">Total Payout: $42,500.00</h2>
            <p className="mt-2 text-brand-200 font-medium">142 employees ready for disbursement. No pending compliance alerts found for this cycle.</p>
         </div>
         <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
               <p className="text-[10px]  font-medium text-brand-300 ">Base Payout</p>
               <h4 className="text-xl font-medium mt-1">$38,200</h4>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
               <p className="text-[10px]  font-medium text-brand-300 ">Global Bonus</p>
               <h4 className="text-xl font-medium mt-1">$4,300</h4>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>

      <div className="bg-surface p-6 rounded-[32px] shadow-soft border border-surface-200">
        <h3 className="text-lg font-medium text-gray-900 mb-6 px-2">Detailed Payslip Preview</h3>
        <div className="overflow-x-auto">
           <div className="overflow-x-auto"><table className="w-full text-left">
            <thead>
              <tr className="bg-surface-50 text-gray-400 text-[10px] font-medium  ">
                <th className="px-6 py-4 rounded-l-xl">Employee</th>
                <th className="px-6 py-4">Base Salary</th>
                <th className="px-6 py-4">Bonuses</th>
                <th className="px-6 py-4">Tax Ded.</th>
                <th className="px-6 py-4">Net Payout</th>
                <th className="px-6 py-4 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {staffPayroll.map((item) => (
                <tr key={item.name} className="group hover:bg-brand-50/20 transition-all cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm text-gray-900 group-hover:text-brand-600 transition-colors">{item.name}</p>
                    <p className="text-[10px] text-gray-400  font-medium">{item.role}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.base}</td>
                  <td className="px-6 py-4 text-sm font-medium text-success-dark">{item.bonus}</td>
                  <td className="px-6 py-4 text-sm font-medium text-danger">{item.tax}</td>
                  <td className="px-6 py-4 font-mono font-medium text-brand-600">{item.net}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-brand-600 rounded-lg"><Download size={18}/></button>
                      <button className="p-2 text-gray-400 hover:text-brand-600 rounded-lg"><Send size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
