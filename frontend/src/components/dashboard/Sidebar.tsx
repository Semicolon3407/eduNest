import React from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../../utils/navigation';
import type { UserRole } from '../../utils/navigation';
import { cn } from '../../utils/cn';
import { LogOut, GraduationCap, X } from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className={cn(
      "w-72 h-screen bg-surface border-r border-surface-200 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 lg:static",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-soft">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-display font-medium text-gray-900">
            eduNest
          </span>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:bg-surface-100 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            end={item.href.endsWith('/dashboard') || !item.href.includes('/', 1)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                isActive
                  ? 'bg-brand-500 text-white shadow-premium z-10'
                  : 'text-gray-500 hover:bg-brand-50 hover:text-brand-600'
              )
            }
          >
            <item.icon size={20} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span className="font-medium font-sans whitespace-nowrap">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-200">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-danger hover:bg-danger-light/30 rounded-xl transition-colors duration-200">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
