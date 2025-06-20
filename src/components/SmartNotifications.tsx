'use client';

import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  XMarkIcon, 
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  HeartIcon,
  CalendarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'reminder' | 'urgent' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
}

export default function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  useEffect(() => {
    // Simulate real-time notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'urgent',
        title: 'استشارة طارئة',
        message: 'لديك استشارة طارئة جديدة من المريض أحمد محمد',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'urgent',
        actionUrl: '/consultations/urgent',
        actionText: 'عرض الاستشارة'
      },
      {
        id: '2',
        type: 'appointment',
        title: 'موعد قادم',
        message: 'لديك موعد مع المريضة فاطمة أحمد خلال 30 دقيقة',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: false,
        priority: 'high',
        actionUrl: '/appointments/upcoming',
        actionText: 'عرض الموعد'
      },
      {
        id: '3',
        type: 'message',
        title: 'رسالة جديدة',
        message: 'رسالة جديدة من د. سارة العلي حول حالة مريض مشترك',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        priority: 'medium',
        actionUrl: '/messages',
        actionText: 'قراءة الرسالة'
      },
      {
        id: '4',
        type: 'reminder',
        title: 'تذكير دوائي',
        message: 'حان وقت تذكير المريض محمد علي بتناول الدواء',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        priority: 'medium',
        actionUrl: '/patients/reminders',
        actionText: 'إرسال التذكير'
      },
      {
        id: '5',
        type: 'info',
        title: 'تحديث النظام',
        message: 'تم إضافة ميزات جديدة للمنصة الطبية',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true,
        priority: 'low',
        actionUrl: '/updates',
        actionText: 'عرض التحديثات'
      },
      {
        id: '6',
        type: 'success',
        title: 'تم إكمال الاستشارة',
        message: 'تم إكمال الاستشارة مع المريض خالد أحمد بنجاح',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        priority: 'low',
        actionUrl: '/consultations/completed',
        actionText: 'عرض التقرير'
      }
    ];

    setNotifications(mockNotifications);

    // Simulate new notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: ['appointment', 'message', 'reminder', 'info'][Math.floor(Math.random() * 4)] as any,
        title: 'إشعار جديد',
        message: 'لديك تحديث جديد في النظام',
        timestamp: new Date(),
        read: false,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        actionText: 'عرض التفاصيل'
      };

      setNotifications(prev => [newNotification, ...prev]);
    }, 30000); // New notification every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return ExclamationTriangleIcon;
      case 'appointment':
        return CalendarIcon;
      case 'message':
        return ChatBubbleLeftIcon;
      case 'reminder':
        return ClockIcon;
      case 'info':
        return InformationCircleIcon;
      case 'success':
        return CheckIcon;
      default:
        return BellIcon;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'urgent') return 'text-red-600 bg-red-100';
    
    switch (type) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'appointment':
        return 'text-blue-600 bg-blue-100';
      case 'message':
        return 'text-green-600 bg-green-100';
      case 'reminder':
        return 'text-yellow-600 bg-yellow-100';
      case 'info':
        return 'text-purple-600 bg-purple-100';
      case 'success':
        return 'text-emerald-600 bg-emerald-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    switch (filter) {
      case 'unread':
        return !n.read;
      case 'urgent':
        return n.priority === 'urgent';
      default:
        return true;
    }
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {urgentCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 w-3 h-3 rounded-full animate-ping"></span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">الإشعارات</h3>
                <p className="text-sm text-gray-600">
                  {unreadCount} غير مقروء من {notifications.length}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  الكل ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filter === 'unread' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  غير مقروء ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('urgent')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filter === 'urgent' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  عاجل ({urgentCount})
                </button>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BellIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد إشعارات</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type, notification.priority);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {formatTime(notification.timestamp)}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="تحديد كمقروء"
                                  >
                                    <CheckIcon className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors"
                                  title="حذف"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            {notification.actionText && (
                              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                                {notification.actionText}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
