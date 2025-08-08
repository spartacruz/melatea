import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ChevronLeft, 
  ChevronRight,
  X,
  Package,
  Calendar,
  User,
  TrendingDown,
  TrendingUp,
  Clock
} from 'lucide-react';
import UserDropdown from '../../components/UserDropdown';

interface InventoryItem {
  id: string;
  materialName: string;
  currentStock: number;
  unit: string;
  reorderThreshold: number;
  status: 'sufficient' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
  cost: number;
  supplier: string;
}

interface StockHistory {
  id: string;
  materialId: string;
  type: 'receive' | 'consume';
  quantity: number;
  date: string;
  notes: string;
  reference?: string; // Order ID for consumption, PO for receiving
}

interface ReceiveStockForm {
  materialId: string;
  quantity: string;
  notes: string;
}

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    materialName: 'Black Tea Leaves',
    currentStock: 150,
    unit: 'kg',
    reorderThreshold: 50,
    status: 'sufficient',
    lastUpdated: '2025-06-28T14:30:00Z',
    cost: 85000,
    supplier: 'Tea Garden Co.'
  },
  {
    id: '2',
    materialName: 'Green Tea Leaves',
    currentStock: 25,
    unit: 'kg',
    reorderThreshold: 30,
    status: 'low-stock',
    lastUpdated: '2025-06-28T10:15:00Z',
    cost: 120000,
    supplier: 'Premium Tea Ltd.'
  },
  {
    id: '3',
    materialName: 'Milk Powder',
    currentStock: 0,
    unit: 'kg',
    reorderThreshold: 20,
    status: 'out-of-stock',
    lastUpdated: '2025-06-27T16:45:00Z',
    cost: 45000,
    supplier: 'Dairy Fresh'
  },
  {
    id: '4',
    materialName: 'Sugar',
    currentStock: 80,
    unit: 'kg',
    reorderThreshold: 25,
    status: 'sufficient',
    lastUpdated: '2025-06-28T09:20:00Z',
    cost: 15000,
    supplier: 'Sweet Supply'
  },
  {
    id: '5',
    materialName: 'Honey',
    currentStock: 15,
    unit: 'kg',
    reorderThreshold: 10,
    status: 'sufficient',
    lastUpdated: '2025-06-27T11:30:00Z',
    cost: 180000,
    supplier: 'Natural Honey Co.'
  },
  {
    id: '6',
    materialName: 'Matcha Powder',
    currentStock: 8,
    unit: 'kg',
    reorderThreshold: 15,
    status: 'low-stock',
    lastUpdated: '2025-06-26T14:20:00Z',
    cost: 450000,
    supplier: 'Japan Tea Import'
  },
  {
    id: '7',
    materialName: 'Lemon Juice',
    currentStock: 35,
    unit: 'L',
    reorderThreshold: 20,
    status: 'sufficient',
    lastUpdated: '2025-06-28T08:45:00Z',
    cost: 25000,
    supplier: 'Fresh Citrus'
  },
  {
    id: '8',
    materialName: 'Peach Syrup',
    currentStock: 0,
    unit: 'L',
    reorderThreshold: 10,
    status: 'out-of-stock',
    lastUpdated: '2025-06-25T13:10:00Z',
    cost: 35000,
    supplier: 'Fruit Flavors Inc.'
  }
];

// Mock stock history
const mockStockHistory: StockHistory[] = [
  {
    id: '1',
    materialId: '1',
    type: 'receive',
    quantity: 50,
    date: '2025-06-28T14:30:00Z',
    notes: 'Weekly delivery',
    reference: 'PO-2025-001'
  },
  {
    id: '2',
    materialId: '1',
    type: 'consume',
    quantity: -5,
    date: '2025-06-28T12:15:00Z',
    notes: 'Order production',
    reference: 'ORD-001'
  },
  {
    id: '3',
    materialId: '2',
    type: 'consume',
    quantity: -10,
    date: '2025-06-28T10:15:00Z',
    notes: 'Order production',
    reference: 'ORD-002'
  }
];

