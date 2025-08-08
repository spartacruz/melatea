import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  ChefHat,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Calendar,
  Eye,
  MoreVertical,
  Play,
  Pause,
  Check,
  X
} from 'lucide-react';
import UserDropdown from '../../components/UserDropdown';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  orderTime: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'canceled';
  items: OrderItem[];
  assignedEmployee?: string;
  estimatedTime?: number; // in minutes
  customer?: string;
  totalAmount: number;
  priority: 'normal' | 'high' | 'urgent';
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    orderTime: '2025-06-28T14:30:00Z',
    status: 'pending',
    items: [
      { id: '1', name: 'Thai Milk Tea', quantity: 2 },
      { id: '2', name: 'Classic Tea', quantity: 1, notes: 'Extra sugar' }
    ],
    customer: 'John Doe',
    totalAmount: 78000,
    priority: 'normal'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    orderTime: '2025-06-28T14:25:00Z',
    status: 'preparing',
    items: [
      { id: '3', name: 'Matcha Latte', quantity: 1 },
      { id: '4', name: 'Honey Lemon Tea', quantity: 2 }
    ],
    assignedEmployee: 'Sarah M.',
    estimatedTime: 5,
    customer: 'Jane Smith',
    totalAmount: 74000,
    priority: 'high'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    orderTime: '2025-06-28T14:20:00Z',
    status: 'ready',
    items: [
      { id: '5', name: 'Peach Iced Tea', quantity: 3 }
    ],
    assignedEmployee: 'Mike R.',
    customer: 'Bob Wilson',
    totalAmount: 75000,
    priority: 'urgent'
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    orderTime: '2025-06-28T14:15:00Z',
    status: 'served',
    items: [
      { id: '6', name: 'Jasmine Green Tea', quantity: 1 },
      { id: '7', name: 'Black Tea', quantity: 1 }
    ],
    assignedEmployee: 'Lisa C.',
    customer: 'Alice Brown',
    totalAmount: 48000,
    priority: 'normal'
  },
  {
    id: '5',
    orderNumber: 'ORD-005',
    orderTime: '2025-06-28T14:10:00Z',
    status: 'pending',
    items: [
      { id: '8', name: 'Lychee Tea', quantity: 2 },
      { id: '9', name: 'Mint Tea', quantity: 1 }
    ],
    customer: 'David Lee',
    totalAmount: 79000,
    priority: 'normal'
  },
  {
    id: '6',
    orderNumber: 'ORD-006',
    orderTime: '2025-06-28T14:05:00Z',
    status: 'preparing',
    items: [
      { id: '10', name: 'Thai Milk Tea', quantity: 1 },
      { id: '11', name: 'Matcha Latte', quantity: 1 }
    ],
    assignedEmployee: 'Emma W.',
    estimatedTime: 8,
    customer: 'Carol White',
    totalAmount: 59000,
    priority: 'high'
  }
];

const statusConfig = {
  'pending': {
    label: 'Pending',
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-gray-300',
    bgColor: 'bg-gray-50',
    icon: Clock,
    iconColor: 'text-gray-600'
  },
  'preparing': {
    label: 'Preparing',
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    icon: ChefHat,
    iconColor: 'text-blue-600'
  },
  'ready': {
    label: 'Ready',
    color: 'bg-emerald-100 text-emerald-800',
    borderColor: 'border-emerald-300',
    bgColor: 'bg-emerald-50',
    icon: CheckCircle,
    iconColor: 'text-emerald-600'
  },
  'served': {
    label: 'Served',
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-300',
    bgColor: 'bg-green-50',
    icon: Check,
    iconColor: 'text-green-600'
  },
  'canceled': {
    label: 'Canceled',
    color: 'bg-red-100 text-red-800',
    borderColor: 'border-red-300',
    bgColor: 'bg-red-50',
    icon: XCircle,
    iconColor: 'text-red-600'
  }
};

