import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  X,
  Upload,
  User,
  Package2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import UserDropdown from '../../components/UserDropdown';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  availability: 'available' | 'out-of-stock';
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  availability: 'available' | 'out-of-stock';
}

// Mock data with timestamps
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Tea',
    description: 'Traditional black tea with a rich, bold flavor',
    price: 20000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Hot Tea',
    availability: 'available',
    createdAt: '2025-06-28T14:30:00Z',
    updatedAt: '2025-06-28T14:30:00Z'
  },
  {
    id: '2',
    name: 'Thai Milk Tea',
    description: 'Creamy Thai-style milk tea with condensed milk',
    price: 29000,
    image: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Milk Tea',
    availability: 'available',
    createdAt: '2025-06-27T16:45:00Z',
    updatedAt: '2025-06-28T10:15:00Z'
  },
  {
    id: '3',
    name: 'Matcha Latte',
    description: 'Premium Japanese matcha with steamed milk',
    price: 30000,
    image: 'https://images.pexels.com/photos/4226894/pexels-photo-4226894.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Specialty',
    availability: 'available',
    createdAt: '2025-06-26T09:20:00Z',
    updatedAt: '2025-06-27T11:30:00Z'
  },
  {
    id: '4',
    name: 'Peach Iced Tea',
    description: 'Refreshing iced tea with natural peach flavor',
    price: 25000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Iced Tea',
    availability: 'out-of-stock',
    createdAt: '2025-06-25T13:10:00Z',
    updatedAt: '2025-06-28T08:45:00Z'
  },
  {
    id: '5',
    name: 'Honey Lemon Tea',
    description: 'Soothing tea with natural honey and fresh lemon',
    price: 22000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Hot Tea',
    availability: 'available',
    createdAt: '2025-06-24T15:25:00Z',
    updatedAt: '2025-06-24T15:25:00Z'
  },
  {
    id: '6',
    name: 'Jasmine Green Tea',
    description: 'Delicate green tea with jasmine flower essence',
    price: 27000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Green Tea',
    availability: 'available',
    createdAt: '2025-06-23T12:40:00Z',
    updatedAt: '2025-06-26T14:20:00Z'
  },
  {
    id: '7',
    name: 'Black Tea',
    description: 'Strong and robust black tea blend',
    price: 21000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Hot Tea',
    availability: 'available',
    createdAt: '2025-06-22T10:15:00Z',
    updatedAt: '2025-06-22T10:15:00Z'
  },
  {
    id: '8',
    name: 'Lychee Tea',
    description: 'Exotic lychee flavored tea with tropical notes',
    price: 28000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fruit Tea',
    availability: 'out-of-stock',
    createdAt: '2025-06-21T17:30:00Z',
    updatedAt: '2025-06-27T09:10:00Z'
  },
  {
    id: '9',
    name: 'Mint Tea',
    description: 'Refreshing mint tea with cooling properties',
    price: 23000,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Herbal Tea',
    availability: 'available',
    createdAt: '2025-06-20T11:50:00Z',
    updatedAt: '2025-06-25T16:35:00Z'
  }
];

const categories = ['All Categories', 'Hot Tea', 'Milk Tea', 'Specialty', 'Iced Tea', 'Green Tea', 'Fruit Tea', 'Herbal Tea'];
const availabilityOptions = ['All Status', 'available', 'out-of-stock'];

type SortField = 'name' | 'price' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Hot Tea',
    availability: 'available'
  });

  const itemsPerPage = 8;

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

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || categoryFilter === 'All Categories' || product.category === categoryFilter;
      const matchesAvailability = !availabilityFilter || availabilityFilter === 'All Status' || product.availability === availabilityFilter;
      
      return matchesSearch && matchesCategory && matchesAvailability;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'updatedAt') {
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

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'Hot Tea',
      availability: 'available'
    });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      availability: product.availability
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.description || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    const now = new Date().toISOString();
    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image || 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: formData.category,
      availability: formData.availability,
      createdAt: editingProduct?.createdAt || now,
      updatedAt: now
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
    } else {
      setProducts(prev => [...prev, productData]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
    setEditingProduct(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-50 h-screen overflow-hidden">
      {/* Header */}
      <div className="h-[80px] px-6 bg-white border-b border-stone-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Product List</h2>
          <p className="text-gray-600">Manage your tea products and inventory</p>
        </div>
        <UserDropdown />
      </div>

      {/* Top Controls */}
      <div className="px-6 py-4 bg-white border-b border-stone-200 flex-shrink-0">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Left side - Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All Categories' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {availabilityOptions.map(option => (
                  <option key={option} value={option === 'All Status' ? '' : option}>
                    {option === 'All Status' ? option : option === 'available' ? 'Available' : 'Out of Stock'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right side - Add Button */}
          <button
            onClick={handleAddProduct}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
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
                  Photo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Product Name</span>
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Price</span>
                    {getSortIcon('price')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('updatedAt')}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  >
                    <span>Updated Date/Time</span>
                    {getSortIcon('updatedAt')}
                  </button>
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
              {paginatedProducts.map((product, index) => (
                <tr 
                  key={product.id} 
                  className={`hover:bg-stone-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-stone-25'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {product.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-emerald-600">
                      {formatPrice(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateTime(product.updatedAt)}
                    </div>
                    {product.createdAt !== product.updatedAt && (
                      <div className="text-xs text-gray-500">
                        Updated
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.availability === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.availability === 'available' ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedProducts.length === 0 && (
            <div className="text-center py-12">
              <Package2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} results
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

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center space-x-4">
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-20 h-20 rounded-lg object-cover border border-stone-200"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter image URL"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a valid image URL or leave empty for default image
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter product description"
                    required
                  />
                </div>

                {/* Price and Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Rp) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {categories.filter(cat => cat !== 'All Categories').map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value as 'available' | 'out-of-stock' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="available">Available</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-stone-200 p-6 bg-stone-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}