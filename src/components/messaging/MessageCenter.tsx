'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FirestoreService } from '@/lib/firebase/firestore';
import { Message, Conversation, Doctor } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { clsx } from 'clsx';

interface MessageCenterProps {
  selectedConversationId?: string;
  onConversationSelect?: (conversationId: string) => void;
}

export default function MessageCenter({
  selectedConversationId,
  onConversationSelect
}: MessageCenterProps) {
  const { userData } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userData) {
      loadConversations();
    }
  }, [userData]);

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
      // Set up real-time listener for messages
      const unsubscribe = FirestoreService.subscribeToMessages(
        selectedConversationId,
        (newMessages) => {
          setMessages(newMessages);
          scrollToBottom();
        }
      );
      return unsubscribe;
    }
  }, [selectedConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      if (userData) {
        const convs = await FirestoreService.getConversations(userData.id);
        setConversations(convs);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const msgs = await FirestoreService.getMessages(conversationId);
      setMessages(msgs.reverse()); // Reverse to show oldest first
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId || !userData) return;

    try {
      setSending(true);
      const participants = selectedConversationId.split('_');
      const receiverId = participants.find(id => id !== userData.id);
      const conversation = conversations.find(c => c.id === selectedConversationId);
      const receiverName = conversation?.participantNames.find(name => name !== userData.fullName) || 'Unknown';

      if (receiverId) {
        await FirestoreService.sendMessage({
          senderId: userData.id,
          senderName: userData.fullName,
          receiverId,
          receiverName,
          content: newMessage,
          attachments: [],
          isRead: false
        });

        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantNames.some(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Card variant="elevated" padding="none" className="h-full">
          <CardHeader>
            <div className="p-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                المحادثات
              </h3>
              <Input
                placeholder="البحث في المحادثات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                fullWidth
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-y-auto h-[400px]">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-secondary-500">لا توجد محادثات</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => {
                    const otherParticipant = conversation.participantNames.find(
                      name => name !== userData?.fullName
                    );
                    const unreadCount = conversation.unreadCount[userData?.id || ''] || 0;

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => onConversationSelect?.(conversation.id)}
                        className={clsx(
                          'w-full text-right p-3 rounded-lg transition-colors',
                          selectedConversationId === conversation.id
                            ? 'bg-primary-50 border border-primary-200'
                            : 'hover:bg-secondary-50'
                        )}
                      >
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="flex-shrink-0">
                            <UserCircleIcon className="h-10 w-10 text-secondary-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-900 truncate">
                              {otherParticipant}
                            </p>
                            <p className="text-xs text-secondary-500 truncate">
                              {conversation.lastMessage}
                            </p>
                            <p className="text-xs text-secondary-400">
                              {formatDistanceToNow(conversation.lastMessageAt.toDate(), {
                                addSuffix: true,
                                locale: ar
                              })}
                            </p>
                          </div>
                          {unreadCount > 0 && (
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                                {unreadCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Area */}
      <div className="lg:col-span-2">
        <Card variant="elevated" padding="none" className="h-full">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader>
                <div className="p-4 border-b border-secondary-200">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <UserCircleIcon className="h-10 w-10 text-secondary-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {selectedConversation.participantNames.find(
                          name => name !== userData?.fullName
                        )}
                      </h3>
                      <p className="text-sm text-secondary-500">متصل</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent>
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.senderId === userData?.id;
                    return (
                      <div
                        key={message.id}
                        className={clsx(
                          'flex',
                          isOwn ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={clsx(
                            'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                            isOwn
                              ? 'bg-primary-600 text-white'
                              : 'bg-secondary-100 text-secondary-900'
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={clsx(
                              'text-xs mt-1',
                              isOwn ? 'text-primary-100' : 'text-secondary-500'
                            )}
                          >
                            {formatDistanceToNow(message.createdAt.toDate(), {
                              addSuffix: true,
                              locale: ar
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-secondary-200">
                <div className="flex space-x-2 space-x-reverse">
                  <button className="flex-shrink-0 p-2 text-secondary-400 hover:text-secondary-600">
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  <Input
                    placeholder="اكتب رسالتك..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    fullWidth
                  />
                  <Button
                    onClick={sendMessage}
                    loading={sending}
                    disabled={!newMessage.trim()}
                    leftIcon={<PaperAirplaneIcon className="h-4 w-4" />}
                  >
                    إرسال
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <UserCircleIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-500">اختر محادثة لبدء المراسلة</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
