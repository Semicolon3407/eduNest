import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, User, Calendar, Menu, GraduationCap, CheckCheck, ArrowRight, AlertCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import { tenantService } from '../../services/tenantService';
import type { NotificationData } from '../../services/notificationService';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isOrgAdmin = user?.role === 'ORGANIZATION';

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

  const fetchNotifications = useCallback(async () => {
    if (!isSuperAdmin && !isOrgAdmin && user?.role !== 'STUDENT') return;
    try {
      setIsLoading(true);
      if (user?.role === 'STUDENT') {
        const { getAnnouncements } = await import('../../services/studentService');
        const res = await getAnnouncements();
        if (res.success) {
          const mapped = res.data.map((a: any) => ({
            _id: a._id,
            title: a.title,
            message: a.content,
            type: 'GENERAL',
            createdAt: a.date || a.createdAt,
            isRead: false
          }));
          setNotifications(mapped);
          setUnreadCount(mapped.length);
        }
      } else {
        const res = isSuperAdmin 
          ? await notificationService.getNotifications()
          : await tenantService.getNotifications();
          
        if (res.success) {
          setNotifications(res.data);
          setUnreadCount(res.unreadCount);
        }
      }
    } catch (err) {
      // Silent fail — don't block UI
    } finally {
      setIsLoading(false);
    }
  }, [isSuperAdmin, isOrgAdmin, user?.role]);

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  const handleToggle = () => {
    setIsNotifOpen((prev) => !prev);
    if (!isNotifOpen) fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    try {
      if (isSuperAdmin) await notificationService.markAllAsRead();
      else if (isOrgAdmin) await tenantService.markAllNotificationsRead();
      
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) { /* silent */ }
  };

  const handleMarkOneRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isSuperAdmin) await notificationService.markAsRead(id);
      else if (isOrgAdmin) await tenantService.markNotificationRead(id);
      
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) { /* silent */ }
  };

  const handleViewAll = () => {
    setIsNotifOpen(false);
    navigate('/super-admin/notifications');
  };

  const getNotifIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'PLAN_EXPIRED':
        return <AlertCircle size={16} className="text-red-500 shrink-0" />;
      case 'PLAN_EXPIRING_SOON':
        return <Clock size={16} className="text-amber-500 shrink-0" />;
      default:
        return <Bell size={16} className="text-brand-500 shrink-0" />;
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const previewNotifications = notifications.slice(0, 5);

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
        {/* Notification Bell */}
        {(isSuperAdmin || isOrgAdmin || user?.role === 'STUDENT') ? (
          <div className="relative" ref={dropdownRef}>
            <button
              id="notification-bell"
              onClick={handleToggle}
              className={`relative p-2 rounded-xl transition-all duration-200 ${isNotifOpen ? 'bg-brand-50 text-brand-600' : 'text-gray-500 hover:bg-surface-100'}`}
            >
              <Bell size={18} className="sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              {unreadCount === 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gray-300 rounded-full border-2 border-surface" />
              )}
            </button>

            {/* Dropdown Panel */}
            {isNotifOpen && (
              <div
                id="notification-dropdown"
                className="absolute right-0 top-full mt-3 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-premium border border-surface-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Notifications</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <CheckCheck size={13} />
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-surface-100 rounded-lg transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Notification List */}
                <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
                  {isLoading ? (
                    <div className="py-10 flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading...</p>
                    </div>
                  ) : previewNotifications.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-surface-50 rounded-2xl flex items-center justify-center">
                        <Bell size={20} className="text-gray-300" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No notifications yet</p>
                    </div>
                  ) : (
                    previewNotifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`group px-5 py-3.5 border-b border-surface-50 last:border-b-0 flex items-start gap-3 hover:bg-surface-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-brand-50/40' : ''}`}
                        onClick={(e) => !notif.isRead && handleMarkOneRead(notif._id, e)}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${notif.type === 'PLAN_EXPIRED' ? 'bg-red-50' : notif.type === 'PLAN_EXPIRING_SOON' ? 'bg-amber-50' : 'bg-brand-50'}`}>
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-bold leading-tight ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <span className="w-2 h-2 bg-brand-500 rounded-full shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {getTimeAgo(notif.createdAt)}
                            </p>
                            {notif.organization && (
                              <span className="text-[10px] font-bold text-brand-500 bg-brand-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                                {notif.organization.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {isSuperAdmin && (
                  <div className="px-5 py-3 border-t border-surface-100 bg-slate-50/60">
                    <button
                      id="view-all-notifications"
                      onClick={handleViewAll}
                      className="w-full flex items-center justify-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 py-1.5 hover:bg-brand-50 rounded-xl transition-all group"
                    >
                      View All Notifications
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Non-super-admin: plain bell without dropdown */
          <button className="relative p-2 text-gray-500 hover:bg-surface-100 rounded-xl transition-colors">
            <Bell size={18} className="sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface" />
          </button>
        )}

        <div className="h-8 w-px bg-surface-200 mx-1 hidden sm:block" />

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
