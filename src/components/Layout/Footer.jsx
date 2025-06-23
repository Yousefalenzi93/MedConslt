import React from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Shield, Clock } from 'lucide-react'

const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="ml-2 rtl:ml-0 rtl:mr-2 text-xl font-bold text-gray-900 dark:text-white">
                {t('home.title')}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              {t('home.subtitle')}
            </p>
            <div className="flex space-x-6 rtl:space-x-reverse">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Shield className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-green-500" />
                آمن ومحمي
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-blue-500" />
                24/7 متاح
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  من نحن
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  خدماتنا
                </a>
              </li>
              <li>
                <a href="/doctors" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  الأطباء
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              الدعم
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  مركز المساعدة
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  شروط الاستخدام
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} منصة الاستشارات الطبية. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-500 dark:text-gray-400 text-sm mr-2 rtl:mr-0 rtl:ml-2">
                صنع بـ
              </span>
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2 rtl:ml-0 rtl:mr-2">
                في المملكة العربية السعودية
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
