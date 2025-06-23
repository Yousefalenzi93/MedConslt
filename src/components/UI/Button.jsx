import React from 'react'
import { Loader2 } from 'lucide-react'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white'
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'outline':
        return 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      case 'ghost':
        return 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      case 'link':
        return 'text-primary-600 hover:text-primary-500 dark:text-primary-400 underline-offset-4 hover:underline'
      case 'primary':
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm'
      case 'large':
        return 'px-6 py-3 text-lg'
      case 'xlarge':
        return 'px-8 py-4 text-xl'
      case 'medium':
      default:
        return 'px-4 py-2 text-base'
    }
  }

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-colors duration-200 focus:outline-none focus:ring-2 
    focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 
    disabled:cursor-not-allowed
  `

  const classes = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2 rtl:mr-0 rtl:ml-2">
          {leftIcon}
        </span>
      )}
      
      {children}
      
      {!loading && rightIcon && (
        <span className="ml-2 rtl:ml-0 rtl:mr-2">
          {rightIcon}
        </span>
      )}
    </button>
  )
}

export default Button
