import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import NotificationContainer from '../Notifications/NotificationContainer'

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <NotificationContainer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
      
      {/* Notifications */}
      <NotificationContainer />
    </div>
  )
}

export default Layout
