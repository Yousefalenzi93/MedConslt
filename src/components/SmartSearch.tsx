'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  HeartIcon,
  SparklesIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface SearchResult {
  id: string;
  type: 'doctor' | 'patient' | 'consultation' | 'document' | 'medication' | 'symptom';
  title: string;
  subtitle: string;
  description: string;
  relevance: number;
  category: string;
  tags: string[];
  url: string;
  metadata?: {
    specialty?: string;
    rating?: number;
    lastActive?: Date;
    status?: string;
  };
}

interface SearchFilters {
  type: string[];
  category: string[];
  dateRange: string;
  sortBy: 'relevance' | 'date' | 'rating';
}

export default function SmartSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    category: [],
    dateRange: 'all',
    sortBy: 'relevance'
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'doctor',
      title: 'د. أحمد محمد علي',
      subtitle: 'استشاري طب القلب',
      description: 'خبرة 15 سنة في طب القلب والأوعية الدموية',
      relevance: 95,
      category: 'أطباء',
      tags: ['طب القلب', 'قسطرة', 'ضغط الدم'],
      url: '/doctors/1',
      metadata: {
        specialty: 'طب القلب',
        rating: 4.9,
        lastActive: new Date(),
        status: 'متاح'
      }
    },
    {
      id: '2',
      type: 'consultation',
      title: 'استشارة حول آلام الصدر',
      subtitle: 'مريض: محمد أحمد',
      description: 'استشارة طبية حول آلام الصدر المتكررة',
      relevance: 88,
      category: 'استشارات',
      tags: ['آلام الصدر', 'طب القلب', 'عاجل'],
      url: '/consultations/2',
      metadata: {
        status: 'مكتملة'
      }
    },
    {
      id: '3',
      type: 'document',
      title: 'دليل علاج ارتفاع ضغط الدم',
      subtitle: 'وثيقة طبية',
      description: 'دليل شامل لعلاج ارتفاع ضغط الدم وإدارته',
      relevance: 82,
      category: 'مكتبة طبية',
      tags: ['ضغط الدم', 'علاج', 'إرشادات'],
      url: '/library/3'
    },
    {
      id: '4',
      type: 'medication',
      title: 'أتينولول 50 مجم',
      subtitle: 'دواء لعلاج ضغط الدم',
      description: 'دواء من مجموعة حاصرات بيتا لعلاج ارتفاع ضغط الدم',
      relevance: 78,
      category: 'أدوية',
      tags: ['ضغط الدم', 'حاصرات بيتا', 'قلب'],
      url: '/medications/4'
    },
    {
      id: '5',
      type: 'symptom',
      title: 'ضيق التنفس',
      subtitle: 'عرض طبي',
      description: 'معلومات حول أسباب وعلاج ضيق التنفس',
      relevance: 75,
      category: 'أعراض',
      tags: ['تنفس', 'رئة', 'قلب'],
      url: '/symptoms/5'
    }
  ];

  const searchSuggestions = [
    'طب القلب',
    'آلام الصدر',
    'ضغط الدم',
    'السكري',
    'طب الأطفال',
    'طب النساء',
    'الصداع',
    'الحمى',
    'آلام المعدة',
    'الأرق'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      
      // Simulate API call delay
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase()) ||
          result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        // Apply filters
        let filteredResults = filtered;
        
        if (filters.type.length > 0) {
          filteredResults = filteredResults.filter(r => filters.type.includes(r.type));
        }
        
        if (filters.category.length > 0) {
          filteredResults = filteredResults.filter(r => filters.category.includes(r.category));
        }

        // Sort results
        filteredResults.sort((a, b) => {
          switch (filters.sortBy) {
            case 'rating':
              return (b.metadata?.rating || 0) - (a.metadata?.rating || 0);
            case 'date':
              return (b.metadata?.lastActive?.getTime() || 0) - (a.metadata?.lastActive?.getTime() || 0);
            default:
              return b.relevance - a.relevance;
          }
        });

        setResults(filteredResults);
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = searchSuggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase()) && s !== query
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setQuery(searchQuery);
      
      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'doctor':
        return UserIcon;
      case 'consultation':
        return HeartIcon;
      case 'document':
        return DocumentTextIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getResultColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'doctor':
        return 'text-blue-600 bg-blue-100';
      case 'consultation':
        return 'text-green-600 bg-green-100';
      case 'document':
        return 'text-purple-600 bg-purple-100';
      case 'medication':
        return 'text-orange-600 bg-orange-100';
      case 'symptom':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-full max-w-md"
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        <span className="text-gray-500 text-right flex-1">البحث في المنصة...</span>
        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs text-gray-600">Ctrl+K</kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث عن أطباء، استشارات، أدوية..."
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 mt-3">
                <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors">
                  <FunnelIcon className="w-4 h-4" />
                  فلاتر
                </button>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">الأكثر صلة</option>
                  <option value="date">الأحدث</option>
                  <option value="rating">الأعلى تقييماً</option>
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {query.length === 0 ? (
                <div className="p-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          عمليات البحث الأخيرة
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          مسح الكل
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4" />
                      اقتراحات البحث
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {searchSuggestions.slice(0, 8).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(suggestion)}
                          className="p-3 text-right bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span className="text-sm text-gray-700">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="border-b border-gray-100">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(suggestion)}
                          className="w-full p-3 text-right hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Results */}
                  <div className="p-4">
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 mb-4">
                          {results.length} نتيجة للبحث عن "{query}"
                        </p>
                        {results.map((result) => {
                          const Icon = getResultIcon(result.type);
                          const colorClass = getResultColor(result.type);
                          
                          return (
                            <div
                              key={result.id}
                              className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {result.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 mb-1">
                                    {result.subtitle}
                                  </p>
                                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                                    {result.description}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                      {result.category}
                                    </span>
                                    {result.metadata?.rating && (
                                      <span className="text-xs text-yellow-600">
                                        ⭐ {result.metadata.rating}
                                      </span>
                                    )}
                                    {result.metadata?.status && (
                                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        {result.metadata.status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">لا توجد نتائج للبحث عن "{query}"</p>
                        <p className="text-sm text-gray-400 mt-1">جرب كلمات مفتاحية أخرى</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
