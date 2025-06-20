'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  UserIcon, 
  KeyIcon, 
  InformationCircleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

export default function DemoData() {
  const demoAccounts = [
    {
      type: 'طبيب',
      email: 'doctor@example.com',
      password: 'demo123',
      description: 'حساب طبيب للاختبار',
      features: ['عرض الاستشارات', 'الرد على الاستشارات', 'المكالمات المرئية', 'المراسلة']
    },
    {
      type: 'مدير',
      email: 'admin@example.com', 
      password: 'admin123',
      description: 'حساب مدير للاختبار',
      features: ['إدارة الأطباء', 'الإحصائيات', 'إدارة المحتوى', 'الدعم الفني']
    }
  ];

  const systemFeatures = [
    'نظام الاستشارات الطبية الشامل',
    'المكالمات المرئية عبر WebRTC',
    'المكتبة الطبية التفاعلية',
    'نظام الرسائل الآمن',
    'تقييم الأطباء والخدمات',
    'الدعم الفني المتكامل',
    'واجهة عربية كاملة',
    'تصميم متجاوب لجميع الأجهزة'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            منصة الاستشارات الطبية
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            نظام شامل للاستشارات الطبية والتواصل بين الأطباء
          </p>
          <div className="flex items-center justify-center space-x-2 space-x-reverse">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <span className="text-green-600 font-medium">النظام جاهز للاستخدام</span>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoAccounts.map((account, index) => (
            <Card key={index} variant="elevated" padding="lg">
              <CardHeader>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      حساب {account.type}
                    </h3>
                    <p className="text-sm text-gray-600">{account.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <KeyIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">بيانات الدخول:</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>البريد الإلكتروني:</strong> {account.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>كلمة المرور:</strong> {account.password}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">الميزات المتاحة:</h4>
                    <ul className="space-y-1">
                      {account.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 space-x-reverse">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Features */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-3 bg-green-100 rounded-lg">
                <InformationCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  ميزات النظام
                </h3>
                <p className="text-sm text-gray-600">جميع الميزات المطلوبة متوفرة</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 space-x-reverse">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card variant="elevated" padding="lg">
          <CardHeader title="تعليمات الاستخدام" />
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">للبدء:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>انقر على "تسجيل الدخول" في الأعلى</li>
                  <li>استخدم أحد الحسابات التجريبية أعلاه</li>
                  <li>استكشف جميع ميزات النظام</li>
                  <li>جرب إنشاء استشارة جديدة</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">ملاحظة مهمة:</h4>
                <p className="text-sm text-yellow-800">
                  هذا نظام تجريبي للعرض. لاستخدام النظام في الإنتاج، يجب إعداد Firebase وقاعدة البيانات الحقيقية.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/auth/login'}
              leftIcon={<UserIcon className="h-5 w-5" />}
            >
              تسجيل الدخول
            </Button>
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => window.location.href = '/auth/register'}
              leftIcon={<UserIcon className="h-5 w-5" />}
            >
              إنشاء حساب جديد
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            تم تطوير النظام باستخدام Next.js 14, TypeScript, Firebase, و Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
