// نظام المزامنة بين الأجهزة للمنصة الطبية
import { MedicalAPI } from './MedicalAPI';
import { BackupManager } from './BackupManager';

export interface SyncConfig {
  endpoint?: string;
  apiKey?: string;
  userId: string;
  deviceId: string;
  syncInterval: number; // بالميلي ثانية
  conflictResolution: 'client' | 'server' | 'manual';
}

export interface SyncRecord {
  id: string;
  storeName: string;
  recordId: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  deviceId: string;
  userId: string;
  synced: boolean;
  version: number;
}

export interface ConflictRecord {
  id: string;
  storeName: string;
  recordId: string;
  localData: any;
  remoteData: any;
  localTimestamp: string;
  remoteTimestamp: string;
  resolved: boolean;
}

export class SyncManager {
  private api: MedicalAPI;
  private backupManager: BackupManager;
  private config: SyncConfig;
  private syncQueue: SyncRecord[] = [];
  private conflicts: ConflictRecord[] = [];
  private isOnline = navigator.onLine;
  private syncTimer?: NodeJS.Timeout;
  private lastSyncTime: string = '';

  constructor(api: MedicalAPI, backupManager: BackupManager, config: SyncConfig) {
    this.api = api;
    this.backupManager = backupManager;
    this.config = config;
    
    this.setupEventListeners();
    this.loadSyncQueue();
    this.loadConflicts();
    
    if (this.isOnline) {
      this.startAutoSync();
    }
  }

  // بدء المزامنة التلقائية
  startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(async () => {
      if (this.isOnline) {
        await this.performSync();
      }
    }, this.config.syncInterval);

