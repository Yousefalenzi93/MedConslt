// نظام النسخ الاحتياطي والاستعادة للمنصة الطبية
import { LocalDB } from './LocalDB';
import { medicalDBConfig } from './schemas';

export interface BackupData {
  id: string;
  timestamp: string;
  version: string;
  stores: Record<string, any[]>;
  metadata: {
    totalRecords: number;
    storesCounts: Record<string, number>;
    size: number;
    checksum: string;
  };
}

export interface BackupOptions {
  includeStores?: string[];
  excludeStores?: string[];
  compress?: boolean;
  encrypt?: boolean;
}

export interface RestoreOptions {
  clearExisting?: boolean;
  mergeStrategy?: 'overwrite' | 'skip' | 'merge';
  includeStores?: string[];
}

export class BackupManager {
  private db: LocalDB;
  private backupKey = 'medical_platform_backups';
  private maxBackups = 10;

  constructor(db: LocalDB) {
    this.db = db;
  }

  // إنشاء نسخة احتياطية كاملة
  async createFullBackup(options: BackupOptions = {}): Promise<BackupData> {
    console.log('🔄 بدء إنشاء النسخة الاحتياطية...');
    
    const stores = medicalDBConfig.stores.map(store => store.name);
    const storesToBackup = options.includeStores || stores.filter(store => 
      !options.excludeStores?.includes(store)
    );

    const backupData: BackupData = {
      id: this.generateBackupId(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      stores: {},
      metadata: {
        totalRecords: 0,
        storesCounts: {},
        size: 0,
        checksum: ''
      }
    };

    let totalRecords = 0;

    // نسخ البيانات من كل مخزن
    for (const storeName of storesToBackup) {
      try {
        const storeData = await this.db.getAll(storeName);
        backupData.stores[storeName] = storeData;
        backupData.metadata.storesCounts[storeName] = storeData.length;
        totalRecords += storeData.length;
        
        console.log(`✅ تم نسخ ${storeData.length} سجل من ${storeName}`);
      } catch (error) {
        console.warn(`⚠️ فشل في نسخ ${storeName}:`, error);
        backupData.stores[storeName] = [];
        backupData.metadata.storesCounts[storeName] = 0;
      }
    }

    backupData.metadata.totalRecords = totalRecords;

    // ضغط البيانات إذا طُلب ذلك
    if (options.compress) {
      backupData = await this.compressBackup(backupData);
    }

    // تشفير البيانات إذا طُلب ذلك
    if (options.encrypt) {
      backupData = await this.encryptBackup(backupData);
    }

    // حساب الحجم والتحقق
    const backupString = JSON.stringify(backupData);
    backupData.metadata.size = new Blob([backupString]).size;
    backupData.metadata.checksum = await this.calculateChecksum(backupString);

    // حفظ النسخة الاحتياطية
    await this.saveBackup(backupData);

    console.log(`✅ تم إنشاء النسخة الاحتياطية بنجاح: ${backupData.id}`);
    console.log(`📊 إجمالي السجلات: ${totalRecords}`);
    console.log(`💾 الحجم: ${this.formatSize(backupData.metadata.size)}`);

    return backupData;
  }

  // إنشاء نسخة احتياطية تزايدية
  async createIncrementalBackup(lastBackupId?: string): Promise<BackupData> {
    console.log('🔄 بدء إنشاء النسخة الاحتياطية التزايدية...');
    
    const lastBackup = lastBackupId ? await this.getBackup(lastBackupId) : await this.getLatestBackup();
    const lastBackupTime = lastBackup ? new Date(lastBackup.timestamp) : new Date(0);

    const backupData: BackupData = {
      id: this.generateBackupId(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      stores: {},
      metadata: {
        totalRecords: 0,
        storesCounts: {},
        size: 0,
        checksum: ''
      }
    };

    let totalRecords = 0;

    // نسخ البيانات المحدثة فقط
    for (const store of medicalDBConfig.stores) {
      try {
        const allData = await this.db.getAll(store.name);
        const updatedData = allData.filter((item: any) => {
          const itemDate = new Date(item.updatedAt || item.createdAt);
          return itemDate > lastBackupTime;
        });

        backupData.stores[store.name] = updatedData;
        backupData.metadata.storesCounts[store.name] = updatedData.length;
        totalRecords += updatedData.length;
        
        console.log(`✅ تم نسخ ${updatedData.length} سجل محدث من ${store.name}`);
      } catch (error) {
        console.warn(`⚠️ فشل في نسخ ${store.name}:`, error);
        backupData.stores[store.name] = [];
        backupData.metadata.storesCounts[store.name] = 0;
      }
    }

    backupData.metadata.totalRecords = totalRecords;

    // حفظ النسخة الاحتياطية
    const backupString = JSON.stringify(backupData);
    backupData.metadata.size = new Blob([backupString]).size;
    backupData.metadata.checksum = await this.calculateChecksum(backupString);

    await this.saveBackup(backupData);

    console.log(`✅ تم إنشاء النسخة الاحتياطية التزايدية: ${backupData.id}`);
    console.log(`📊 السجلات المحدثة: ${totalRecords}`);

    return backupData;
  }

  // استعادة البيانات من نسخة احتياطية
  async restoreFromBackup(backupId: string, options: RestoreOptions = {}): Promise<void> {
    console.log(`🔄 بدء استعادة البيانات من النسخة: ${backupId}`);
    
    const backup = await this.getBackup(backupId);
    if (!backup) {
      throw new Error('النسخة الاحتياطية غير موجودة');
    }

    // التحقق من سلامة البيانات
    const isValid = await this.validateBackup(backup);
    if (!isValid) {
      throw new Error('النسخة الاحتياطية تالفة');
    }

    const storesToRestore = options.includeStores || Object.keys(backup.stores);

    // مسح البيانات الموجودة إذا طُلب ذلك
    if (options.clearExisting) {
      for (const storeName of storesToRestore) {
        await this.db.clear(storeName);
        console.log(`🗑️ تم مسح ${storeName}`);
      }
    }

    let totalRestored = 0;

    // استعادة البيانات
    for (const storeName of storesToRestore) {
      const storeData = backup.stores[storeName] || [];
      
      for (const item of storeData) {
        try {
          if (options.mergeStrategy === 'skip') {
            // تخطي إذا كان السجل موجود
            const existing = await this.db.get(storeName, item.id);
            if (existing) continue;
          }

          if (options.mergeStrategy === 'merge') {
            // دمج مع البيانات الموجودة
            const existing = await this.db.get(storeName, item.id);
            if (existing) {
              const merged = { ...existing, ...item };
              await this.db.update(storeName, merged);
            } else {
              await this.db.add(storeName, item);
            }
          } else {
            // استبدال (افتراضي)
            await this.db.update(storeName, item);
          }

          totalRestored++;
        } catch (error) {
          console.warn(`⚠️ فشل في استعادة سجل من ${storeName}:`, error);
        }
      }

      console.log(`✅ تم استعادة ${storeData.length} سجل إلى ${storeName}`);
    }

    console.log(`✅ تم استعادة ${totalRestored} سجل بنجاح`);
  }

  // الحصول على قائمة النسخ الاحتياطية
  async getBackupsList(): Promise<BackupData[]> {
    const backupsData = localStorage.getItem(this.backupKey);
    if (!backupsData) return [];

    try {
      const backups = JSON.parse(backupsData);
      return backups.sort((a: BackupData, b: BackupData) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('خطأ في قراءة النسخ الاحتياطية:', error);
      return [];
    }
  }

  // الحصول على نسخة احتياطية محددة
  async getBackup(backupId: string): Promise<BackupData | null> {
    const backups = await this.getBackupsList();
    return backups.find(backup => backup.id === backupId) || null;
  }

  // الحصول على أحدث نسخة احتياطية
  async getLatestBackup(): Promise<BackupData | null> {
    const backups = await this.getBackupsList();
    return backups[0] || null;
  }

  // حذف نسخة احتياطية
  async deleteBackup(backupId: string): Promise<void> {
    const backups = await this.getBackupsList();
    const filteredBackups = backups.filter(backup => backup.id !== backupId);
    
    localStorage.setItem(this.backupKey, JSON.stringify(filteredBackups));
    console.log(`🗑️ تم حذف النسخة الاحتياطية: ${backupId}`);
  }

  // تصدير نسخة احتياطية كملف
  async exportBackup(backupId: string): Promise<Blob> {
    const backup = await this.getBackup(backupId);
    if (!backup) {
      throw new Error('النسخة الاحتياطية غير موجودة');
    }

    const backupString = JSON.stringify(backup, null, 2);
    return new Blob([backupString], { type: 'application/json' });
  }

  // استيراد نسخة احتياطية من ملف
  async importBackup(file: File): Promise<BackupData> {
    const text = await file.text();
    const backup: BackupData = JSON.parse(text);

    // التحقق من صحة البيانات
    if (!backup.id || !backup.timestamp || !backup.stores) {
      throw new Error('ملف النسخة الاحتياطية غير صحيح');
    }

    // حفظ النسخة المستوردة
    await this.saveBackup(backup);
    
    console.log(`✅ تم استيراد النسخة الاحتياطية: ${backup.id}`);
    return backup;
  }

  // === طرق مساعدة ===

  private async saveBackup(backup: BackupData): Promise<void> {
    const backups = await this.getBackupsList();
    
    // إضافة النسخة الجديدة
    backups.unshift(backup);
    
    // الاحتفاظ بعدد محدود من النسخ
    if (backups.length > this.maxBackups) {
      backups.splice(this.maxBackups);
    }
    
    localStorage.setItem(this.backupKey, JSON.stringify(backups));
  }

  private async validateBackup(backup: BackupData): Promise<boolean> {
    try {
      // التحقق من البنية الأساسية
      if (!backup.id || !backup.timestamp || !backup.stores || !backup.metadata) {
        return false;
      }

      // التحقق من التوقيع
      const backupString = JSON.stringify({
        ...backup,
        metadata: { ...backup.metadata, checksum: '' }
      });
      const calculatedChecksum = await this.calculateChecksum(backupString);
      
      return calculatedChecksum === backup.metadata.checksum;
    } catch (error) {
      console.error('خطأ في التحقق من النسخة الاحتياطية:', error);
      return false;
    }
  }

  private async calculateChecksum(data: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // بديل بسيط للمتصفحات القديمة
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // تحويل إلى 32bit integer
    }
    return hash.toString(16);
  }

  private async compressBackup(backup: BackupData): Promise<BackupData> {
    // ضغط بسيط - يمكن تحسينه باستخدام مكتبات ضغط متقدمة
    const compressed = { ...backup };
    // هنا يمكن إضافة خوارزمية ضغط
    return compressed;
  }

  private async encryptBackup(backup: BackupData): Promise<BackupData> {
    // تشفير بسيط - يمكن تحسينه باستخدام مكتبات تشفير متقدمة
    const encrypted = { ...backup };
    // هنا يمكن إضافة خوارزمية تشفير
    return encrypted;
  }

  private generateBackupId(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substr(2, 6);
    return `backup_${timestamp}_${random}`;
  }

  private formatSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // جدولة النسخ الاحتياطية التلقائية
  startAutoBackup(intervalMinutes: number = 60): void {
    setInterval(async () => {
      try {
        await this.createIncrementalBackup();
        console.log('✅ تم إنشاء نسخة احتياطية تلقائية');
      } catch (error) {
        console.error('❌ فشل في النسخ الاحتياطي التلقائي:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }
}
