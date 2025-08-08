import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Eye, 
  Printer, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  X,
  User,
  CreditCard,
  Receipt,
  Package2
} from 'lucide-react';
import UserDropdown from '../../components/UserDropdown';

interface Transaction {
  id: string;
  invoiceNo: string;
  customer: string;
  cashier: string;
  date: string;
  time: string;
  paymentMethod: 'cash' | 'card' | 'qris' | 'transfer';
  totalAmount: number;
  status: 'paid' | 'refunded' | 'canceled';
  items: TransactionItem[];
  subtotal: number;
  paid: number;
  change: number;
}

interface TransactionItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    invoiceNo: 'INV-20250628-001',
    customer: 'John Doe',
    cashier: 'Airlangga W.',
    date: '2025-06-28',
    time: '14:30',
    paymentMethod: 'cash',
    totalAmount: 75000,
    status: 'paid',
    subtotal: 75000,
    paid: 80000,
    change: 5000,
    items: [
      { id: '1', name: 'Thai Milk Tea', quantity: 2, price: 29000, subtotal: 58000 },
      { id: '2', name: 'Classic Tea', quantity: 1, price: 20000, subtotal: 20000 }
    ]
  },
  {
    id: '2',
    invoiceNo: 'INV-20250628-002',
    customer: 'Jane Smith',
    cashier: 'Airlangga W.',
    date: '2025-06-28',
    time: '15:45',
    paymentMethod: 'card',
    totalAmount: 52000,
    status: 'paid',
    subtotal: 52000,
    paid: 52000,
    change: 0,
    items: [
      { id: '3', name: 'Matcha Latte', quantity: 1, price: 30000, subtotal: 30000 },
      { id: '4', name: 'Honey Lemon Tea', quantity: 1, price: 22000, subtotal: 22000 }
    ]
  },
  {
    id: '3',
    invoiceNo: 'INV-20250627-015',
    customer: 'Bob Wilson',
    cashier: 'Sarah M.',
    date: '2025-06-27',
    time: '16:20',
    paymentMethod: 'qris',
    totalAmount: 30000,
    status: 'refunded',
    subtotal: 30000,
    paid: 30000,
    change: 0,
    items: [
      { id: '5', name: 'Matcha Latte', quantity: 1, price: 30000, subtotal: 30000 }
    ]
  },
  {
    id: '4',
    invoiceNo: 'INV-20250627-012',
    customer: 'Alice Brown',
    cashier: 'Mike R.',
    date: '2025-06-27',
    time: '13:15',
    paymentMethod: 'transfer',
    totalAmount: 48000,
    status: 'canceled',
    subtotal: 48000,
    paid: 0,
    change: 0,
    items: [
      { id: '6', name: 'Peach Iced Tea', quantity: 1, price: 25000, subtotal: 25000 },
      { id: '7', name: 'Mint Tea', quantity: 1, price: 23000, subtotal: 23000 }
    ]
  },
  {
    id: '5',
    invoiceNo: 'INV-20250626-008',
    customer: 'David Lee',
    cashier: 'Airlangga W.',
    date: '2025-06-26',
    time: '11:30',
    paymentMethod: 'cash',
    totalAmount: 84000,
    status: 'paid',
    subtotal: 84000,
    paid: 85000,
    change: 1000,
    items: [
      { id: '8', name: 'Lychee Tea', quantity: 2, price: 28000, subtotal: 56000 },
      { id: '9', name: 'Jasmine Green Tea', quantity: 1, price: 27000, subtotal: 27000 }
    ]
  }
];

const paymentMethodLabels = {
  cash: 'Cash',
  card: 'Card',
  qris: 'QRIS',
  transfer: 'Transfer'
};

const statusLabels = {
  paid: 'Paid',
  refunded: 'Refunded',
  canceled: 'Canceled'
};

