import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-600 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة.
        </p>
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
            
            <Link
              href="/"
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowRightIcon className="w-4 h-4 ml-2" />
              العودة للصفحة الرئيسية
            </Link>
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
