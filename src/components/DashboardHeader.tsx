import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, ChevronDown, Menu, X, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'stock' | 'system' | 'order' | 'employee';
}

export interface HeaderUser {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface HeaderNotifications {
  count: number;
  items: NotificationItem[];
}

export interface HeaderProps {
  pageTitle: string;
  pageSubtitle: string;
  user: HeaderUser;
  notifications: HeaderNotifications;
  onNotificationClick?: () => void;
  onLogout?: () => void;
  onMenuToggle?: () => void;
  isMobile?: boolean;
  className?: string;
}

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

export default function DashboardHeader({
  pageTitle,
  pageSubtitle,
  user,
  notifications,
  onNotificationClick,
  onLogout,
  onMenuToggle,
  isMobile = false,
  className = ''
}: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsUserDropdownOpen(false);
    
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  return (
    <header 
      className={`h-[72px] px-4 lg:px-6 bg-white border-b border-stone-200 flex items-center justify-between shadow-sm ${className}`}
      role="banner"
    >
      {/* Left Section - Title and Subtitle */}
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        {/* Mobile Menu Toggle */}
        {isMobile && onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Page Title and Subtitle */}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 truncate">
            {pageTitle}
          </h1>
          <p className="text-sm lg:text-base text-gray-600 truncate mt-1">
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* Right Section - Notifications and User */}
      <div className="flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleNotificationToggle}
            className={`relative p-2 rounded-lg hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              isNotificationOpen ? 'bg-stone-100' : ''
            }`}
            aria-label={`Notifications ${notifications.count > 0 ? `(${notifications.count} unread)` : ''}`}
            aria-expanded={isNotificationOpen}
            aria-haspopup="true"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            
            {/* Notification Badge */}
            {notifications.count > 0 && (
              <span 
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                aria-label={`${notifications.count} unread notifications`}
              >
                {notifications.count > 9 ? '9+' : notifications.count}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div 
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50 max-h-96 overflow-hidden"
              role="menu"
              aria-label="Notifications"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  {notifications.items.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {notifications.items.length} total
                    </span>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.items.length > 0 ? (
                  <div className="py-2">
                    {notifications.items.slice(0, 5).map((notification) => {
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
                          role="menuitem"
                          tabIndex={0}
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
              {notifications.items.length > 0 && (
                <div className="border-t border-stone-200 px-4 py-3">
                  <button 
                    className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                    role="menuitem"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View All Notifications</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={handleUserDropdownToggle}
            className={`flex items-center space-x-2 lg:space-x-3 bg-white px-3 lg:px-4 py-2 rounded-full shadow-sm border border-stone-200 hover:bg-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              isUserDropdownOpen ? 'ring-2 ring-emerald-500 border-emerald-300' : ''
            }`}
            aria-label="User menu"
            aria-expanded={isUserDropdownOpen}
            aria-haspopup="true"
          >
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center flex-shrink-0">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={`${user.name} avatar`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            
            {/* User Name - Hidden on mobile */}
            <span className="text-sm font-medium text-gray-700 hidden sm:block truncate max-w-32">
              {user.name.split(' ')[0]}
            </span>
            
            {/* Dropdown Arrow */}
            <ChevronDown 
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isUserDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* User Dropdown Menu */}
          {isUserDropdownOpen && (
            <div 
              className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50"
              role="menu"
              aria-label="User menu"
            >
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-stone-200">
                <div className="flex items-center space-x-3">
                  {/* Larger Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={`${user.name} avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-emerald-600" />
                    )}
                  </div>
                  
                  {/* User Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.name}
                    </p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* Profile Section - Future feature */}
                <div className="px-4 py-2">
                  <button 
                    className="w-full text-left flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-stone-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    role="menuitem"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>View Profile</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-stone-200 my-2"></div>

                {/* Logout */}
                <div className="px-4 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}