const statusColors = {
  paid: 'bg-emerald-100 text-emerald-800',
  refunded: 'bg-amber-100 text-amber-800',
  canceled: 'bg-red-100 text-red-800'
};

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const itemsPerPage = 10;

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const formatDateTime = (date: string, time: string) => {
    return `${date} ${time}`;
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

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.cashier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateRange = 
      (!dateFrom || transaction.date >= dateFrom) &&
      (!dateTo || transaction.date <= dateTo);

    const matchesPaymentMethod = 
      !paymentMethodFilter || transaction.paymentMethod === paymentMethodFilter;

    const matchesStatus = 
      !statusFilter || transaction.status === statusFilter;

    return matchesSearch && matchesDateRange && matchesPaymentMethod && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const handlePrint = (transaction: Transaction) => {
    // Implement print functionality
    console.log('Print transaction:', transaction.invoiceNo);
  };

  const handleRefund = (transaction: Transaction) => {
    // Implement refund functionality
    console.log('Refund transaction:', transaction.invoiceNo);
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-50 h-screen overflow-hidden">
      {/* Header */}
      <div className="h-[80px] px-6 bg-white border-b border-stone-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
          <p className="text-gray-600">View and manage all transactions</p>
        </div>
        <UserDropdown />
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-stone-200 flex-shrink-0">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by invoice, customer, or cashier..."
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

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="qris">QRIS</option>
              <option value="transfer">Transfer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleQuickFilter('today')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => handleQuickFilter('week')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            This Week
          </button>
          <button
            onClick={() => handleQuickFilter('month')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            This Month
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              setDateFrom('');
              setDateTo('');
              setPaymentMethodFilter('');
              setStatusFilter('');
            }}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            Clear All
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
                  Invoice No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cashier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {paginatedTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  className={`hover:bg-stone-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-stone-25'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.invoiceNo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.cashier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateTime(transaction.date, transaction.time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {paymentMethodLabels[transaction.paymentMethod]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-emerald-600">
                      {formatPrice(transaction.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[transaction.status]}`}>
                      {statusLabels[transaction.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrint(transaction)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="Print"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {transaction.status === 'paid' && (
                        <button
                          onClick={() => handleRefund(transaction)}
                          className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50"
                          title="Refund"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedTransactions.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border rounded-lg ${
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
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {isDetailModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="text-2xl font-bold text-gray-800">Transaction Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Transaction Info */}
                <div className="space-y-6">
                  {/* Invoice Info */}
                  <div className="bg-stone-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Invoice Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice No:</span>
                        <span className="font-medium">{selectedTransaction.invoiceNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDateTime(selectedTransaction.date, selectedTransaction.time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cashier:</span>
                        <span className="font-medium">{selectedTransaction.cashier}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-stone-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{selectedTransaction.customer}</span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-stone-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{paymentMethodLabels[selectedTransaction.paymentMethod]}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[selectedTransaction.status]}`}>
                          {statusLabels[selectedTransaction.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Products */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                  <div className="bg-stone-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {selectedTransaction.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-stone-200 last:border-b-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Package2 className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-800">{item.name}</span>
                            </div>
                            <div className="text-sm text-gray-600 ml-6">
                              {item.quantity} x {formatPrice(item.price)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-800">
                              {formatPrice(item.subtotal)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mt-8 bg-emerald-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatPrice(selectedTransaction.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold">{formatPrice(selectedTransaction.paid)}</span>
                  </div>
                  {selectedTransaction.change > 0 && (
                    <div className="flex justify-between border-t border-emerald-200 pt-3">
                      <span className="text-emerald-600 font-medium">Change:</span>
                      <span className="font-bold text-emerald-600">{formatPrice(selectedTransaction.change)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-emerald-200 pt-3">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-emerald-600">
                      {formatPrice(selectedTransaction.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-stone-200 p-6 bg-stone-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handlePrint(selectedTransaction)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                {selectedTransaction.status === 'paid' && (
                  <button
                    onClick={() => handleRefund(selectedTransaction)}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Refund</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}