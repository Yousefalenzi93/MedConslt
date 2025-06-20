'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              حدث خطأ غير متوقع
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              نعتذر، حدث خطأ أثناء تحميل الصفحة
            </p>
          </div>

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
                    <p>{error.message || 'خطأ غير معروف'}</p>
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

          <div className="mt-6 space-y-3">
            <button
              onClick={reset}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              إذا استمر الخطأ، يرجى التواصل مع الدعم الفني
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
