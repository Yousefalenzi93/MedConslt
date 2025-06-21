'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.simple';
import DashboardLayout from '@/components/layout/DashboardLayout';
import libraryData from '@/data/medical-library.json';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  StarIcon,
  TagIcon,
  CalendarIcon,
  UserIcon,
  BookOpenIcon,
  AcademicCapIcon,
  HeartIcon,
  BeakerIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  author: string;
  language: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl: string;
  tags: string[];
  keywords: string[];
  rating: number;
  downloads: number;
  views: number;
  isPublic: boolean;
  isPremium: boolean;
  uploadedBy: string;
  approvedBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export default function MedicalLibraryPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [categories] = useState(libraryData.categories);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchQuery, selectedCategory, selectedSubcategory, sortBy]);

  const loadDocuments = () => {
    try {
      // Filter documents based on user role and status
      let availableDocuments = libraryData.documents.filter(doc => {
        if (user?.role === 'admin') return true;
        return doc.status === 'approved' && doc.isPublic;
      });

      setDocuments(availableDocuments);
      setLoading(false);
    } catch (error) {
      console.error('Error loading documents:', error);
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(doc => doc.subcategory === selectedSubcategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'views':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title, 'ar');
        default:
          return 0;
      }
    });

    setFilteredDocuments(filtered);
  };

  const getSubcategories = () => {
    if (selectedCategory === 'all') return [];
    const category = categories.find(cat => cat.name === selectedCategory);
    return category?.subcategories || [];
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'أمراض القلب':
        return <HeartIcon className="w-5 h-5" />;
      case 'طب الأطفال':
        return <UserIcon className="w-5 h-5" />;
      case 'طب الطوارئ':
        return <BeakerIcon className="w-5 h-5" />;
      case 'التغذية العلاجية':
        return <AcademicCapIcon className="w-5 h-5" />;
      case 'علم الأدوية':
        return <CpuChipIcon className="w-5 h-5" />;
      case 'الأشعة التشخيصية':
        return <EyeIcon className="w-5 h-5" />;
      default:
        return <BookOpenIcon className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = (document: Document) => {
    // Simulate download
    console.log('Downloading:', document.title);
    // In a real app, this would trigger the actual download
  };

  const handleView = (document: Document) => {
    // Simulate view
    console.log('Viewing:', document.title);
    // In a real app, this would open the document viewer
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpenIcon className="w-7 h-7 text-blue-600" />
              المكتبة الطبية
            </h1>
            <p className="text-gray-600 mt-1">
              مجموعة شاملة من المراجع والوثائق الطبية
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في المكتبة الطبية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('all');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع التصنيفات</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Subcategory Filter */}
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={selectedCategory === 'all'}
            >
              <option value="all">جميع التصنيفات الفرعية</option>
              {getSubcategories().map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="downloads">الأكثر تحميلاً</option>
              <option value="views">الأكثر مشاهدة</option>
              <option value="title">الاسم (أ-ي)</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <FunnelIcon className="w-4 h-4 ml-2" />
              {filteredDocuments.length} من {documents.length} وثيقة
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{ color: selectedCategory === category.name ? category.color : undefined }}
                >
                  {getCategoryIcon(category.name)}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredDocuments.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد وثائق</h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== 'all' || selectedSubcategory !== 'all'
                  ? 'لا توجد وثائق تطابق معايير البحث'
                  : 'لم يتم رفع أي وثائق بعد'
                }
              </p>
            </div>
          ) : (
            filteredDocuments.map((document) => (
              <div
                key={document.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'p-4' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(document.category)}
                        <span className="text-sm font-medium text-blue-600">
                          {document.category}
                        </span>
                      </div>
                      {document.isPremium && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                          مميز
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {document.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {document.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span>{document.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>{document.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4" />
                        <span>{document.views}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {document.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {document.tags.length > 3 && (
                        <span className="text-gray-400 text-xs">
                          +{document.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-4 h-4" />
                          <span>{document.author}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(document.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(document)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(document)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="تحميل"
                        >
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {document.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                            {document.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{document.category}</span>
                            <span>•</span>
                            <span>{document.author}</span>
                            <span>•</span>
                            <span>{formatFileSize(document.fileSize)}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <StarIcon className="w-4 h-4 text-yellow-500" />
                              <span>{document.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleView(document)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownload(document)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="تحميل"
                          >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
