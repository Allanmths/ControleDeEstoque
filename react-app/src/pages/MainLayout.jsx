import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaSignOutAlt, FaUser, FaHome, FaBoxes, FaChartBar, FaClipboardList } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FaChartBar },
    { name: 'Início', href: '/home', icon: FaHome },
    { name: 'Estoque', href: '/stock', icon: FaBoxes },
    { name: 'Nova Contagem', href: '/count/new', icon: FaClipboardList },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">Controle de Estoque</h1>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 p-4">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 mb-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Controle de Estoque</h1>
        </div>
        <nav className="flex-1 p-4">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className={`w-full flex items-center px-3 py-2 mb-2 text-sm font-medium rounded-md ${
                isActive(item.href)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:px-6">
          <button
            className="text-gray-400 hover:text-gray-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaUser className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {userData?.displayName || currentUser?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
