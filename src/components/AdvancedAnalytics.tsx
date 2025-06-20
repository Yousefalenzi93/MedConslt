'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  HeartIcon,
  EyeIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalConsultations: number;
  activePatients: number;
  averageRating: number;
  responseTime: number;
  consultationTrends: { month: string; count: number }[];
  specialtyDistribution: { name: string; count: number; color: string }[];
  patientSatisfaction: number;
  revenueGrowth: number;
}

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalytics({
        totalConsultations: 1247,
        activePatients: 892,
        averageRating: 4.8,
        responseTime: 12,
        consultationTrends: [
          { month: 'يناير', count: 145 },
          { month: 'فبراير', count: 167 },
          { month: 'مارس', count: 189 },
          { month: 'أبريل', count: 203 },
          { month: 'مايو', count: 234 },
          { month: 'يونيو', count: 267 }
        ],
        specialtyDistribution: [
          { name: 'طب عام', count: 342, color: 'bg-blue-500' },
          { name: 'طب الأطفال', count: 289, color: 'bg-green-500' },
          { name: 'طب القلب', count: 198, color: 'bg-red-500' },
          { name: 'طب النساء', count: 156, color: 'bg-purple-500' },
          { name: 'طب الأعصاب', count: 134, color: 'bg-yellow-500' },
          { name: 'أخرى', count: 128, color: 'bg-gray-500' }
        ],
        patientSatisfaction: 94.5,
        revenueGrowth: 23.4
      });
      setLoading(false);
    }, 1500);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'blue' 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    color?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <ArrowUpIcon className="w-4 h-4 ml-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 ml-1" />
              )}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ChartBarIcon className="w-7 h-7 text-blue-600" />
            التحليلات المتقدمة
          </h2>
          <p className="text-gray-600 mt-1">نظرة شاملة على أداء المنصة</p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">آخر 7 أيام</option>
          <option value="30d">آخر 30 يوم</option>
          <option value="90d">آخر 3 أشهر</option>
          <option value="1y">آخر سنة</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الاستشارات"
          value={analytics.totalConsultations.toLocaleString()}
          icon={UsersIcon}
          trend="up"
          trendValue="+12.5%"
          color="blue"
        />
        <StatCard
          title="المرضى النشطون"
          value={analytics.activePatients.toLocaleString()}
          icon={HeartIcon}
          trend="up"
          trendValue="+8.3%"
          color="green"
        />
        <StatCard
          title="متوسط التقييم"
          value={`${analytics.averageRating}/5`}
          icon={EyeIcon}
          trend="up"
          trendValue="+0.2"
          color="yellow"
        />
        <StatCard
          title="وقت الاستجابة"
          value={`${analytics.responseTime} دقيقة`}
          icon={ClockIcon}
          trend="down"
          trendValue="-15%"
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultation Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowUpIcon className="w-5 h-5 text-blue-600" />
            اتجاه الاستشارات
          </h3>
          <div className="space-y-3">
            {analytics.consultationTrends.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">{item.month}</span>
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / Math.max(...analytics.consultationTrends.map(t => t.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-left">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialty Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-green-600" />
            توزيع التخصصات
          </h3>
          <div className="space-y-3">
            {analytics.specialtyDistribution.map((specialty, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${specialty.color}`}></div>
                  <span className="text-gray-700 text-sm">{specialty.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {specialty.count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((specialty.count / analytics.totalConsultations) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">رضا المرضى</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{analytics.patientSatisfaction}%</p>
              <p className="text-green-100 text-sm">من المرضى راضون عن الخدمة</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 rounded-full border-4 border-green-200 flex items-center justify-center">
                <HeartIcon className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">نمو الإيرادات</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">+{analytics.revenueGrowth}%</p>
              <p className="text-blue-100 text-sm">مقارنة بالشهر الماضي</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 rounded-full border-4 border-blue-200 flex items-center justify-center">
                <ArrowUpIcon className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
