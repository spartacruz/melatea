import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Eye, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  X,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User,
  Building2
} from 'lucide-react';
import UserDropdown from '../../components/UserDropdown';
import NotificationBell from '../../components/NotificationBell';

interface StockMovement {
  id: string;
  dateTime: string;
  materialId: string;
  materialName: string;
  movementType: 'received' | 'consumed';
  quantity: number;
  unit: string;
  currentStock: number;
  reference: string;
  notes: string;
  employee: string;
  supplier?: string;
}

interface Material {
  id: string;
  name: string;
  unit: string;
}

// Mock data
const mockMaterials: Material[] = [
  { id: '1', name: 'Black Tea Leaves', unit: 'kg' },
  { id: '2', name: 'Green Tea Leaves', unit: 'kg' },
  { id: '3', name: 'Milk Powder', unit: 'kg' },
  { id: '4', name: 'Sugar', unit: 'kg' },
  { id: '5', name: 'Honey', unit: 'kg' },
  { id: '6', name: 'Matcha Powder', unit: 'kg' },
  { id: '7', name: 'Lemon Juice', unit: 'L' },
  { id: '8', name: 'Peach Syrup', unit: 'L' }
];

const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    dateTime: '2025-06-28T14:30:00Z',
    materialId: '1',
    materialName: 'Black Tea Leaves',
    movementType: 'received',
    quantity: 50,
    unit: 'kg',
    currentStock: 150,
    reference: 'PO-2025-001',
    notes: 'Weekly delivery from supplier',
    employee: 'Airlangga W.',
    supplier: 'Tea Garden Co.'
  },
  {
    id: '2',
    dateTime: '2025-06-28T12:15:00Z',
    materialId: '1',
    materialName: 'Black Tea Leaves',
    movementType: 'consumed',
    quantity: -5,
    unit: 'kg',
    currentStock: 100,
    reference: 'ORD-001',
    notes: 'Used for Thai Milk Tea production',
    employee: 'Sarah M.'
  },
  {
    id: '3',
    dateTime: '2025-06-28T11:45:00Z',
    materialId: '4',
    materialName: 'Sugar',
    movementType: 'received',
    quantity: 25,
    unit: 'kg',
    currentStock: 80,
    reference: 'PO-2025-002',
    notes: 'Emergency restock',
    employee: 'Mike R.',
    supplier: 'Sweet Supply'
  },
  {
    id: '4',
    dateTime: '2025-06-28T10:30:00Z',
    materialId: '2',
    materialName: 'Green Tea Leaves',
    movementType: 'consumed',
    quantity: -10,
    unit: 'kg',
    currentStock: 25,
    reference: 'ORD-002',
    notes: 'Used for Jasmine Green Tea',
    employee: 'Lisa C.'
  },
  {
    id: '5',
    dateTime: '2025-06-28T09:20:00Z',
    materialId: '5',
    materialName: 'Honey',
    movementType: 'received',
    quantity: 10,
    unit: 'kg',
    currentStock: 15,
    reference: 'PO-2025-003',
    notes: 'Premium organic honey',
    employee: 'Emma W.',
    supplier: 'Natural Honey Co.'
  },
  {
    id: '6',
    dateTime: '2025-06-27T16:45:00Z',
    materialId: '3',
    materialName: 'Milk Powder',
    movementType: 'consumed',
    quantity: -20,
    unit: 'kg',
    currentStock: 0,
    reference: 'ORD-003',
    notes: 'Used for milk tea production',
    employee: 'James B.'
  },
  {
    id: '7',
    dateTime: '2025-06-27T14:20:00Z',
    materialId: '6',
    materialName: 'Matcha Powder',
    movementType: 'received',
    quantity: 5,
    unit: 'kg',
    currentStock: 8,
    reference: 'PO-2025-004',
    notes: 'Premium Japanese matcha',
    employee: 'Sarah M.',
    supplier: 'Japan Tea Import'
  },
  {
    id: '8',
    dateTime: '2025-06-27T13:10:00Z',
    materialId: '7',
    materialName: 'Lemon Juice',
    movementType: 'received',
    quantity: 15,
    unit: 'L',
    currentStock: 35,
    reference: 'PO-2025-005',
    notes: 'Fresh citrus delivery',
    employee: 'David T.',
    supplier: 'Fresh Citrus'
  },
  {
    id: '9',
    dateTime: '2025-06-26T15:30:00Z',
    materialId: '8',
    materialName: 'Peach Syrup',
    movementType: 'consumed',
    quantity: -10,
    unit: 'L',
    currentStock: 0,
    reference: 'ORD-004',
    notes: 'Used for peach iced tea',
    employee: 'Anna G.'
  },
  {
    id: '10',
    dateTime: '2025-06-26T11:15:00Z',
    materialId: '2',
    materialName: 'Green Tea Leaves',
    movementType: 'consumed',
    quantity: -5,
    unit: 'kg',
    currentStock: 35,
    reference: 'ORD-005',
    notes: 'Morning tea preparation',
    employee: 'Mike R.'
  }
];

