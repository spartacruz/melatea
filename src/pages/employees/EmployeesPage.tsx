import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  UserX, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  X,
  User,
  Users,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import UserDropdown from '../../components/UserDropdown';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Cashier' | 'Supervisor';
  status: 'active' | 'inactive';
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeFormData {
  name: string;
  email: string;
  role: 'Manager' | 'Cashier' | 'Supervisor';
  password: string;
  status: 'active' | 'inactive';
}

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Airlangga W.',
    email: 'airlangga@melatea.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2025-06-28T14:30:00Z',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-06-28T14:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    email: 'sarah.m@melatea.com',
    role: 'Supervisor',
    status: 'active',
    lastLogin: '2025-06-28T13:45:00Z',
    createdAt: '2025-02-20T10:30:00Z',
    updatedAt: '2025-06-27T16:20:00Z'
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike.r@melatea.com',
    role: 'Cashier',
    status: 'active',
    lastLogin: '2025-06-28T12:15:00Z',
    createdAt: '2025-03-10T14:15:00Z',
    updatedAt: '2025-06-28T08:30:00Z'
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.c@melatea.com',
    role: 'Cashier',
    status: 'active',
    lastLogin: '2025-06-27T18:30:00Z',
    createdAt: '2025-04-05T11:45:00Z',
    updatedAt: '2025-06-26T15:10:00Z'
  },
  {
    id: '5',
    name: 'David Thompson',
    email: 'david.t@melatea.com',
    role: 'Cashier',
    status: 'inactive',
    lastLogin: '2025-06-20T16:45:00Z',
    createdAt: '2025-01-30T13:20:00Z',
    updatedAt: '2025-06-21T09:15:00Z'
  },
  {
    id: '6',
    name: 'Emma Wilson',
    email: 'emma.w@melatea.com',
    role: 'Supervisor',
    status: 'active',
    lastLogin: '2025-06-28T10:20:00Z',
    createdAt: '2025-05-12T16:30:00Z',
    updatedAt: '2025-06-28T10:20:00Z'
  },
  {
    id: '7',
    name: 'James Brown',
    email: 'james.b@melatea.com',
    role: 'Cashier',
    status: 'inactive',
    lastLogin: '2025-06-15T14:10:00Z',
    createdAt: '2025-03-25T12:00:00Z',
    updatedAt: '2025-06-16T11:30:00Z'
  },
  {
    id: '8',
    name: 'Anna Garcia',
    email: 'anna.g@melatea.com',
    role: 'Cashier',
    status: 'active',
    lastLogin: '2025-06-28T09:45:00Z',
    createdAt: '2025-04-18T15:45:00Z',
    updatedAt: '2025-06-27T17:20:00Z'
  }
];

const roles = ['All Roles', 'Manager', 'Supervisor', 'Cashier'];
const statusOptions = ['All Status', 'active', 'inactive'];

const roleColors = {
  Manager: 'bg-purple-100 text-purple-800',
  Supervisor: 'bg-blue-100 text-blue-800',
  Cashier: 'bg-emerald-100 text-emerald-800'
};

