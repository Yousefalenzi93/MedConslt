'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext.simple';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';
import {
  HeartIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChartBarIcon,
  BellIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  CpuChipIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Dynamic imports to avoid SSR issues with event handlers
const AIAssistant = dynamicImport(() => import('@/components/AIAssistant'), {
  ssr: false,
  loading: () => <div className="fixed bottom-6 left-6 w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
});

const SmartNotifications = dynamicImport(() => import('@/components/SmartNotifications'), {
  ssr: false,
  loading: () => <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
});

const SmartSearch = dynamicImport(() => import('@/components/SmartSearch'), {
  ssr: false,
  loading: () => <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
});

const DemoData = dynamicImport(() => import('@/components/demo/DemoData'), {
  ssr: false
});

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "منصة الاستشارات الطبية المتطورة",
      subtitle: "تواصل مع أفضل الأطباء في المملكة",
      description: "احصل على استشارة طبية فورية من أطباء معتمدين مع تقنيات الذكاء الاصطناعي",
      image: "/images/hero-1.jpg",
      cta: "ابدأ الآن"
    },
    {
      title: "مكالمات فيديو عالية الجودة",
      subtitle: "تقنية WebRTC المتقدمة",
      description: "استشارات مرئية آمنة ومشفرة مع جودة HD",
      image: "/images/hero-2.jpg",
      cta: "جرب المكالمة"
    },
    {
      title: "مساعد ذكي بالذكاء الاصطناعي",
      subtitle: "إرشاد طبي ذكي 24/7",
      description: "احصل على إجابات فورية وإرشادات طبية من المساعد الذكي",
      image: "/images/hero-3.jpg",
      cta: "تحدث مع المساعد"
    }
  ];

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        setShowDemo(true);
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <SparklesIcon className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">جاري تحميل المنصة الطبية المتطورة...</p>
        </div>
      </div>
    );
  }

  if (showDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">منصة الاستشارات الطبية</h1>
                  <p className="text-xs text-gray-600">تقنية متطورة • أطباء معتمدون</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <SmartSearch />
                <SmartNotifications />
                <Link
                  href="/auth/login"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    <SparklesIcon className="w-4 h-4" />
                    جديد: مساعد ذكي بالذكاء الاصطناعي
                  </div>
                  <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <h2 className="text-2xl text-blue-600 font-semibold">
                    {heroSlides[currentSlide].subtitle}
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {heroSlides[currentSlide].description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 group">
                    {heroSlides[currentSlide].cta}
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2">
                    <PlayIcon className="w-5 h-5" />
                    شاهد العرض التوضيحي
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">1000+</div>
                    <div className="text-gray-600">طبيب معتمد</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">50K+</div>
                    <div className="text-gray-600">استشارة مكتملة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">4.9</div>
                    <div className="text-gray-600">تقييم المرضى</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">استشارة فورية</h3>
                        <p className="text-gray-600">متاح 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <ShieldCheckIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">آمن ومشفر</h3>
                        <p className="text-gray-600">حماية كاملة للبيانات</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <CpuChipIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">ذكاء اصطناعي</h3>
                        <p className="text-gray-600">مساعد ذكي متطور</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 blur-3xl"></div>
              </div>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </section>

        <DemoData />
        <AIAssistant />
      </div>
    );
  }

  return null;
}
