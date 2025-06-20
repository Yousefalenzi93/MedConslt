'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputClasses = clsx(
      'block w-full rounded-lg border-0 py-2.5 text-secondary-900',
      'ring-1 ring-inset ring-secondary-300 placeholder:text-secondary-400',
      'focus:ring-2 focus:ring-inset focus:ring-primary-600',
      'disabled:cursor-not-allowed disabled:bg-secondary-50 disabled:text-secondary-500',
      'transition-colors duration-200',
      {
        'pl-10': leftIcon,
        'pr-10': rightIcon,
        'px-3': !leftIcon && !rightIcon,
        'ring-error-300 focus:ring-error-600': error,
        'w-full': fullWidth
      },
      className
    );

    const containerClasses = clsx({
      'w-full': fullWidth
    });

    return (
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium leading-6 text-secondary-900 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-secondary-400 sm:text-sm">{leftIcon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            {...props}
          />
          
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-secondary-400 sm:text-sm">{rightIcon}</span>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-error-600" id={`${inputId}-error`}>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-secondary-500" id={`${inputId}-description`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
