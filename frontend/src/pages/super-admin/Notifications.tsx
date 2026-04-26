import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell, AlertCircle, Clock, CheckCheck, Search,
  Filter, Loader2, RefreshCw, Building2, Calendar,
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { notificationService } from '../../services/notificationService';
import type { NotificationData } from '../../services/notificationService';
import toast from 'react-hot-toast';

type FilterType = 'ALL' | 'UNREAD' | 'PLAN_EXPIRED' | 'PLAN_EXPIRING_SOON';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to update notifications');
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleCheckExpiry = async () => {
    try {
      setIsChecking(true);
      const res = await notificationService.checkExpiry();
      toast.success(res.message || 'Expiry check complete');
      fetchNotifications();
    } catch {
      toast.error('Expiry check failed');
    } finally {
      setIsChecking(false);
    }
  };

  const getIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'PLAN_EXPIRED':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'PLAN_EXPIRING_SOON':
        return <Clock size={20} className="text-amber-500" />;
      default:
        return <Bell size={20} className="text-brand-500" />;
    }
  };

  const getIconBg = (type: NotificationData['type']) => {
    switch (type) {
      case 'PLAN_EXPIRED':
        return 'bg-red-50';
      case 'PLAN_EXPIRING_SOON':
        return 'bg-amber-50';
      default:
        return 'bg-brand-50';
    }
  };

  const getBadgeVariant = (type: NotificationData['type']): 'danger' | 'warning' | 'brand' => {
    if (type === 'PLAN_EXPIRED') return 'danger';
    if (type === 'PLAN_EXPIRING_SOON') return 'warning';
    return 'brand';
  };

  const getBadgeLabel = (type: NotificationData['type']) => {
    if (type === 'PLAN_EXPIRED') return 'Expired';
    if (type === 'PLAN_EXPIRING_SOON') return 'Expiring Soon';
    return 'General';
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) !== 1 ? 's' : ''} ago`;
  };

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Unread', value: 'UNREAD' },
    { label: 'Expired', value: 'PLAN_EXPIRED' },
    { label: 'Expiring Soon', value: 'PLAN_EXPIRING_SOON' },
  ];

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.organization?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'UNREAD' && !n.isRead) ||
      n.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Plan expiry alerts and system notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl transition-all"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
          <button
            onClick={handleCheckExpiry}
            disabled={isChecking}
            className="flex items-center gap-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-60 px-4 py-2.5 rounded-xl transition-all shadow-soft"
          >
            {isChecking ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {isChecking ? 'Checking...' : 'Run Expiry Check'}
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface p-4 sm:p-6 rounded-[32px] shadow-soft border border-surface-200">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:border-brand-500/50 placeholder:text-gray-400"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {filterButtons.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                  filter === value
                    ? 'bg-brand-600 text-white border-brand-600 shadow-soft'
                    : 'bg-surface-50 text-gray-500 border-surface-200 hover:bg-surface-100'
                }`}
              >
                <Filter size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 size={40} className="animate-spin text-brand-500" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-surface-50 rounded-3xl flex items-center justify-center border border-surface-200">
              <Bell size={28} className="text-gray-300" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-500">No notifications found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || filter !== 'ALL'
                  ? 'Try adjusting your search or filters'
                  : 'Run an expiry check to generate alerts'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notif) => (
              <div
                key={notif._id}
                className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all hover:shadow-soft cursor-pointer ${
                  !notif.isRead
                    ? 'bg-brand-50/40 border-brand-100 hover:border-brand-200'
                    : 'bg-surface border-surface-100 hover:border-surface-200'
                }`}
                onClick={() => !notif.isRead && handleMarkOneRead(notif._id)}
              >
                {/* Unread indicator */}
                {!notif.isRead && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-brand-500 rounded-full" />
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getIconBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-1">
                    <p className={`text-sm font-bold leading-tight ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notif.title}
                    </p>
                    <Badge variant={getBadgeVariant(notif.type)}>
                      {getBadgeLabel(notif.type)}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed mt-1">
                    {notif.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    {notif.organization && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg">
                        <Building2 size={11} />
                        {notif.organization.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <Calendar size={11} />
                      {getTimeAgo(notif.createdAt)}
                    </span>
                    {notif.isRead ? (
                      <span className="text-[11px] font-bold text-green-500 uppercase tracking-wider">Read</span>
                    ) : (
                      <button
                        className="text-[11px] font-bold text-brand-500 hover:text-brand-700 uppercase tracking-wider transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleMarkOneRead(notif._id); }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {!isLoading && notifications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: notifications.length, color: 'bg-surface-50 border-surface-200 text-gray-700' },
            { label: 'Unread', value: unreadCount, color: 'bg-brand-50 border-brand-100 text-brand-700' },
            {
              label: 'Expired Plans',
              value: notifications.filter((n) => n.type === 'PLAN_EXPIRED').length,
              color: 'bg-red-50 border-red-100 text-red-700',
            },
            {
              label: 'Expiring Soon',
              value: notifications.filter((n) => n.type === 'PLAN_EXPIRING_SOON').length,
              color: 'bg-amber-50 border-amber-100 text-amber-700',
            },
          ].map(({ label, value, color }) => (
            <div key={label} className={`p-4 rounded-2xl border ${color} flex flex-col gap-1`}>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
