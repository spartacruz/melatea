import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Package, Users, Clock, Eye } from 'lucide-react';

interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'stock' | 'system' | 'order' | 'employee';
}

interface NotificationBellProps {
  className?: string;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Milk Powder is out of stock',
    timestamp: '5 mins ago',
    isRead: false,
    category: 'stock'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Green Tea Leaves running low (8 kg remaining)',
    timestamp: '15 mins ago',
    isRead: false,
    category: 'stock'
  },
  {
    id: '3',
    type: 'success',
    title: 'Stock Received',
    message: 'Black Tea Leaves restocked (50 kg received)',
    timestamp: '1 hour ago',
    isRead: true,
    category: 'stock'
  },
  {
    id: '4',
    type: 'info',
    title: 'New Order',
    message: 'Order #ORD-007 received from customer',
    timestamp: '2 hours ago',
    isRead: true,
    category: 'order'
  },
  {
    id: '5',
    type: 'error',
    title: 'System Alert',
    message: 'Printer connection lost',
    timestamp: '3 hours ago',
    isRead: false,
    category: 'system'
  }
];

const notificationIcons = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Bell,
  error: AlertTriangle
};

const notificationColors = {
  warning: 'text-amber-600 bg-amber-50',
  success: 'text-emerald-600 bg-emerald-50',
  info: 'text-blue-600 bg-blue-50',
  error: 'text-red-600 bg-red-50'
};

export default function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    
    // Mark notifications as read when opened
    if (!isOpen && unreadCount > 0) {
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        isRead: true
      })));
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={handleToggle}
        className={`relative p-2 rounded-lg hover:bg-stone-100 transition-colors ${
          isOpen ? 'bg-stone-100' : ''
        }`}
      >
        <Bell className="w-5 h-5 text-gray-600" />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              {notifications.length > 0 && (
                <span className="text-sm text-gray-500">
                  {notifications.length} total
                </span>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="py-2">
                {notifications.slice(0, 5).map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  const colorClass = notificationColors[notification.type];
                  
                  return (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-stone-50 transition-colors cursor-pointer border-l-4 ${
                        notification.type === 'warning' ? 'border-amber-400' :
                        notification.type === 'success' ? 'border-emerald-400' :
                        notification.type === 'info' ? 'border-blue-400' :
                        'border-red-400'
                      } ${!notification.isRead ? 'bg-blue-25' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-stone-200 px-4 py-3">
              <button className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View All Notifications</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}