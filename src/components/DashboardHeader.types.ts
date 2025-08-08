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

// Utility type for notification refresh
export interface NotificationRefreshOptions {
  interval?: number; // in milliseconds, default 30000 (30 seconds)
  onRefresh?: (notifications: NotificationItem[]) => void;
}

// Hook return type for notification management
export interface UseNotificationsReturn {
  notifications: HeaderNotifications;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => Promise<void>;
  isLoading: boolean;
}