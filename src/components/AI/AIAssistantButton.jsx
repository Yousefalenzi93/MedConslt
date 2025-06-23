import React, { useState } from 'react'
import { Bot, MessageCircle } from 'lucide-react'
import AIAssistant from './AIAssistant'

const AIAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAssistant = () => {
    setIsOpen(!isOpen)
  }

  const closeAssistant = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleAssistant}
          className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          title="المساعد الذكي"
        >
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-primary-600 animate-ping opacity-20"></div>
          
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-2 h-2 text-white" />
          </div>
        </button>
      )}

      {/* AI Assistant Modal */}
      <AIAssistant 
        isOpen={isOpen} 
        onToggle={toggleAssistant}
        onClose={closeAssistant}
      />
    </>
  )
}

export default AIAssistantButton
