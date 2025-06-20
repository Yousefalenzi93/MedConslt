'use client';

// Force dynamic rendering to avoid static generation issues with event handlers
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import AIAssistant from '@/components/AIAssistant';
import SmartNotifications from '@/components/SmartNotifications';
import {
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
  TrendingUpIcon,
  ClockIcon,
  BellIcon,
  EyeIcon,
  HeartIcon,
  CpuChipIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface DashboardStats {
  totalConsultations: number;
  pendingConsultations: number;
  completedConsultations: number;
  averageRating: number;
  totalMessages: number;
  videoCalls: number;
}

export default function DashboardPage() {
  const { userData } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalConsultations: 0,
    pendingConsultations: 0,
    completedConsultations: 0,
    averageRating: 0,
    totalMessages: 0,
    videoCalls: 0
  });

  const isDoctor = userData?.role === 'doctor';
  const isAdmin = userData?.role === 'admin';

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, fetch this data from Firebase
    setStats({
      totalConsultations: 45,
      pendingConsultations: 8,
      completedConsultations: 37,
      averageRating: 4.8,
      totalMessages: 156,
      videoCalls: 23
    });
  }, []);

  const doctorStats = [
    {
      name: 'إجمالي الاستشارات',
      value: stats.totalConsultations,
      icon: ClipboardDocumentListIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      name: 'الاستشارات المعلقة',
      value: stats.pendingConsultations,
      icon: ClipboardDocumentListIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100'
    },
    {
      name: 'الرسائل',
      value: stats.totalMessages,
      icon: ChatBubbleLeftRightIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    {
      name: 'المكالمات المرئية',
      value: stats.videoCalls,
      icon: VideoCameraIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'متوسط التقييم',
      value: stats.averageRating.toFixed(1),
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const adminStats = [
    {
      name: 'إجمالي الأطباء',
      value: 156,
      icon: UserGroupIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      name: 'الأطباء النشطون',
      value: 142,
      icon: UserGroupIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    {
      name: 'إجمالي الاستشارات',
      value: 2847,
      icon: ClipboardDocumentListIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'المكالمات المرئية',
      value: 1234,
      icon: VideoCameraIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'معدل الرضا',
      value: '94%',
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const currentStats = isAdmin ? adminStats : doctorStats;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            مرحباً، {userData?.fullName}
          </h1>
          <p className="mt-1 text-sm text-secondary-600">
            {isAdmin ? 'لوحة تحكم الإدارة' : `طبيب ${userData?.specialty}`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {currentStats.map((stat) => (
            <Card key={stat.name} variant="elevated" padding="md" hover>
              <CardContent>
                <div className="flex items-center">
                  <div className={clsx('flex-shrink-0 p-3 rounded-lg', stat.bgColor)}>
                    <stat.icon className={clsx('h-6 w-6', stat.color)} />
                  </div>
                  <div className="mr-4 flex-1">
                    <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card variant="elevated" padding="lg">
            <CardHeader title="الإجراءات السريعة" />
            <CardContent>
              <div className="space-y-4">
                {isDoctor ? (
                  <>
                    <button className="w-full text-right p-4 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                      <div className="flex items-center">
                        <ClipboardDocumentListIcon className="h-6 w-6 text-primary-600 ml-3" />
                        <div>
                          <p className="font-medium text-secondary-900">عرض الاستشارات المعلقة</p>
                          <p className="text-sm text-secondary-600">{stats.pendingConsultations} استشارة في الانتظار</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full text-right p-4 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                      <div className="flex items-center">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-success-600 ml-3" />
                        <div>
                          <p className="font-medium text-secondary-900">الرسائل الجديدة</p>
                          <p className="text-sm text-secondary-600">5 رسائل غير مقروءة</p>
                        </div>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full text-right p-4 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-6 w-6 text-primary-600 ml-3" />
                        <div>
                          <p className="font-medium text-secondary-900">إدارة الأطباء</p>
                          <p className="text-sm text-secondary-600">14 طبيب في انتظار التفعيل</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full text-right p-4 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-6 w-6 text-purple-600 ml-3" />
                        <div>
                          <p className="font-medium text-secondary-900">عرض الإحصائيات</p>
                          <p className="text-sm text-secondary-600">تقارير شاملة عن النشاط</p>
                        </div>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg">
            <CardHeader title="النشاط الأخير" />
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <ClipboardDocumentListIcon className="h-4 w-4 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">استشارة جديدة</p>
                    <p className="text-sm text-secondary-600">منذ 5 دقائق</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-success-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">رسالة جديدة</p>
                    <p className="text-sm text-secondary-600">منذ 15 دقيقة</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <StarIcon className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">تقييم جديد</p>
                    <p className="text-sm text-secondary-600">منذ ساعة</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Assistant Card */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">المساعد الذكي</h3>
                  <p className="text-sm text-gray-600">مدعوم بالذكاء الاصطناعي</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    احصل على إجابات فورية وإرشادات طبية ذكية
                  </p>
                  <div className="flex items-center gap-2 text-xs text-purple-600">
                    <CpuChipIcon className="w-4 h-4" />
                    <span>متاح 24/7</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300">
                  تحدث مع المساعد
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Smart Notifications Card */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <BellIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">الإشعارات الذكية</h3>
                  <p className="text-sm text-gray-600">تنبيهات مخصصة</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">إشعارات جديدة</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">5</span>
                  </div>
                  <div className="text-xs text-blue-600 flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>آخر تحديث: منذ دقيقتين</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300">
                  عرض الإشعارات
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Preview Card */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">التحليلات المتقدمة</h3>
                  <p className="text-sm text-gray-600">رؤى تفصيلية</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">نمو الأداء</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                      <span className="text-sm font-semibold">+23%</span>
                    </div>
                  </div>
                  <div className="text-xs text-green-600">
                    مقارنة بالشهر الماضي
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300">
                  عرض التحليلات
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Section */}
        {isAdmin && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
                التحليلات المتقدمة
              </h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                عرض التفاصيل الكاملة
              </button>
            </div>
            <AdvancedAnalytics />
          </div>
        )}

        {/* Real-time Activity Feed */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <EyeIcon className="w-5 h-5 text-purple-600" />
                النشاط المباشر
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">مباشر</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {[
                { type: 'consultation', message: 'استشارة جديدة من المريض أحمد محمد', time: 'منذ دقيقة', color: 'blue' },
                { type: 'message', message: 'رسالة جديدة من د. سارة أحمد', time: 'منذ 3 دقائق', color: 'green' },
                { type: 'rating', message: 'تقييم جديد 5 نجوم من المريضة فاطمة علي', time: 'منذ 5 دقائق', color: 'yellow' },
                { type: 'video', message: 'مكالمة فيديو مكتملة مع المريض محمد سالم', time: 'منذ 10 دقائق', color: 'purple' },
                { type: 'ai', message: 'المساعد الذكي ساعد 15 مريض اليوم', time: 'منذ 15 دقيقة', color: 'pink' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 bg-${activity.color}-500`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        {isDoctor && !userData?.isActive && (
          <Card variant="outlined" padding="lg">
            <CardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-warning-600" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-medium text-secondary-900">
                    حسابك في انتظار التفعيل
                  </h3>
                  <p className="text-sm text-secondary-600">
                    سيتم مراجعة بياناتك وتفعيل حسابك خلال 24-48 ساعة
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add AI Assistant and Smart Notifications */}
      <AIAssistant />
    </DashboardLayout>
  );
}
