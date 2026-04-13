import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../hooks/utils';

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-primary-950/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        "lg:ml-64"
      )}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-8 flex-1">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
