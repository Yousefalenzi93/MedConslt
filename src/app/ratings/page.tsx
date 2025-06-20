'use client';

// Force dynamic rendering to avoid static generation issues with event handlers
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { localDataService } from '@/services/localDataService';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ratingsData from '@/data/ratings.json';
import { 
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  CalendarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon,
  EyeIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Rating {
  id: string;
  doctorId: string;
  patientId: string;
  consultationId: string;
  rating: number;
  comment: string;
  aspects: {
    communication: number;
    expertise: number;
    punctuality: number;
    explanation: number;
    overall: number;
  };
  isAnonymous: boolean;
  isVerified: boolean;
  helpfulVotes: number;
  totalVotes: number;
  createdAt: string;
  updatedAt: string;
}

export default function RatingsPage() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [filteredRatings, setFilteredRatings] = useState<Rating[]>([]);
  const [doctorStats, setDoctorStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterRatings();
  }, [ratings, searchQuery, ratingFilter, sortBy, selectedDoctor]);

  const loadData = () => {
    if (!user) return;

    try {
      let userRatings: Rating[] = [];
      
      if (user.role === 'admin') {
        userRatings = ratingsData.ratings;
        setDoctorStats(ratingsData.doctorStats);
      } else if (user.role === 'doctor') {
        userRatings = ratingsData.ratings.filter(rating => rating.doctorId === user.id);
        const doctorStat = ratingsData.doctorStats.find(stat => stat.doctorId === user.id);
        setDoctorStats(doctorStat ? [doctorStat] : []);
      } else if (user.role === 'patient') {
        userRatings = ratingsData.ratings.filter(rating => rating.patientId === user.id);
      }

      setRatings(userRatings);

      // Load doctors for admin view
      if (user.role === 'admin') {
        const allUsers = localDataService.getUsers();
        setDoctors(allUsers.filter(u => u.role === 'doctor'));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading ratings:', error);
      setLoading(false);
    }
  };

  const filterRatings = () => {
    let filtered = ratings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(rating =>
        rating.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const ratingValue = parseInt(ratingFilter);
      filtered = filtered.filter(rating => rating.rating === ratingValue);
    }

    // Doctor filter
    if (selectedDoctor !== 'all') {
      filtered = filtered.filter(rating => rating.doctorId === selectedDoctor);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpfulVotes - a.helpfulVotes;
        default:
          return 0;
      }
    });

    setFilteredRatings(filtered);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = localDataService.getUserById(doctorId);
    return doctor ? doctor.fullName : 'طبيب غير معروف';
  };

  const getPatientName = (patientId: string, isAnonymous: boolean) => {
    if (isAnonymous) return 'مريض مجهول';
    const patient = localDataService.getUserById(patientId);
    return patient ? patient.fullName : 'مريض غير معروف';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAspectName = (aspect: string) => {
    const aspectNames: Record<string, string> = {
      communication: 'التواصل',
      expertise: 'الخبرة',
      punctuality: 'الالتزام بالوقت',
      explanation: 'وضوح الشرح',
      overall: 'التقييم العام'
    };
    return aspectNames[aspect] || aspect;
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <StarIcon className="w-7 h-7 text-yellow-500" />
              التقييمات والمراجعات
            </h1>
            <p className="text-gray-600 mt-1">
              تقييمات المرضى وآراؤهم حول الخدمات الطبية
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {doctorStats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctorStats.map((stat) => (
              <div key={stat.doctorId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {renderStars(stat.averageRating, 'lg')}
                    <span className="text-2xl font-bold text-gray-900">
                      {stat.averageRating}
                    </span>
                  </div>
                  <ChartBarIcon className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">إجمالي التقييمات:</span>
                    <span className="font-medium">{stat.totalRatings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">التصويتات المفيدة:</span>
                    <span className="font-medium">{stat.totalHelpfulVotes}</span>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">توزيع التقييمات:</h4>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-4">{rating}</span>
                      <StarIconSolid className="w-4 h-4 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${(stat.ratingDistribution[rating] / stat.totalRatings) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {stat.ratingDistribution[rating]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في التعليقات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع التقييمات</option>
              <option value="5">5 نجوم</option>
              <option value="4">4 نجوم</option>
              <option value="3">3 نجوم</option>
              <option value="2">2 نجوم</option>
              <option value="1">1 نجمة</option>
            </select>

            {/* Doctor Filter (Admin only) */}
            {user?.role === 'admin' && (
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الأطباء</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName}
                  </option>
                ))}
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="highest">الأعلى تقييماً</option>
              <option value="lowest">الأقل تقييماً</option>
              <option value="helpful">الأكثر فائدة</option>
            </select>
          </div>

          <div className="flex items-center text-sm text-gray-600 mt-4">
            <FunnelIcon className="w-4 h-4 ml-2" />
            {filteredRatings.length} من {ratings.length} تقييم
          </div>
        </div>

        {/* Ratings List */}
        <div className="space-y-4">
          {filteredRatings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <StarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقييمات</h3>
              <p className="text-gray-600">
                {searchQuery || ratingFilter !== 'all' || selectedDoctor !== 'all'
                  ? 'لا توجد تقييمات تطابق معايير البحث'
                  : 'لم يتم إضافة أي تقييمات بعد'
                }
              </p>
            </div>
          ) : (
            filteredRatings.map((rating) => (
              <div
                key={rating.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {getPatientName(rating.patientId, rating.isAnonymous)}
                        </h3>
                        {rating.isVerified && (
                          <CheckBadgeIcon className="w-5 h-5 text-blue-500" title="تقييم موثق" />
                        )}
                        {rating.isAnonymous && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            مجهول
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2">
                        {renderStars(rating.rating)}
                        <span className="text-sm text-gray-600">
                          للدكتور {getDoctorName(rating.doctorId)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{formatDate(rating.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{rating.comment}</p>
                </div>

                {/* Detailed Aspects */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  {Object.entries(rating.aspects).map(([aspect, score]) => (
                    <div key={aspect} className="text-center">
                      <div className="text-sm text-gray-600 mb-1">
                        {getAspectName(aspect)}
                      </div>
                      <div className="flex justify-center">
                        {renderStars(score, 'sm')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                      <HandThumbUpIcon className="w-4 h-4" />
                      <span>مفيد ({rating.helpfulVotes})</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
                      <HandThumbDownIcon className="w-4 h-4" />
                      <span>غير مفيد ({rating.totalVotes - rating.helpfulVotes})</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      <span>رد</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                      <EyeIcon className="w-4 h-4" />
                      <span>عرض الاستشارة</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
