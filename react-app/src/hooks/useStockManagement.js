import { useState, useEffect, useMemo } from 'react';
import { db } from '../services/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import useFirestore from './useFirestore';
import toast from 'react-hot-toast';

export const useStockManagement = () => {
  // Estados para modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Buscar dados do Firestore
  const { docs: rawProducts, loading: loadingProducts } = useFirestore('products');
  const { docs: categories, loading: loadingCategories } = useFirestore('categories', { field: 'name', direction: 'asc' });
  const { docs: locations, loading: loadingLocations } = useFirestore('locations', { field: 'name', direction: 'asc' });

  // Processar produtos para incluir dados calculados
  const processedProducts = useMemo(() => {
    if (!rawProducts || !categories || !locations) return [];

    return rawProducts.map(product => {
      // Encontrar categoria
      const category = categories.find(cat => cat.id === product.categoryId);
      
      // Calcular quantidade total e localização principal
      const locationEntries = Object.entries(product.locations || {});
      const totalQuantity = locationEntries.reduce((sum, [, qty]) => sum + (Number(qty) || 0), 0);
      
      // Encontrar localização com maior quantidade
      let mainLocation = 'N/A';
      let maxQuantity = 0;
      
      locationEntries.forEach(([locationId, quantity]) => {
        const qty = Number(quantity) || 0;
        if (qty > maxQuantity) {
          maxQuantity = qty;
          const locationObj = locations.find(loc => loc.id === locationId);
          mainLocation = locationObj ? locationObj.name : 'N/A';
        }
      });

      return {
        ...product,
        category: category ? category.name : 'Sem categoria',
        location: mainLocation,
        quantity: totalQuantity,
        price: product.cost || 0,
        totalQuantity
      };
    });
  }, [rawProducts, categories, locations]);

  // Aplicar filtros
  const filteredProducts = useMemo(() => {
    return processedProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesLocation = !locationFilter || product.location === locationFilter;
      
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [processedProducts, searchTerm, categoryFilter, locationFilter]);

  // Aplicar paginação
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, locationFilter]);

  // Funções para gerenciar modais
  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Função para deletar produto
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteDoc(doc(db, 'products', productToDelete.id));
      toast.success(`Produto "${productToDelete.name}" excluído com sucesso!`);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto. Tente novamente.');
    }
  };

  return {
    // Dados
    products: paginatedProducts,
    categories: categories || [],
    locations: locations || [],
    totalProducts: filteredProducts.length,
    
    // Estados de carregamento
    isLoading: loadingProducts || loadingCategories || loadingLocations,
    
    // Estados dos modais
    isModalOpen,
    selectedProduct,
    isDeleteModalOpen,
    productToDelete,
    
    // Funções dos modais
    handleOpenModal,
    handleCloseModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteProduct,
    
    // Filtros
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    locationFilter,
    setLocationFilter,
    
    // Paginação
    currentPage,
    setCurrentPage,
    itemsPerPage,
  };
};
