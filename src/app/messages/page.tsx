'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext.simple';
import { localDataService, Conversation, Message, User } from '@/services/localDataService';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = () => {
    if (!user) return;

    try {
      const userConversations = localDataService.getUserConversations(user.id);
      setConversations(userConversations);
      
      // Select first conversation if none selected
      if (userConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(userConversations[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setLoading(false);
    }
  };

  const loadMessages = (conversationId: string) => {
    try {
      const conversationMessages = localDataService.getMessagesByConversation(conversationId);
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markAsRead = (conversationId: string) => {
    if (!user) return;
    localDataService.markMessagesAsRead(conversationId, user.id);
    loadConversations(); // Refresh to update unread counts
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const otherParticipant = selectedConversation.participants.find(p => p !== user.id);
    if (!otherParticipant) return;

    try {
      const messageData = {
        conversationId: selectedConversation.id,
        senderId: user.id,
        receiverId: otherParticipant,
        content: newMessage.trim(),
        type: 'text' as const,
        attachments: [],
        isRead: false
      };

      localDataService.createMessage(messageData);
      setNewMessage('');
      loadMessages(selectedConversation.id);
      loadConversations(); // Refresh conversations to update last message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherParticipant = (conversation: Conversation): User | null => {
    if (!user) return null;
    const otherParticipantId = conversation.participants.find(p => p !== user.id);
    if (!otherParticipantId) return null;
    return localDataService.getUserById(otherParticipantId);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('ar-SA', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMinutes < 60) {
      return `منذ ${Math.floor(diffInMinutes)} دقيقة`;
    } else if (diffInHours < 24) {
      return `منذ ${Math.floor(diffInHours)} ساعة`;
    } else if (diffInDays < 7) {
      return `منذ ${Math.floor(diffInDays)} يوم`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    const otherParticipant = getOtherParticipant(conversation);
    return otherParticipant?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 flex">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-l border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">الرسائل</h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في المحادثات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <UserCircleIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>لا توجد محادثات</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                const unreadCount = conversation.unreadCount[user?.id || ''] || 0;
                const isSelected = selectedConversation?.id === conversation.id;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        {otherParticipant?.avatar ? (
                          <img
                            src={otherParticipant.avatar}
                            alt={otherParticipant.fullName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <UserCircleIcon className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                        {unreadCount > 0 && (
                          <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium truncate ${unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                            {otherParticipant?.fullName || 'مستخدم غير معروف'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatLastMessageTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {conversation.lastMessage}
                        </p>
                        {otherParticipant?.role && (
                          <span className="text-xs text-blue-600 mt-1 inline-block">
                            {otherParticipant.role === 'doctor' ? 'طبيب' : 
                             otherParticipant.role === 'patient' ? 'مريض' : 'مدير'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const otherParticipant = getOtherParticipant(selectedConversation);
                      return (
                        <>
                          {otherParticipant?.avatar ? (
                            <img
                              src={otherParticipant.avatar}
                              alt={otherParticipant.fullName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <UserCircleIcon className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {otherParticipant?.fullName || 'مستخدم غير معروف'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {otherParticipant?.role === 'doctor' ? `${otherParticipant.specialty}` : 
                               otherParticipant?.role === 'patient' ? 'مريض' : 'مدير'}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-between mt-1 text-xs ${
                          isOwn ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>{formatMessageTime(message.createdAt)}</span>
                          {isOwn && (
                            <div className="mr-2">
                              {message.isRead ? (
                                <div className="flex">
                                  <CheckIcon className="w-4 h-4" />
                                  <CheckIcon className="w-4 h-4 -mr-1" />
                                </div>
                              ) : (
                                <CheckIcon className="w-4 h-4" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-end gap-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <PaperClipIcon className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="اكتب رسالتك هنا..."
                      rows={1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <UserCircleIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">اختر محادثة</h3>
                <p>اختر محادثة من القائمة لبدء المراسلة</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
