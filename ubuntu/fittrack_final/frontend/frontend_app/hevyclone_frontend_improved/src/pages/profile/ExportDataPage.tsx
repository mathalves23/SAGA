import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { exportService, ExportOptions, ExportFormat, DataType } from '../../services/exportService';
import toast from 'react-hot-toast';

const ExportDataPage: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [selectedDataType, setSelectedDataType] = useState<DataType>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [includeCharts, setIncludeCharts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [availableData, setAvailableData] = useState<{ [key: string]: number }>({});
  const [estimatedSize, setEstimatedSize] = useState('');

  useEffect(() => {
    // Carregar dados disponíveis
    const data = exportService.getAvailableData();
    setAvailableData(data);
  }, []);

  useEffect(() => {
    // Calcular tamanho estimado
    const size = exportService.getEstimatedSize(selectedDataType, selectedFormat);
    setEstimatedSize(size);
  }, [selectedDataType, selectedFormat]);

  const handleExport = async () => {
    if (Object.values(availableData).every(count => count === 0)) {
      toast.error('Não há dados para exportar');
      return;
    }

    setLoading(true);
    
    try {
      const options: ExportOptions = {
        format: selectedFormat,
        dataType: selectedDataType,
        dateRange: dateRange.start && dateRange.end ? dateRange : undefined,
        includeCharts
      };

      await exportService.exportData(options);
      
      toast.success(`Dados exportados com sucesso em formato ${selectedFormat.toUpperCase()}!`);
      
      // Log da ação para analytics
      console.log('Export realizado:', {
        format: selectedFormat,
        dataType: selectedDataType,
        hasDateRange: !!(dateRange.start && dateRange.end),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
    console.error('Erro na exportação:', error);
      toast.error('Erro ao exportar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatOptions = [
    {
      value: 'json' as ExportFormat,
      label: 'JSON',
      description: 'Formato estruturado para desenvolvedores',
      icon: '📄',
      recommended: false
    },
    {
      value: 'csv' as ExportFormat,
      label: 'CSV',
      description: 'Compatível com Excel e planilhas',
      icon: '📊',
      recommended: true
    },
    {
      value: 'pdf' as ExportFormat,
      label: 'PDF',
      description: 'Relatório visual para impressão',
      icon: '📑',
      recommended: false
    }
  ];

  const dataTypeOptions = [
    {
      value: 'all' as DataType,
      label: 'Todos os Dados',
      description: 'Exportar todos os seus dados',
      icon: '🗂️',
      count: Object.values(availableData).reduce((sum, count) => sum + count, 0)
    },
    {
      value: 'workouts' as DataType,
      label: 'Treinos',
      description: 'Histórico completo de treinos',
      icon: '💪',
      count: availableData.workouts || 0
    },
    {
      value: 'goals' as DataType,
      label: 'Metas',
      description: 'Suas metas e progresso',
      icon: '🎯',
      count: availableData.goals || 0
    },
    {
      value: 'progress' as DataType,
      label: 'Progresso',
      description: 'Estatísticas e análises',
      icon: '📈',
      count: 1 // Sempre disponível
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            📤 Exportar Dados
          </h1>
          <p className="text-gray-300 text-lg">
            Baixe seus dados pessoais em diferentes formatos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Configurações de Exportação */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Formato de Exportação */}
            <Card className="bg-surface border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  📋 Formato de Exportação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formatOptions.map((format) => (
                  <div
                    key={format.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedFormat === format.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedFormat(format.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{format.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{format.label}</h3>
                            {format.recommended && (
                              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                Recomendado
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{format.description}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedFormat === format.value
                          ? 'border-primary bg-primary'
                          : 'border-gray-600'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tipo de Dados */}
            <Card className="bg-surface border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  🗃️ Dados para Exportar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataTypeOptions.map((dataType) => (
                  <div
                    key={dataType.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedDataType === dataType.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-600 hover:border-gray-500'
                    } ${dataType.count === 0 ? 'opacity-50' : ''}`}
                    onClick={() => dataType.count > 0 && setSelectedDataType(dataType.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{dataType.icon}</span>
                        <div>
                          <h3 className="font-semibold text-white">{dataType.label}</h3>
                          <p className="text-sm text-gray-400">{dataType.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                          {dataType.count} {dataType.count === 1 ? 'item' : 'itens'}
                        </span>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedDataType === dataType.value
                            ? 'border-primary bg-primary'
                            : 'border-gray-600'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Filtros Avançados */}
            <Card className="bg-surface border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  🔧 Filtros Avançados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Período de Datas */}
                <div>
                  <h4 className="text-white font-medium mb-3">📅 Período (opcional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Data inicial</label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Data final</label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                      />
                    </div>
                  </div>
                  {dateRange.start && dateRange.end && (
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        Período: {new Date(dateRange.start).toLocaleDateString('pt-BR')} - {new Date(dateRange.end).toLocaleDateString('pt-BR')}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDateRange({ start: '', end: '' })}
                        className="text-xs"
                      >
                        Limpar
                      </Button>
                    </div>
                  )}
                </div>

                {/* Opções Extras */}
                {selectedFormat === 'pdf' && (
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">📊 Incluir gráficos</h4>
                      <p className="text-sm text-gray-400">Adicionar visualizações ao relatório PDF</p>
                    </div>
                    <button
                      onClick={() => setIncludeCharts(!includeCharts)}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        includeCharts ? 'bg-primary' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                        includeCharts ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Painel Lateral - Resumo */}
          <div className="space-y-6">
            
            {/* Resumo da Exportação */}
            <Card className="bg-surface border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">📋 Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Formato:</span>
                    <span className="text-white font-medium">{selectedFormat.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dados:</span>
                    <span className="text-white font-medium">
                      {dataTypeOptions.find(d => d.value === selectedDataType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Período:</span>
                    <span className="text-white font-medium">
                      {dateRange.start && dateRange.end ? 'Personalizado' : 'Todos'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tamanho estimado:</span>
                    <span className="text-white font-medium">{estimatedSize}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-600">
                  <Button
                    onClick={handleExport}
                    disabled={loading || Object.values(availableData).every(count => count === 0)}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Exportando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        📤 Exportar Dados
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Privacidade */}
            <Card className="bg-yellow-900/20 border-yellow-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 text-xl">🔒</span>
                  <div>
                    <h4 className="text-yellow-300 font-medium mb-2">Privacidade</h4>
                    <ul className="text-sm text-yellow-200 space-y-1">
                      <li>• Dados exportados ficam apenas no seu dispositivo</li>
                      <li>• Nenhuma informação é enviada para servidores</li>
                      <li>• Você tem controle total sobre seus dados</li>
                      <li>• Arquivos podem conter informações sensíveis</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formatos Suportados */}
            <Card className="bg-blue-900/20 border-blue-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 text-xl">💡</span>
                  <div>
                    <h4 className="text-blue-300 font-medium mb-2">Formatos</h4>
                    <ul className="text-sm text-blue-200 space-y-1">
                      <li>• <strong>JSON:</strong> Para desenvolvedores e backup</li>
                      <li>• <strong>CSV:</strong> Para análise em planilhas</li>
                      <li>• <strong>PDF:</strong> Para visualização e impressão</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDataPage; 