import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Users, 
  Stethoscope,
  MessageSquare,
  Star,
  CheckCircle
} from 'lucide-react'

const Home = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: Stethoscope,
      title: t('home.features.consultation.title'),
      description: t('home.features.consultation.description'),
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: t('home.features.secure.title'),
      description: t('home.features.secure.description'),
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: t('home.features.available.title'),
      description: t('home.features.available.description'),
      color: 'text-purple-600'
    }
  ]

  const stats = [
    { number: '1000+', label: 'طبيب معتمد' },
    { number: '50000+', label: 'استشارة مكتملة' },
    { number: '4.9', label: 'تقييم المستخدمين' },
    { number: '24/7', label: 'دعم متواصل' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                {t('home.getStarted')}
                <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-semibold rounded-lg border border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('home.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              نقدم لك أفضل الخدمات الطبية الرقمية مع ضمان الجودة والأمان
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-full shadow-md mb-6">
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 dark:bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              كيف يعمل التطبيق؟
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              خطوات بسيطة للحصول على استشارة طبية موثوقة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'إنشاء حساب',
                description: 'سجل حسابك واملأ بياناتك الطبية الأساسية'
              },
              {
                step: '2',
                title: 'اختر طبيبك',
                description: 'تصفح قائمة الأطباء المعتمدين واختر المناسب لحالتك'
              },
              {
                step: '3',
                title: 'احصل على الاستشارة',
                description: 'تواصل مع الطبيب واحصل على التشخيص والعلاج المناسب'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            ابدأ رحلتك الصحية اليوم
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            انضم إلى آلاف المرضى الذين يثقون في خدماتنا الطبية الرقمية
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            ابدأ الآن مجاناً
            <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
