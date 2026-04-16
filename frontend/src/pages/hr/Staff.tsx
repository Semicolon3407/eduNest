import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Search, Plus, MoreHorizontal, Download } from 'lucide-react';

const staffMembers = [
  { id: 1, name: 'Robert Fox', role: 'Senior Teacher', dept: 'Mathematics', type: 'Full-time', status: 'Active', salary: '$4,200' },
  { id: 2, name: 'Jane Cooper', role: 'HR Manager', dept: 'Admin', type: 'Full-time', status: 'Active', salary: '$3,800' },
  { id: 3, name: 'Wade Warren', role: 'Junior Teacher', dept: 'Physics', type: 'Contract', status: 'On Leave', salary: '$2,500' },
  { id: 4, name: 'Guy Hawkins', role: 'Librarian', dept: 'Library', type: 'Full-time', status: 'Active', salary: '$2,200' },
  { id: 5, name: 'Jenny Wilson', role: 'Admin Assistant', dept: 'Admin', type: 'Part-time', status: 'Inactive', salary: '$1,500' },
];

const StaffManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900 ">Staff Directory</h1>
          <p className="text-gray-500 mt-1">Manage employee records, roles, and status across the institution</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline"><Download size={18} /> Export</Button>
           <Button><Plus size={18} /> Add New Staff</Button>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-[32px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="flex-1">
             <Input 
               placeholder="Search by name, department, or role..." 
               icon={Search} 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>

        <div className="overflow-x-auto">
           <div className="overflow-x-auto"><table className="w-full text-left">
            <thead>
              <tr className="bg-surface-50 text-gray-400 text-[10px] font-medium  tracking-[0.2em]">
                <th className="px-6 py-4 rounded-l-xl">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="group hover:bg-brand-50/20 transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-medium">
                         {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{staff.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{staff.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-600">{staff.dept}</td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">{staff.type}</td>
                  <td className="px-6 py-5">
                    <Badge variant={
                      staff.status === 'Active' ? 'success' : 
                      staff.status === 'On Leave' ? 'warning' : 'danger'
                    }>
                      {staff.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-gray-400 hover:text-brand-600">
                      <MoreHorizontal size={18} />
                    </button>
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

export default StaffManagement;
