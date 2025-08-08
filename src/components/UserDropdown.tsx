import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserDropdownProps {
  className?: string;
}

export default function UserDropdown({ className = '' }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  // Mock user data - in a real app, this would come from auth context
  const user = {
    name: 'Airlangga Wibowo',
    role: 'Manager',
    email: 'airlangga@melatea.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* User Pill Button */}
      <button
        onClick={handleToggle}
        className={`flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-stone-200 hover:bg-stone-50 transition-colors ${
          isOpen ? 'ring-2 ring-emerald-500 border-emerald-300' : ''
        }`}
      >
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        
        {/* User Name - Hidden on mobile */}
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user.name.split(' ')[0]}
        </span>
        
        {/* Dropdown Arrow */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-stone-200">
            <div className="flex items-center space-x-3">
              {/* Larger Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center flex-shrink-0">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-emerald-600" />
                )}
              </div>
              
              {/* User Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile Section - Future feature */}
            <div className="px-4 py-2">
              <button className="w-full text-left flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-stone-50 rounded-lg transition-colors">
                <User className="w-4 h-4 text-gray-500" />
                <span>View Profile</span>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-200 my-2"></div>

            {/* Logout */}
            <div className="px-4 py-2">
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}