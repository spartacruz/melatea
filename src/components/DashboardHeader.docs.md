# DashboardHeader Component

A reusable, production-ready header component for POS dashboard applications built with React and TypeScript.

## Features

- **Responsive Design**: Adapts to desktop, tablet, and mobile viewports
- **Accessibility**: Full keyboard navigation and screen reader support
- **TypeScript**: Complete type safety with comprehensive interfaces
- **Notifications**: Real-time notification system with badge counts
- **User Management**: Profile dropdown with logout functionality
- **Mobile Support**: Collapsible menu integration for mobile devices
- **Customizable**: Flexible props for different page contexts

## Installation

```bash
npm install lucide-react
```

## Basic Usage

```tsx
import DashboardHeader from './components/DashboardHeader';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const { notifications } = useNotifications();
  
  const user = {
    name: 'John Doe',
    role: 'Manager',
    avatarUrl: 'https://example.com/avatar.jpg'
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('User logged out');
  };

  return (
    <DashboardHeader
      pageTitle="Dashboard"
      pageSubtitle="Overview of your business performance"
      user={user}
      notifications={notifications}
      onLogout={handleLogout}
    />
  );
}
```

## Props

### HeaderProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `pageTitle` | `string` | ✅ | Main page title displayed in the header |
| `pageSubtitle` | `string` | ✅ | Context-specific subtitle |
| `user` | `HeaderUser` | ✅ | User information object |
| `notifications` | `HeaderNotifications` | ✅ | Notification data and count |
| `onNotificationClick` | `() => void` | ❌ | Callback when notification bell is clicked |
| `onLogout` | `() => void` | ❌ | Callback when logout is triggered |
| `onMenuToggle` | `() => void` | ❌ | Callback for mobile menu toggle |
| `isMobile` | `boolean` | ❌ | Whether to show mobile menu toggle |
| `className` | `string` | ❌ | Additional CSS classes |

### HeaderUser

```typescript
interface HeaderUser {
  name: string;        // Full name of the user
  role: string;        // User role (e.g., "Manager", "Cashier")
  avatarUrl?: string;  // Optional avatar image URL
}
```

### HeaderNotifications

```typescript
interface HeaderNotifications {
  count: number;              // Number of unread notifications
  items: NotificationItem[];  // Array of notification objects
}
```

### NotificationItem

```typescript
interface NotificationItem {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'stock' | 'system' | 'order' | 'employee';
}
```

## Advanced Usage

### With Custom Notification Handling

```tsx
import DashboardHeader from './components/DashboardHeader';
import { useNotifications } from './hooks/useNotifications';

function Dashboard() {
  const { notifications, markAllAsRead } = useNotifications({
    refreshInterval: 15000, // Refresh every 15 seconds
    autoRefresh: true
  });

  const handleNotificationClick = () => {
    markAllAsRead();
    // Navigate to notifications page
    navigate('/notifications');
  };

  return (
    <DashboardHeader
      pageTitle="Inventory Management"
      pageSubtitle="Monitor and manage material stock levels"
      user={{
        name: 'Sarah Martinez',
        role: 'Supervisor',
        avatarUrl: '/avatars/sarah.jpg'
      }}
      notifications={notifications}
      onNotificationClick={handleNotificationClick}
      onLogout={() => auth.logout()}
    />
  );
}
```

### Mobile Integration

```tsx
function MobileApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <DashboardHeader
        pageTitle="Order Queue"
        pageSubtitle="Kitchen order management"
        user={currentUser}
        notifications={notifications}
        isMobile={true}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
      />
      
      <Sidebar isOpen={isSidebarOpen} />
      <MainContent />
    </div>
  );
}
```

## Styling

The component uses Tailwind CSS with the MelaTea design system. Key design tokens:

- **Height**: 72px fixed header height
- **Colors**: Emerald primary, stone neutrals
- **Shadows**: Subtle bottom shadow for elevation
- **Spacing**: 16px gap between elements
- **Typography**: Responsive text sizing

### Custom Styling

```tsx
<DashboardHeader
  className="border-b-2 border-emerald-500 bg-gradient-to-r from-emerald-50 to-blue-50"
  // ... other props
/>
```

## Accessibility

The component includes comprehensive accessibility features:

- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Full keyboard support with proper focus management
- **Screen Readers**: Semantic HTML and ARIA attributes
- **Color Contrast**: 4.5:1 minimum contrast ratio
- **Focus Management**: Visible focus indicators and logical tab order

### Keyboard Shortcuts

- `Tab` / `Shift+Tab`: Navigate between interactive elements
- `Enter` / `Space`: Activate buttons and dropdowns
- `Escape`: Close open dropdowns
- `Arrow Keys`: Navigate within dropdown menus

## Responsive Behavior

### Desktop (> 1024px)
- Full layout with all elements visible
- Hover states for interactive elements
- Side-by-side notification and user dropdowns

### Tablet (768px - 1024px)
- Condensed user name display
- Maintained functionality with adjusted spacing
- Touch-friendly target sizes

### Mobile (< 768px)
- Mobile menu toggle button
- Hidden user name, avatar only
- Optimized dropdown positioning
- Touch-optimized interactions

## Testing

The component includes comprehensive unit tests covering:

- Rendering and display logic
- User interactions (clicks, keyboard)
- Dropdown behavior
- Accessibility features
- Responsive behavior
- Error states

```bash
npm test DashboardHeader
```

## Performance

- **Lazy Loading**: Dropdowns render only when opened
- **Event Cleanup**: Proper cleanup of event listeners
- **Memoization**: Optimized re-renders with React hooks
- **Bundle Size**: Minimal dependencies (only Lucide React icons)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Migration Guide

### From v1.x to v2.x

```tsx
// Old API
<Header title="Dashboard" user={user} />

// New API
<DashboardHeader 
  pageTitle="Dashboard" 
  pageSubtitle="Overview" 
  user={user} 
  notifications={notifications}
/>
```

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new features
3. Update documentation for API changes
4. Ensure accessibility compliance
5. Test across all supported breakpoints

## License

MIT License - see LICENSE file for details.