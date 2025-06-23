import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Dashboard = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  // Mock data - in real app, this would come from API
  const stats = {
    totalConsultations: user?.userType === 'doctor' ? 156 : 12,
    activeConsultations: user?.userType === 'doctor' ? 8 : 2,
    completedConsultations: user?.userType === 'doctor' ? 148 : 10,
    pendingConsultations: user?.userType === 'doctor' ? 3 : 1
  }

  const recentConsultations = [
    {
      id: 1,
      patientName: user?.userType === 'doctor' ? 'فاطمة أحمد' : 'د. أحمد محمد',
      specialty: 'طب عام',
      date: '2024-01-15',
      time: '14:30',
      status: 'completed',
      type: user?.userType === 'doctor' ? 'patient' : 'doctor'
    },
    {
      id: 2,
      patientName: user?.userType === 'doctor' ? 'محمد علي' : 'د. سارة خالد',
      specialty: 'طب الأطفال',
      date: '2024-01-14',
      time: '10:15',
      status: 'active',
      type: user?.userType === 'doctor' ? 'patient' : 'doctor'
    },
    {
      id: 3,
      patientName: user?.userType === 'doctor' ? 'نورا سالم' : 'د. عبدالله حسن',
      specialty: 'طب النساء',
      date: '2024-01-13',
      time: '16:45',
      status: 'pending',
      type: user?.userType === 'doctor' ? 'patient' : 'doctor'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'active':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'مكتملة'
      case 'active':
        return 'نشطة'
      case 'pending':
        return 'معلقة'
      default:
        return 'غير محدد'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {t('dashboard.welcome')} {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-primary-100 mb-4">
          {user?.userType === 'doctor' 
            ? 'مرحباً بك في لوحة تحكم الطبيب. يمكنك إدارة استشاراتك ومرضاك من هنا.'
            : 'مرحباً بك في لوحة التحكم. يمكنك طلب استشارة طبية أو متابعة استشاراتك الحالية.'
          }
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/consultations"
            className="inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {user?.userType === 'doctor' ? 'عرض الاستشارات' : 'استشارة جديدة'}
          </Link>
          <Link
            to="/messages"
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('dashboard.viewMessages')}
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                إجمالي الاستشارات
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalConsultations}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                استشارات مكتملة
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completedConsultations}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                استشارات نشطة
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeConsultations}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                استشارات معلقة
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pendingConsultations}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Consultations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('dashboard.recentConsultations')}
            </h2>
            <Link
              to="/consultations"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium flex items-center"
            >
              عرض الكل
              <ArrowRight className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentConsultations.map((consultation) => (
            <div key={consultation.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      {consultation.patientName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {consultation.patientName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {consultation.specialty}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="text-right rtl:text-left">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {consultation.date}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {consultation.time}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                    {getStatusText(consultation.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/consultations"
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
              <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {user?.userType === 'doctor' ? 'إدارة الاستشارات' : 'طلب استشارة'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.userType === 'doctor' 
                  ? 'عرض وإدارة جميع الاستشارات'
                  : 'احصل على استشارة طبية فورية'
                }
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/messages"
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
              <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                الرسائل
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تواصل مع {user?.userType === 'doctor' ? 'المرضى' : 'الأطباء'}
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                الملف الشخصي
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تحديث معلوماتك الشخصية
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
