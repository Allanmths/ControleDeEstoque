import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import DiagnosticPanel from '../components/DiagnosticPanel';
import UserRoleManager from '../components/UserRoleManager';
import { FaListOl, FaUserCog, FaStethoscope, FaCog } from 'react-icons/fa';

const SettingsPage = () => {
    const { itemsPerPage, setItemsPerPage } = useSettings();
    const [activeTab, setActiveTab] = useState('general');

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
    };

    const tabs = [
        { id: 'general', label: 'Geral', icon: FaCog },
        { id: 'users', label: 'Usuários', icon: FaUserCog },
        { id: 'diagnostic', label: 'Diagnóstico', icon: FaStethoscope }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                            <FaListOl className="text-2xl text-blue-500 mr-3" />
                            <h3 className="text-xl font-bold text-gray-800">Visualização de Listas</h3>
                        </div>
                        <p className="text-gray-600 mb-4">Defina quantos itens devem ser exibidos por página nas tabelas do sistema.</p>
                        
                        <div>
                            <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-2">
                                Itens por página
                            </label>
                            <select
                                id="itemsPerPage"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>
                );
            case 'users':
                return <UserRoleManager />;
            case 'diagnostic':
                return <DiagnosticPanel />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
                    <p className="text-gray-600">Gerencie as configurações do sistema, usuários e diagnósticos</p>
                </div>
                
                {/* Navegação por Abas */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-0 overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="mr-2" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Conteúdo da Aba Ativa */}
                <div className="transition-opacity duration-200">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
