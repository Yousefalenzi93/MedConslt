import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = null,
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4'
      case 'large':
        return 'w-12 h-12'
      case 'xlarge':
        return 'w-16 h-16'
      case 'medium':
      default:
        return 'w-8 h-8'
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'white':
        return 'text-white'
      case 'gray':
        return 'text-gray-500'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'warning':
        return 'text-yellow-600'
      case 'primary':
      default:
        return 'text-primary-600'
    }
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 
          className={`animate-spin ${getSizeClasses()} ${getColorClasses()}`}
        />
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

export default LoadingSpinner
