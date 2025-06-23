import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, Paperclip, Smile, Search, Phone, Video, MoreVertical } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Messages = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState(1)
  const [newMessage, setNewMessage] = useState('')

  // Mock data
  const conversations = [
    {
      id: 1,
      name: user?.userType === 'doctor' ? 'فاطمة أحمد' : 'د. أحمد محمد',
      lastMessage: 'شكراً لك على الاستشارة المفيدة',
      time: '14:30',
      unread: 2,
      online: true,
      avatar: '/avatars/user1.jpg'
    },
    {
      id: 2,
      name: user?.userType === 'doctor' ? 'محمد علي' : 'د. سارة خالد',
      lastMessage: 'متى يمكنني زيارة العيادة؟',
      time: '12:15',
      unread: 0,
      online: false,
      avatar: '/avatars/user2.jpg'
    },
    {
      id: 3,
      name: user?.userType === 'doctor' ? 'نورا سالم' : 'د. عبدالله حسن',
      lastMessage: 'هل يمكن تكرار الدواء؟',
      time: 'أمس',
      unread: 1,
      online: true,
      avatar: '/avatars/user3.jpg'
    }
  ]

  const messages = [
    {
      id: 1,
      senderId: user?.userType === 'doctor' ? 2 : 1,
      text: 'مرحباً دكتور، أشعر بصداع مستمر منذ يومين',
      time: '14:25',
      isOwn: user?.userType !== 'doctor'
    },
    {
      id: 2,
      senderId: user?.userType === 'doctor' ? 1 : 2,
      text: 'مرحباً، هل يصاحب الصداع أي أعراض أخرى مثل الحمى أو الغثيان؟',
      time: '14:27',
      isOwn: user?.userType === 'doctor'
    },
    {
      id: 3,
      senderId: user?.userType === 'doctor' ? 2 : 1,
      text: 'نعم، أشعر بحمى خفيفة وقليل من الغثيان',
      time: '14:28',
      isOwn: user?.userType !== 'doctor'
    },
    {
      id: 4,
      senderId: user?.userType === 'doctor' ? 1 : 2,
      text: 'أنصحك بأخذ قسط من الراحة وشرب الكثير من السوائل. إذا استمرت الأعراض لأكثر من يومين، يرجى مراجعة العيادة',
      time: '14:30',
      isOwn: user?.userType === 'doctor'
    },
    {
      id: 5,
      senderId: user?.userType === 'doctor' ? 2 : 1,
      text: 'شكراً لك على الاستشارة المفيدة',
      time: '14:30',
      isOwn: user?.userType !== 'doctor'
    }
  ]

  const selectedConversation = conversations.find(c => c.id === selectedChat)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      // Here you would send the message to your backend
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t('messages.title')}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="البحث في المحادثات..."
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              className={`p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedChat === conversation.id ? 'bg-primary-50 dark:bg-primary-900 border-r-2 border-r-primary-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {conversation.name.charAt(0)}
                    </span>
                  </div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {conversation.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary-600 rounded-full">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {selectedConversation.name.charAt(0)}
                      </span>
                    </div>
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedConversation.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedConversation.online ? t('messages.online') : t('messages.offline')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isOwn ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('messages.typeMessage')}
                    className="w-full px-4 py-2 pr-10 rtl:pr-4 rtl:pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                اختر محادثة
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                اختر محادثة من القائمة لبدء المراسلة
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
