import React, { useState } from 'react';
import { User, ChevronDown, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: 'Trang chủ', href: '/home' },
    { name: 'Khóa học', href: '/courses' },
    { name: 'Đánh giá', href: '/assessments' },
    { name: 'Đặt lịch', href: '/booking' },
    { name: 'Blog', href: '/blog' },
  ];

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/home');
  };

  const userMenuItems = [
    { name: 'Dashboard', icon: User, href: '/dashboard' },
    { name: 'Đăng xuất', icon: LogOut, href: '#', onClick: handleLogout, divider: true },
  ];

  return (
    <header className="bg-white shadow-lg border-b-2 border-teal-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Name */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Drug Prevention
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-teal-600 bg-teal-50 border-b-2 border-teal-600'
                    : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 focus:outline-none focus:text-teal-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    {userMenuItems.map((item) => (
                      <React.Fragment key={item.name}>
                        {item.divider && <div className="border-t border-gray-100 my-1"></div>}
                        {item.onClick ? (
                          <button
                            onClick={item.onClick}
                            className={`w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200 ${
                              item.name === 'Đăng xuất' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''
                            }`}
                          >
                            <item.icon className="w-4 h-4 mr-3" />
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            to={item.href}
                            className={`flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200`}
                          >
                            <item.icon className="w-4 h-4 mr-3" />
                            {item.name}
                          </Link>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 focus:outline-none focus:text-teal-600 transition-colors duration-200"
              >
                <span className="font-medium">Đăng nhập</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-teal-600 focus:outline-none focus:text-teal-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile User Menu */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <>
                  <div className="flex items-center px-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {userMenuItems.map((item) => (
                      item.onClick ? (
                        <button
                          key={item.name}
                          onClick={item.onClick}
                          className={`w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                            item.name === 'Đăng xuất' 
                              ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                              : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-5 py-2 text-base font-medium text-gray-700 hover:text-teal-600 transition-colors duration-200"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isUserDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserDropdownOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;