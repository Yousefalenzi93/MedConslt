import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../UI/LoadingSpinner'

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user type is required and matches
  if (requiredUserType && user?.userType !== requiredUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            غير مصرح لك بالوصول
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            هذه الصفحة مخصصة لـ {requiredUserType === 'doctor' ? 'الأطباء' : 'المرضى'} فقط
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
