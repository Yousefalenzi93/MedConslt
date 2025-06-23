import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, BookOpen, Download, Share, Bookmark, Eye, Calendar, User } from 'lucide-react'

const Library = () => {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const categories = [
    { id: 'all', name: 'الكل', count: 24 },
    { id: 'general', name: 'طب عام', count: 8 },
    { id: 'cardiology', name: 'طب القلب', count: 5 },
    { id: 'pediatrics', name: 'طب الأطفال', count: 6 },
    { id: 'gynecology', name: 'طب النساء', count: 3 },
    { id: 'neurology', name: 'طب الأعصاب', count: 2 }
  ]

  const articles = [
    {
      id: 1,
      title: 'أحدث التطورات في علاج أمراض القلب',
      description: 'مراجعة شاملة للتقنيات الحديثة في علاج أمراض القلب والأوعية الدموية',
      category: 'cardiology',
      author: 'د. أحمد محمد',
      date: '2024-01-15',
      readTime: '15 دقيقة',
      views: 1250,
      bookmarked: true,
      image: '/images/cardiology.jpg',
      tags: ['قلب', 'علاج', 'تقنيات حديثة']
    },
    {
      id: 2,
      title: 'التغذية السليمة للأطفال في السنوات الأولى',
      description: 'دليل شامل للتغذية الصحية للأطفال من الولادة حتى سن الخامسة',
      category: 'pediatrics',
      author: 'د. فاطمة أحمد',
      date: '2024-01-12',
      readTime: '12 دقيقة',
      views: 980,
      bookmarked: false,
      image: '/images/pediatrics.jpg',
      tags: ['أطفال', 'تغذية', 'صحة']
    },
    {
      id: 3,
      title: 'الوقاية من الأمراض المعدية',
      description: 'أهمية النظافة الشخصية والتطعيمات في الوقاية من الأمراض المعدية',
      category: 'general',
      author: 'د. محمد علي',
      date: '2024-01-10',
      readTime: '8 دقائق',
      views: 1500,
      bookmarked: true,
      image: '/images/prevention.jpg',
      tags: ['وقاية', 'أمراض معدية', 'تطعيمات']
    },
    {
      id: 4,
      title: 'صحة المرأة أثناء الحمل',
      description: 'نصائح مهمة للحفاظ على صحة الأم والجنين أثناء فترة الحمل',
      category: 'gynecology',
      author: 'د. سارة خالد',
      date: '2024-01-08',
      readTime: '20 دقيقة',
      views: 750,
      bookmarked: false,
      image: '/images/pregnancy.jpg',
      tags: ['حمل', 'صحة المرأة', 'رعاية']
    },
    {
      id: 5,
      title: 'اضطرابات النوم وعلاجها',
      description: 'فهم أسباب اضطرابات النوم والطرق الحديثة لعلاجها',
      category: 'neurology',
      author: 'د. عبدالله حسن',
      date: '2024-01-05',
      readTime: '18 دقيقة',
      views: 650,
      bookmarked: true,
      image: '/images/sleep.jpg',
      tags: ['نوم', 'اضطرابات', 'علاج']
    },
    {
      id: 6,
      title: 'أهمية الفحص الدوري للصحة العامة',
      description: 'لماذا يجب إجراء فحوصات دورية وما هي الفحوصات الأساسية المطلوبة',
      category: 'general',
      author: 'د. ليلى أحمد',
      date: '2024-01-03',
      readTime: '10 دقائق',
      views: 1100,
      bookmarked: false,
      image: '/images/checkup.jpg',
      tags: ['فحص دوري', 'وقاية', 'صحة عامة']
    }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleBookmark = (articleId) => {
    // Here you would update the bookmark status in your backend
    console.log('Toggle bookmark for article:', articleId)
  }

  const handleShare = (article) => {
    // Here you would implement sharing functionality
    console.log('Share article:', article.title)
  }

  const handleDownload = (article) => {
    // Here you would implement download functionality
    console.log('Download article:', article.title)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('library.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            مكتبة شاملة من المقالات والأبحاث الطبية المحدثة
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث في المقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <Filter className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            تصفية متقدمة
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('library.categories')}
          </h3>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {category.name}
                <span className="ml-2 rtl:ml-0 rtl:mr-2 text-xs opacity-75">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            {/* Article Image */}
            <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-primary-600 dark:text-primary-400" />
            </div>
            
            {/* Article Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                  {categories.find(c => c.id === article.category)?.name}
                </span>
                <button
                  onClick={() => handleBookmark(article.id)}
                  className={`p-1 rounded-full transition-colors ${
                    article.bookmarked
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${article.bookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {article.description}
              </p>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4 space-x-4 rtl:space-x-reverse">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                  {article.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                  {article.date}
                </div>
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                  {article.views}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {article.readTime}
                </span>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => handleShare(article)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="مشاركة"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDownload(article)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="تحميل"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                    {t('library.readMore')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            لا توجد مقالات
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            لم يتم العثور على مقالات تطابق البحث الحالي
          </p>
        </div>
      )}
    </div>
  )
}

export default Library
