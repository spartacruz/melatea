import type { Meta, StoryObj } from '@storybook/react';
import DashboardHeader from './DashboardHeader';
import type { HeaderProps, NotificationItem } from './DashboardHeader';

const meta: Meta<typeof DashboardHeader> = {
  title: 'Components/DashboardHeader',
  component: DashboardHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A reusable header component for POS dashboard pages with notifications and user management.',
      },
    },
  },
  argTypes: {
    pageTitle: {
      control: 'text',
      description: 'The main title of the current page',
    },
    pageSubtitle: {
      control: 'text',
      description: 'Context-specific subtitle for the page',
    },
    onNotificationClick: {
      action: 'notification clicked',
      description: 'Callback when notification bell is clicked',
    },
    onLogout: {
      action: 'logout clicked',
      description: 'Callback when logout is triggered',
    },
    onMenuToggle: {
      action: 'menu toggled',
      description: 'Callback for mobile menu toggle',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DashboardHeader>;

// Mock notification data
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

const defaultArgs: HeaderProps = {
  pageTitle: 'Dashboard',
  pageSubtitle: 'Overview of your business performance',
  user: {
    name: 'Airlangga Wibowo',
    role: 'Manager',
    avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  notifications: {
    count: 3,
    items: mockNotifications
  }
};

export const Default: Story = {
  args: defaultArgs,
};

export const WithManyNotifications: Story = {
  args: {
    ...defaultArgs,
    pageTitle: 'Inventory Management',
    pageSubtitle: 'Monitor and manage material stock levels',
    notifications: {
      count: 12,
      items: mockNotifications
    }
  },
};

export const NoNotifications: Story = {
  args: {
    ...defaultArgs,
    pageTitle: 'Settings',
    pageSubtitle: 'Configure your POS system preferences',
    notifications: {
      count: 0,
      items: []
    }
  },
};

export const LongTitles: Story = {
  args: {
    ...defaultArgs,
    pageTitle: 'Very Long Page Title That Should Truncate Properly',
    pageSubtitle: 'This is a very long subtitle that demonstrates how the component handles overflow text and responsive behavior',
  },
};

export const DifferentUser: Story = {
  args: {
    ...defaultArgs,
    pageTitle: 'Order Queue',
    pageSubtitle: 'Kitchen order management and tracking',
    user: {
      name: 'Sarah Martinez',
      role: 'Cashier',
      // No avatar URL to test fallback
    }
  },
};

export const Mobile: Story = {
  args: {
    ...defaultArgs,
    isMobile: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  args: defaultArgs,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Interactive story for testing dropdown behavior
export const Interactive: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    // This would be used for interaction testing in Storybook
    // Example: clicking notifications, user dropdown, etc.
  },
};