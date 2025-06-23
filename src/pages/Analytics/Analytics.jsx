import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Analytics = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Mock data - in real app, this would come from API
  const stats = {
    totalConsultations: 156,
    activePatients: 89,
    completionRate: 94.2,
    averageRating: 4.8,
    totalRevenue: 15600,
    monthlyGrowth: 12.5
  }

  const chartData = {
    consultations: [
      { month: 'يناير', count: 45 },
      { month: 'فبراير', count: 52 },
      { month: 'مارس', count: 38 },
      { month: 'أبريل', count: 61 },
      { month: 'مايو', count: 55 },
      { month: 'يونيو', count: 48 }
    ],
    specialties: [
      { name: 'طب عام', count: 45, percentage: 35 },
      { name: 'طب الأطفال', count: 32, percentage: 25 },
      { name: 'طب القلب', count: 28, percentage: 22 },
      { name: 'طب النساء', count: 23, percentage: 18 }
    ]
  }

  const recentActivity = [
    {
      id: 1,
      type: 'consultation',
      description: 'استشارة جديدة مع فاطمة أحمد',
      time: '10 دقائق مضت',
      status: 'active'
    },
    {
      id: 2,
      type: 'rating',
      description: 'تقييم 5 نجوم من محمد علي',
      time: '30 دقيقة مضت',
      status: 'positive'
    },
    {
      id: 3,
      type: 'payment',
      description: 'دفعة بقيمة 200 ريال',
      time: 'ساعة واحدة مضت',
      status: 'completed'
    },
    {
      id: 4,
      type: 'consultation',
      description: 'إكمال استشارة مع نورا سالم',
      time: '2 ساعة مضت',
      status: 'completed'
    }
  ]

  const periods = [
    { id: 'week', label: 'هذا الأسبوع' },
    { id: 'month', label: 'هذا الشهر' },
    { id: 'quarter', label: 'هذا الربع' },
    { id: 'year', label: 'هذا العام' }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'consultation':
        return <Calendar className="w-4 h-4" />
      case 'rating':
        return <TrendingUp className="w-4 h-4" />
      case 'payment':
        return <DollarSign className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
      case 'positive':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'completed':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('analytics.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            تحليل شامل لأداء عيادتك والإحصائيات المهمة
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3 rtl:space-x-reverse">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.label}
              </option>
            ))}
          </select>
          
          <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('analytics.exportReport')}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('analytics.totalConsultations')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalConsultations}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                +{stats.monthlyGrowth}% من الشهر الماضي
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('analytics.activePatients')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activePatients}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                مريض نشط هذا الشهر
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('analytics.completionRate')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completionRate}%
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                معدل إكمال ممتاز
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                الإيرادات الشهرية
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalRevenue.toLocaleString()} ريال
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                متوسط {Math.round(stats.totalRevenue / stats.totalConsultations)} ريال/استشارة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultations Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('analytics.consultationStats')}
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {chartData.consultations.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                    {item.month}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(item.count / 70) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900 dark:text-white text-right">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specialties Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                توزيع التخصصات
              </h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {chartData.specialties.map((specialty, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3 rtl:mr-0 rtl:ml-3"
                      style={{ backgroundColor: `hsl(${index * 90}, 70%, 50%)` }}
                    ></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {specialty.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {specialty.count}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({specialty.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            النشاط الأخير
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-6 flex items-center">
              <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="ml-4 rtl:ml-0 rtl:mr-4 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            ملخص الأداء
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stats.averageRating}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('analytics.averageRating')}
              </div>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(stats.averageRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {Math.round((stats.totalConsultations / 30) * 10) / 10}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                متوسط الاستشارات اليومية
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {Math.round(stats.totalRevenue / stats.totalConsultations)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                متوسط قيمة الاستشارة (ريال)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
