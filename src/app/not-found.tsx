import Link from 'next/link';
import { ExclamationTriangleIcon, HomeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* 404 Icon */}
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
            </div>

            {/* 404 Number */}
            <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
            
            {/* Error Message */}
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              الصفحة غير موجودة
            </h2>
            <p className="mt-2 text-base text-gray-600">
              عذراً، لا يمكن العثور على الصفحة التي تبحث عنها
            </p>
          </div>

          {/* Suggestions */}
          <div className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                اقتراحات مفيدة:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• تحقق من صحة الرابط</li>
                <li>• تأكد من كتابة العنوان بشكل صحيح</li>
                <li>• جرب العودة للصفحة الرئيسية</li>
                <li>• استخدم قائمة التنقل للوصول للصفحات</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Link
              href="/"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <HomeIcon className="w-4 h-4 ml-2" />
              العودة للصفحة الرئيسية
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowRightIcon className="w-4 h-4 ml-2" />
              العودة للصفحة السابقة
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              روابط سريعة:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/consultations"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                الاستشارات
              </Link>
              <Link
                href="/messages"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                الرسائل
              </Link>
              <Link
                href="/library"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                المكتبة الطبية
              </Link>
              <Link
                href="/support"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                الدعم الفني
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم الفني
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
