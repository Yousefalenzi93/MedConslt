import DashboardLayout from '@/components/layout/DashboardLayout';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function MessagesLoading() {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 flex">
        {/* Conversations Sidebar Skeleton */}
        <div className="w-1/3 border-l border-gray-200 flex flex-col">
          {/* Header Skeleton */}
          <div className="p-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Conversations List Skeleton */}
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area Skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Loading Animation */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative mb-4">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-blue-600 mx-auto animate-pulse" />
                <div className="absolute inset-0 animate-ping">
                  <ChatBubbleLeftRightIcon className="w-16 h-16 text-blue-400 mx-auto opacity-75" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                جاري تحميل الرسائل...
              </h3>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
