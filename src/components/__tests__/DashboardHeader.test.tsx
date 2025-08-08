import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DashboardHeader from '../DashboardHeader';
import type { HeaderProps, NotificationItem } from '../DashboardHeader';

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
    type: 'success',
    title: 'Stock Received',
    message: 'Black Tea Leaves restocked',
    timestamp: '1 hour ago',
    isRead: true,
    category: 'stock'
  }
];

const defaultProps: HeaderProps = {
  pageTitle: 'Dashboard',
  pageSubtitle: 'Overview of your business performance',
  user: {
    name: 'John Doe',
    role: 'Manager',
    avatarUrl: 'https://example.com/avatar.jpg'
  },
  notifications: {
    count: 1,
    items: mockNotifications
  }
};

describe('DashboardHeader', () => {
  it('renders page title and subtitle correctly', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
    expect(screen.getByText('Overview of your business performance')).toBeInTheDocument();
  });

  it('displays user information correctly', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    expect(screen.getByText('John')).toBeInTheDocument(); // First name only
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();
  });

  it('shows notification count badge when there are unread notifications', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    const notificationButton = screen.getByLabelText(/Notifications.*1 unread/);
    expect(notificationButton).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('does not show notification badge when count is 0', () => {
    const propsWithNoNotifications = {
      ...defaultProps,
      notifications: { count: 0, items: [] }
    };
    
    render(<DashboardHeader {...propsWithNoNotifications} />);
    
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('opens notification dropdown when bell is clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardHeader {...defaultProps} />);
    
    const notificationButton = screen.getByLabelText(/Notifications/);
    await user.click(notificationButton);
    
    expect(screen.getByText('Low Stock Alert')).toBeInTheDocument();
    expect(screen.getByText('Stock Received')).toBeInTheDocument();
  });

  it('opens user dropdown when user pill is clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardHeader {...defaultProps} />);
    
    const userButton = screen.getByLabelText('User menu');
    await user.click(userButton);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('View Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls onLogout when logout button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnLogout = jest.fn();
    
    render(<DashboardHeader {...defaultProps} onLogout={mockOnLogout} />);
    
    const userButton = screen.getByLabelText('User menu');
    await user.click(userButton);
    
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('calls onNotificationClick when notification bell is clicked', async () => {
    const user = userEvent.setup();
    const mockOnNotificationClick = jest.fn();
    
    render(<DashboardHeader {...defaultProps} onNotificationClick={mockOnNotificationClick} />);
    
    const notificationButton = screen.getByLabelText(/Notifications/);
    await user.click(notificationButton);
    
    expect(mockOnNotificationClick).toHaveBeenCalledTimes(1);
  });

  it('shows mobile menu toggle when isMobile is true', () => {
    const mockOnMenuToggle = jest.fn();
    
    render(
      <DashboardHeader 
        {...defaultProps} 
        isMobile={true} 
        onMenuToggle={mockOnMenuToggle} 
      />
    );
    
    expect(screen.getByLabelText('Toggle navigation menu')).toBeInTheDocument();
  });

  it('calls onMenuToggle when mobile menu button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnMenuToggle = jest.fn();
    
    render(
      <DashboardHeader 
        {...defaultProps} 
        isMobile={true} 
        onMenuToggle={mockOnMenuToggle} 
      />
    );
    
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    await user.click(menuButton);
    
    expect(mockOnMenuToggle).toHaveBeenCalledTimes(1);
  });

  it('closes dropdowns when clicking outside', async () => {
    const user = userEvent.setup();
    render(<DashboardHeader {...defaultProps} />);
    
    // Open notification dropdown
    const notificationButton = screen.getByLabelText(/Notifications/);
    await user.click(notificationButton);
    expect(screen.getByText('Low Stock Alert')).toBeInTheDocument();
    
    // Click outside
    await user.click(document.body);
    
    await waitFor(() => {
      expect(screen.queryByText('Low Stock Alert')).not.toBeInTheDocument();
    });
  });

  it('closes dropdowns when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<DashboardHeader {...defaultProps} />);
    
    // Open user dropdown
    const userButton = screen.getByLabelText('User menu');
    await user.click(userButton);
    expect(screen.getByText('View Profile')).toBeInTheDocument();
    
    // Press Escape
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByText('View Profile')).not.toBeInTheDocument();
    });
  });

  it('handles user without avatar correctly', () => {
    const propsWithoutAvatar = {
      ...defaultProps,
      user: {
        name: 'Jane Smith',
        role: 'Cashier'
        // No avatarUrl
      }
    };
    
    render(<DashboardHeader {...propsWithoutAvatar} />);
    
    // Should show default user icon
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();
  });

  it('truncates long titles appropriately', () => {
    const propsWithLongTitle = {
      ...defaultProps,
      pageTitle: 'This is a very long page title that should be truncated',
      pageSubtitle: 'This is also a very long subtitle that should be truncated properly'
    };
    
    render(<DashboardHeader {...propsWithLongTitle} />);
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveClass('truncate');
  });

  it('shows correct notification count for large numbers', () => {
    const propsWithManyNotifications = {
      ...defaultProps,
      notifications: {
        count: 15,
        items: mockNotifications
      }
    };
    
    render(<DashboardHeader {...propsWithManyNotifications} />);
    
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('displays empty state when no notifications', async () => {
    const user = userEvent.setup();
    const propsWithNoNotifications = {
      ...defaultProps,
      notifications: { count: 0, items: [] }
    };
    
    render(<DashboardHeader {...propsWithNoNotifications} />);
    
    const notificationButton = screen.getByLabelText(/Notifications/);
    await user.click(notificationButton);
    
    expect(screen.getByText('No notifications yet')).toBeInTheDocument();
    expect(screen.getByText("You're all caught up!")).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    const { container } = render(
      <DashboardHeader {...defaultProps} className="custom-header-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-header-class');
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<DashboardHeader {...defaultProps} />);
    
    // Header should have banner role
    expect(screen.getByRole('banner')).toBeInTheDocument();
    
    // Buttons should have proper ARIA attributes
    const notificationButton = screen.getByLabelText(/Notifications/);
    expect(notificationButton).toHaveAttribute('aria-expanded', 'false');
    expect(notificationButton).toHaveAttribute('aria-haspopup', 'true');
    
    const userButton = screen.getByLabelText('User menu');
    expect(userButton).toHaveAttribute('aria-expanded', 'false');
    expect(userButton).toHaveAttribute('aria-haspopup', 'true');
  });
});