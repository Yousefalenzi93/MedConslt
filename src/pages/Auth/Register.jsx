import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Mail, Lock, User, UserCheck, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const Register = () => {
  const { t } = useTranslation()
  const { register, isLoading } = useAuth()
  const { showSuccess, showError } = useNotification()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient',
    specialty: '',
    experience: '',
    license: '',
    phone: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'اسم العائلة مطلوب'
    }
    
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة'
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة'
    }
    
    if (formData.userType === 'doctor') {
      if (!formData.specialty.trim()) {
        newErrors.specialty = 'التخصص مطلوب للأطباء'
      }
      if (!formData.license.trim()) {
        newErrors.license = 'رقم الترخيص مطلوب للأطباء'
      }
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const { confirmPassword, agreeToTerms, ...registrationData } = formData
      await register(registrationData)
      
      showSuccess(t('auth.registerSuccess'))
      navigate('/dashboard')
    } catch (error) {
      showError(error.message || t('auth.registerError'))
    }
  }

  const specialties = [
    'طب عام',
    'طب الأطفال',
    'طب النساء والولادة',
    'طب القلب',
    'طب الأعصاب',
    'طب العيون',
    'طب الأسنان',
    'طب الجلدية',
    'طب العظام',
    'الطب النفسي'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.register')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              {t('auth.login')}
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('auth.userType')}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`
                relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors
                ${formData.userType === 'patient' 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }
              `}>
                <input
                  type="radio"
                  name="userType"
                  value="patient"
                  checked={formData.userType === 'patient'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <User className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('auth.patient')}
                  </span>
                </div>
              </label>
              
              <label className={`
                relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors
                ${formData.userType === 'doctor' 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }
              `}>
                <input
                  type="radio"
                  name="userType"
                  value="doctor"
                  checked={formData.userType === 'doctor'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t('auth.doctor')}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.firstName')}
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`
                  w-full px-3 py-3 border ${errors.firstName ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'}
                  rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                `}
                placeholder="أحمد"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.lastName')}
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`
                  w-full px-3 py-3 border ${errors.lastName ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'}
                  rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                `}
                placeholder="محمد"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('auth.email')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`
                  w-full px-3 py-3 pl-10 rtl:pl-3 rtl:pr-10 border ${errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'}
                  rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                `}
                placeholder="example@domain.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-3 pl-10 rtl:pl-3 rtl:pr-10 pr-10 rtl:pr-3 rtl:pl-10 border ${errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'}
                    rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-3 pl-10 rtl:pl-3 rtl:pr-10 pr-10 rtl:pr-3 rtl:pl-10 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'}
                    rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Doctor-specific fields */}
          {formData.userType === 'doctor' && (
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                معلومات مهنية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Specialty */}
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    التخصص
                  </label>
                  <select
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className={`
                      w-full px-3 py-3 border ${errors.specialty ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'}
                      rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    `}
                  >
                    <option value="">اختر التخصص</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  {errors.specialty && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.specialty}</p>
                  )}
                </div>

                {/* License */}
                <div>
                  <label htmlFor="license" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    رقم الترخيص
                  </label>
                  <input
                    id="license"
                    name="license"
                    type="text"
                    value={formData.license}
                    onChange={handleChange}
                    className={`
                      w-full px-3 py-3 border ${errors.license ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'}
                      rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    `}
                    placeholder="DOC123456"
                  />
                  {errors.license && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.license}</p>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  سنوات الخبرة
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10"
                />
              </div>
            </div>
          )}

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              رقم الهاتف (اختياري)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="+966501234567"
            />
          </div>

          {/* Terms Agreement */}
          <div>
            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 rtl:ml-0 rtl:mr-2 block text-sm text-gray-900 dark:text-gray-300">
                أوافق على{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  الشروط والأحكام
                </Link>
                {' '}و{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  سياسة الخصوصية
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                <>
                  {t('auth.register')}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