const priorityConfig = {
  'normal': {
    label: 'Normal',
    color: 'bg-gray-100 text-gray-700',
    dotColor: 'bg-gray-400'
  },
  'high': {
    label: 'High',
    color: 'bg-amber-100 text-amber-700',
    dotColor: 'bg-amber-500'
  },
  'urgent': {
    label: 'Urgent',
    color: 'bg-red-100 text-red-700',
    dotColor: 'bg-red-500'
  }
};

const employees = ['All Staff', 'Sarah M.', 'Mike R.', 'Lisa C.', 'Emma W.', 'James B.'];

export default function OrderQueuePage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getElapsedTime = (orderTime: string) => {
    const date = new Date(orderTime);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return diffMinutes;
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = !statusFilter || order.status === statusFilter;
      const matchesEmployee = !employeeFilter || employeeFilter === 'All Staff' || order.assignedEmployee === employeeFilter;
      const matchesPriority = !priorityFilter || order.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesEmployee && matchesPriority;
    })
    .sort((a, b) => {
      // Sort by priority first (urgent > high > normal), then by time (newest first)
      const priorityOrder = { urgent: 3, high: 2, normal: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime();
    });

  const updateOrderStatus = (orderId: string, newStatus: Order['status'], assignedEmployee?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        if (assignedEmployee !== undefined) {
          updatedOrder.assignedEmployee = assignedEmployee;
        }
        if (newStatus === 'preparing' && !updatedOrder.estimatedTime) {
          updatedOrder.estimatedTime = 10; // Default 10 minutes
        }
        return updatedOrder;
      }
      return order;
    }));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const getStatusCounts = () => {
    return {
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      preparing: filteredOrders.filter(o => o.status === 'preparing').length,
      ready: filteredOrders.filter(o => o.status === 'ready').length,
      served: filteredOrders.filter(o => o.status === 'served').length,
      canceled: filteredOrders.filter(o => o.status === 'canceled').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="flex-1 flex flex-col bg-stone-50 h-screen overflow-hidden">
      {/* Header */}
      <div className="h-[80px] px-6 bg-white border-b border-stone-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order Queue</h2>
          <p className="text-gray-600">Kitchen order management and tracking</p>
        </div>
        <UserDropdown />
      </div>

      {/* Status Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-stone-200 flex-shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            const config = statusConfig[status as keyof typeof statusConfig];
            const Icon = config.icon;
            
            return (
              <div key={status} className={`${config.bgColor} rounded-lg p-4 border ${config.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{config.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{count}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${config.iconColor}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by order number, item, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="served">Served</option>
              <option value="canceled">Canceled</option>
            </select>

            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {employees.map(employee => (
                <option key={employee} value={employee === 'All Staff' ? '' : employee}>
                  {employee}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Cards Grid */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOrders.map((order) => {
              const statusInfo = statusConfig[order.status];
              const priorityInfo = priorityConfig[order.priority];
              const StatusIcon = statusInfo.icon;
              const elapsedTime = getElapsedTime(order.orderTime);
              
              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-lg shadow-sm border-2 ${statusInfo.borderColor} hover:shadow-md transition-all duration-200 cursor-pointer`}
                  onClick={() => handleViewOrder(order)}
                >
                  {/* Card Header */}
                  <div className={`${statusInfo.bgColor} px-4 py-3 rounded-t-lg border-b ${statusInfo.borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`w-5 h-5 ${statusInfo.iconColor}`} />
                        <span className="font-bold text-gray-800">{order.orderNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Priority Badge */}
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                          <div className={`w-2 h-2 rounded-full ${priorityInfo.dotColor}`}></div>
                          <span>{priorityInfo.label}</span>
                        </div>
                        
                        {/* Status Badge */}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(order.orderTime)}</span>
                        <span className={`font-medium ${elapsedTime > 15 ? 'text-red-600' : elapsedTime > 10 ? 'text-amber-600' : 'text-gray-600'}`}>
                          ({elapsedTime}m)
                        </span>
                      </div>
                      {order.customer && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-xs truncate max-w-20">{order.customer}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-800">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-emerald-600">×{item.quantity}</span>
                          </div>
                        </div>
                      ))}
                      
                      {/* Show notes if any */}
                      {order.items.some(item => item.notes) && (
                        <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-xs font-medium text-amber-800 mb-1">Special Notes:</p>
                          {order.items.filter(item => item.notes).map((item) => (
                            <p key={item.id} className="text-xs text-amber-700">
                              {item.name}: {item.notes}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Assigned Employee */}
                    {order.assignedEmployee && (
                      <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
                        <ChefHat className="w-4 h-4" />
                        <span>Assigned to: <span className="font-medium">{order.assignedEmployee}</span></span>
                      </div>
                    )}

                    {/* Estimated Time */}
                    {order.estimatedTime && order.status === 'preparing' && (
                      <div className="flex items-center space-x-2 mb-3 text-sm">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600 font-medium">Est. {order.estimatedTime} min remaining</span>
                      </div>
                    )}

                    {/* Total Amount */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Total:</span>
                      <span className="text-lg font-bold text-gray-800">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Card Footer - Action Buttons */}
                  <div className="px-4 pb-4">
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, 'preparing', 'Kitchen Staff');
                          }}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start</span>
                        </button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, 'ready');
                            }}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Ready</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, 'pending');
                            }}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {order.status === 'ready' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, 'served');
                          }}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                        >
                          <Check className="w-4 h-4" />
                          <span>Served</span>
                        </button>
                      )}
                      
                      {(order.status === 'pending' || order.status === 'preparing') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to cancel this order?')) {
                              updateOrderStatus(order.id, 'canceled');
                            }
                          }}
                          className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-500">No orders match your current filters</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <p className="text-gray-600">{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Order Time</label>
                    <p className="text-lg font-semibold text-gray-800">{formatTime(selectedOrder.orderTime)}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Customer</label>
                    <p className="text-lg font-semibold text-gray-800">{selectedOrder.customer || 'Walk-in'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${priorityConfig[selectedOrder.priority].color}`}>
                      <div className={`w-2 h-2 rounded-full ${priorityConfig[selectedOrder.priority].dotColor}`}></div>
                      <span>{priorityConfig[selectedOrder.priority].label}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedOrder.status].color}`}>
                      {(() => {
                        const StatusIcon = statusConfig[selectedOrder.status].icon;
                        return <StatusIcon className="w-4 h-4" />;
                      })()}
                      <span>{statusConfig[selectedOrder.status].label}</span>
                    </div>
                  </div>
                  
                  {selectedOrder.assignedEmployee && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Assigned To</label>
                      <p className="text-lg font-semibold text-gray-800">{selectedOrder.assignedEmployee}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Amount</label>
                    <p className="text-xl font-bold text-emerald-600">{formatPrice(selectedOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          {item.notes && (
                            <p className="text-sm text-amber-600 font-medium">Note: {item.notes}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-lg font-bold text-emerald-600">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Section */}
              <div className="bg-stone-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'preparing', 'Kitchen Staff');
                        setIsDetailModalOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Preparing</span>
                    </button>
                  )}
                  
                  {selectedOrder.status === 'preparing' && (
                    <>
                      <button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, 'ready');
                          setIsDetailModalOpen(false);
                        }}
                        className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Mark Ready</span>
                      </button>
                      <button
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, 'pending');
                          setIsDetailModalOpen(false);
                        }}
                        className="flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
                      >
                        <Pause className="w-5 h-5" />
                        <span>Pause</span>
                      </button>
                    </>
                  )}
                  
                  {selectedOrder.status === 'ready' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'served');
                        setIsDetailModalOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors"
                    >
                      <Check className="w-5 h-5" />
                      <span>Mark Served</span>
                    </button>
                  )}
                  
                  {(selectedOrder.status === 'pending' || selectedOrder.status === 'preparing') && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          updateOrderStatus(selectedOrder.id, 'canceled');
                          setIsDetailModalOpen(false);
                        }
                      }}
                      className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancel Order</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}