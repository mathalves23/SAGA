import React, { useState } from 'react';
import { 
  SparklesIcon,
  BoltIcon,
  BeakerIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'available' | 'beta' | 'coming-soon';
}

const AIToolsPage: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const aiTools: AITool[] = [
    {
      id: 'workout-optimizer',
      name: 'Workout Optimizer',
      description: 'IA avançada que otimiza seus treinos baseado no seu histórico e objetivos',
      icon: BoltIcon,
      color: 'from-yellow-500 to-orange-500',
      status: 'available'
    },
    {
      id: 'form-analyzer',
      name: 'Form Analyzer',
      description: 'Análise de movimento e forma dos exercícios usando visão computacional',
      icon: BeakerIcon,
      color: 'from-green-500 to-emerald-500',
      status: 'beta'
    },
    {
      id: 'progress-predictor',
      name: 'Progress Predictor',
      description: 'Predição de progresso e recomendações personalizadas usando machine learning',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-purple-500',
      status: 'available'
    },
    {
      id: 'nutrition-ai',
      name: 'Nutrition AI',
      description: 'Planejamento nutricional inteligente baseado em seus treinos e objetivos',
      icon: DocumentTextIcon,
      color: 'from-pink-500 to-rose-500',
      status: 'coming-soon'
    },
    {
      id: 'recovery-assistant',
      name: 'Recovery Assistant',
      description: 'IA que monitora sua recuperação e sugere ajustes nos treinos',
      icon: CpuChipIcon,
      color: 'from-indigo-500 to-cyan-500',
      status: 'beta'
    },
    {
      id: 'injury-prevention',
      name: 'Injury Prevention',
      description: 'Sistema preditivo que identifica riscos de lesão e sugere prevenção',
      icon: SparklesIcon,
      color: 'from-red-500 to-pink-500',
      status: 'coming-soon'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">Available</span>;
      case 'beta':
        return <span className="px-2 py-1 text-xs bg-yellow-500 text-black rounded-full">Beta</span>;
      case 'coming-soon':
        return <span className="px-2 py-1 text-xs bg-gray-500 text-white rounded-full">Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] px-6 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Tools</h1>
          <p className="text-[#8b8b8b] text-lg">
            Ferramentas de Inteligência Artificial exclusivas do SAGA para potencializar seus treinos
          </p>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {aiTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 ${
                  selectedTool === tool.id ? 'border-purple-500 bg-[#2d2d30]' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {getStatusBadge(tool.status)}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
                <p className="text-[#8b8b8b] text-sm leading-relaxed">{tool.description}</p>
                
                <div className="mt-4 pt-4 border-t border-[#2d2d30]">
                  <button 
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${
                      tool.status === 'available' 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : tool.status === 'beta'
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-[#2d2d30] text-[#8b8b8b] cursor-not-allowed'
                    }`}
                    disabled={tool.status === 'coming-soon'}
                  >
                    {tool.status === 'available' ? 'Launch Tool' : 
                     tool.status === 'beta' ? 'Try Beta' : 'Coming Soon'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tool Details */}
        {selectedTool && (
          <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <SparklesIcon className="w-8 h-8 text-purple-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">AI Tool Dashboard</h2>
                <p className="text-[#8b8b8b]">Configure e monitore suas ferramentas de IA</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Usage Stats */}
              <div className="bg-[#2d2d30] rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">Usage This Month</h3>
                <p className="text-2xl font-bold text-purple-400">247</p>
                <p className="text-xs text-[#8b8b8b]">AI analyses performed</p>
              </div>

              {/* Accuracy Score */}
              <div className="bg-[#2d2d30] rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">Accuracy Score</h3>
                <p className="text-2xl font-bold text-green-400">94.2%</p>
                <p className="text-xs text-[#8b8b8b]">Prediction accuracy</p>
              </div>

              {/* Credits Remaining */}
              <div className="bg-[#2d2d30] rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">AI Credits</h3>
                <p className="text-2xl font-bold text-yellow-400">1,847</p>
                <p className="text-xs text-[#8b8b8b]">Credits remaining</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="font-medium text-white">Pro Tip</h4>
                  <p className="text-sm text-[#8b8b8b]">
                    Combine múltiplas ferramentas de IA para obter insights mais precisos sobre seu progresso
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">🤖 Machine Learning</h3>
            <p className="text-[#8b8b8b] mb-4">
              Nossos algoritmos aprendem com seus dados para fornecer recomendações cada vez mais precisas
            </p>
            <ul className="space-y-2 text-sm text-[#8b8b8b]">
              <li>• Análise de padrões de treino</li>
              <li>• Predição de performance</li>
              <li>• Otimização automática</li>
            </ul>
          </div>

          <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">📊 Analytics Avançadas</h3>
            <p className="text-[#8b8b8b] mb-4">
              Visualize seus dados de forma inteligente com insights gerados por IA
            </p>
            <ul className="space-y-2 text-sm text-[#8b8b8b]">
              <li>• Dashboards personalizados</li>
              <li>• Relatórios automatizados</li>
              <li>• Tendências e projeções</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolsPage; 