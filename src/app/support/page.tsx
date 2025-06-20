'use client';

// Force dynamic rendering to avoid static generation issues with event handlers
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import supportData from '@/data/support.json';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  EyeIcon,
  PencilIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  CogIcon,
  CreditCardIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface Ticket {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedTo: string | null;
  tags: string[];
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
  helpful: number;
  notHelpful: number;
}

export default function SupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [faq, setFaq] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq'>('tickets');
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, statusFilter, categoryFilter]);

  const loadData = () => {
    if (!user) return;

    try {
      let userTickets: Ticket[] = [];
      
      if (user.role === 'admin') {
        userTickets = supportData.tickets;
      } else {
        userTickets = supportData.tickets.filter(ticket => ticket.userId === user.id);
      }

      setTickets(userTickets);
      setFaq(supportData.faq);
      setLoading(false);
    } catch (error) {
      console.error('Error loading support data:', error);
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredTickets(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <ExclamationTriangleIcon className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'مفتوح';
      case 'in_progress': return 'قيد المعالجة';
      case 'resolved': return 'محلول';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <CogIcon className="w-4 h-4" />;
      case 'billing':
        return <CreditCardIcon className="w-4 h-4" />;
      case 'feature_request':
        return <LightBulbIcon className="w-4 h-4" />;
      case 'general':
        return <QuestionMarkCircleIcon className="w-4 h-4" />;
      default:
        return <TicketIcon className="w-4 h-4" />;
    }
  };

  const getCategoryText = (category: string) => {
    const categoryNames: Record<string, string> = {
      technical: 'مشاكل تقنية',
      billing: 'الفواتير والمدفوعات',
      feature_request: 'طلب ميزة جديدة',
      general: 'استفسارات عامة'
    };
    return categoryNames[category] || category;
  };

  const handleCreateTicket = () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) return;

    const ticket: Ticket = {
      id: Date.now().toString(),
      userId: user?.id || '',
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      assignedTo: null,
      tags: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
    setShowNewTicketModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TicketIcon className="w-7 h-7 text-blue-600" />
              الدعم الفني
            </h1>
            <p className="text-gray-600 mt-1">
              مركز المساعدة وحل المشاكل التقنية
            </p>
          </div>
          
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            تذكرة جديدة
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('tickets')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'tickets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                تذاكر الدعم ({tickets.length})
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'faq'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                الأسئلة الشائعة ({faq.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'tickets' ? (
              <div className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="البحث في التذاكر..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="open">مفتوح</option>
                    <option value="in_progress">قيد المعالجة</option>
                    <option value="resolved">محلول</option>
                  </select>

                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">جميع الفئات</option>
                    <option value="technical">مشاكل تقنية</option>
                    <option value="billing">الفواتير والمدفوعات</option>
                    <option value="feature_request">طلب ميزة جديدة</option>
                    <option value="general">استفسارات عامة</option>
                  </select>

                  {/* Results Count */}
                  <div className="flex items-center text-sm text-gray-600">
                    <FunnelIcon className="w-4 h-4 ml-2" />
                    {filteredTickets.length} من {tickets.length} تذكرة
                  </div>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                  {filteredTickets.length === 0 ? (
                    <div className="text-center py-8">
                      <TicketIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تذاكر</h3>
                      <p className="text-gray-600">
                        {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                          ? 'لا توجد تذاكر تطابق معايير البحث'
                          : 'لم يتم إنشاء أي تذاكر دعم بعد'
                        }
                      </p>
                    </div>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {ticket.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(ticket.status)}
                                <span className="text-sm font-medium text-gray-700">
                                  {getStatusText(ticket.status)}
                                </span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                {getPriorityText(ticket.priority)}
                              </span>
                            </div>

                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {ticket.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                {getCategoryIcon(ticket.category)}
                                <span>{getCategoryText(ticket.category)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                <span>{formatDate(ticket.createdAt)}</span>
                              </div>
                              {ticket.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <span>العلامات: {ticket.tags.join(', ')}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="عرض التفاصيل"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="رد"
                            >
                              <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* FAQ Section */
              <div className="space-y-4">
                {faq.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {item.answer}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {getCategoryText(item.category)}
                      </span>
                      <div className="flex items-center gap-4">
                        <span>{item.views} مشاهدة</span>
                        <span>{item.helpful} مفيد</span>
                        <span>{item.notHelpful} غير مفيد</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* New Ticket Modal */}
        {showNewTicketModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">تذكرة دعم جديدة</h3>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان المشكلة
                  </label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اكتب عنوان المشكلة..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف المشكلة
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اشرح المشكلة بالتفصيل..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الفئة
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">استفسارات عامة</option>
                      <option value="technical">مشاكل تقنية</option>
                      <option value="billing">الفواتير والمدفوعات</option>
                      <option value="feature_request">طلب ميزة جديدة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الأولوية
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">منخفض</option>
                      <option value="medium">متوسط</option>
                      <option value="high">عالي</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCreateTicket}
                  disabled={!newTicket.title.trim() || !newTicket.description.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  إنشاء التذكرة
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
