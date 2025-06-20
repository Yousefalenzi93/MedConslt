'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95'
    ];

    const variantClasses = {
      primary: [
        'bg-blue-600 text-white',
        'hover:bg-blue-700 focus:ring-blue-500',
        'shadow-sm hover:shadow-md'
      ],
      secondary: [
        'bg-gray-100 text-gray-900',
        'hover:bg-gray-200 focus:ring-gray-500',
        'border border-gray-300'
      ],
      success: [
        'bg-green-600 text-white',
        'hover:bg-green-700 focus:ring-green-500',
        'shadow-sm hover:shadow-md'
      ],
      warning: [
        'bg-yellow-600 text-white',
        'hover:bg-yellow-700 focus:ring-yellow-500',
        'shadow-sm hover:shadow-md'
      ],
      error: [
        'bg-red-600 text-white',
        'hover:bg-red-700 focus:ring-red-500',
        'shadow-sm hover:shadow-md'
      ],
      ghost: [
        'text-gray-700 bg-transparent',
        'hover:bg-gray-100 focus:ring-gray-500'
      ]
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg'
    };

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      {
        'w-full': fullWidth,
        'cursor-not-allowed': loading || disabled
      },
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        
        {children}
        
        {!loading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
