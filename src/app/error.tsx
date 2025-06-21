'use client';

import Link from 'next/link';

export default function Error() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">خطأ</h1>
        <p className="text-gray-600 mb-8">حدث خطأ غير متوقع</p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
