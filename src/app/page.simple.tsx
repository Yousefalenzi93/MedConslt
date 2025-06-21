'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext.simple';
import Link from 'next/link';
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
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                منصة الاستشارات الطبية
              </h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            استشارات طبية متطورة
            <span className="text-blue-600 block">بتقنية الذكاء الاصطناعي</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            احصل على استشارة طبية فورية من أفضل الأطباء المتخصصين مع تقنيات متقدمة 
            للتشخيص والمتابعة الطبية الشاملة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center justify-center"
            >
              ابدأ الآن مجاناً
              <ArrowRightIcon className="mr-2 h-5 w-5" />
            </Link>
            <Link
              href="/consultations"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center justify-center"
            >
              تصفح الاستشارات
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              لماذا تختار منصتنا؟
            </h3>
            <p className="text-lg text-gray-600">
              نقدم أفضل الخدمات الطبية بتقنيات حديثة ومتطورة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <VideoCameraIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                مكالمات فيديو عالية الجودة
              </h4>
              <p className="text-gray-600">
                تواصل مع الأطباء عبر مكالمات فيديو آمنة وعالية الجودة
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <SparklesIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                ذكاء اصطناعي متطور
              </h4>
              <p className="text-gray-600">
                مساعد ذكي يساعدك في التشخيص الأولي والإرشادات الطبية
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <ClockIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                متاح 24/7
              </h4>
              <p className="text-gray-600">
                خدمة طبية متاحة على مدار الساعة لحالات الطوارئ
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <ShieldCheckIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                أمان وخصوصية
              </h4>
              <p className="text-gray-600">
                حماية كاملة لبياناتك الطبية وفقاً لأعلى معايير الأمان
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <UserGroupIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                أطباء متخصصون
              </h4>
              <p className="text-gray-600">
                فريق من أفضل الأطباء المعتمدين في جميع التخصصات
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <BookOpenIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                مكتبة طبية شاملة
              </h4>
              <p className="text-gray-600">
                مصادر طبية موثوقة ومقالات تثقيفية من خبراء الطب
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">طبيب متخصص</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">استشارة مكتملة</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">رضا المرضى</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">دعم متواصل</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            جاهز لبدء رحلتك الصحية؟
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            انضم إلى آلاف المرضى الذين يثقون في خدماتنا الطبية المتطورة
          </p>
          <Link
            href="/auth/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center"
          >
            ابدأ الآن
            <ArrowRightIcon className="mr-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <HeartIcon className="h-8 w-8 text-blue-400 ml-3" />
              <h4 className="text-xl font-bold">منصة الاستشارات الطبية</h4>
            </div>
            <p className="text-gray-400 mb-4">
              نحو مستقبل أفضل للرعاية الصحية الرقمية
            </p>
            <p className="text-sm text-gray-500">
              © 2024 منصة الاستشارات الطبية. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
