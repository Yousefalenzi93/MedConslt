import React from 'react'

const TestApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl font-bold">م</span>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          منصة الاستشارات الطبية
        </h1>
        
        <p className="text-gray-600 mb-6">
          React App يعمل بنجاح!
        </p>
        
        {/* Status Cards */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-gray-700">React</span>
            <span className="text-green-600 font-semibold">✅ يعمل</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-gray-700">TailwindCSS</span>
            <span className="text-green-600 font-semibold">✅ يعمل</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-gray-700">دعم العربية</span>
            <span className="text-green-600 font-semibold">✅ يعمل</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-gray-700">Vite</span>
            <span className="text-green-600 font-semibold">✅ يعمل</span>
          </div>
        </div>
        
        {/* Success Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">🎉 التطبيق يعمل بنجاح!</h3>
          <p className="text-sm text-blue-600">
            جميع المكونات الأساسية تعمل بشكل صحيح
          </p>
        </div>
        
        {/* Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>React {React.version}</p>
          <p>Built with Vite</p>
          <p>Styled with TailwindCSS</p>
        </div>
      </div>
    </div>
  )
}

export default TestApp
