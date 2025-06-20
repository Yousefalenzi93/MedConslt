// محسن الأداء والفهرسة للمنصة الطبية
import { LocalDB, QueryOptions } from './LocalDB';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
  size: number;
}

export interface IndexEntry {
  value: any;
  records: string[];
}

export interface PerformanceMetrics {
  queryTime: number;
  cacheHits: number;
  cacheMisses: number;
  indexHits: number;
  totalQueries: number;
  averageQueryTime: number;
}

export class PerformanceOptimizer {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private indexes: Map<string, Map<any, string[]>> = new Map();
  private metrics: PerformanceMetrics = {
    queryTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
    indexHits: 0,
    totalQueries: 0,
    averageQueryTime: 0
  };
  
  private readonly maxCacheSize = 1000;
  private readonly maxIndexSize = 500;
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 دقائق

  constructor(private db: LocalDB) {
    this.startCleanupTimer();
  }

  // تحسين الاستعلامات مع التخزين المؤقت
  async optimizedQuery<T>(
    storeName: string,
    queryKey: string,
    queryFn: () => Promise<T>,
    options?: { ttl?: number; useCache?: boolean }
  ): Promise<T> {
    const startTime = performance.now();
    this.metrics.totalQueries++;

    const useCache = options?.useCache !== false;
    const ttl = options?.ttl || this.cacheTimeout;

    // التحقق من التخزين المؤقت
    if (useCache) {
      const cached = this.getFromCache<T>(queryKey);
      if (cached) {
        this.metrics.cacheHits++;
        this.updateMetrics(performance.now() - startTime);
        return cached;
      }
    }

    // تنفيذ الاستعلام
    const result = await queryFn();
    
    // حفظ في التخزين المؤقت
    if (useCache) {
      this.setCache(queryKey, result, ttl);
      this.metrics.cacheMisses++;
    }

    this.updateMetrics(performance.now() - startTime);
    return result;
  }

  // بحث محسن بالفهارس
  async optimizedSearch<T>(
    storeName: string,
    field: string,
    value: any,
    options?: QueryOptions
  ): Promise<T[]> {
    const indexKey = `${storeName}_${field}`;
    
    // التحقق من وجود فهرس
    if (!this.indexes.has(indexKey)) {
      await this.buildIndex(storeName, field);
    }

    const index = this.indexes.get(indexKey);
    if (index && index.has(value)) {
      this.metrics.indexHits++;
      const recordIds = index.get(value) || [];
      
      // جلب السجلات بالمعرفات
      const results: T[] = [];
      for (const id of recordIds) {
        const record = await this.db.get<T>(storeName, id);
        if (record) {
          results.push(record);
        }
      }

      // تطبيق خيارات الاستعلام
      return this.applyQueryOptions(results, options);
    }

    // البحث التقليدي إذا لم يوجد فهرس
    return this.db.findByIndex<T>(storeName, field, value, options);
  }

  // بحث نصي متقدم
  async fullTextSearch<T>(
    storeName: string,
    query: string,
    fields: string[],
    options?: QueryOptions & { fuzzy?: boolean; minScore?: number }
  ): Promise<Array<T & { score: number }>> {
    const allRecords = await this.db.getAll<T>(storeName);
    const results: Array<T & { score: number }> = [];

    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);

    for (const record of allRecords) {
      let score = 0;
      
      for (const field of fields) {
        const fieldValue = (record as any)[field];
        if (typeof fieldValue === 'string') {
          const fieldText = fieldValue.toLowerCase();
          
          // حساب النقاط بناءً على التطابق
          for (const term of queryTerms) {
            if (fieldText.includes(term)) {
              // تطابق كامل
              score += 10;
              
              // نقاط إضافية للتطابق في بداية النص
              if (fieldText.startsWith(term)) {
                score += 5;
              }
              
              // نقاط إضافية للتطابق الكامل للكلمة
              const wordBoundary = new RegExp(`\\b${term}\\b`);
              if (wordBoundary.test(fieldText)) {
                score += 3;
              }
            } else if (options?.fuzzy) {
              // البحث الضبابي
              const similarity = this.calculateSimilarity(term, fieldText);
              if (similarity > 0.7) {
                score += similarity * 5;
              }
            }
          }
        }
      }

      const minScore = options?.minScore || 1;
      if (score >= minScore) {
        results.push({ ...record, score });
      }
    }

    // ترتيب النتائج حسب النقاط
    results.sort((a, b) => b.score - a.score);

