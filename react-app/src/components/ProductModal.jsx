import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import toast from 'react-hot-toast';
import useFirestore from '../hooks/useFirestore';
import { useAuth } from '../context/AuthContext';

const ProductModal = ({ isOpen, onClose, product, categories = [], locations = [] }) => {
    // Estados do formulário
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        unit: 'un',
        minStock: '',
        cost: '',
        stockQuantities: {}
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Contexto de autenticação
    const { userData } = useAuth();

    // Buscar categorias se não foram passadas como prop
    const { docs: firestoreCategories, loading: categoriesLoading } = useFirestore('categories');
    const safeCategories = categories.length > 0 ? categories : (firestoreCategories || []);
    const safeLocations = locations || [];

    // Reset form quando modal abrir/fechar
    useEffect(() => {
        if (isOpen) {
            if (product) {
                setFormData({
                    name: product.name || '',
                    categoryId: product.categoryId || '',
                    unit: product.unit || 'un',
                    minStock: product.minStock || '',
                    cost: product.cost || '',
                    stockQuantities: product.locations || {}
                });
            } else {
                setFormData({
                    name: '',
                    categoryId: '',
                    unit: 'un',
                    minStock: '',
                    cost: '',
                    stockQuantities: {}
                });
            }
            setErrors({});
        }
    }, [isOpen, product]);

    // Função para atualizar campos do formulário
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Limpar erro do campo quando usuário digitar
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Função para atualizar quantidade por localização
    const handleQuantityChange = (locationId, value) => {
        const numericValue = value === '' ? '' : Number(value);
        if (numericValue < 0) return; // Prevenir estoque negativo
        
        setFormData(prev => ({
            ...prev,
            stockQuantities: {
                ...prev.stockQuantities,
                [locationId]: numericValue
            }
        }));
    };

    // Validação do formulário
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Nome do produto é obrigatório';
        }
        
        if (!formData.categoryId) {
            newErrors.categoryId = 'Categoria é obrigatória';
        }
        
        if (!formData.unit) {
            newErrors.unit = 'Unidade é obrigatória';
        }

        if (formData.minStock && isNaN(Number(formData.minStock))) {
            newErrors.minStock = 'Estoque mínimo deve ser um número';
        }

        if (formData.cost && isNaN(Number(formData.cost))) {
            newErrors.cost = 'Custo deve ser um número';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Função para salvar produto
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Por favor, corrija os erros no formulário.');
            return;
        }

        setLoading(true);

        try {
            // Preparar dados para salvamento
            const finalStockQuantities = Object.entries(formData.stockQuantities).reduce((acc, [key, value]) => {
                acc[key] = Number(value) || 0;
                return acc;
            }, {});

            const productData = {
                name: formData.name.trim(),
                categoryId: formData.categoryId,
                unit: formData.unit,
                minStock: Number(formData.minStock) || 0,
                cost: Number(formData.cost) || 0,
                locations: finalStockQuantities,
                updatedAt: serverTimestamp(),
            };

            let productId = product?.id;

            // Salvar produto
            if (product) {
                const productRef = doc(db, 'products', productId);
                await updateDoc(productRef, productData);
                toast.success(`Produto "${formData.name}" atualizado com sucesso!`);
            } else {
                const docRef = await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: serverTimestamp(),
                });
                productId = docRef.id;
                toast.success(`Produto "${formData.name}" criado com sucesso!`);
            }

            // Registrar movimentações no histórico
            await registerMovements(productId, finalStockQuantities);

            // Fechar modal
            onClose();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            toast.error('Erro ao salvar produto. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Função para registrar movimentações
    const registerMovements = async (productId, finalStockQuantities) => {
        try {
            const batch = writeBatch(db);
            const movementsRef = collection(db, 'movements');
            const oldQuantities = product?.locations || {};
            
            // Criar mapa de localidades para facilitar busca
            const locationMap = safeLocations.reduce((acc, loc) => {
                acc[loc.id] = loc.name;
                return acc;
            }, {});

            // Identificar todas as localidades afetadas
            const allLocationIds = new Set([
                ...Object.keys(oldQuantities),
                ...Object.keys(finalStockQuantities)
            ]);

            // Registrar movimento para cada localidade alterada
            allLocationIds.forEach(locationId => {
                const oldQty = Number(oldQuantities[locationId] || 0);
                const newQty = Number(finalStockQuantities[locationId] || 0);

                if (oldQty !== newQty) {
                    const movementDoc = doc(movementsRef);
                    batch.set(movementDoc, {
                        productId,
                        productName: formData.name,
                        locationId,
                        locationName: locationMap[locationId] || 'N/A',
                        quantityBefore: oldQty,
                        quantityAfter: newQty,
                        quantityChanged: newQty - oldQty,
                        type: product ? 'Ajuste Manual' : 'Entrada Inicial',
                        userId: userData?.uid || 'system',
                        userName: userData?.displayName || userData?.email || 'Sistema',
                        timestamp: serverTimestamp(),
                    });
                }
            });

            await batch.commit();
        } catch (error) {
            console.error('Erro ao registrar movimentações:', error);
            // Não falhar o processo principal por causa do histórico
        }
    };

    // Não renderizar se modal não estiver aberto
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {product ? 'Editar Produto' : 'Adicionar Produto'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome do Produto */}
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Produto *
                        </label>
                        <input
                            type="text"
                            id="productName"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loading}
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Categoria e Unidade */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Categoria *
                            </label>
                            <select
                                id="category"
                                value={formData.categoryId}
                                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.categoryId ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading || categoriesLoading}
                                required
                            >
                                <option value="">Selecione uma categoria</option>
                                {safeCategories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                                Unidade *
                            </label>
                            <select
                                id="unit"
                                value={formData.unit}
                                onChange={(e) => handleInputChange('unit', e.target.value)}
                                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.unit ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading}
                                required
                            >
                                <option value="un">Unidade (un)</option>
                                <option value="kg">Quilograma (kg)</option>
                                <option value="g">Grama (g)</option>
                                <option value="m">Metro (m)</option>
                                <option value="l">Litro (l)</option>
                                <option value="caixa">Caixa (cx)</option>
                                <option value="pacote">Pacote (pct)</option>
                                <option value="peça">Peça (pç)</option>
                            </select>
                            {errors.unit && (
                                <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                            )}
                        </div>
                    </div>

                    {/* Estoque Mínimo e Custo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="minStock" className="block text-sm font-medium text-gray-700 mb-1">
                                Estoque Mínimo
                            </label>
                            <input
                                type="number"
                                id="minStock"
                                value={formData.minStock}
                                onChange={(e) => handleInputChange('minStock', e.target.value)}
                                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.minStock ? 'border-red-500' : 'border-gray-300'
                                }`}
                                min="0"
                                step="1"
                                disabled={loading}
                                placeholder="Ex: 10"
                            />
                            {errors.minStock && (
                                <p className="mt-1 text-sm text-red-600">{errors.minStock}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                                Custo (R$)
                            </label>
                            <input
                                type="number"
                                id="cost"
                                value={formData.cost}
                                onChange={(e) => handleInputChange('cost', e.target.value)}
                                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.cost ? 'border-red-500' : 'border-gray-300'
                                }`}
                                min="0"
                                step="0.01"
                                disabled={loading}
                                placeholder="Ex: 25.50"
                            />
                            {errors.cost && (
                                <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
                            )}
                        </div>
                    </div>

                    {/* Estoque por Localização */}
                    {safeLocations.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                                Estoque por Localização
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {safeLocations.map(location => (
                                    <div key={location.id}>
                                        <label htmlFor={`loc-${location.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                            {location.name}
                                        </label>
                                        <input
                                            type="number"
                                            id={`loc-${location.id}`}
                                            value={formData.stockQuantities[location.id] || ''}
                                            onChange={(e) => handleQuantityChange(location.id, e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            step="1"
                                            disabled={loading}
                                            placeholder="0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-300"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : (product ? 'Salvar Alterações' : 'Adicionar Produto')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
