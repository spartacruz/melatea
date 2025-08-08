import React, { useState } from 'react';
import { 
  ShoppingCart, 
  CreditCard, 
  Package2, 
  Package, 
  Users, 
  Settings, 
  Leaf, 
  Plus, 
  Minus, 
  Trash2,
  BarChart3,
  ChefHat,
  Menu,
  X,
  History
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PaymentModal from './components/PaymentModal';
import DashboardOverview from './components/DashboardOverview';
import TransactionsPage from '../transactions/TransactionsPage';
import ProductsPage from '../products/ProductsPage';
import InventoryPage from '../inventory/InventoryPage';
import StockHistoryPage from '../stock-history/StockHistoryPage';
import EmployeesPage from '../employees/EmployeesPage';
import SettingsPage from '../settings/SettingsPage';
import OrderQueuePage from '../queue/OrderQueuePage';
import UserDropdown from '../../components/UserDropdown';
import NotificationBell from '../../components/NotificationBell';

interface TeaItem {
  id: string;
  name: string;
  price: number;
  icon: string;
}

interface OrderItem extends TeaItem {
  quantity: number;
}

const teaMenu: TeaItem[] = [
  { id: '1', name: 'Classic Tea', price: 20000, icon: '🍵' },
  { id: '2', name: 'Thai Milk Tea', price: 29000, icon: '🧋' },
  { id: '3', name: 'Matcha Latte', price: 30000, icon: '🍃' },
  { id: '4', name: 'Peach Iced Tea', price: 25000, icon: '🍑' },
  { id: '5', name: 'Honey Lemon Tea', price: 22000, icon: '🍯' },
  { id: '6', name: 'Jasmine Green Tea', price: 27000, icon: '🌼' },
  { id: '7', name: 'Black Tea', price: 21000, icon: '☕' },
  { id: '8', name: 'Lychee Tea', price: 28000, icon: '🫧' },
  { id: '9', name: 'Mint Tea', price: 23000, icon: '🌿' },
];

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const addToOrder = (tea: TeaItem) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.id === tea.id);
      if (existing) {
        return prev.map(item =>
          item.id === tea.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...tea, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setOrderItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  const handlePaymentComplete = () => {
    clearOrder();
    // Here you could add success notification, receipt generation, etc.
  };

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'order', label: 'Order Entry', icon: ShoppingCart },
    { id: 'queue', label: 'Order Queue', icon: ChefHat },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'products', label: 'Products', icon: Package2 },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'stock-history', label: 'Stock History', icon: History },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardOverview />;
        
      case 'order':
        return (
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Tea Menu Grid - Fixed Height with Scroll */}
            <div className="flex-1 flex flex-col h-screen">
              {/* Header - Reduced height to match sidebar */}
              <div className="h-[80px] flex-shrink-0 px-6 bg-white border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Menu className="w-5 h-5 text-gray-600" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Tea Menu</h2>
                    <p className="text-gray-600">Select items to add to order</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <NotificationBell />
                  <UserDropdown />
                </div>
              </div>

              {/* Tea Grid - Scrollable, Flush Alignment */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teaMenu.map((tea) => (
                    <div
                      key={tea.id}
                      className="bg-white rounded-xl shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{tea.icon}</div>
                        <h3 className="font-semibold text-gray-800 mb-1">{tea.name}</h3>
                        <p className="text-lg font-bold text-emerald-600 mb-3">
                          {formatPrice(tea.price)}
                        </p>
                        <button
                          onClick={() => addToOrder(tea)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Panel - Fixed Width, Flush Alignment */}
            <div className="w-full lg:w-80 bg-white shadow-lg flex flex-col h-screen border-l border-stone-200">
              {/* Order Header - Reduced height to match other headers */}
              <div className="h-[80px] px-6 border-b border-stone-200 flex-shrink-0 flex items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Order On</h3>
                  <p className="text-gray-600">Current order items</p>
                </div>
              </div>

              {/* Order Items - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {orderItems.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🍵</div>
                    <p className="text-gray-500">No items in order</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-stone-50 rounded-lg p-3 border border-stone-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">{item.name}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                            <p className="font-semibold text-emerald-600">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Summary - Fixed at Bottom, Aligned */}
              <div className="border-t border-stone-200 px-6 py-6 bg-stone-50 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-emerald-600">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    disabled={orderItems.length === 0}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg py-3 font-semibold transition-colors"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={clearOrder}
                    disabled={orderItems.length === 0}
                    className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 rounded-lg py-2 font-medium transition-colors"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'queue':
        return <OrderQueuePage />;
      
      case 'transactions':
        return <TransactionsPage />;
      
      case 'products':
        return <ProductsPage />;
      
      case 'inventory':
        return <InventoryPage />;
      
      case 'stock-history':
        return <StockHistoryPage />;
      
      case 'employees':
        return <EmployeesPage />;
      
      case 'settings':
        return <SettingsPage />;
      
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-stone-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const menuItem = menuItems.find(item => item.id === activeMenu);
                  const Icon = menuItem?.icon || Package;
                  return <Icon className="w-12 h-12 text-gray-400" />;
                })()}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {menuItems.find(item => item.id === activeMenu)?.label || 'Page'}
              </h2>
              <p className="text-gray-600 mb-4">This page is under development</p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Coming Soon
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isSidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      } ${
        isSidebarCollapsed && window.innerWidth >= 1024 ? 'lg:w-16' : 'w-64'
      } bg-white shadow-lg flex flex-col fixed lg:relative h-full border-r border-stone-200 z-50 transition-all duration-300 ease-in-out`}>
        
        {/* Brand Header */}
        <div className={`${
          isSidebarCollapsed && window.innerWidth >= 1024 ? 'lg:px-2' : 'px-6'
        } h-[80px] py-6 border-b border-stone-200 flex items-center transition-all duration-300`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            {(!isSidebarCollapsed || window.innerWidth < 1024) && (
              <div className="transition-opacity duration-300">
                <h1 className="text-xl font-bold text-gray-800">MelaTea</h1>
                <p className="text-xs text-gray-500">Point of Sale</p>
              </div>
            )}
          </div>
          
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:block ml-auto p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {isSidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className={`${
          isSidebarCollapsed && window.innerWidth >= 1024 ? 'lg:px-2' : 'px-4'
        } py-4 flex-1 transition-all duration-300`}>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed && window.innerWidth >= 1024 ? 'lg:justify-center lg:px-2' : 'space-x-3 px-3'
                    } py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                    title={isSidebarCollapsed && window.innerWidth >= 1024 ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : ''} flex-shrink-0`} />
                    {(!isSidebarCollapsed || window.innerWidth < 1024) && (
                      <span className="font-medium transition-opacity duration-300">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden h-[80px] px-6 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <NotificationBell />
            <UserDropdown />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderItems={orderItems}
        total={total}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}