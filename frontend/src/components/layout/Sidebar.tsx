import { Link, useLocation } from 'react-router-dom';
import { LogOut, GraduationCap, X } from 'lucide-react';
import { NAV_ITEMS } from './NavItems';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../hooks/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex h-full flex-col px-3 py-4 relative">
        <button 
            onClick={onClose}
            className="lg:hidden absolute right-4 top-4 p-2 text-muted-foreground hover:text-primary-600 z-50"
        >
            <X size={20} />
        </button>

        {/* Brand */}
        <div className="mb-10 flex items-center px-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-emerald-600 text-white shadow-xl shadow-primary-500/20">
            <GraduationCap size={24} strokeWidth={2.5} />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-primary-400 border-2 border-background animate-pulse"></div>
          </div>
          <div className="ml-4 flex flex-col">
            <span className="text-xl font-black tracking-tight text-foreground leading-none">
                EDU<span className="text-primary-600">NEST</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">
                SYSTEMS
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {filteredItems.map((item) => (
            <Link
              key={item.href + item.title}
              to={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                location.pathname === item.href
                  ? "bg-primary-50 text-primary-600 dark:bg-muted dark:text-primary-400 font-bold"
                  : "text-muted-foreground hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-muted/50"
              )}
            >
              <span className={cn(
                "mr-3 transition-colors",
                location.pathname === item.href ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground group-hover:text-primary-600"
              )}>
                {item.icon}
              </span>
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Footer / User info */}
        <div className="mt-auto border-t pt-4">
          <button
            onClick={logout}
            className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
