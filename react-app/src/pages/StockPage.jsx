import React, { useEffect, useRef, useState } from 'react';
import { FaPlus, FaSearch, FaFilePdf, FaEllipsisV } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { useStockManagement } from '../hooks/useStockManagement';
import ProductModal from '../components/ProductModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import SkeletonLoader from '../components/SkeletonLoader';
import Pagination from '../components/Pagination';

const StockPage = () => {
  const {
    products,
    categories,
    locations,
    totalProducts,
    isLoading,
    isModalOpen,
    selectedProduct,
    handleOpenModal,
    handleCloseModal,
    isDeleteModalOpen,
    productToDelete,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteProduct,
    searchTerm, 
    setSearchTerm,
    categoryFilter, 
    setCategoryFilter,
    locationFilter, 
    setLocationFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
  } = useStockManagement();

  // Estado local apenas para o dropdown de ações
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Estoque', 20, 10);
    // Nota: O hook retorna os produtos já paginados.
    // Para gerar um PDF com todos os itens filtrados, o hook precisaria ser ajustado para expor essa lista completa.
    // Por simplicidade, o PDF será gerado com os itens visíveis na página atual.
    doc.autoTable({
      head: [['Nome', 'Categoria', 'Local', 'Quantidade', 'Preço']],
      body: (products || []).map(p => [p.name, p.category, p.location, p.quantity, `R$ ${p.price}`]),
    });
    doc.save('relatorio_estoque.pdf');
  };

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Controle de Estoque</h1>
        <div className="flex items-center space-x-2">
          <button onClick={generatePdf} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center">
            <FaFilePdf className="mr-2" />
            Exportar PDF
          </button>
          <button onClick={() => handleOpenModal()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
            <FaPlus className="mr-2" />
            Adicionar Produto
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full p-2 border rounded pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <select
          className="w-full p-2 border rounded"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          {categories?.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
        </select>
        <select
          className="w-full p-2 border rounded"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">Todos os Locais</option>
          {locations?.map(loc => <option key={loc.id} value={loc.name}>{loc.name}</option>)}
        </select>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <SkeletonLoader rows={5} />
          ) : products.length > 0 ? (
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categoria</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Local</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantidade</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Preço</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(products || []).map(product => (
                  <tr key={product.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.name}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.category}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.location}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.quantity}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">R$ {product.price}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm relative" ref={openDropdown === product.id ? dropdownRef : null}>
                      <button onClick={() => setOpenDropdown(openDropdown === product.id ? null : product.id)} className="text-gray-600 hover:text-gray-900">
                        <FaEllipsisV />
                      </button>
                      {openDropdown === product.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <a href="#" onClick={(e) => { e.preventDefault(); handleOpenModal(product); setOpenDropdown(null); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar</a>
                          <a href="#" onClick={(e) => { e.preventDefault(); handleOpenDeleteModal(product); setOpenDropdown(null); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Excluir</a>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-10">
              <h2 className="text-xl font-semibold mb-2">Nenhum produto encontrado.</h2>
              <p className="text-gray-500 mb-4">Que tal adicionar o primeiro?</p>
              <button onClick={() => handleOpenModal()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center mx-auto">
                <FaPlus className="mr-2" />
                Adicionar Produto
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Paginação */}
      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalProducts}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modais */}
      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          categories={categories}
          locations={locations}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={async () => {
          await handleDeleteProduct();
          handleCloseDeleteModal();
        }}
        productName={productToDelete?.name}
      />
    </div>
  );
};

export default StockPage;
