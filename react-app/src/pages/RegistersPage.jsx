import React, { useState } from 'react';
import CategoriesManager from '../components/CategoriesManager';
import LocationManager from '../components/LocationManager';
import ProductManager from '../components/ProductManager';
import ProductBulkImport from '../components/ProductBulkImport';
import SupplierManager from '../components/SuppliersManager';
import { FaBox, FaTags, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';

export default function RegistersPage() {
    const [activeTab, setActiveTab] = useState('produtos');

    const tabs = [
        { id: 'produtos', label: 'Produtos', icon: FaBox },
        { id: 'categorias', label: 'Categorias', icon: FaTags },
        { id: 'localidades', label: 'Localidades', icon: FaMapMarkerAlt },
        { id: 'fornecedores', label: 'Fornecedores', icon: FaTruck }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'produtos':
                return (
                    <div className="space-y-8">
                        <ProductManager />
                        <ProductBulkImport />
                    </div>
                );
            case 'categorias':
                return <CategoriesManager />;
            case 'localidades':
                return <LocationManager />;
            case 'fornecedores':
                return <SupplierManager />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastros</h1>
                    <p className="text-gray-600">Gerencie produtos, categorias, localizações e fornecedores do seu estoque</p>
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
}
