import React from 'react';
import { Bell, User, Calendar, Menu, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  
  // Mapping roles for display in user info
  const roleLabel = user?.role === 'SUPER_ADMIN' ? 'Super Admin' :
                    user?.role === 'ORGANIZATION' ? 'Org Admin' :
                    user?.role === 'HR' ? 'HR Manager' :
                    user?.role === 'ADMIN' ? 'Administrator' :
                    user?.role === 'TUTOR' ? 'Tutor' :
                    user?.role === 'STUDENT' ? 'Student' : 'User';

  const today = new Intl.DateTimeFormat('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }).format(new Date());

  return (
    <header className="h-16 sm:h-20 bg-surface/80 backdrop-blur-md border-b border-surface-200 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-2 sm:gap-6">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="p-2 text-gray-500 hover:bg-surface-100 rounded-xl transition-all lg:hidden"
        >
          <Menu size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Brand Logo - Mobile Only */}
        <div className="flex lg:hidden items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white shadow-soft">
                <GraduationCap size={18} />
            </div>
            <span className="text-lg font-display font-medium text-gray-900 hidden xs:block">
                eduNest
            </span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
           <Calendar size={14} className="text-brand-500" />
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">{today}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-surface-100 rounded-xl transition-colors">
          <Bell size={18} className="sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
        </button>
        
        <div className="h-8 w-px bg-surface-200 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors whitespace-nowrap">{user?.name || 'User'}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleLabel}</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 border border-brand-200 flex items-center justify-center text-white shadow-soft shrink-0 overflow-hidden">
             <User size={20} className="sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