type SortField = 'dateTime' | 'materialName' | 'movementType' | 'quantity' | 'currentStock';
type SortDirection = 'asc' | 'desc';

export default function StockHistoryPage() {
  const [movements, setMovements] = useState<StockMovement[]>(mockStockMovements);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [movementTypeFilter, setMovementTypeFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('dateTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const itemsPerPage = 15;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-emerald-600" />
      : <ArrowDown className="w-4 h-4 text-emerald-600" />;
  };

  const handleQuickFilter = (filter: string) => {
    const today = new Date();
    let fromDate = '';
    let toDate = today.toISOString().split('T')[0];

    switch (filter) {
      case 'today':
        fromDate = toDate;
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        fromDate = weekAgo.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        fromDate = monthAgo.toISOString().split('T')[0];
        break;
      default:
        fromDate = '';
        toDate = '';
    }

    setDateFrom(fromDate);
    setDateTo(toDate);
  };

  const filteredAndSortedMovements = movements
    .filter(movement => {
      const matchesSearch = movement.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movement.notes.toLowerCase().includes(searchTerm.toLowerCase());

      const movementDate = movement.dateTime.split('T')[0];
      const matchesDateRange = 
        (!dateFrom || movementDate >= dateFrom) &&
        (!dateTo || movementDate <= dateTo);

      const matchesMovementType = !movementTypeFilter || movement.movementType === movementTypeFilter;
      const matchesMaterial = !materialFilter || movement.materialId === materialFilter;

      return matchesSearch && matchesDateRange && matchesMovementType && matchesMaterial;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'dateTime') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const totalPages = Math.ceil(filteredAndSortedMovements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovements = filteredAndSortedMovements.slice(startIndex, startIndex + itemsPerPage);

  const handleViewMovement = (movement: StockMovement) => {
    setSelectedMovement(movement);
    setIsDetailModalOpen(true);
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      'Date/Time',
      'Material Name',
      'Movement Type',
      'Quantity',
      'Unit',
      'Current Stock',
      'Reference',
      'Employee',
      'Notes'
    ];

    const csvData = filteredAndSortedMovements.map(movement => [
      formatDateTime(movement.dateTime),
      movement.materialName,
      movement.movementType === 'received' ? 'Received' : 'Consumed',
      movement.movementType === 'received' ? `+${movement.quantity}` : movement.quantity.toString(),
      movement.unit,
      movement.currentStock,
      movement.reference,
      movement.employee,
      movement.notes
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getMovementSummary = () => {
    const received = filteredAndSortedMovements.filter(m => m.movementType === 'received').length;
    const consumed = filteredAndSortedMovements.filter(m => m.movementType === 'consumed').length;
    const totalQuantityReceived = filteredAndSortedMovements
      .filter(m => m.movementType === 'received')
      .reduce((sum, m) => sum + m.quantity, 0);
    const totalQuantityConsumed = filteredAndSortedMovements
      .filter(m => m.movementType === 'consumed')
      .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

    return { received, consumed, totalQuantityReceived, totalQuantityConsumed };
  };

  const summary = getMovementSummary();

  return (
    <div className="flex-1 flex flex-col bg-stone-50 h-screen overflow-hidden">
      {/* Header */}
      <div className="h-[80px] px-6 bg-white border-b border-stone-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Stock History</h2>
          <p className="text-gray-600">Monitor material movements across your inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <NotificationBell />
          <UserDropdown />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-stone-200 flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Movements</p>
                <p className="text-2xl font-bold text-gray-800">{filteredAndSortedMovements.length}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Received</p>
                <p className="text-2xl font-bold text-emerald-800">{summary.received}</p>
                <p className="text-xs text-emerald-600">{summary.totalQuantityReceived} units</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Consumed</p>
                <p className="text-2xl font-bold text-red-800">{summary.consumed}</p>
                <p className="text-xs text-red-600">{summary.totalQuantityConsumed} units</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Net Movement</p>
                <p className="text-2xl font-bold text-blue-800">
                  {summary.totalQuantityReceived - summary.totalQuantityConsumed > 0 ? '+' : ''}
                  {summary.totalQuantityReceived - summary.totalQuantityConsumed}
                </p>
                <p className="text-xs text-blue-600">units</p>
              </div>
              <ArrowUpDown className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Main Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by material name, reference, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <span className="flex items-center text-gray-500">to</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Secondary Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              {/* Movement Type Filter */}
              <select
                value={movementTypeFilter}
                onChange={(e) => setMovementTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Movements</option>
                <option value="received">Received</option>
                <option value="consumed">Consumed</option>
              </select>

              {/* Material Filter */}
              <select
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Materials</option>
                {mockMaterials.map(material => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => handleQuickFilter('today')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
              >
                Today
              </button>
              <button
                onClick={() => handleQuickFilter('week')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
              >
                This Week
              </button>
              <button
                onClick={() => handleQuickFilter('month')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
              >
                This Month
              </button>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFrom('');
                  setDateTo('');
                  setMovementTypeFilter('');
                  setMaterialFilter('');
                }}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('dateTime')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Date/Time</span>
                    {getSortIcon('dateTime')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('materialName')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Material Name</span>
                    {getSortIcon('materialName')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('movementType')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Movement Type</span>
                    {getSortIcon('movementType')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('quantity')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Quantity</span>
                    {getSortIcon('quantity')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('currentStock')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Current Stock</span>
                    {getSortIcon('currentStock')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {paginatedMovements.map((movement, index) => (
                <tr 
                  key={movement.id} 
                  className={`hover:bg-stone-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-stone-25'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateTime(movement.dateTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{movement.materialName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {movement.movementType === 'received' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        movement.movementType === 'received' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {movement.movementType === 'received' ? 'Received' : 'Consumed'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      movement.movementType === 'received' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {movement.movementType === 'received' ? '+' : ''}{movement.quantity} {movement.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {movement.currentStock.toLocaleString()} {movement.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{movement.reference}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {movement.notes}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewMovement(movement)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedMovements.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No stock movements found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedMovements.length)} of {filteredAndSortedMovements.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Movement Detail Modal */}
      {isDetailModalOpen && selectedMovement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Movement Details</h2>
                <p className="text-gray-600">{selectedMovement.reference}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Movement Info */}
                <div className="space-y-4">
                  <div className="bg-stone-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Movement Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date/Time:</span>
                        <span className="font-medium">{formatDateTime(selectedMovement.dateTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <div className="flex items-center space-x-2">
                          {selectedMovement.movementType === 'received' ? (
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`font-medium ${
                            selectedMovement.movementType === 'received' ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {selectedMovement.movementType === 'received' ? 'Received' : 'Consumed'}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium">{selectedMovement.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employee:</span>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{selectedMovement.employee}</span>
                        </div>
                      </div>
                      {selectedMovement.supplier && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Supplier:</span>
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{selectedMovement.supplier}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Material & Quantity Info */}
                <div className="space-y-4">
                  <div className="bg-stone-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Material Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{selectedMovement.materialName}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className={`text-xl font-bold ${
                          selectedMovement.movementType === 'received' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {selectedMovement.movementType === 'received' ? '+' : ''}{selectedMovement.quantity} {selectedMovement.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock After:</span>
                        <span className="text-xl font-bold text-gray-800">
                          {selectedMovement.currentStock.toLocaleString()} {selectedMovement.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {selectedMovement.notes && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
                  <p className="text-gray-700">{selectedMovement.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}