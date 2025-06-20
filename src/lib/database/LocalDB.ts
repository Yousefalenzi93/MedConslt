// نظام قاعدة البيانات المحلية المتقدم
// يدعم IndexedDB و LocalStorage مع إمكانيات متقدمة

export interface DBConfig {
  name: string;
  version: number;
  stores: DBStore[];
}

export interface DBStore {
  name: string;
  keyPath: string;
  autoIncrement?: boolean;
  indexes?: DBIndex[];
}

export interface DBIndex {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  where?: Record<string, any>;
}

export class LocalDB {
  private db: IDBDatabase | null = null;
  private config: DBConfig;
  private isInitialized = false;

  constructor(config: DBConfig) {
    this.config = config;
  }

  // تهيئة قاعدة البيانات
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        // في بيئة الخادم، استخدم LocalStorage فقط
        this.isInitialized = true;
        resolve();
        return;
      }

      const request = indexedDB.open(this.config.name, this.config.version);

      request.onerror = () => {
        console.error('فشل في فتح قاعدة البيانات:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('تم تهيئة قاعدة البيانات بنجاح');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // إنشاء المخازن والفهارس
        this.config.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, {
              keyPath: store.keyPath,
              autoIncrement: store.autoIncrement || false
            });

            // إضافة الفهارس
            store.indexes?.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath, {
                unique: index.unique || false
              });
            });
          }
        });
      };
    });
  }

  // إضافة سجل جديد
  async add<T>(storeName: string, data: T): Promise<string> {
    await this.initialize();

    if (!this.db) {
      // استخدام LocalStorage كبديل
      return this.addToLocalStorage(storeName, data);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.add(data);
      
      request.onsuccess = () => {
        resolve(request.result as string);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // الحصول على سجل بالمعرف
  async get<T>(storeName: string, id: string): Promise<T | null> {
    await this.initialize();

    if (!this.db) {
      return this.getFromLocalStorage<T>(storeName, id);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // الحصول على جميع السجلات
  async getAll<T>(storeName: string, options?: QueryOptions): Promise<T[]> {
    await this.initialize();

    if (!this.db) {
      return this.getAllFromLocalStorage<T>(storeName, options);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const request = store.getAll();
      
      request.onsuccess = () => {
        let results = request.result;
        
        // تطبيق الفلاتر والترتيب
        if (options) {
          results = this.applyQueryOptions(results, options);
        }
        
        resolve(results);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // تحديث سجل
  async update<T>(storeName: string, data: T): Promise<void> {
    await this.initialize();

    if (!this.db) {
      return this.updateInLocalStorage(storeName, data);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.put(data);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // حذف سجل
  async delete(storeName: string, id: string): Promise<void> {
    await this.initialize();

    if (!this.db) {
      return this.deleteFromLocalStorage(storeName, id);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // البحث بالفهرس
  async findByIndex<T>(
    storeName: string, 
    indexName: string, 
    value: any,
    options?: QueryOptions
  ): Promise<T[]> {
    await this.initialize();

    if (!this.db) {
      return this.findByIndexInLocalStorage<T>(storeName, indexName, value, options);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      
      const request = index.getAll(value);
      
      request.onsuccess = () => {
        let results = request.result;
        
        if (options) {
          results = this.applyQueryOptions(results, options);
        }
        
        resolve(results);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // عد السجلات
  async count(storeName: string): Promise<number> {
    await this.initialize();

    if (!this.db) {
      return this.countInLocalStorage(storeName);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const request = store.count();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // مسح جميع البيانات
  async clear(storeName: string): Promise<void> {
    await this.initialize();

    if (!this.db) {
      return this.clearLocalStorage(storeName);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // إغلاق قاعدة البيانات
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }

  // === طرق LocalStorage البديلة ===

  private addToLocalStorage<T>(storeName: string, data: T): string {
    const items = this.getAllFromLocalStorage<T>(storeName);
    const id = this.generateId();
    const newItem = { ...data, id };
    items.push(newItem);
    localStorage.setItem(`localdb_${storeName}`, JSON.stringify(items));
    return id;
  }

  private getFromLocalStorage<T>(storeName: string, id: string): T | null {
    const items = this.getAllFromLocalStorage<T>(storeName);
    return items.find((item: any) => item.id === id) || null;
  }

  private getAllFromLocalStorage<T>(storeName: string, options?: QueryOptions): T[] {
    const data = localStorage.getItem(`localdb_${storeName}`);
    let items: T[] = data ? JSON.parse(data) : [];
    
    if (options) {
      items = this.applyQueryOptions(items, options);
    }
    
    return items;
  }

  private updateInLocalStorage<T>(storeName: string, data: any): void {
    const items = this.getAllFromLocalStorage<T>(storeName);
    const index = items.findIndex((item: any) => item.id === data.id);
    if (index !== -1) {
      items[index] = data;
      localStorage.setItem(`localdb_${storeName}`, JSON.stringify(items));
    }
  }

  private deleteFromLocalStorage(storeName: string, id: string): void {
    const items = this.getAllFromLocalStorage(storeName);
    const filteredItems = items.filter((item: any) => item.id !== id);
    localStorage.setItem(`localdb_${storeName}`, JSON.stringify(filteredItems));
  }

  private findByIndexInLocalStorage<T>(
    storeName: string, 
    indexName: string, 
    value: any,
    options?: QueryOptions
  ): T[] {
    const items = this.getAllFromLocalStorage<T>(storeName);
    let results = items.filter((item: any) => item[indexName] === value);
    
    if (options) {
      results = this.applyQueryOptions(results, options);
    }
    
    return results;
  }

  private countInLocalStorage(storeName: string): number {
    return this.getAllFromLocalStorage(storeName).length;
  }

  private clearLocalStorage(storeName: string): void {
    localStorage.removeItem(`localdb_${storeName}`);
  }

  // === طرق مساعدة ===

  private applyQueryOptions<T>(items: T[], options: QueryOptions): T[] {
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

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
