// نقطة الدخول الرئيسية لنظام قاعدة البيانات المحلية
import { LocalDB } from './LocalDB';
import { MedicalAPI } from './MedicalAPI';
import { BackupManager } from './BackupManager';
import { PerformanceOptimizer } from './PerformanceOptimizer';
import { SyncManager, SyncConfig } from './SyncManager';
import { DatabaseTester } from './DatabaseTester';
import { medicalDBConfig } from './schemas';

// إعدادات قاعدة البيانات الافتراضية
export const defaultConfig = {
  autoBackup: true,
  backupInterval: 60 * 60 * 1000, // ساعة واحدة
  enableSync: false,
  enableOptimization: true,
  enableTesting: process.env.NODE_ENV === 'development'
};

// فئة إدارة قاعدة البيانات الرئيسية
export class MedicalDatabase {
  private db: LocalDB;
  private api: MedicalAPI;
  private backupManager: BackupManager;
  private optimizer: PerformanceOptimizer;
  private syncManager?: SyncManager;
  private tester: DatabaseTester;
  private isInitialized = false;

  constructor() {
    this.db = new LocalDB(medicalDBConfig);
    this.api = new MedicalAPI();
    this.backupManager = new BackupManager(this.db);
    this.optimizer = new PerformanceOptimizer(this.db);
    this.tester = new DatabaseTester(
      this.api,
      this.backupManager,
      this.optimizer
    );
  }

  // تهيئة قاعدة البيانات
  async initialize(config = defaultConfig): Promise<void> {
    if (this.isInitialized) {
      console.log('🏥 قاعدة البيانات مهيأة بالفعل');
      return;
    }

    console.log('🚀 بدء تهيئة قاعدة البيانات الطبية...');

    try {
      // تهيئة قاعدة البيانات الأساسية
      await this.db.initialize();
      console.log('✅ تم تهيئة قاعدة البيانات الأساسية');

      // تهيئة API الطبي
      await this.api.initialize();
      console.log('✅ تم تهيئة API الطبي');

      // تهيئة محسن الأداء
      if (config.enableOptimization) {
        await this.optimizer.rebuildAllIndexes();
        console.log('✅ تم تهيئة محسن الأداء');
      }

      // تهيئة النسخ الاحتياطي التلقائي
      if (config.autoBackup) {
        this.backupManager.startAutoBackup(config.backupInterval / 60000);
        console.log('✅ تم تفعيل النسخ الاحتياطي التلقائي');
      }

      // تشغيل اختبار سريع في بيئة التطوير
      if (config.enableTesting) {
        const testPassed = await this.tester.runQuickTest();
        if (testPassed) {
          console.log('✅ اجتاز الاختبار السريع');
        } else {
          console.warn('⚠️ فشل في الاختبار السريع');
        }
      }

      this.isInitialized = true;
      console.log('🎉 تم تهيئة قاعدة البيانات الطبية بنجاح!');

    } catch (error) {
      console.error('❌ فشل في تهيئة قاعدة البيانات:', error);
      throw error;
    }
  }

  // تفعيل المزامنة
  enableSync(syncConfig: SyncConfig): void {
    this.syncManager = new SyncManager(this.api, this.backupManager, syncConfig);
    this.tester = new DatabaseTester(
      this.api,
      this.backupManager,
      this.optimizer,
      this.syncManager
    );
    console.log('🔄 تم تفعيل نظام المزامنة');
  }

  // الحصول على API الطبي
  getAPI(): MedicalAPI {
    this.ensureInitialized();
    return this.api;
  }

  // الحصول على مدير النسخ الاحتياطي
  getBackupManager(): BackupManager {
    this.ensureInitialized();
    return this.backupManager;
  }

  // الحصول على محسن الأداء
  getOptimizer(): PerformanceOptimizer {
    this.ensureInitialized();
    return this.optimizer;
  }

  // الحصول على مدير المزامنة
  getSyncManager(): SyncManager | undefined {
    this.ensureInitialized();
    return this.syncManager;
  }

  // الحصول على نظام الاختبار
  getTester(): DatabaseTester {
    return this.tester;
  }

  // تشغيل اختبارات شاملة
  async runTests(): Promise<void> {
    this.ensureInitialized();
    await this.tester.runAllTests();
  }

  // إنشاء نسخة احتياطية فورية
  async createBackup(): Promise<string> {
    this.ensureInitialized();
    const backup = await this.backupManager.createFullBackup();
    return backup.id;
  }

