'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً! أنا المساعد الذكي للمنصة الطبية. كيف يمكنني مساعدتك اليوم؟',
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        'كيف أحجز استشارة طبية؟',
        'ما هي التخصصات المتاحة؟',
        'كيف أرفع التقارير الطبية؟',
        'معلومات عن الأطباء'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const medicalResponses = {
    'حجز': 'لحجز استشارة طبية:\n1. اختر التخصص المطلوب\n2. اختر الطبيب المناسب\n3. حدد الوقت المناسب\n4. أدخل وصف الحالة\n5. أكد الحجز',
    'تخصص': 'التخصصات المتاحة:\n• طب عام\n• طب الأطفال\n• طب النساء والولادة\n• طب القلب\n• طب الأعصاب\n• طب العيون\n• طب الأسنان\n• الطب النفسي',
    'رفع': 'لرفع التقارير الطبية:\n1. اذهب إلى "ملفاتي الطبية"\n2. انقر "رفع ملف جديد"\n3. اختر نوع التقرير\n4. ارفع الملف (PDF, صورة)\n5. أضف وصف مختصر',
    'طبيب': 'يمكنك عرض معلومات الأطباء من خلال:\n• صفحة الأطباء\n• التقييمات والمراجعات\n• التخصصات والخبرات\n• أوقات العمل المتاحة',
    'مساعدة': 'كيف يمكنني مساعدتك؟\n• حجز الاستشارات\n• معلومات الأطباء\n• رفع الملفات\n• استخدام المنصة\n• المشاكل التقنية',
    'سعر': 'أسعار الاستشارات تختلف حسب:\n• نوع التخصص\n• خبرة الطبيب\n• مدة الاستشارة\n• نوع الاستشارة (مرئية/نصية)\nيمكنك رؤية السعر قبل التأكيد',
    'وقت': 'أوقات العمل:\n• الأطباء متاحون 24/7\n• يمكن حجز مواعيد مسبقة\n• استشارات طارئة متاحة\n• إشعارات للمواعيد القادمة'
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(medicalResponses)) {
      if (message.includes(key)) {
        return response;
      }
    }

    // Default responses
    const defaultResponses = [
      'شكراً لسؤالك. يمكنني مساعدتك في استخدام المنصة الطبية. هل تريد معرفة كيفية حجز استشارة؟',
      'أفهم استفسارك. للحصول على مساعدة أكثر تفصيلاً، يمكنك التواصل مع فريق الدعم أو طرح سؤال أكثر تحديداً.',
      'هذا سؤال جيد! يمكنني مساعدتك في جميع ما يتعلق بالمنصة الطبية. جرب استخدام الكلمات المفتاحية مثل "حجز" أو "طبيب".'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(messageText),
        isUser: false,
        timestamp: new Date(),
        suggestions: messageText.includes('مساعدة') ? [
          'كيف أحجز استشارة؟',
          'ما هي الأسعار؟',
          'أوقات العمل',
          'رفع التقارير'
        ] : undefined
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* AI Assistant Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      >
        <SparklesIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          AI
        </div>
      </button>

      {/* AI Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">المساعد الذكي</h3>
                  <p className="text-sm opacity-90">متاح 24/7 لمساعدتك</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser 
                      ? 'bg-blue-600 text-white rounded-br-md' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}>
                    <p className="whitespace-pre-line">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('ar-SA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-right p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
