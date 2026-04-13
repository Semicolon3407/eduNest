import { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon, Calendar as CalendarIcon, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  if (!user) return null;

  // Mock Nepali Date (Sample for Apr 09, 2026 -> Chaitra 27, 2082 approx)
  const englishDate = new Intl.DateTimeFormat('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit' 
  }).format(new Date());
  
  const nepaliDate = "बिहीबार, चैत २७, २०८२"; // Mock realistic date

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b bg-background/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
           onClick={onMenuClick}
           className="lg:hidden p-2 text-muted-foreground hover:text-primary-600"
        >
            <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative hidden sm:block w-48 md:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-xl border bg-muted/30 py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-sans font-bold"
          />
        </div>
      </div>

      {/* Center: Dates */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-2 rounded-2xl border bg-muted/10">
        <div className="flex items-center gap-3 border-r pr-6">
            <CalendarIcon size={16} className="text-primary-600" />
            <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground leading-none mb-1">English Date</p>
                <p className="text-xs font-bold text-foreground leading-none">{englishDate}</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground leading-none mb-1 text-right">नेपाली मिति</p>
                <p className="text-sm font-bold text-foreground leading-none font-sans">{nepaliDate}</p>
            </div>
        </div>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="h-10 w-10 flex items-center justify-center rounded-xl border bg-background text-muted-foreground hover:text-primary-600 transition-all"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-primary-600 transition-colors">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary-600 ring-2 ring-background"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 md:border-l md:pl-6">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-foreground leading-none">{user.name}</p>
            <p className="mt-1 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary-100 shrink-0">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              alt="Avatar" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
