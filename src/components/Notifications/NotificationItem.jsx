import React, { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useNotification } from '../../contexts/NotificationContext'

const NotificationItem = ({ notification }) => {
  const { removeNotification } = useNotification()

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700'
      case 'error':
        return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700'
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'
    }
  }

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800 dark:text-green-200'
      case 'error':
        return 'text-red-800 dark:text-red-200'
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200'
      case 'info':
      default:
        return 'text-blue-800 dark:text-blue-200'
    }
  }

  const handleClose = () => {
    removeNotification(notification.id)
  }

  return (
    <div
      className={`
        ${getBackgroundColor()}
        ${getTextColor()}
        border rounded-lg p-4 shadow-lg animate-slide-down
        transform transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 rtl:ml-0 rtl:mr-3 flex-1">
          {notification.title && (
            <h4 className="text-sm font-medium mb-1">
              {notification.title}
            </h4>
          )}
          <p className="text-sm">
            {notification.message}
          </p>
        </div>
        
        <div className="ml-4 rtl:ml-0 rtl:mr-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md"
          >
            <span className="sr-only">إغلاق</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
