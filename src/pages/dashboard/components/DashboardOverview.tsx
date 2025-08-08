import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Package,
  AlertTriangle,
  Eye,
  User,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  TrendingDown,
  CheckCircle,
  XCircle,
  Loader,
  Package2,
  Menu
} from 'lucide-react';
import UserDropdown from '../../../components/UserDropdown';
import NotificationBell from '../../../components/NotificationBell';

interface SalesData {
  period: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  id: string;
  name: string;
  quantitySold: number;
  revenue: number;
  image: string;
}

interface LowStockItem {
  id: string;
  name: string;
  currentStock: number;
  threshold: number;
  unit: string;
  status: 'low' | 'out';
  affectedProducts: string[];
}

interface OrderStatus {
  status: 'pending' | 'paid' | 'in-progress' | 'completed' | 'canceled';
  count: number;
  percentage: number;
}

interface StockReceived {
  id: string;
  materialName: string;
  quantityReceived: number;
  unit: string;
  receiverName: string;
  dateTime: string;
}

// Mock data
const todayStats = {
  totalOrders: 47,
  revenue: 1250000,
  productsSold: 89,
  averageOrderValue: 26596,
  averageCompletionTime: 405 // in seconds (6m 45s)
};

const yesterdayStats = {
  totalOrders: 42,
  revenue: 1180000,
  productsSold: 78,
  averageOrderValue: 28095,
  averageCompletionTime: 450 // in seconds (7m 30s)
};

const salesDataToday: SalesData[] = [
  { period: '09:00', revenue: 85000, orders: 3 },
  { period: '10:00', revenue: 120000, orders: 5 },
  { period: '11:00', revenue: 95000, orders: 4 },
  { period: '12:00', revenue: 180000, orders: 7 },
  { period: '13:00', revenue: 210000, orders: 8 },
  { period: '14:00', revenue: 165000, orders: 6 },
  { period: '15:00', revenue: 145000, orders: 5 },
  { period: '16:00', revenue: 125000, orders: 4 },
  { period: '17:00', revenue: 125000, orders: 5 }
];

const salesDataWeek: SalesData[] = [
  { period: 'Mon', revenue: 980000, orders: 38 },
  { period: 'Tue', revenue: 1120000, orders: 42 },
  { period: 'Wed', revenue: 1350000, orders: 51 },
  { period: 'Thu', revenue: 1180000, orders: 45 },
  { period: 'Fri', revenue: 1420000, orders: 54 },
  { period: 'Sat', revenue: 1680000, orders: 63 },
  { period: 'Sun', revenue: 1250000, orders: 47 }
];

const salesDataMonth: SalesData[] = [
  { period: 'Week 1', revenue: 7200000, orders: 285 },
  { period: 'Week 2', revenue: 8100000, orders: 320 },
  { period: 'Week 3', revenue: 7800000, orders: 298 },
  { period: 'Week 4', revenue: 8500000, orders: 335 }
];

const orderStatusData: OrderStatus[] = [
  { status: 'completed', count: 142, percentage: 68.3 },
  { status: 'paid', count: 28, percentage: 13.5 },
  { status: 'in-progress', count: 18, percentage: 8.7 },
  { status: 'pending', count: 15, percentage: 7.2 },
  { status: 'canceled', count: 5, percentage: 2.4 }
];

