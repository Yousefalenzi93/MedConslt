import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Minimize2, Maximize2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../UI/Button'
import LoadingSpinner from '../UI/LoadingSpinner'

const AIAssistant = ({ isOpen, onToggle, onClose }) => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'مرحباً! أنا المساعد الذكي للاستشارات الطبية. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Mock AI responses - في التطبيق الحقيقي، ستتصل بـ API
  const getAIResponse = async (message) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const responses = {
      'صداع': 'الصداع يمكن أن يكون له أسباب متعددة. هل يصاحبه أعراض أخرى مثل الحمى أو الغثيان؟ أنصحك بشرب الماء والراحة، وإذا استمر لأكثر من يومين، يرجى استشارة طبيب.',
      'حمى': 'الحمى عادة ما تكون علامة على وجود عدوى. تأكد من شرب السوائل والراحة. إذا كانت الحمى أعلى من 38.5 درجة مئوية أو استمرت لأكثر من 3 أيام، يجب استشارة طبيب.',
      'ألم': 'يمكنني مساعدتك في فهم الألم بشكل أفضل. أين تشعر بالألم تحديداً؟ ومتى بدأ؟ هذه المعلومات ستساعد في تقديم نصائح أفضل.',
      'دواء': 'لا يمكنني وصف الأدوية، لكن يمكنني تقديم معلومات عامة. من المهم دائماً استشارة طبيب أو صيدلي قبل تناول أي دواء.',
      'موعد': 'يمكنك حجز موعد مع أحد أطبائنا من خلال قسم الاستشارات. هل تريد أن أوجهك إلى قائمة الأطباء المتاحين؟'
    }

    // Simple keyword matching
    const lowerMessage = message.toLowerCase()
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return response
      }
    }

    return 'شكراً لسؤالك. للحصول على استشارة طبية دقيقة، أنصحك بحجز موعد مع أحد أطبائنا المختصين. يمكنني مساعدتك في العثور على الطبيب المناسب لحالتك.'
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const aiResponse = await getAIResponse(inputMessage)
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    'لدي صداع مستمر',
    'أشعر بحمى خفيفة',
    'أريد حجز موعد',
    'معلومات عن الأدوية',
    'نصائح صحية عامة'
  ]

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 rtl:right-auto rtl:left-4 z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                المساعد الذكي
              </h3>
              <p className="text-xs text-green-600 dark:text-green-400">
                متصل
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 rtl:space-x-reverse max-w-xs ${
                    message.type === 'user' ? 'flex-row-reverse rtl:flex-row' : ''
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary-600' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    
                    <div className={`px-3 py-2 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 rtl:space-x-reverse">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                      <LoadingSpinner size="small" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  أسئلة شائعة:
                </p>
                <div className="flex flex-wrap gap-1">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="small"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                ⚠️ هذا مساعد ذكي للمعلومات العامة فقط. للاستشارة الطبية الدقيقة، يرجى حجز موعد مع طبيب.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AIAssistant
