import React, { useState, useMemo } from 'react';
import { FaSearch, FaFilter, FaEye, FaUser, FaClock } from 'react-icons/fa';
import useFirestore from '../hooks/useFirestore';
import Pagination from '../components/Pagination';
import { format } from 'date-fns';

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const { docs: auditLogs, loading } = useFirestore('audit_logs');

  const filteredLogs = useMemo(() => {
    let filtered = [...auditLogs];

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    if (filterUser) {
      filtered = filtered.filter(log =>
        log.userId?.toLowerCase().includes(filterUser.toLowerCase()) ||
        log.userName?.toLowerCase().includes(filterUser.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const dateA = a.timestamp?.toDate?.() || new Date(a.timestamp);
      const dateB = b.timestamp?.toDate?.() || new Date(b.timestamp);
      return dateB - dateA;
    });
  }, [auditLogs, searchTerm, filterAction, filterUser]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'text-green-600 bg-green-100';
      case 'UPDATE':
        return 'text-blue-600 bg-blue-100';
      case 'DELETE':
        return 'text-red-600 bg-red-100';
      case 'LOGIN':
        return 'text-purple-600 bg-purple-100';
      case 'LOGOUT':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'CREATE':
        return 'Criação';
      case 'UPDATE':
        return 'Atualização';
      case 'DELETE':
        return 'Exclusão';
      case 'LOGIN':
        return 'Login';
      case 'LOGOUT':
        return 'Logout';
      default:
        return action;
    }
  };

  const actionTypes = [
    { value: 'all', label: 'Todas as Ações' },
    { value: 'CREATE', label: 'Criação' },
    { value: 'UPDATE', label: 'Atualização' },
    { value: 'DELETE', label: 'Exclusão' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Auditoria do Sistema
            </h1>
            <p className="text-gray-600 mt-1">
              Histórico de todas as ações realizadas no sistema
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaClock className="w-4 h-4" />
            <span>Últimas {filteredLogs.length} ações</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar ações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Ação
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {actionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Nome do usuário..."
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterAction('all');
                  setFilterUser('');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total</h3>
            <p className="text-2xl font-bold text-blue-600">{filteredLogs.length}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Criações</h3>
            <p className="text-2xl font-bold text-green-600">
              {filteredLogs.filter(l => l.action === 'CREATE').length}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Atualizações</h3>
            <p className="text-2xl font-bold text-blue-600">
              {filteredLogs.filter(l => l.action === 'UPDATE').length}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Exclusões</h3>
            <p className="text-2xl font-bold text-red-600">
              {filteredLogs.filter(l => l.action === 'DELETE').length}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Logins</h3>
            <p className="text-2xl font-bold text-purple-600">
              {filteredLogs.filter(l => l.action === 'LOGIN').length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    <div className="py-8">
                      <FaEye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg mb-2">Nenhum log de auditoria encontrado</p>
                      <p className="text-sm">As ações dos usuários aparecerão aqui conforme são realizadas</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.timestamp ? 
                        format(log.timestamp.toDate?.() || new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')
                        : 'Data não disponível'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FaUser className="w-4 h-4 text-gray-400" />
                        {log.userName || log.userId || 'Sistema'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                        {getActionText(log.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.entityType || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.description || log.details || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ipAddress || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