const topProducts: TopProduct[] = [
  {
    id: '1',
    name: 'Thai Milk Tea',
    quantitySold: 23,
    revenue: 667000,
    image: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Matcha Latte',
    quantitySold: 18,
    revenue: 540000,
    image: 'https://images.pexels.com/photos/4226894/pexels-photo-4226894.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Classic Tea',
    quantitySold: 15,
    revenue: 300000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'Jasmine Green Tea',
    quantitySold: 12,
    revenue: 324000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    name: 'Honey Lemon Tea',
    quantitySold: 11,
    revenue: 242000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const lowStockItems: LowStockItem[] = [
  {
    id: '1',
    name: 'Milk Powder',
    currentStock: 0,
    threshold: 20,
    unit: 'kg',
    status: 'out',
    affectedProducts: ['Thai Milk Tea', 'Matcha Latte']
  },
  {
    id: '2',
    name: 'Green Tea Leaves',
    currentStock: 8,
    threshold: 30,
    unit: 'kg',
    status: 'low',
    affectedProducts: ['Jasmine Green Tea', 'Matcha Latte']
  },
  {
    id: '3',
    name: 'Peach Syrup',
    currentStock: 0,
    threshold: 10,
    unit: 'L',
    status: 'out',
    affectedProducts: ['Peach Iced Tea']
  },
  {
    id: '4',
    name: 'Matcha Powder',
    currentStock: 3,
    threshold: 15,
    unit: 'kg',
    status: 'low',
    affectedProducts: ['Matcha Latte']
  }
];

const recentStockReceived: StockReceived[] = [
  {
    id: '1',
    materialName: 'Black Tea Leaves',
    quantityReceived: 50,
    unit: 'kg',
    receiverName: 'Airlangga W.',
    dateTime: '2025-06-28T14:30:00Z'
  },
  {
    id: '2',
    materialName: 'Sugar',
    quantityReceived: 25,
    unit: 'kg',
    receiverName: 'Sarah M.',
    dateTime: '2025-06-28T11:15:00Z'
  },
  {
    id: '3',
    materialName: 'Honey',
    quantityReceived: 10,
    unit: 'kg',
    receiverName: 'Mike R.',
    dateTime: '2025-06-28T09:45:00Z'
  },
  {
    id: '4',
    materialName: 'Lemon Juice',
    quantityReceived: 15,
    unit: 'L',
    receiverName: 'Lisa C.',
    dateTime: '2025-06-27T16:20:00Z'
  },
  {
    id: '5',
    materialName: 'Matcha Powder',
    quantityReceived: 5,
    unit: 'kg',
    receiverName: 'Emma W.',
    dateTime: '2025-06-27T13:10:00Z'
  }
];

type ChartPeriod = 'today' | 'week' | 'month';
type SortBy = 'quantity' | 'revenue';

const statusConfig = {
  'completed': { label: 'Completed', color: '#10b981', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
  'paid': { label: 'Paid', color: '#3b82f6', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  'in-progress': { label: 'In Progress', color: '#f59e0b', bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
  'pending': { label: 'Pending', color: '#6b7280', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  'canceled': { label: 'Canceled', color: '#ef4444', bgColor: 'bg-red-100', textColor: 'text-red-800' }
};

// Real Line Chart Component
const LineChart = ({ data, isLoading }: { data: SalesData[], isLoading: boolean }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const minRevenue = Math.min(...data.map(d => d.revenue));
  const revenueRange = maxRevenue - minRevenue;
  
  const chartWidth = 100;
  const chartHeight = 100;
  const padding = { top: 10, right: 10, bottom: 20, left: 10 };
  
  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * (chartWidth - padding.left - padding.right);
  };
  
  const getY = (revenue: number) => {
    const normalizedValue = revenueRange > 0 ? (revenue - minRevenue) / revenueRange : 0.5;
    return chartHeight - padding.bottom - (normalizedValue * (chartHeight - padding.top - padding.bottom));
  };

  // Generate path for line
  const pathData = data.map((point, index) => {
    const x = getX(index);
    const y = getY(point.revenue);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Generate gradient area path
  const areaPath = [
    pathData,
    `L ${getX(data.length - 1)} ${chartHeight - padding.bottom}`,
    `L ${getX(0)} ${chartHeight - padding.bottom}`,
    'Z'
  ].join(' ');

  return (
    <div className="h-64 relative">
      <svg 
        className="w-full h-full" 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05"/>
          </linearGradient>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.3"/>
          </pattern>
        </defs>
        
        {/* Background grid */}
        <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />
        
        {/* Area under curve */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          className="transition-all duration-700 ease-in-out"
        />
        
        {/* Main line */}
        <path
          d={pathData}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-700 ease-in-out"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.2))'
          }}
        />
        
        {/* Data points */}
        {data.map((point, index) => {
          const x = getX(index);
          const y = getY(point.revenue);
          const isHovered = hoveredPoint === index;
          
          return (
            <g key={index}>
              {/* Hover area */}
              <rect
                x={x - 5}
                y={0}
                width={10}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              
              {/* Data point */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 5 : 3}
                fill="#10b981"
                stroke="white"
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-200"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
              />
              
              {/* Hover tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 25}
                    y={y - 35}
                    width={50}
                    height={25}
                    rx={4}
                    fill="rgba(0, 0, 0, 0.8)"
                    className="transition-all duration-200"
                  />
                  <text
                    x={x}
                    y={y - 25}
                    textAnchor="middle"
                    fill="white"
                    fontSize="3"
                    fontWeight="600"
                  >
                    {(point.revenue / 1000).toFixed(0)}K
                  </text>
                  <text
                    x={x}
                    y={y - 18}
                    textAnchor="middle"
                    fill="white"
                    fontSize="2.5"
                  >
                    {point.orders} orders
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
        {data.map((point, index) => (
          <span key={index} className="text-center">
            {point.period}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function DashboardOverview() {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('today');
  const [sortBy, setSortBy] = useState<SortBy>('quantity');
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month}, ${hours}:${minutes}`;
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getStatChange = (current: number, previous: number) => {
    const change = calculatePercentageChange(current, previous);
    const isPositive = change >= 0;
    
    return {
      percentage: Math.abs(change).toFixed(1),
      isPositive,
      icon: isPositive ? ArrowUp : ArrowDown,
      color: isPositive ? 'text-emerald-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-emerald-50' : 'bg-red-50'
    };
  };

  const getSalesData = () => {
    switch (chartPeriod) {
      case 'today': return salesDataToday;
      case 'week': return salesDataWeek;
      case 'month': return salesDataMonth;
      default: return salesDataToday;
    }
  };

  const sortedProducts = [...topProducts].sort((a, b) => {
    if (sortBy === 'quantity') {
      return b.quantitySold - a.quantitySold;
    }
    return b.revenue - a.revenue;
  });

  const outOfStockItems = lowStockItems.filter(item => item.status === 'out');
  const lowStockCount = lowStockItems.filter(item => item.status === 'low').length;

  // Donut chart calculations
  const totalOrders = orderStatusData.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercentage = 0;

  const donutSegments = orderStatusData.map(item => {
    const startAngle = cumulativePercentage * 3.6; // Convert percentage to degrees
    const endAngle = (cumulativePercentage + item.percentage) * 3.6;
    cumulativePercentage += item.percentage;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const largeArcFlag = item.percentage > 50 ? 1 : 0;
    
    const x1 = 50 + 35 * Math.cos(startAngleRad);
    const y1 = 50 + 35 * Math.sin(startAngleRad);
    const x2 = 50 + 35 * Math.cos(endAngleRad);
    const y2 = 50 + 35 * Math.sin(endAngleRad);
    
    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    return {
      ...item,
      pathData,
      color: statusConfig[item.status].color
    };
  });

  return (
    <div className="flex-1 flex flex-col bg-stone-50 h-screen overflow-hidden">
      {/* Header */}
      <div className="h-[80px] px-6 bg-white border-b border-stone-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600">Overview of your business performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <NotificationBell />
          <UserDropdown />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="space-y-6">
          
          {/* Today's Summary - Stat Cards */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              
              {/* Total Orders */}
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800">{todayStats.totalOrders}</p>
                    <div className="flex items-center mt-2">
                      {(() => {
                        const change = getStatChange(todayStats.totalOrders, yesterdayStats.totalOrders);
                        const Icon = change.icon;
                        return (
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${change.bgColor}`}>
                            <Icon className={`w-3 h-3 ${change.color}`} />
                            <span className={`text-xs font-medium ${change.color}`}>
                              {change.percentage}%
                            </span>
                          </div>
                        );
                      })()}
                      <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenue</p>
                    <p className="text-3xl font-bold text-gray-800">{formatPrice(todayStats.revenue)}</p>
                    <div className="flex items-center mt-2">
                      {(() => {
                        const change = getStatChange(todayStats.revenue, yesterdayStats.revenue);
                        const Icon = change.icon;
                        return (
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${change.bgColor}`}>
                            <Icon className={`w-3 h-3 ${change.color}`} />
                            <span className={`text-xs font-medium ${change.color}`}>
                              {change.percentage}%
                            </span>
                          </div>
                        );
                      })()}
                      <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Products Sold */}
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Products Sold</p>
                    <p className="text-3xl font-bold text-gray-800">{todayStats.productsSold}</p>
                    <div className="flex items-center mt-2">
                      {(() => {
                        const change = getStatChange(todayStats.productsSold, yesterdayStats.productsSold);
                        const Icon = change.icon;
                        return (
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${change.bgColor}`}>
                            <Icon className={`w-3 h-3 ${change.color}`} />
                            <span className={`text-xs font-medium ${change.color}`}>
                              {change.percentage}%
                            </span>
                          </div>
                        );
                      })()}
                      <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Average Order Value */}
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                    <p className="text-3xl font-bold text-gray-800">{formatPrice(todayStats.averageOrderValue)}</p>
                    <div className="flex items-center mt-2">
                      {(() => {
                        const change = getStatChange(todayStats.averageOrderValue, yesterdayStats.averageOrderValue);
                        const Icon = change.icon;
                        return (
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${change.bgColor}`}>
                            <Icon className={`w-3 h-3 ${change.color}`} />
                            <span className={`text-xs font-medium ${change.color}`}>
                              {change.percentage}%
                            </span>
                          </div>
                        );
                      })()}
                      <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>

              {/* Average Completion Time */}
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg Completion Time</p>
                    <p className="text-3xl font-bold text-gray-800">{formatTime(todayStats.averageCompletionTime)}</p>
                    <div className="flex items-center mt-2">
                      {(() => {
                        const change = getStatChange(todayStats.averageCompletionTime, yesterdayStats.averageCompletionTime);
                        const Icon = change.icon;
                        // For completion time, lower is better, so invert the color logic
                        const isImprovement = change.isPositive ? false : true;
                        return (
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${isImprovement ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            <Icon className={`w-3 h-3 ${isImprovement ? 'text-emerald-600' : 'text-red-600'}`} />
                            <span className={`text-xs font-medium ${isImprovement ? 'text-emerald-600' : 'text-red-600'}`}>
                              {change.percentage}%
                            </span>
                          </div>
                        );
                      })()}
                      <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart and Order Status Breakdown Row (50% - 50%) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Sales Chart</h3>
                  </div>
                  <div className="flex space-x-2">
                    {(['today', 'week', 'month'] as ChartPeriod[]).map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setIsLoading(true);
                          setTimeout(() => {
                            setChartPeriod(period);
                            setIsLoading(false);
                          }, 300);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          chartPeriod === period
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <LineChart data={getSalesData()} isLoading={isLoading} />
                
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span>Revenue</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>
                      Total: {formatPrice(getSalesData().reduce((sum, data) => sum + data.revenue, 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <div className="flex items-center space-x-3">
                  <PieChart className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Order Status Breakdown</h3>
                  <span className="text-sm text-gray-500">({totalOrders} total orders)</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Donut Chart */}
                  <div className="flex justify-center">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {donutSegments.map((segment, index) => (
                          <path
                            key={segment.status}
                            d={segment.pathData}
                            fill={segment.color}
                            className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                          />
                        ))}
                        {/* Center circle */}
                        <circle cx="50" cy="50" r="20" fill="white" />
                      </svg>
                      
                      {/* Center text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800">{totalOrders}</div>
                          <div className="text-sm text-gray-500">Orders</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="space-y-3">
                    {orderStatusData.map((item) => (
                      <div key={item.status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: statusConfig[item.status].color }}
                          ></div>
                          <span className="text-sm font-medium text-gray-800">
                            {statusConfig[item.status].label}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-800">{item.count}</div>
                          <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products and Low Stock Alerts Row (50% - 50%) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Selling Products */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <PieChart className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Top Products</h3>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="quantity">By Quantity</option>
                    <option value="revenue">By Revenue</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {sortedProducts.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-full">
                          {index + 1}
                        </span>
                      </div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{product.quantitySold} sold</span>
                          <span>•</span>
                          <span>{formatPrice(product.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {outOfStockItems.length} out of stock
                    </span>
                    {lowStockCount > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {lowStockCount} low stock
                      </span>
                    )}
                  </div>
                  <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View All</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {lowStockItems.length > 0 ? (
                  <div className="space-y-4">
                    {lowStockItems.slice(0, 4).map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-4 rounded-lg border-l-4 ${
                          item.status === 'out' 
                            ? 'bg-red-50 border-red-400' 
                            : 'bg-amber-50 border-amber-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                item.status === 'out' ? 'bg-red-500' : 'bg-amber-500'
                              }`} />
                              <h4 className="font-medium text-gray-800">{item.name}</h4>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === 'out' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {item.status === 'out' ? 'Out of Stock' : 'Low Stock'}
                              </span>
                            </div>
                            
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                              <span>
                                Current: <span className="font-medium">{item.currentStock} {item.unit}</span>
                              </span>
                              <span>
                                Threshold: <span className="font-medium">{item.threshold} {item.unit}</span>
                              </span>
                            </div>
                            
                            {item.affectedProducts.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">
                                  Affected: {item.affectedProducts.slice(0, 2).join(', ')}
                                  {item.affectedProducts.length > 2 && ` +${item.affectedProducts.length - 2} more`}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg transition-colors">
                              Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">All inventory levels are sufficient</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Stock Received */}
          <div className="bg-white rounded-lg shadow-sm border border-stone-200">
            <div className="p-6 border-b border-stone-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package2 className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Recent Stock Received</h3>
                </div>
                <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View All</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity Received
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receiver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date/Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-200">
                  {recentStockReceived.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-stone-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-stone-25'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{item.materialName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-emerald-600">
                          +{item.quantityReceived.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{item.unit}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{item.receiverName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{formatDateTime(item.dateTime)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {recentStockReceived.length === 0 && (
                <div className="text-center py-12">
                  <Package2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent stock movements</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}