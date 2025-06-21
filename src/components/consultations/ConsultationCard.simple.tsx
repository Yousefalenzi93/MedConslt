'use client';

import React from 'react';
import { ConsultationRequest } from '@/types';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface ConsultationCardProps {
  consultation: ConsultationRequest;
  showActions?: boolean;
}

export default function ConsultationCard({ 
  consultation, 
  showActions = false 
}: ConsultationCardProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-warning-600 bg-warning-100';
      case 'accepted':
        return 'text-primary-600 bg-primary-100';
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
      case 'urgent':
        return <ExclamationTriangleIcon className="h-4 w-4 text-error-500" />;
      case 'normal':
        return <ClockIcon className="h-4 w-4 text-warning-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-secondary-500" />;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'عاجل';
      case 'normal':
        return 'عادي';
      default:
        return urgency;
    }
  };

  // Internal handlers - no external props
  const handleAccept = () => {
    console.log('Accept consultation:', consultation.id);
    // Handle accept logic internally
  };

  const handleReject = () => {
    console.log('Reject consultation:', consultation.id);
    // Handle reject logic internally
  };

  const handleView = () => {
    console.log('View consultation:', consultation.id);
    // Handle view logic internally
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
        <div className="px-4 py-2">
          <p className="text-sm text-secondary-700 mb-3">
            {consultation.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-secondary-500">
            <span>التخصص: {consultation.specialty}</span>
            <span>{new Date(consultation.createdAt).toLocaleDateString('ar-SA')}</span>
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
                  onClick={handleAccept}
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
              onClick={handleView}
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