const statusColors = {
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-red-100 text-red-800'
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    role: 'Cashier',
    password: '',
    status: 'active'
  });

  const itemsPerPage = 10;

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const getLastLoginStatus = (lastLogin: string | null) => {
    if (!lastLogin) return { text: 'Never', color: 'text-gray-500' };
    
    const loginDate = new Date(lastLogin);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return { text: 'Just now', color: 'text-emerald-600' };
    if (diffHours < 24) return { text: `${diffHours}h ago`, color: 'text-emerald-600' };
    if (diffHours < 168) return { text: `${Math.floor(diffHours / 24)}d ago`, color: 'text-amber-600' };
    return { text: formatDateTime(lastLogin), color: 'text-gray-600' };
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || roleFilter === 'All Roles' || employee.role === roleFilter;
    const matchesStatus = !statusFilter || statusFilter === 'All Status' || employee.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Cashier',
      password: '',
      status: 'active'
    });
    setShowPassword(false);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      password: '', // Don't pre-fill password for security
      status: employee.status
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleDeactivateEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const action = employee.status === 'active' ? 'deactivate' : 'activate';
    const message = `Are you sure you want to ${action} this employee?`;
    
    if (window.confirm(message)) {
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeId 
          ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active', updatedAt: new Date().toISOString() }
          : emp
      ));
    }
  };

  const handleResetPassword = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    if (window.confirm(`Reset password for ${employee.name}? A temporary password will be generated.`)) {
      // In a real app, this would trigger a password reset email or generate a temporary password
      alert(`Password reset initiated for ${employee.name}. Temporary password: temp123`);
      
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeId 
          ? { ...emp, updatedAt: new Date().toISOString() }
          : emp
      ));
    }
  };

  const handleSaveEmployee = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editingEmployee && !formData.password) {
      alert('Password is required for new employees');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Check for duplicate email
    const existingEmployee = employees.find(emp => 
      emp.email.toLowerCase() === formData.email.toLowerCase() && 
      emp.id !== editingEmployee?.id
    );
    
    if (existingEmployee) {
      alert('An employee with this email already exists');
      return;
    }

    const now = new Date().toISOString();
    const employeeData: Employee = {
      id: editingEmployee?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      lastLogin: editingEmployee?.lastLogin || null,
      createdAt: editingEmployee?.createdAt || now,
      updatedAt: now
    };

    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? employeeData : emp));
    } else {
      setEmployees(prev => [...prev, employeeData]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
    setEditingEmployee(null);
  };

  const getEmployeeSummary = () => {
    const total = filteredEmployees.length;
    const active = filteredEmployees.filter(emp => emp.status === 'active').length;
    const inactive = filteredEmployees.filter(emp => emp.status === 'inactive').length;
    const managers = filteredEmployees.filter(emp => emp.role === 'Manager').length;
    const supervisors = filteredEmployees.filter(emp => emp.role === 'Supervisor').length;
    const cashiers = filteredEmployees.filter(emp => emp.role === 'Cashier').length;
    
    return { total, active, inactive, managers, supervisors, cashiers };
  };

  const summary = getEmployeeSummary();

  return (
    <div className="flex-1 flex flex-col bg-stone-50 h-screen overflow-hidden">
      {/* Header */}
      <div className="h-[80px] px-6 bg-white border-b border-stone-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
          <p className="text-gray-600">Manage staff accounts and permissions</p>
        </div>
        <UserDropdown />
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 bg-white border-b border-stone-200 flex-shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Active</p>
                <p className="text-2xl font-bold text-emerald-800">{summary.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Inactive</p>
                <p className="text-2xl font-bold text-red-800">{summary.inactive}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Managers</p>
                <p className="text-2xl font-bold text-purple-800">{summary.managers}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Supervisors</p>
                <p className="text-2xl font-bold text-blue-800">{summary.supervisors}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Cashiers</p>
                <p className="text-2xl font-bold text-emerald-800">{summary.cashiers}</p>
              </div>
              <User className="w-8 h-8 text-emerald-400" />
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
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {roles.map(role => (
                  <option key={role} value={role === 'All Roles' ? '' : role}>
                    {role}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status === 'All Status' ? '' : status}>
                    {status === 'All Status' ? status : status === 'active' ? 'Active' : 'Inactive'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Employee Button */}
          <button
            onClick={handleAddEmployee}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {paginatedEmployees.map((employee, index) => {
                const lastLoginStatus = getLastLoginStatus(employee.lastLogin);
                
                return (
                  <tr 
                    key={employee.id} 
                    className={`hover:bg-stone-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-stone-25'
                    } ${employee.status === 'inactive' ? 'opacity-75' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-xs text-gray-500">ID: {employee.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[employee.role]}`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{employee.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[employee.status]}`}>
                        {employee.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${lastLoginStatus.color}`}>
                          {lastLoginStatus.text}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeactivateEmployee(employee.id)}
                          className={`p-1 rounded transition-colors ${
                            employee.status === 'active'
                              ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                              : 'text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50'
                          }`}
                          title={employee.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(employee.id)}
                          className="text-amber-600 hover:text-amber-900 p-1 rounded hover:bg-amber-50 transition-colors"
                          title="Reset Password"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {paginatedEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No employees found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} results
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

      {/* Add/Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
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
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                {/* Role and Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'Manager' | 'Cashier' | 'Supervisor' }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="Cashier">Cashier</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Manager">Manager</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {!editingEmployee && '*'}
                    {editingEmployee && (
                      <span className="text-sm text-gray-500 font-normal ml-2">
                        (Leave empty to keep current password)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder={editingEmployee ? "Enter new password" : "Enter password"}
                      required={!editingEmployee}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {!editingEmployee && (
                    <p className="text-xs text-gray-500 mt-1">
                      Password should be at least 8 characters long
                    </p>
                  )}
                </div>

                {/* Role Permissions Info */}
                <div className="bg-stone-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Role Permissions</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>Manager:</strong> Full access to all features and settings</div>
                    <div><strong>Supervisor:</strong> Access to reports, inventory, and employee management</div>
                    <div><strong>Cashier:</strong> Access to order entry and basic transaction features</div>
                  </div>
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
                  onClick={handleSaveEmployee}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  {editingEmployee ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}