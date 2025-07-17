import React, { useState } from 'react';
import { FaSave, FaCog, FaUser, FaBell, FaDatabase, FaShield } from 'react-icons/fa';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Minha Empresa',
      lowStockAlert: 10,
      autoBackup: true,
      notifications: true
    },
    profile: {
      name: 'Usuário',
      email: 'usuario@email.com',
      role: 'admin'
    },
    notifications: {
      lowStock: true,
      newMovements: true,
      dailyReports: false,
      emailNotifications: true
    }
  });

  const tabs = [
    { id: 'general', label: 'Geral', icon: FaCog },
    { id: 'profile', label: 'Perfil', icon: FaUser },
    { id: 'notifications', label: 'Notificações', icon: FaBell },
    { id: 'data', label: 'Dados', icon: FaDatabase },
    { id: 'security', label: 'Segurança', icon: FaShield },
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Salvando configurações:', settings);
    // Aqui você implementaria a lógica para salvar as configurações
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Empresa
        </label>
        <input
          type="text"
          value={settings.general.companyName}
          onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alerta de Estoque Baixo (quantidade)
        </label>
        <input
          type="number"
          value={settings.general.lowStockAlert}
          onChange={(e) => handleSettingChange('general', 'lowStockAlert', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Produtos com quantidade igual ou menor que este valor serão marcados como estoque baixo
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="autoBackup"
          checked={settings.general.autoBackup}
          onChange={(e) => handleSettingChange('general', 'autoBackup', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-900">
          Backup automático dos dados
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="notifications"
          checked={settings.general.notifications}
          onChange={(e) => handleSettingChange('general', 'notifications', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
          Habilitar notificações
        </label>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome
        </label>
        <input
          type="text"
          value={settings.profile.name}
          onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={settings.profile.email}
          onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Função
        </label>
        <select
          value={settings.profile.role}
          onChange={(e) => handleSettingChange('profile', 'role', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="admin">Administrador</option>
          <option value="manager">Gerente</option>
          <option value="user">Usuário</option>
          <option value="viewer">Visualizador</option>
        </select>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
          Alterar Senha
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="lowStock"
          checked={settings.notifications.lowStock}
          onChange={(e) => handleSettingChange('notifications', 'lowStock', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="lowStock" className="ml-2 block text-sm text-gray-900">
          Alertas de estoque baixo
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="newMovements"
          checked={settings.notifications.newMovements}
          onChange={(e) => handleSettingChange('notifications', 'newMovements', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="newMovements" className="ml-2 block text-sm text-gray-900">
          Notificações de novas movimentações
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="dailyReports"
          checked={settings.notifications.dailyReports}
          onChange={(e) => handleSettingChange('notifications', 'dailyReports', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="dailyReports" className="ml-2 block text-sm text-gray-900">
          Relatórios diários por email
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="emailNotifications"
          checked={settings.notifications.emailNotifications}
          onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
          Enviar notificações por email
        </label>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-yellow-800">Backup dos Dados</h3>
        <p className="text-sm text-yellow-700 mt-1">
          Faça backup regular dos seus dados para evitar perda de informações.
        </p>
        <div className="mt-3 space-x-2">
          <button className="px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
            Fazer Backup Agora
          </button>
          <button className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
            Baixar Backup
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-red-800">Zona de Perigo</h3>
        <p className="text-sm text-red-700 mt-1">
          Estas ações são irreversíveis. Use com cuidado.
        </p>
        <div className="mt-3 space-x-2">
          <button className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
            Limpar Todos os Dados
          </button>
          <button className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
            Resetar Sistema
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800">Autenticação</h3>
        <p className="text-sm text-blue-700 mt-1">
          Configure as opções de segurança da sua conta.
        </p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Sessões Ativas</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <p className="text-sm font-medium">Dispositivo Atual</p>
              <p className="text-xs text-gray-600">Chrome no Windows - IP: 192.168.1.100</p>
            </div>
            <span className="text-xs text-green-600 font-medium">Ativo</span>
          </div>
        </div>
      </div>

      <div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          Desconectar Todos os Dispositivos
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'data':
        return renderDataSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Configurações
        </h1>
        <p className="text-gray-600">
          Gerencie as configurações do sistema e da sua conta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu Lateral */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <nav className="space-y-1 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
            </div>
            <div className="p-6">
              {renderContent()}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaSave className="w-4 h-4" />
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