  // استعادة من نسخة احتياطية
  async restoreFromBackup(backupId: string): Promise<void> {
    this.ensureInitialized();
    await this.backupManager.restoreFromBackup(backupId, { clearExisting: true });
  }

  // مزامنة فورية
  async sync(): Promise<void> {
    if (!this.syncManager) {
      throw new Error('المزامنة غير مفعلة');
    }
    await this.syncManager.forcSync();
  }

  // الحصول على إحصائيات شاملة
  async getStatistics(): Promise<any> {
    this.ensureInitialized();
    
    const [
      apiStats,
      performanceStats,
      backups,
      syncStatus
    ] = await Promise.all([
      this.api.getStatistics(),
      this.optimizer.getPerformanceMetrics(),
      this.backupManager.getBackupsList(),
      this.syncManager?.getSyncStatus()
    ]);

    return {
      database: apiStats,
      performance: performanceStats,
      backups: {
        total: backups.length,
        latest: backups[0]?.timestamp,
        totalSize: backups.reduce((sum, b) => sum + b.metadata.size, 0)
      },
      sync: syncStatus,
      isInitialized: this.isInitialized,
      timestamp: new Date().toISOString()
    };
  }

  // تنظيف وتحسين قاعدة البيانات
  async optimize(): Promise<void> {
    this.ensureInitialized();
    
    console.log('🔧 بدء تحسين قاعدة البيانات...');
    
    // تنظيف التخزين المؤقت
    this.optimizer.cleanupCache();
    
    // إعادة بناء الفهارس
    await this.optimizer.rebuildAllIndexes();
    
    // إنشاء نسخة احتياطية
    await this.backupManager.createIncrementalBackup();
    
    console.log('✅ تم تحسين قاعدة البيانات');
  }

  // إعادة تعيين قاعدة البيانات
  async reset(): Promise<void> {
    console.log('🔄 إعادة تعيين قاعدة البيانات...');
    
    // إيقاف العمليات التلقائية
    this.backupManager.stopAutoBackup?.();
    this.syncManager?.stopAutoSync();
    
    // مسح البيانات
    for (const store of medicalDBConfig.stores) {
      await this.db.clear(store.name);
    }
    
    // مسح التخزين المؤقت والفهارس
    this.optimizer.resetMetrics();
    this.optimizer.cleanupCache();
    
    // إعادة تعيين المزامنة
    this.syncManager?.resetSync();
    
    this.isInitialized = false;
    console.log('✅ تم إعادة تعيين قاعدة البيانات');
  }

  // إغلاق قاعدة البيانات
  close(): void {
    console.log('🔒 إغلاق قاعدة البيانات...');
    
    // إيقاف العمليات التلقائية
    this.backupManager.stopAutoBackup?.();
    this.syncManager?.stopAutoSync();
    
    // إغلاق الاتصالات
    this.db.close();
    this.api.close();
    
    this.isInitialized = false;
    console.log('✅ تم إغلاق قاعدة البيانات');
  }

  // التحقق من التهيئة
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('قاعدة البيانات غير مهيأة. يرجى استدعاء initialize() أولاً');
    }
  }
}

// إنشاء مثيل واحد للاستخدام العام
export const medicalDB = new MedicalDatabase();

// تصدير الفئات للاستخدام المتقدم
export {
  LocalDB,
  MedicalAPI,
  BackupManager,
  PerformanceOptimizer,
  SyncManager,
  DatabaseTester
};

// تصدير الأنواع
export type {
  SyncConfig
};

// دالة مساعدة للتهيئة السريعة
export async function initializeMedicalDB(config = defaultConfig): Promise<MedicalDatabase> {
  await medicalDB.initialize(config);
  return medicalDB;
}

// دالة مساعدة للاختبار
export async function testMedicalDB(): Promise<boolean> {
  try {
    await medicalDB.runTests();
    return true;
  } catch (error) {
    console.error('فشل في اختبار قاعدة البيانات:', error);
    return false;
  }
}

// دالة مساعدة للحصول على الإحصائيات
export async function getMedicalDBStats(): Promise<any> {
  return await medicalDB.getStatistics();
}

// معلومات الإصدار
export const version = '1.0.0';
export const buildDate = new Date().toISOString();

console.log(`📦 تم تحميل نظام قاعدة البيانات الطبية v${version}`);
