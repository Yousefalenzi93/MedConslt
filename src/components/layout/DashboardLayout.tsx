'use client';

import React, { useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  VideoCameraIcon,
  BookOpenIcon,
  StarIcon,
  LifebuoyIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'الرئيسية', href: '/dashboard', icon: HomeIcon },
  { name: 'الاستشارات', href: '/consultations', icon: ClipboardDocumentListIcon },
  { name: 'الرسائل', href: '/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'المكتبة الطبية', href: '/library', icon: BookOpenIcon },
  { name: 'التقييمات', href: '/ratings', icon: StarIcon },
  { name: 'الدعم الفني', href: '/support', icon: LifebuoyIcon },
];

const adminNavigation = [
  { name: 'إدارة الأطباء', href: '/admin/doctors', icon: UserGroupIcon },
  { name: 'الإحصائيات', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'الإعدادات', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isAdmin = user?.role === 'admin';
  const currentNavigation = isAdmin ? [...navigation, ...adminNavigation] : navigation;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar */}
      <div className={clsx(
        'fixed inset-0 z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-secondary-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 right-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <h2 className="text-lg font-semibold text-secondary-900">القائمة</h2>
            <button
              type="button"
              className="text-secondary-400 hover:text-secondary-600"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="ml-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 shadow-lg">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-primary-600">منصة الاستشارات الطبية</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {currentNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-secondary-700 hover:text-primary-600 hover:bg-secondary-50"
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-secondary-900">
                  <UserCircleIcon className="h-8 w-8 rounded-full bg-secondary-50" />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">{user?.fullName}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-secondary-700 hover:text-error-600 hover:bg-error-50"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0" />
                  تسجيل الخروج
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pr-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-secondary-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-secondary-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button
                type="button"
                className="-m-2.5 p-2.5 text-secondary-400 hover:text-secondary-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <div className="flex items-center gap-x-2">
                  <span className="text-sm font-semibold leading-6 text-secondary-900">
                    {user?.fullName}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.fullName?.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