    // تطبيق خيارات الاستعلام
    return this.applyQueryOptions(results, options) as Array<T & { score: number }>;
  }

  // بناء فهرس لحقل معين
  async buildIndex(storeName: string, field: string): Promise<void> {
    console.log(`🔍 بناء فهرس لـ ${storeName}.${field}`);
    
    const indexKey = `${storeName}_${field}`;
    const index = new Map<any, string[]>();

    const allRecords = await this.db.getAll(storeName);
    
    for (const record of allRecords) {
      const value = (record as any)[field];
      const id = (record as any).id;
      
      if (value !== undefined && value !== null) {
        if (!index.has(value)) {
          index.set(value, []);
        }
        index.get(value)!.push(id);
      }
    }

    this.indexes.set(indexKey, index);
    console.log(`✅ تم بناء فهرس ${indexKey} مع ${index.size} قيمة فريدة`);
  }

  // إعادة بناء جميع الفهارس
  async rebuildAllIndexes(): Promise<void> {
    console.log('🔄 إعادة بناء جميع الفهارس...');
    
    this.indexes.clear();
    
    // بناء الفهارس الأساسية
    const commonIndexes = [
      { store: 'users', field: 'email' },
      { store: 'users', field: 'role' },
      { store: 'consultations', field: 'status' },
      { store: 'consultations', field: 'specialty' },
      { store: 'consultations', field: 'requesterId' },
      { store: 'doctors', field: 'specialty' },
      { store: 'doctors', field: 'isAvailable' },
      { store: 'messages', field: 'senderId' },
      { store: 'messages', field: 'receiverId' }
    ];

    for (const { store, field } of commonIndexes) {
      await this.buildIndex(store, field);
    }

    console.log('✅ تم إعادة بناء جميع الفهارس');
  }

  // تحديث فهرس عند إضافة/تحديث سجل
  updateIndex(storeName: string, field: string, oldValue: any, newValue: any, recordId: string): void {
    const indexKey = `${storeName}_${field}`;
    const index = this.indexes.get(indexKey);
    
    if (!index) return;

    // إزالة من القيمة القديمة
    if (oldValue !== undefined && oldValue !== null) {
      const oldRecords = index.get(oldValue);
      if (oldRecords) {
        const newRecords = oldRecords.filter(id => id !== recordId);
        if (newRecords.length === 0) {
          index.delete(oldValue);
        } else {
          index.set(oldValue, newRecords);
        }
      }
    }

    // إضافة للقيمة الجديدة
    if (newValue !== undefined && newValue !== null) {
      if (!index.has(newValue)) {
        index.set(newValue, []);
      }
      const records = index.get(newValue)!;
      if (!records.includes(recordId)) {
        records.push(recordId);
      }
    }
  }

  // تحسين الذاكرة بحذف البيانات المؤقتة القديمة
  cleanupCache(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    // تنظيف إضافي إذا تجاوز الحد الأقصى
    if (this.cache.size > this.maxCacheSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].hits - b[1].hits); // ترتيب حسب الاستخدام
      
      const toDelete = entries.slice(0, entries.length - this.maxCacheSize);
      for (const [key] of toDelete) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 تم تنظيف ${cleaned} عنصر من التخزين المؤقت`);
    }
  }

  // الحصول على إحصائيات الأداء
  getPerformanceMetrics(): PerformanceMetrics & {
    cacheSize: number;
    indexesCount: number;
    cacheHitRate: number;
  } {
    const totalCacheQueries = this.metrics.cacheHits + this.metrics.cacheMisses;
    const cacheHitRate = totalCacheQueries > 0 ? (this.metrics.cacheHits / totalCacheQueries) * 100 : 0;

    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      indexesCount: this.indexes.size,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100
    };
  }

  // إعادة تعيين الإحصائيات
  resetMetrics(): void {
    this.metrics = {
      queryTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      indexHits: 0,
      totalQueries: 0,
      averageQueryTime: 0
    };
  }

  // === طرق مساعدة ===

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    const size = this.estimateSize(data);
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
      size
    });

    // تنظيف إذا تجاوز الحد
    if (this.cache.size > this.maxCacheSize) {
      this.cleanupCache();
    }
  }

  private estimateSize(obj: any): number {
    return JSON.stringify(obj).length * 2; // تقدير تقريبي
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private applyQueryOptions<T>(items: T[], options?: QueryOptions): T[] {
    if (!options) return items;

    let results = [...items];

    // تطبيق الفلتر
    if (options.where) {
      results = results.filter(item => {
        return Object.entries(options.where!).every(([key, value]) => {
          return (item as any)[key] === value;
        });
      });
    }

    // تطبيق الترتيب
    if (options.orderBy) {
      results.sort((a, b) => {
        const aVal = (a as any)[options.orderBy!];
        const bVal = (b as any)[options.orderBy!];
        
        if (options.orderDirection === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // تطبيق التصفح
    if (options.offset || options.limit) {
      const start = options.offset || 0;
      const end = options.limit ? start + options.limit : undefined;
      results = results.slice(start, end);
    }

    return results;
  }

  private updateMetrics(queryTime: number): void {
    this.metrics.queryTime += queryTime;
    this.metrics.averageQueryTime = this.metrics.queryTime / this.metrics.totalQueries;
  }

  private startCleanupTimer(): void {
    // تنظيف كل 10 دقائق
    setInterval(() => {
      this.cleanupCache();
    }, 10 * 60 * 1000);
  }

  // تصدير/استيراد الفهارس
  exportIndexes(): string {
    const indexData: Record<string, Array<[any, string[]]>> = {};
    
    for (const [key, index] of this.indexes.entries()) {
      indexData[key] = Array.from(index.entries());
    }
    
    return JSON.stringify(indexData);
  }

  importIndexes(data: string): void {
    try {
      const indexData = JSON.parse(data);
      
      this.indexes.clear();
      
      for (const [key, entries] of Object.entries(indexData)) {
        const index = new Map(entries as Array<[any, string[]]>);
        this.indexes.set(key, index);
      }
      
      console.log(`✅ تم استيراد ${this.indexes.size} فهرس`);
    } catch (error) {
      console.error('خطأ في استيراد الفهارس:', error);
    }
  }
}
