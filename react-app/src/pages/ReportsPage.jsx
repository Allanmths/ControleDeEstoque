import React, { useState } from 'react';
import { FaFilePdf, FaFileExcel, FaChart, FaCalendarAlt } from 'react-icons/fa';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('stock');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const reportTypes = [
    {
      id: 'stock',
      name: 'Relatório de Estoque',
      description: 'Relatório atual do estoque com quantidades e valores',
      icon: FaChart
    },
    {
      id: 'movements',
      name: 'Relatório de Movimentações',
      description: 'Entradas e saídas do estoque por período',
      icon: FaCalendarAlt
    },
    {
      id: 'counting',
      name: 'Relatório de Contagens',
      description: 'Histórico de contagens realizadas',
      icon: FaChart
    },
    {
      id: 'discrepancies',
      name: 'Relatório de Discrepâncias',
      description: 'Diferenças encontradas nas contagens',
      icon: FaChart
    }
  ];

  const handleGenerateReport = (format) => {
    console.log(`Gerando relatório ${selectedReport} no formato ${format}`, { dateRange });
    // Aqui você implementaria a lógica de geração dos relatórios
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Relatórios
        </h1>
        <p className="text-gray-600">
          Gere relatórios detalhados sobre o estoque, movimentações e contagens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção do Tipo de Relatório */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Tipos de Relatório
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div
                      key={report.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedReport === report.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedReport === report.id
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            selectedReport === report.id
                              ? 'text-blue-900'
                              : 'text-gray-900'
                          }`}>
                            {report.name}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            selectedReport === report.id
                              ? 'text-blue-700'
                              : 'text-gray-600'
                          }`}>
                            {report.description}
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedReport === report.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedReport === report.id && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Configurações e Geração */}
        <div className="space-y-6">
          {/* Filtros de Data */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Período
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Formatos de Exportação */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Gerar Relatório
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => handleGenerateReport('pdf')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <FaFilePdf className="w-5 h-5" />
                Exportar como PDF
              </button>
              
              <button
                onClick={() => handleGenerateReport('excel')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FaFileExcel className="w-5 h-5" />
                Exportar como Excel
              </button>
            </div>
          </div>

          {/* Visualização Rápida */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Visualização Rápida
              </h2>
            </div>
            <div className="p-6">
              <button
                onClick={() => console.log('Visualizando relatório')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaChart className="w-5 h-5" />
                Visualizar na Tela
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Relatórios */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Histórico de Relatórios
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <FaChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum relatório gerado recentemente</p>
            <p className="text-sm">Os relatórios gerados aparecerão aqui</p>
          </div>
        </div>
      </div>
    </div>
  );
}
