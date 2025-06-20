'use client';

import React from 'react';
import { ConsultationRequest } from '@/types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaperClipIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
// Simple date formatting function
const formatTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'الآن';
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `منذ ${diffInDays} يوم`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `منذ ${diffInWeeks} أسبوع`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `منذ ${diffInMonths} شهر`;
};

interface ConsultationCardProps {
  consultation: ConsultationRequest;
  onAccept?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  onView?: (id: string) => void;
  showActions?: boolean;
}

export default function ConsultationCard({
  consultation,
  onAccept,
  onReject,
  onView,
  showActions = true
}: ConsultationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-warning-600 bg-warning-100';
      case 'accepted':
        return 'text-primary-600 bg-primary-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-success-600 bg-success-100';
      case 'rejected':
        return 'text-error-600 bg-error-100';
      default:
        return 'text-secondary-600 bg-secondary-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'accepted':
        return 'مقبولة';
      case 'in-progress':
        return 'قيد المعالجة';
      case 'completed':
        return 'مكتملة';
      case 'rejected':
        return 'مرفوضة';
      default:
        return status;
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return <ExclamationTriangleIcon className="h-4 w-4 text-error-600" />;
      case 'urgent':
        return <ClockIcon className="h-4 w-4 text-warning-600" />;
      default:
        return <CalendarIcon className="h-4 w-4 text-secondary-600" />;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'طارئ';
      case 'urgent':
        return 'عاجل';
      case 'routine':
        return 'روتيني';
      default:
        return urgency;
    }
  };

  const handleReject = () => {
    const reason = prompt('يرجى إدخال سبب الرفض:');
    if (reason && onReject) {
      onReject(consultation.id, reason);
    }
  };

  return (
    <Card variant="elevated" padding="none" hover>
      <CardHeader>
        <div className="flex items-start justify-between p-4 pb-0">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-1">
              {consultation.title}
            </h3>
            <p className="text-sm text-secondary-600">
              من: {consultation.requesterName}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={clsx(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getStatusColor(consultation.status)
            )}>
              {getStatusText(consultation.status)}
            </span>
            <div className="flex items-center space-x-1 space-x-reverse">
              {getUrgencyIcon(consultation.urgencyLevel)}
              <span className="text-xs text-secondary-600">
                {getUrgencyText(consultation.urgencyLevel)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="px-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-secondary-700 mb-1">التخصص:</p>
            <p className="text-sm text-secondary-600">{consultation.specialty}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-secondary-700 mb-1">الوصف:</p>
            <p className="text-sm text-secondary-600 line-clamp-3">
              {consultation.description}
            </p>
          </div>

          {consultation.attachments && consultation.attachments.length > 0 && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <PaperClipIcon className="h-4 w-4 text-secondary-400" />
              <span className="text-xs text-secondary-600">
                {consultation.attachments.length} مرفق
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-secondary-500">
            <span>
              {formatTimeAgo(consultation.createdAt)}
            </span>
            {consultation.assignedDoctorName && (
              <span>الطبيب: {consultation.assignedDoctorName}</span>
            )}
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter>
          <div className="px-4 pb-4 flex space-x-3 space-x-reverse">
            {consultation.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => onAccept?.(consultation.id)}
                  leftIcon={<CheckCircleIcon className="h-4 w-4" />}
                >
                  قبول
                </Button>
                <Button
                  size="sm"
                  variant="error"
                  onClick={handleReject}
                  leftIcon={<XCircleIcon className="h-4 w-4" />}
                >
                  رفض
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onView?.(consultation.id)}
              fullWidth={consultation.status !== 'pending'}
            >
              عرض التفاصيل
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
