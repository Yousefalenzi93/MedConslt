import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Search, Filter, Calendar, Clock, User, Stethoscope } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Consultations = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - in real app, this would come from API
  const consultations = [
    {
      id: 1,
      patientName: user?.userType === 'doctor' ? 'فاطمة أحمد' : 'د. أحمد محمد',
      specialty: 'طب عام',
      date: '2024-01-15',
      time: '14:30',
      status: 'completed',
      symptoms: 'صداع مستمر وحمى خفيفة',
      urgency: 'medium',
      type: user?.userType === 'doctor' ? 'patient' : 'doctor'
    },
    {
      id: 2,
      patientName: user?.userType === 'doctor' ? 'محمد علي' : 'د. سارة خالد',
      specialty: 'طب الأطفال',
      date: '2024-01-14',
      time: '10:15',
      status: 'active',
      symptoms: 'ألم في البطن عند الطفل',
      urgency: 'high',
      type: user?.userType === 'doctor' ? 'patient' : 'doctor'
    },
    {
      id: 3,
      patientName: user?.userType === 'doctor' ? 'نورا سالم' : 'د. عبدالله حسن',
      specialty: 'طب النساء',
      date: '2024-01-13',
      time: '16:45',
      status: 'pending',
      symptoms: 'استشارة حول الحمل',
      urgency: 'low',
      type: user?.userType === 'doctor' ? 'patient' : 'doctor'
    },
    {
      id: 4,
      patientName: user?.userType === 'doctor' ? 'خالد محمود' : 'د. ليلى أحمد',
      specialty: 'طب القلب',
      date: '2024-01-12',
      time: '09:00',
      status: 'cancelled',
      symptoms: 'ألم في الصدر',
      urgency: 'emergency',
      type: user?.userType === 'doctor' ? 'patient' : 'doctor'
    }
  ]

  const tabs = [
    { id: 'all', label: 'الكل', count: consultations.length },
    { id: 'pending', label: t('consultations.pending'), count: consultations.filter(c => c.status === 'pending').length },
    { id: 'active', label: t('consultations.active'), count: consultations.filter(c => c.status === 'active').length },
    { id: 'completed', label: t('consultations.completed'), count: consultations.filter(c => c.status === 'completed').length },
    { id: 'cancelled', label: t('consultations.cancelled'), count: consultations.filter(c => c.status === 'cancelled').length }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
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
      case 'cancelled':
        return 'ملغاة'
      default:
        return 'غير محدد'
    }
  }

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'emergency':
        return 'طارئ'
      case 'high':
        return 'عالي'
      case 'medium':
        return 'متوسط'
      case 'low':
        return 'منخفض'
      default:
        return 'غير محدد'
    }
  }

  const filteredConsultations = consultations.filter(consultation => {
    const matchesTab = activeTab === 'all' || consultation.status === activeTab
    const matchesSearch = consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('consultations.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {user?.userType === 'doctor' 
              ? 'إدارة جميع الاستشارات الطبية الخاصة بك'
              : 'عرض وإدارة استشاراتك الطبية'
            }
          </p>
        </div>
        
        {user?.userType === 'patient' && (
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('consultations.new')}
            </button>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث في الاستشارات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <Filter className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            تصفية
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 rtl:space-x-reverse px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                {tab.label}
                <span className="ml-2 rtl:ml-0 rtl:mr-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Consultations List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredConsultations.length === 0 ? (
            <div className="p-12 text-center">
              <Stethoscope className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                لا توجد استشارات
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'all' 
                  ? 'لم تقم بأي استشارات بعد'
                  : `لا توجد استشارات ${tabs.find(t => t.id === activeTab)?.label}`
                }
              </p>
              {user?.userType === 'patient' && (
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    طلب استشارة جديدة
                  </button>
                </div>
              )}
            </div>
          ) : (
            filteredConsultations.map((consultation) => (
              <div key={consultation.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {consultation.patientName}
                        </h3>
                        <div className={`w-3 h-3 rounded-full ${getUrgencyColor(consultation.urgency)}`} title={`الإلحاح: ${getUrgencyText(consultation.urgency)}`}></div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {consultation.specialty}
                      </p>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {consultation.symptoms}
                      </p>
                      
                      <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                          {consultation.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                          {consultation.time}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                      {getStatusText(consultation.status)}
                    </span>
                    
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      {consultation.status === 'active' && (
                        <button className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium">
                          متابعة
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-500 dark:text-gray-400 text-sm font-medium">
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Consultations
