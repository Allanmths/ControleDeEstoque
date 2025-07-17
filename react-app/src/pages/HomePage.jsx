import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBoxes, FaClipboardList, FaChartLine, FaUsers } from 'react-icons/fa';

const HomePage = () => {
  const { userData } = useAuth();

  const quickActions = [
    {
      title: 'Ver Estoque',
      description: 'Visualizar produtos em estoque',
      icon: FaBoxes,
      href: '/stock',
      color: 'bg-blue-500'
    },
    {
      title: 'Nova Contagem',
      description: 'Iniciar contagem de estoque',
      icon: FaClipboardList,
      href: '/count/new',
      color: 'bg-green-500'
    },
    {
      title: 'Dashboard',
      description: 'Ver relatórios e análises',
      icon: FaChartLine,
      href: '/dashboard',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {userData?.displayName || 'Usuário'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Gerencie seu estoque de forma eficiente
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
            onClick={() => window.location.href = action.href}
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${action.color}`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Visão Geral do Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">--</div>
            <div className="text-sm text-gray-500">Total de Produtos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">--</div>
            <div className="text-sm text-gray-500">Categorias</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">--</div>
            <div className="text-sm text-gray-500">Localizações</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
