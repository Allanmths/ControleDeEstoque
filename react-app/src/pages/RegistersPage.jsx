import React, { useState } from 'react';
import { 
  FaPlus, 
  FaBoxes, 
  FaTags, 
  FaTruck, 
  FaUsers, 
  FaEdit, 
  FaTrash 
} from 'react-icons/fa';
import useFirestore from '../hooks/useFirestore';
import ProductModal from '../components/ProductModal';

export default function RegistersPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { docs: products, loading: loadingProducts } = useFirestore('products');
  const { docs: categories, loading: loadingCategories } = useFirestore('categories');
  const { docs: suppliers, loading: loadingSuppliers } = useFirestore('suppliers');

  const tabs = [
    { id: 'products', label: 'Produtos', icon: FaBoxes, count: products.length },
    { id: 'categories', label: 'Categorias', icon: FaTags, count: categories.length },
    { id: 'suppliers', label: 'Fornecedores', icon: FaTruck, count: suppliers.length },
    { id: 'users', label: 'Usuários', icon: FaUsers, count: 0 },
  ];

  const renderProducts = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Produtos</h2>
        <button
          onClick={() => setShowProductModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaPlus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      {loadingProducts ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando produtos...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <div className="mt-2 flex gap-4 text-sm text-gray-500">
                    <span>Categoria: {product.category}</span>
                    <span>Fornecedor: {product.supplier}</span>
                    <span>Estoque: {product.quantity || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowProductModal(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600">
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FaBoxes className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum produto cadastrado</p>
              <button
                onClick={() => setShowProductModal(true)}
                className="mt-2 text-blue-600 hover:underline"
              >
                Cadastrar primeiro produto
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Categorias</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <FaPlus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      {loadingCategories ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando categorias...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600">
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600">
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FaTags className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma categoria cadastrada</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Fornecedores</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <FaPlus className="w-4 h-4" />
          Novo Fornecedor
        </button>
      </div>

      {loadingSuppliers ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando fornecedores...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                  <p className="text-sm text-gray-600">{supplier.contact}</p>
                  <p className="text-sm text-gray-600">{supplier.email}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600">
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600">
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {suppliers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FaTruck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum fornecedor cadastrado</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Usuários</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <FaPlus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      <div className="text-center py-8 text-gray-500">
        <FaUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Gerenciamento de usuários em desenvolvimento</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return renderProducts();
      case 'categories':
        return renderCategories();
      case 'suppliers':
        return renderSuppliers();
      case 'users':
        return renderUsers();
      default:
        return renderProducts();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Cadastros</h1>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {renderContent()}

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