    console.log(`🔄 تم بدء المزامنة التلقائية كل ${this.config.syncInterval / 1000} ثانية`);
  }

  // إيقاف المزامنة التلقائية
  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = undefined;
    }
    console.log('⏹️ تم إيقاف المزامنة التلقائية');
  }

  // إضافة عملية للمزامنة
  addToSyncQueue(
    storeName: string,
    recordId: string,
    action: 'create' | 'update' | 'delete',
    data?: any
  ): void {
    const syncRecord: SyncRecord = {
      id: this.generateId(),
      storeName,
      recordId,
      action,
      data,
      timestamp: new Date().toISOString(),
      deviceId: this.config.deviceId,
      userId: this.config.userId,
      synced: false,
      version: 1
    };

    this.syncQueue.push(syncRecord);
    this.saveSyncQueue();

    console.log(`📝 تم إضافة عملية ${action} للمزامنة: ${storeName}/${recordId}`);

    // محاولة المزامنة الفورية إذا كان متصل
    if (this.isOnline) {
      this.performSync().catch(console.error);
    }
  }

  // تنفيذ المزامنة
  async performSync(): Promise<void> {
    if (!this.isOnline) {
      console.log('📴 غير متصل - تم تأجيل المزامنة');
      return;
    }

    console.log('🔄 بدء عملية المزامنة...');

    try {
      // 1. رفع التغييرات المحلية
      await this.uploadLocalChanges();

      // 2. تحميل التغييرات من الخادم
      await this.downloadRemoteChanges();

      // 3. حل التعارضات
      await this.resolveConflicts();

      // 4. تنظيف قائمة المزامنة
      this.cleanupSyncQueue();

      this.lastSyncTime = new Date().toISOString();
      console.log('✅ تمت المزامنة بنجاح');

    } catch (error) {
      console.error('❌ فشل في المزامنة:', error);
      throw error;
    }
  }

  // رفع التغييرات المحلية
  private async uploadLocalChanges(): Promise<void> {
    const pendingChanges = this.syncQueue.filter(record => !record.synced);
    
    if (pendingChanges.length === 0) {
      console.log('📤 لا توجد تغييرات محلية للرفع');
      return;
    }

    console.log(`📤 رفع ${pendingChanges.length} تغيير محلي...`);

    for (const change of pendingChanges) {
      try {
        await this.uploadSingleChange(change);
        change.synced = true;
        console.log(`✅ تم رفع: ${change.storeName}/${change.recordId}`);
      } catch (error) {
        console.error(`❌ فشل في رفع: ${change.storeName}/${change.recordId}`, error);
      }
    }

    this.saveSyncQueue();
  }

  // رفع تغيير واحد
  private async uploadSingleChange(change: SyncRecord): Promise<void> {
    if (!this.config.endpoint) {
      // محاكاة الرفع للخادم المحلي
      await this.simulateServerUpload(change);
      return;
    }

    const url = `${this.config.endpoint}/sync/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-Device-ID': this.config.deviceId,
        'X-User-ID': this.config.userId
      },
      body: JSON.stringify(change)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // تحميل التغييرات من الخادم
  private async downloadRemoteChanges(): Promise<void> {
    console.log('📥 تحميل التغييرات من الخادم...');

    if (!this.config.endpoint) {
      // محاكاة التحميل من الخادم المحلي
      await this.simulateServerDownload();
      return;
    }

    const url = `${this.config.endpoint}/sync/download`;
    const params = new URLSearchParams({
      userId: this.config.userId,
      deviceId: this.config.deviceId,
      since: this.lastSyncTime || '1970-01-01T00:00:00.000Z'
    });

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-Device-ID': this.config.deviceId,
        'X-User-ID': this.config.userId
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const remoteChanges: SyncRecord[] = await response.json();
    await this.applyRemoteChanges(remoteChanges);
  }

  // تطبيق التغييرات من الخادم
  private async applyRemoteChanges(changes: SyncRecord[]): Promise<void> {
    if (changes.length === 0) {
      console.log('📥 لا توجد تغييرات جديدة من الخادم');
      return;
    }

    console.log(`📥 تطبيق ${changes.length} تغيير من الخادم...`);

    for (const change of changes) {
      try {
        await this.applySingleRemoteChange(change);
        console.log(`✅ تم تطبيق: ${change.storeName}/${change.recordId}`);
      } catch (error) {
        console.error(`❌ فشل في تطبيق: ${change.storeName}/${change.recordId}`, error);
      }
    }
  }

  // تطبيق تغيير واحد من الخادم
  private async applySingleRemoteChange(change: SyncRecord): Promise<void> {
    // التحقق من وجود تعارض
    const localRecord = await this.getLocalRecord(change.storeName, change.recordId);
    
    if (localRecord && this.hasConflict(localRecord, change)) {
      await this.handleConflict(change.storeName, change.recordId, localRecord, change.data);
      return;
    }

    // تطبيق التغيير
    switch (change.action) {
      case 'create':
      case 'update':
        await this.updateLocalRecord(change.storeName, change.data);
        break;
      case 'delete':
        await this.deleteLocalRecord(change.storeName, change.recordId);
        break;
    }
  }

  // حل التعارضات
  private async resolveConflicts(): Promise<void> {
    const unresolvedConflicts = this.conflicts.filter(c => !c.resolved);
    
    if (unresolvedConflicts.length === 0) {
      return;
    }

    console.log(`🔧 حل ${unresolvedConflicts.length} تعارض...`);

    for (const conflict of unresolvedConflicts) {
      try {
        await this.resolveConflict(conflict);
        conflict.resolved = true;
        console.log(`✅ تم حل التعارض: ${conflict.storeName}/${conflict.recordId}`);
      } catch (error) {
        console.error(`❌ فشل في حل التعارض: ${conflict.storeName}/${conflict.recordId}`, error);
      }
    }

    this.saveConflicts();
  }

  // حل تعارض واحد
  private async resolveConflict(conflict: ConflictRecord): Promise<void> {
    let resolvedData: any;

    switch (this.config.conflictResolution) {
      case 'client':
        resolvedData = conflict.localData;
        break;
      case 'server':
        resolvedData = conflict.remoteData;
        break;
      case 'manual':
        // في الوضع اليدوي، نحتاج لتدخل المستخدم
        resolvedData = await this.requestManualResolution(conflict);
        break;
      default:
        // الافتراضي: استخدام الأحدث
        const localTime = new Date(conflict.localTimestamp).getTime();
        const remoteTime = new Date(conflict.remoteTimestamp).getTime();
        resolvedData = remoteTime > localTime ? conflict.remoteData : conflict.localData;
    }

    await this.updateLocalRecord(conflict.storeName, resolvedData);
  }

  // طلب حل يدوي للتعارض
  private async requestManualResolution(conflict: ConflictRecord): Promise<any> {
    // هذه الطريقة يمكن تخصيصها لعرض واجهة للمستخدم
    console.log('🤔 تعارض يتطلب حل يدوي:', conflict);
    
    // للآن، نستخدم الأحدث كحل افتراضي
    const localTime = new Date(conflict.localTimestamp).getTime();
    const remoteTime = new Date(conflict.remoteTimestamp).getTime();
    return remoteTime > localTime ? conflict.remoteData : conflict.localData;
  }

  // التحقق من وجود تعارض
  private hasConflict(localRecord: any, remoteChange: SyncRecord): boolean {
    if (!localRecord) return false;
    
    const localTime = new Date(localRecord.updatedAt || localRecord.createdAt).getTime();
    const remoteTime = new Date(remoteChange.timestamp).getTime();
    
    // تعارض إذا كان كلاهما محدث بعد آخر مزامنة
    const lastSync = new Date(this.lastSyncTime || '1970-01-01').getTime();
    
    return localTime > lastSync && remoteTime > lastSync && localTime !== remoteTime;
  }

  // معالجة التعارض
  private async handleConflict(
    storeName: string,
    recordId: string,
    localData: any,
    remoteData: any
  ): Promise<void> {
    const conflict: ConflictRecord = {
      id: this.generateId(),
      storeName,
      recordId,
      localData,
      remoteData,
      localTimestamp: localData.updatedAt || localData.createdAt,
      remoteTimestamp: remoteData.updatedAt || remoteData.createdAt,
      resolved: false
    };

    this.conflicts.push(conflict);
    this.saveConflicts();

    console.log(`⚠️ تم اكتشاف تعارض: ${storeName}/${recordId}`);
  }

  // الحصول على سجل محلي
  private async getLocalRecord(storeName: string, recordId: string): Promise<any> {
    try {
      return await (this.api as any).db.get(storeName, recordId);
    } catch (error) {
      return null;
    }
  }

  // تحديث سجل محلي
  private async updateLocalRecord(storeName: string, data: any): Promise<void> {
    await (this.api as any).db.update(storeName, data);
  }

  // حذف سجل محلي
  private async deleteLocalRecord(storeName: string, recordId: string): Promise<void> {
    await (this.api as any).db.delete(storeName, recordId);
  }

  // محاكاة رفع للخادم (للاختبار)
  private async simulateServerUpload(change: SyncRecord): Promise<void> {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    // محاكاة نجاح 95% من الوقت
    if (Math.random() < 0.05) {
      throw new Error('محاكاة فشل الشبكة');
    }
  }

  // محاكاة تحميل من الخادم (للاختبار)
  private async simulateServerDownload(): Promise<void> {
    // محاكاة عدم وجود تغييرات جديدة
    await this.applyRemoteChanges([]);
  }

  // إعداد مستمعي الأحداث
  private setupEventListeners(): void {
    // مراقبة حالة الاتصال
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 تم الاتصال بالإنترنت - استئناف المزامنة');
      this.startAutoSync();
      this.performSync().catch(console.error);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 انقطع الاتصال بالإنترنت - إيقاف المزامنة');
      this.stopAutoSync();
    });

    // مراقبة إغلاق النافذة
    window.addEventListener('beforeunload', () => {
      this.saveSyncQueue();
      this.saveConflicts();
    });
  }

  // حفظ قائمة المزامنة
  private saveSyncQueue(): void {
    localStorage.setItem('medical_sync_queue', JSON.stringify(this.syncQueue));
  }

  // تحميل قائمة المزامنة
  private loadSyncQueue(): void {
    const data = localStorage.getItem('medical_sync_queue');
    if (data) {
      try {
        this.syncQueue = JSON.parse(data);
      } catch (error) {
        console.error('خطأ في تحميل قائمة المزامنة:', error);
        this.syncQueue = [];
      }
    }
  }

  // حفظ التعارضات
  private saveConflicts(): void {
    localStorage.setItem('medical_sync_conflicts', JSON.stringify(this.conflicts));
  }

  // تحميل التعارضات
  private loadConflicts(): void {
    const data = localStorage.getItem('medical_sync_conflicts');
    if (data) {
      try {
        this.conflicts = JSON.parse(data);
      } catch (error) {
        console.error('خطأ في تحميل التعارضات:', error);
        this.conflicts = [];
      }
    }
  }

  // تنظيف قائمة المزامنة
  private cleanupSyncQueue(): void {
    const before = this.syncQueue.length;
    this.syncQueue = this.syncQueue.filter(record => !record.synced);
    const after = this.syncQueue.length;
    
    if (before !== after) {
      console.log(`🧹 تم تنظيف ${before - after} عملية مزامنة مكتملة`);
      this.saveSyncQueue();
    }
  }

  // توليد معرف فريد
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // الحصول على حالة المزامنة
  getSyncStatus(): {
    isOnline: boolean;
    pendingChanges: number;
    unresolvedConflicts: number;
    lastSyncTime: string;
    autoSyncEnabled: boolean;
  } {
    return {
      isOnline: this.isOnline,
      pendingChanges: this.syncQueue.filter(r => !r.synced).length,
      unresolvedConflicts: this.conflicts.filter(c => !c.resolved).length,
      lastSyncTime: this.lastSyncTime,
      autoSyncEnabled: !!this.syncTimer
    };
  }

  // الحصول على التعارضات غير المحلولة
  getUnresolvedConflicts(): ConflictRecord[] {
    return this.conflicts.filter(c => !c.resolved);
  }

  // مزامنة فورية
  async forcSync(): Promise<void> {
    console.log('🚀 بدء المزامنة الفورية...');
    await this.performSync();
  }

  // إعادة تعيين المزامنة
  resetSync(): void {
    this.syncQueue = [];
    this.conflicts = [];
    this.lastSyncTime = '';
    
    this.saveSyncQueue();
    this.saveConflicts();
    localStorage.removeItem('medical_last_sync_time');
    
    console.log('🔄 تم إعادة تعيين المزامنة');
  }
}
