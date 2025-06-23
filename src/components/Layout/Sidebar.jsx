import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  User, 
  BarChart3,
  Stethoscope,
  Users
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const location = useLocation()

  const navigationItems = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: t('navigation.consultations'),
      href: '/consultations',
      icon: Stethoscope,
      current: location.pathname === '/consultations'
    },
    {
      name: t('navigation.messages'),
      href: '/messages',
      icon: MessageSquare,
      current: location.pathname === '/messages'
    },
    {
      name: t('navigation.library'),
      href: '/library',
      icon: BookOpen,
      current: location.pathname === '/library'
    },
    {
      name: t('navigation.profile'),
      href: '/profile',
      icon: User,
      current: location.pathname === '/profile'
    }
  ]

  // Add analytics for doctors
  if (user?.userType === 'doctor') {
    navigationItems.push({
      name: t('navigation.analytics'),
      href: '/analytics',
      icon: BarChart3,
      current: location.pathname === '/analytics'
    })
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="ml-2 rtl:ml-0 rtl:mr-2 text-xl font-bold text-gray-900 dark:text-white">
              Medical
            </span>
          </div>
          
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.current
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon
                    className={`
                      mr-3 rtl:mr-0 rtl:ml-3 flex-shrink-0 h-5 w-5 transition-colors
                      ${item.current
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      }
                    `}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        {/* User Info at Bottom */}
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="ml-3 rtl:ml-0 rtl:mr-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.userType === 'doctor' ? t('auth.doctor') : t('auth.patient')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
