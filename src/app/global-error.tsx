'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50">
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                {/* Error Icon */}
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
                  <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
                </div>

                {/* Error Title */}
                <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
                  خطأ في النظام
                </h1>
                
                {/* Error Description */}
                <p className="mt-2 text-base text-gray-600">
                  حدث خطأ غير متوقع في منصة الاستشارات الطبية
                </p>
              </div>

              {/* Error Details */}
              <div className="mt-6">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="mr-3">
                      <h3 className="text-sm font-medium text-red-800">
                        تفاصيل الخطأ
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error.message || 'خطأ غير معروف في النظام'}</p>
                        {error.digest && (
                          <p className="mt-1 text-xs text-red-600">
                            معرف الخطأ: {error.digest}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={reset}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <ArrowPathIcon className="w-4 h-4 ml-2" />
                  إعادة تحميل النظام
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <HomeIcon className="w-4 h-4 ml-2" />
                  العودة للصفحة الرئيسية
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  إعادة تحميل الصفحة
                </button>
              </div>

              {/* Help Information */}
              <div className="mt-8">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    خطوات استكشاف الأخطاء:
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• تحديث الصفحة (F5)</li>
                    <li>• مسح ذاكرة التخزين المؤقت</li>
                    <li>• التحقق من اتصال الإنترنت</li>
                    <li>• إعادة تشغيل المتصفح</li>
                  </ul>
                </div>
              </div>

              {/* System Information */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  منصة الاستشارات الطبية - نظام إدارة الرعاية الصحية
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  إذا استمر الخطأ، يرجى التواصل مع الدعم الفني
                </p>
              </div>

              {/* Technical Details (for development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6">
                  <details className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                      تفاصيل تقنية (للمطورين)
                    </summary>
                    <div className="mt-2 text-xs text-gray-600 font-mono">
                      <pre className="whitespace-pre-wrap break-words">
                        {error.stack || error.toString()}
                      </pre>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
