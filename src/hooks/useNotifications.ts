import { useState, useEffect, useCallback } from 'react';
import type { NotificationItem, HeaderNotifications, UseNotificationsReturn } from '../components/DashboardHeader.types';

// Mock notification data - in a real app, this would come from an API
const mockNotifications: NotificationItem[] = [
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

interface UseNotificationsOptions {
  refreshInterval?: number; // in milliseconds
  autoRefresh?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { refreshInterval = 30000, autoRefresh = true } = options;
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mark a specific notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  // Refresh notifications from API
  const refreshNotifications = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would fetch from your API here
      // const response = await fetch('/api/notifications');
      // const newNotifications = await response.json();
      // setNotifications(newNotifications);
      
      // For now, we'll just simulate some new notifications occasionally
      const shouldAddNew = Math.random() > 0.7;
      if (shouldAddNew) {
        const newNotification: NotificationItem = {
          id: Date.now().toString(),
          type: 'info',
          title: 'New Update',
          message: 'System has been updated successfully',
          timestamp: 'Just now',
          isRead: false,
          category: 'system'
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh notifications
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refreshNotifications, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshNotifications, refreshInterval, autoRefresh]);

  const headerNotifications: HeaderNotifications = {
    count: unreadCount,
    items: notifications
  };

  return {
    notifications: headerNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    isLoading
  };
}