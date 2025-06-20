// نظام اختبار شامل لقاعدة البيانات المحلية
import { MedicalAPI } from './MedicalAPI';
import { BackupManager } from './BackupManager';
import { PerformanceOptimizer } from './PerformanceOptimizer';
import { SyncManager } from './SyncManager';
import { User, Doctor, ConsultationRequest } from '../../types';

export interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalDuration: number;
}

export class DatabaseTester {
  private api: MedicalAPI;
  private backupManager: BackupManager;
  private optimizer: PerformanceOptimizer;
  private syncManager?: SyncManager;
  private testResults: TestSuite[] = [];

  constructor(
    api: MedicalAPI,
    backupManager: BackupManager,
    optimizer: PerformanceOptimizer,
    syncManager?: SyncManager
  ) {
    this.api = api;
    this.backupManager = backupManager;
    this.optimizer = optimizer;
    this.syncManager = syncManager;
  }

  // تشغيل جميع الاختبارات
  async runAllTests(): Promise<TestSuite[]> {
    console.log('🧪 بدء الاختبارات الشاملة لقاعدة البيانات...');
    
    this.testResults = [];

    // اختبارات قاعدة البيانات الأساسية
    await this.runBasicDatabaseTests();
    
    // اختبارات API الطبي
    await this.runMedicalAPITests();
    
    // اختبارات الأداء
    await this.runPerformanceTests();
    
    // اختبارات النسخ الاحتياطي
    await this.runBackupTests();
    
    // اختبارات المزامنة (إذا كانت متوفرة)
    if (this.syncManager) {
      await this.runSyncTests();
    }

    // اختبارات الضغط
    await this.runStressTests();

    this.printTestSummary();
    return this.testResults;
  }

  // اختبارات قاعدة البيانات الأساسية
  private async runBasicDatabaseTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'اختبارات قاعدة البيانات الأساسية',
      tests: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    // اختبار التهيئة
    await this.runTest(suite, 'تهيئة قاعدة البيانات', async () => {
      await this.api.initialize();
      return { initialized: true };
    });

    // اختبار إنشاء مستخدم
    await this.runTest(suite, 'إنشاء مستخدم', async () => {
      const user = await this.api.createUser({
        email: 'test@example.com',
        role: 'patient',
        fullName: 'مستخدم تجريبي'
      });
      
      if (!user.id || user.email !== 'test@example.com') {
        throw new Error('فشل في إنشاء المستخدم');
      }
      
      return { userId: user.id };
    });

    // اختبار البحث عن مستخدم
    await this.runTest(suite, 'البحث عن مستخدم بالبريد الإلكتروني', async () => {
      const user = await this.api.getUserByEmail('test@example.com');
      
      if (!user || user.email !== 'test@example.com') {
        throw new Error('فشل في العثور على المستخدم');
      }
      
      return { found: true };
    });

    // اختبار تحديث مستخدم
    await this.runTest(suite, 'تحديث بيانات المستخدم', async () => {
      const user = await this.api.getUserByEmail('test@example.com');
      if (!user) throw new Error('المستخدم غير موجود');
      
      await this.api.updateUser(user.id, { fullName: 'مستخدم محدث' });
      
      const updatedUser = await this.api.getUserById(user.id);
      if (!updatedUser || updatedUser.fullName !== 'مستخدم محدث') {
        throw new Error('فشل في تحديث المستخدم');
      }
      
      return { updated: true };
    });

