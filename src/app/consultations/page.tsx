'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.simple';
import { localDataService, Consultation, User } from '@/services/localDataService';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  UserIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function ConsultationsPage() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showNewConsultationModal, setShowNewConsultationModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterConsultations();
  }, [consultations, searchQuery, statusFilter, priorityFilter]);

  const loadData = () => {
    if (!user) return;

    try {
      let userConsultations: Consultation[] = [];
      
      if (user.role === 'admin') {
        userConsultations = localDataService.getConsultations();
      } else if (user.role === 'doctor') {
        userConsultations = localDataService.getConsultationsByUser(user.id, 'doctor');
      } else if (user.role === 'patient') {
        userConsultations = localDataService.getConsultationsByUser(user.id, 'patient');
      }

      setConsultations(userConsultations);

      // Load doctors and patients for admin view
      if (user.role === 'admin') {
        const allUsers = localDataService.getUsers();
        setDoctors(allUsers.filter(u => u.role === 'doctor'));
        setPatients(allUsers.filter(u => u.role === 'patient'));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading consultations:', error);
      setLoading(false);
    }
  };

  const filterConsultations = () => {
    let filtered = consultations;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(consultation =>
        consultation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.symptoms.some(symptom => 
          symptom.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(consultation => consultation.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(consultation => consultation.priority === priorityFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredConsultations(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <UserIcon className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'urgent':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'in_progress': return 'جاري';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      case 'urgent': return 'عاجل';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل جداً';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="w-4 h-4" />;
      case 'chat':
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case 'phone':
        return <PhoneIcon className="w-4 h-4" />;
      default:
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
    }
  };

  const getUserName = (userId: string, role: 'doctor' | 'patient') => {
    const allUsers = localDataService.getUsers();
    const user = allUsers.find(u => u.id === userId);
    return user ? user.fullName : 'غير معروف';
  };

  const handleDeleteConsultation = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الاستشارة؟')) {
      const success = localDataService.deleteConsultation(id);
      if (success) {
        loadData();
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">الاستشارات الطبية</h1>
            <p className="text-gray-600 mt-1">
              إدارة ومتابعة الاستشارات الطبية
            </p>
          </div>
          
          {(user?.role === 'patient' || user?.role === 'admin') && (
            <button
              onClick={() => setShowNewConsultationModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              استشارة جديدة
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الاستشارات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="in_progress">جاري</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
              <option value="urgent">عاجل</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الأولويات</option>
              <option value="urgent">عاجل جداً</option>
              <option value="high">عالي</option>
              <option value="medium">متوسط</option>
              <option value="low">منخفض</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <FunnelIcon className="w-4 h-4 ml-2" />
              {filteredConsultations.length} من {consultations.length} استشارة
            </div>
          </div>
        </div>

        {/* Consultations List */}
        <div className="space-y-4">
          {filteredConsultations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد استشارات</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'لا توجد استشارات تطابق معايير البحث'
                  : 'لم يتم إنشاء أي استشارات بعد'
                }
              </p>
            </div>
          ) : (
            filteredConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {consultation.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(consultation.status)}
                        <span className="text-sm font-medium text-gray-700">
                          {getStatusText(consultation.status)}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(consultation.priority)}`}>
                        {getPriorityText(consultation.priority)}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {consultation.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>
                          {user?.role === 'doctor' ? 'المريض: ' : 'الطبيب: '}
                          {user?.role === 'doctor' 
                            ? getUserName(consultation.patientId, 'patient')
                            : getUserName(consultation.doctorId, 'doctor')
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(consultation.type)}
                        <span>
                          {consultation.type === 'video' ? 'مكالمة مرئية' :
                           consultation.type === 'chat' ? 'محادثة نصية' : 'مكالمة صوتية'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>{formatDate(consultation.scheduledDate)}</span>
                      </div>
                    </div>

                    {consultation.symptoms.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-700">الأعراض: </span>
                        <span className="text-sm text-gray-600">
                          {consultation.symptoms.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => {/* Navigate to consultation details */}}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="عرض التفاصيل"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    
                    {(user?.role === 'admin' || 
                      (user?.role === 'doctor' && consultation.doctorId === user.id) ||
                      (user?.role === 'patient' && consultation.patientId === user.id)) && (
                      <>
                        <button
                          onClick={() => {/* Navigate to edit consultation */}}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteConsultation(consultation.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {consultation.fee && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">رسوم الاستشارة:</span>
                      <span className="font-semibold text-green-600">
                        {consultation.fee} ريال
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
