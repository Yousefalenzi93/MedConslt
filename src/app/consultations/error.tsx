'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ConsultationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Consultations page error:', error);
  }, [error]);

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              خطأ في تحميل الاستشارات
            </h2>
            <p className="text-gray-600 mb-4">
              حدث خطأ أثناء تحميل صفحة الاستشارات
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-700">{error.message}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={reset}
                className="w-full flex justify-center items-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4 ml-2" />
                إعادة المحاولة
              </button>
              
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                العودة للوحة التحكم
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
