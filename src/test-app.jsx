// Simple test app to verify basic functionality
import React from 'react'

const TestApp = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">M</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          منصة الاستشارات الطبية
        </h1>
        
        <p className="text-gray-600 mb-6">
          Medical Consultation Platform
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">React:</span>
            <span className="text-green-600 font-medium">✅ Working</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">TailwindCSS:</span>
            <span className="text-green-600 font-medium">✅ Working</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Arabic Support:</span>
            <span className="text-green-600 font-medium">✅ Working</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Build Status:</span>
            <span className="text-green-600 font-medium">✅ Success</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            🎉 التطبيق يعمل بنجاح!
            <br />
            Application is working successfully!
          </p>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          Version 1.0.0 • Built with React + Vite
        </div>
      </div>
    </div>
  )
}

export default TestApp