    this.testResults.push(suite);
  }

  // اختبارات API الطبي
  private async runMedicalAPITests(): Promise<void> {
    const suite: TestSuite = {
      name: 'اختبارات API الطبي',
      tests: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    // اختبار إنشاء طبيب
    await this.runTest(suite, 'إنشاء ملف طبيب', async () => {
      const user = await this.api.createUser({
        email: 'doctor@example.com',
        role: 'doctor',
        fullName: 'د. أحمد محمد'
      });

      const doctor = await this.api.createDoctor({
        userId: user.id,
        specialty: 'طب عام',
        fullName: 'د. أحمد محمد'
      });
      
      if (!doctor.id || doctor.specialty !== 'طب عام') {
        throw new Error('فشل في إنشاء ملف الطبيب');
      }
      
      return { doctorId: doctor.id };
    });

    // اختبار إنشاء استشارة
    await this.runTest(suite, 'إنشاء استشارة طبية', async () => {
      const patient = await this.api.getUserByEmail('test@example.com');
      if (!patient) throw new Error('المريض غير موجود');

      const consultation = await this.api.createConsultation({
        requesterId: patient.id,
        requesterName: patient.fullName || 'مريض',
        specialty: 'طب عام',
        title: 'استشارة تجريبية',
        description: 'وصف الاستشارة التجريبية',
        urgencyLevel: 'routine'
      });
      
      if (!consultation.id || consultation.status !== 'pending') {
        throw new Error('فشل في إنشاء الاستشارة');
      }
      
      return { consultationId: consultation.id };
    });

    // اختبار تعيين طبيب للاستشارة
    await this.runTest(suite, 'تعيين طبيب للاستشارة', async () => {
      const doctor = await this.api.getDoctorByUserId(
        (await this.api.getUserByEmail('doctor@example.com'))!.id
      );
      if (!doctor) throw new Error('الطبيب غير موجود');

      const consultations = await this.api.getConsultationsByStatus('pending');
      if (consultations.length === 0) throw new Error('لا توجد استشارات معلقة');

      await this.api.assignConsultationToDoctor(
        consultations[0].id,
        doctor.id,
        doctor.fullName
      );
      
      const updatedConsultation = await this.api.getConsultationById(consultations[0].id);
      if (!updatedConsultation || updatedConsultation.status !== 'accepted') {
        throw new Error('فشل في تعيين الطبيب');
      }
      
      return { assigned: true };
    });

    // اختبار إرسال رسالة
    await this.runTest(suite, 'إرسال رسالة', async () => {
      const patient = await this.api.getUserByEmail('test@example.com');
      const doctor = await this.api.getUserByEmail('doctor@example.com');
      
      if (!patient || !doctor) throw new Error('المستخدمون غير موجودون');

      const message = await this.api.sendMessage({
        senderId: patient.id,
        senderName: patient.fullName || 'مريض',
        receiverId: doctor.id,
        receiverName: doctor.fullName || 'طبيب',
        content: 'رسالة تجريبية'
      });
      
      if (!message.id || message.content !== 'رسالة تجريبية') {
        throw new Error('فشل في إرسال الرسالة');
      }
      
      return { messageId: message.id };
    });

    this.testResults.push(suite);
  }

  // اختبارات الأداء
  private async runPerformanceTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'اختبارات الأداء',
      tests: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    // اختبار بناء الفهارس
    await this.runTest(suite, 'بناء الفهارس', async () => {
      await this.optimizer.rebuildAllIndexes();
      return { indexesBuilt: true };
    });

    // اختبار البحث المحسن
    await this.runTest(suite, 'البحث المحسن', async () => {
      const startTime = performance.now();
      
      const results = await this.optimizer.optimizedSearch(
        'users',
        'role',
        'doctor'
      );
      
      const duration = performance.now() - startTime;
      
      if (duration > 100) { // أكثر من 100ms
        throw new Error(`البحث بطيء جداً: ${duration}ms`);
      }
      
      return { duration, resultsCount: results.length };
    });

    // اختبار البحث النصي
    await this.runTest(suite, 'البحث النصي المتقدم', async () => {
      const results = await this.optimizer.fullTextSearch(
        'consultations',
        'تجريبية',
        ['title', 'description']
      );
      
      if (results.length === 0) {
        throw new Error('لم يتم العثور على نتائج');
      }
      
      return { resultsCount: results.length };
    });

    // اختبار إحصائيات الأداء
    await this.runTest(suite, 'إحصائيات الأداء', async () => {
      const metrics = this.optimizer.getPerformanceMetrics();
      
      if (metrics.totalQueries === 0) {
        throw new Error('لا توجد إحصائيات');
      }
      
      return metrics;
    });

    this.testResults.push(suite);
  }

  // اختبارات النسخ الاحتياطي
  private async runBackupTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'اختبارات النسخ الاحتياطي',
      tests: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    let backupId: string;

    // اختبار إنشاء نسخة احتياطية
    await this.runTest(suite, 'إنشاء نسخة احتياطية كاملة', async () => {
      const backup = await this.backupManager.createFullBackup();
      backupId = backup.id;
      
      if (!backup.id || backup.metadata.totalRecords === 0) {
        throw new Error('فشل في إنشاء النسخة الاحتياطية');
      }
      
      return { 
        backupId: backup.id,
        totalRecords: backup.metadata.totalRecords,
        size: backup.metadata.size
      };
    });

    // اختبار قائمة النسخ الاحتياطية
    await this.runTest(suite, 'قائمة النسخ الاحتياطية', async () => {
      const backups = await this.backupManager.getBackupsList();
      
      if (backups.length === 0) {
        throw new Error('لا توجد نسخ احتياطية');
      }
      
      return { backupsCount: backups.length };
    });

    // اختبار تصدير النسخة الاحتياطية
    await this.runTest(suite, 'تصدير النسخة الاحتياطية', async () => {
      const blob = await this.backupManager.exportBackup(backupId);
      
      if (blob.size === 0) {
        throw new Error('فشل في تصدير النسخة الاحتياطية');
      }
      
      return { exportSize: blob.size };
    });

    this.testResults.push(suite);
  }

  // اختبارات المزامنة
  private async runSyncTests(): Promise<void> {
    if (!this.syncManager) return;

    const suite: TestSuite = {
      name: 'اختبارات المزامنة',
      tests: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    // اختبار حالة المزامنة
    await this.runTest(suite, 'حالة المزامنة', async () => {
      const status = this.syncManager!.getSyncStatus();
      return status;
    });

    // اختبار إضافة للمزامنة
    await this.runTest(suite, 'إضافة عملية للمزامنة', async () => {
      this.syncManager!.addToSyncQueue('users', 'test-id', 'update', { test: true });
      
      const status = this.syncManager!.getSyncStatus();
      if (status.pendingChanges === 0) {
        throw new Error('لم تتم إضافة العملية للمزامنة');
      }
      
      return { pendingChanges: status.pendingChanges };
    });

    this.testResults.push(suite);
  }

  // اختبارات الضغط
  private async runStressTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'اختبارات الضغط',
      tests: [],
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      totalDuration: 0
    };

    // اختبار إنشاء مستخدمين متعددين
    await this.runTest(suite, 'إنشاء 100 مستخدم', async () => {
      const startTime = performance.now();
      const users: User[] = [];
      
      for (let i = 0; i < 100; i++) {
        const user = await this.api.createUser({
          email: `user${i}@test.com`,
          role: 'patient',
          fullName: `مستخدم ${i}`
        });
        users.push(user);
      }
      
      const duration = performance.now() - startTime;
      
      if (users.length !== 100) {
        throw new Error(`تم إنشاء ${users.length} مستخدم فقط من أصل 100`);
      }
      
      return { 
        usersCreated: users.length,
        duration,
        averageTime: duration / users.length
      };
    });

    // اختبار البحث في البيانات الكبيرة
    await this.runTest(suite, 'البحث في البيانات الكبيرة', async () => {
      const startTime = performance.now();
      
      const users = await this.api.getAllUsers();
      const duration = performance.now() - startTime;
      
      if (users.length < 100) {
        throw new Error('عدد المستخدمين أقل من المتوقع');
      }
      
      return {
        totalUsers: users.length,
        searchDuration: duration
      };
    });

    this.testResults.push(suite);
  }

  // تشغيل اختبار واحد
  private async runTest(
    suite: TestSuite,
    testName: string,
    testFn: () => Promise<any>
  ): Promise<void> {
    const startTime = performance.now();
    
    try {
      const result = await testFn();
      const duration = performance.now() - startTime;
      
      suite.tests.push({
        testName,
        passed: true,
        duration,
        details: result
      });
      
      suite.passedTests++;
      console.log(`✅ ${testName} (${Math.round(duration)}ms)`);
      
    } catch (error) {
      const duration = performance.now() - startTime;
      
      suite.tests.push({
        testName,
        passed: false,
        duration,
        error: error instanceof Error ? error.message : String(error)
      });
      
      suite.failedTests++;
      console.error(`❌ ${testName} (${Math.round(duration)}ms):`, error);
    }
    
    suite.totalTests++;
    suite.totalDuration += performance.now() - startTime;
  }

  // طباعة ملخص الاختبارات
  private printTestSummary(): void {
    console.log('\n📊 ملخص الاختبارات:');
    console.log('================');
    
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;

    for (const suite of this.testResults) {
      console.log(`\n📁 ${suite.name}:`);
      console.log(`   ✅ نجح: ${suite.passedTests}`);
      console.log(`   ❌ فشل: ${suite.failedTests}`);
      console.log(`   ⏱️ الوقت: ${Math.round(suite.totalDuration)}ms`);
      
      totalTests += suite.totalTests;
      totalPassed += suite.passedTests;
      totalFailed += suite.failedTests;
      totalDuration += suite.totalDuration;
    }

    console.log('\n🎯 الإجمالي:');
    console.log(`   📊 إجمالي الاختبارات: ${totalTests}`);
    console.log(`   ✅ نجح: ${totalPassed}`);
    console.log(`   ❌ فشل: ${totalFailed}`);
    console.log(`   📈 معدل النجاح: ${Math.round((totalPassed / totalTests) * 100)}%`);
    console.log(`   ⏱️ إجمالي الوقت: ${Math.round(totalDuration)}ms`);

    if (totalFailed === 0) {
      console.log('\n🎉 جميع الاختبارات نجحت! قاعدة البيانات تعمل بشكل مثالي.');
    } else {
      console.log(`\n⚠️ ${totalFailed} اختبار فشل. يرجى مراجعة الأخطاء أعلاه.`);
    }
  }

  // تشغيل اختبار سريع
  async runQuickTest(): Promise<boolean> {
    console.log('⚡ تشغيل اختبار سريع...');
    
    try {
      // اختبار التهيئة
      await this.api.initialize();
      
      // اختبار إنشاء مستخدم
      const user = await this.api.createUser({
        email: 'quicktest@example.com',
        role: 'patient',
        fullName: 'اختبار سريع'
      });
      
      // اختبار البحث
      const foundUser = await this.api.getUserByEmail('quicktest@example.com');
      
      if (!foundUser || foundUser.id !== user.id) {
        throw new Error('فشل في الاختبار السريع');
      }
      
      console.log('✅ الاختبار السريع نجح');
      return true;
      
    } catch (error) {
      console.error('❌ فشل الاختبار السريع:', error);
      return false;
    }
  }

  // الحصول على تقرير مفصل
  getDetailedReport(): string {
    let report = '# تقرير اختبارات قاعدة البيانات\n\n';
    
    for (const suite of this.testResults) {
      report += `## ${suite.name}\n\n`;
      report += `- إجمالي الاختبارات: ${suite.totalTests}\n`;
      report += `- نجح: ${suite.passedTests}\n`;
      report += `- فشل: ${suite.failedTests}\n`;
      report += `- الوقت الإجمالي: ${Math.round(suite.totalDuration)}ms\n\n`;
      
      report += '### تفاصيل الاختبارات:\n\n';
      
      for (const test of suite.tests) {
        const status = test.passed ? '✅' : '❌';
        report += `${status} **${test.testName}** (${Math.round(test.duration)}ms)\n`;
        
        if (!test.passed && test.error) {
          report += `   - خطأ: ${test.error}\n`;
        }
        
        if (test.details) {
          report += `   - تفاصيل: ${JSON.stringify(test.details, null, 2)}\n`;
        }
        
        report += '\n';
      }
      
      report += '\n';
    }
    
    return report;
  }
}
