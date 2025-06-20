import { HeartIcon } from '@heroicons/react/24/outline';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col justify-center items-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="animate-pulse">
            <HeartIcon className="w-16 h-16 text-blue-600 mx-auto" />
          </div>
          <div className="absolute inset-0 animate-ping">
            <HeartIcon className="w-16 h-16 text-blue-400 mx-auto opacity-75" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          منصة الاستشارات الطبية
        </h2>
        <p className="text-gray-600 mb-8">
          جاري تحميل النظام...
        </p>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-blue-600 font-medium">يرجى الانتظار</span>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center items-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 bg-gray-200 rounded-full h-2 mt-8">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>

        {/* Loading Steps */}
        <div className="mt-8 text-sm text-gray-500 space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>تحميل البيانات</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>إعداد الواجهة</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>تهيئة النظام</span>
          </div>
        </div>
      </div>
    </div>
  );
}