const statusConfig = {
  'sufficient': {
    label: 'Sufficient',
    color: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircle,
    iconColor: 'text-emerald-600'
  },
  'low-stock': {
    label: 'Low Stock',
    color: 'bg-amber-100 text-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-600'
  },
  'out-of-stock': {
    label: 'Out of Stock',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    iconColor: 'text-red-600'
  }
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>(mockStockHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<InventoryItem | null>(null);

  const [receiveForm, setReceiveForm] = useState<ReceiveStockForm>({
    materialId: '',
    quantity: '',
    notes: ''
  });

  const itemsPerPage = 10;

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

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

  const updateMaterialStatus = (material: InventoryItem): InventoryItem => {
    let status: 'sufficient' | 'low-stock' | 'out-of-stock';
    
    if (material.currentStock === 0) {
      status = 'out-of-stock';
    } else if (material.currentStock <= material.reorderThreshold) {
      status = 'low-stock';
    } else {
      status = 'sufficient';
    }
    
    return { ...material, status };
  };

  const filteredInventory = inventory
    .map(updateMaterialStatus)
    .filter(item => {
      const matchesSearch = item.materialName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + itemsPerPage);

  const handleReceiveStock = () => {
    setReceiveForm({
      materialId: '',
      quantity: '',
      notes: ''
    });
    setIsReceiveModalOpen(true);
  };

  const handleViewHistory = (material: InventoryItem) => {
    setSelectedMaterial(material);
    setIsHistoryModalOpen(true);
  };

  const handleSubmitReceive = () => {
    if (!receiveForm.materialId || !receiveForm.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    const quantity = parseFloat(receiveForm.quantity);
    if (quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    const now = new Date().toISOString();

    // Update inventory
    setInventory(prev => prev.map(item => {
      if (item.id === receiveForm.materialId) {
        return {
          ...item,
          currentStock: item.currentStock + quantity,
          lastUpdated: now
        };
      }
      return item;
    }));

    // Add to stock history
    const newHistoryEntry: StockHistory = {
      id: Date.now().toString(),
      materialId: receiveForm.materialId,
      type: 'receive',
      quantity: quantity,
      date: now,
      notes: receiveForm.notes || 'Stock received',
      reference: `RCV-${Date.now()}`
    };

    setStockHistory(prev => [newHistoryEntry, ...prev]);

    setIsReceiveModalOpen(false);
    setReceiveForm({
      materialId: '',
      quantity: '',
      notes: ''
    });
  };

  const getFilteredHistory = (materialId: string) => {
    return stockHistory
      .filter(entry => entry.materialId === materialId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getStockSummary = () => {
    const sufficient = filteredInventory.filter(item => item.status === 'sufficient').length;
    const lowStock = filteredInventory.filter(item => item.status === 'low-stock').length;
    const outOfStock = filteredInventory.filter(item => item.status === 'out-of-stock').length;
    
    return { sufficient, lowStock, outOfStock };
  };

  const summary = getStockSummary();

  return (
    <div className="flex-1 flex flex-col bg-stone-50 h-screen overflow-hidden">
      {/* Header */}
      <div className="h-[80px] px-6 bg-white border-b border-stone-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
          <p className="text-gray-600">Monitor and manage material stock levels</p>
        </div>
        <UserDropdown />
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-stone-200 flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold text-gray-800">{filteredInventory.length}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Sufficient Stock</p>
                <p className="text-2xl font-bold text-emerald-800">{summary.sufficient}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Low Stock</p>
                <p className="text-2xl font-bold text-amber-800">{summary.lowStock}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-800">{summary.outOfStock}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Status</option>
              <option value="sufficient">Sufficient</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Receive Stock Button */}
          <button
            onClick={handleReceiveStock}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Receive Stock</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Threshold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {paginatedInventory.map((item, index) => {
                const statusInfo = statusConfig[item.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-stone-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-stone-25'
                    } ${item.status === 'out-of-stock' ? 'bg-red-25' : item.status === 'low-stock' ? 'bg-amber-25' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className={`w-5 h-5 ${statusInfo.iconColor}`} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.materialName}</div>
                          <div className="text-xs text-gray-500">{item.supplier}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.currentStock.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.reorderThreshold.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(item.lastUpdated)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setReceiveForm(prev => ({ ...prev, materialId: item.id }));
                            setIsReceiveModalOpen(true);
                          }}
                          className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50 transition-colors"
                          title="Receive Stock"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewHistory(item)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="View History"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {paginatedInventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No materials found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInventory.length)} of {filteredInventory.length} results
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

      {/* Receive Stock Modal */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="text-xl font-bold text-gray-800">Receive Stock</h2>
              <button
                onClick={() => setIsReceiveModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Material Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material *
                </label>
                <select
                  value={receiveForm.materialId}
                  onChange={(e) => setReceiveForm(prev => ({ ...prev, materialId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select material</option>
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.materialName} ({item.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={receiveForm.quantity}
                  onChange={(e) => setReceiveForm(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter quantity"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              {/* Unit Display */}
              {receiveForm.materialId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={inventory.find(item => item.id === receiveForm.materialId)?.unit || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              )}

              {/* Date/Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date/Time
                </label>
                <div className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {formatDateTime(new Date().toISOString())}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={receiveForm.notes}
                  onChange={(e) => setReceiveForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter any notes about this stock receipt"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-stone-200 p-6 bg-stone-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsReceiveModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReceive}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Receive Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock History Modal */}
      {isHistoryModalOpen && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Stock History</h2>
                <p className="text-gray-600">{selectedMaterial.materialName}</p>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              {/* Current Status */}
              <div className="bg-stone-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Stock</p>
                    <p className="text-xl font-bold text-gray-800">
                      {selectedMaterial.currentStock.toLocaleString()} {selectedMaterial.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reorder Threshold</p>
                    <p className="text-xl font-bold text-gray-800">
                      {selectedMaterial.reorderThreshold.toLocaleString()} {selectedMaterial.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[selectedMaterial.status].color}`}>
                      {statusConfig[selectedMaterial.status].label}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatDateTime(selectedMaterial.lastUpdated)}
                    </p>
                  </div>
                </div>
              </div>

              {/* History Table */}
              <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
                <div className="px-4 py-3 bg-stone-50 border-b border-stone-200">
                  <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date/Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Reference
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {getFilteredHistory(selectedMaterial.id).map((entry, index) => (
                        <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-stone-25'}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatDateTime(entry.date)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              {entry.type === 'receive' ? (
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                              )}
                              <span className={`text-sm font-medium ${
                                entry.type === 'receive' ? 'text-emerald-600' : 'text-red-600'
                              }`}>
                                {entry.type === 'receive' ? 'Received' : 'Consumed'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-semibold ${
                              entry.type === 'receive' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {entry.type === 'receive' ? '+' : ''}{entry.quantity.toLocaleString()} {selectedMaterial.unit}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {entry.reference}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {entry.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {getFilteredHistory(selectedMaterial.id).length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No history available</p>
                    </div>
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