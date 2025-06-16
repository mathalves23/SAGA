import React, { useState } from 'react';
import { 
  UserIcon,
  LockClosedIcon,
  DocumentArrowDownIcon,
  ScaleIcon,
  SunIcon,
  BellIcon,
  EyeIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  DevicePhoneMobileIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../../context/ThemeContext';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  // Estados para configurações
  const [perfilPrivado, setPerfilPrivado] = useState(false);
  const [unidadePeso, setUnidadePeso] = useState('kg');
  const [unidadeDistancia, setUnidadeDistancia] = useState('km');
  const [unidadeMedida, setUnidadeMedida] = useState('cm');
  const [idioma, setIdioma] = useState('pt-BR');
  
  // Estados para notificações
  const [notificacoesTreino, setNotificacoesTreino] = useState(true);
  const [notificacoesDesafios, setNotificacoesDesafios] = useState(true);
  const [notificacoesSocial, setNotificacoesSocial] = useState(false);
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesPush, setNotificacoesPush] = useState(true);
  
  // Estados para privacidade
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(true);
  const [permitirMensagens, setPermitirMensagens] = useState(true);
  const [mostrarOnline, setMostrarOnline] = useState(false);
  
  // Estados para formulários
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nome, setNome] = useState('Matheus');
  const [email, setEmail] = useState('matheus@exemplo.com');
  const [telefone, setTelefone] = useState('');
  
  // Estado para aba ativa
  const [abaAtiva, setAbaAtiva] = useState('conta');
  
  const abas = [
    { id: 'conta', nome: 'Conta', icone: LockClosedIcon },
    { id: 'notificacoes', nome: 'Notificações', icone: BellIcon },
    { id: 'privacidade', nome: 'Privacidade', icone: EyeIcon },
    { id: 'preferencias', nome: 'Preferências', icone: CogIcon },
    { id: 'ajuda', nome: 'Ajuda', icone: QuestionMarkCircleIcon },
  ];

  const handleAlterarSenha = () => {
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    if (novaSenha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    alert('Senha alterada com sucesso!');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
  };

  const handleSalvarPerfil = () => {
    alert('Perfil atualizado com sucesso!');
  };

  const handleExportarDados = () => {
    alert('Seus dados estão sendo preparados para download...');
  };

  const handleExcluirConta = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      alert('Conta excluída com sucesso.');
    }
  };

  const renderConteudoAba = () => {
    switch (abaAtiva) {
      case 'conta':
        return (
          <div className="space-y-6">
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Alterar Senha</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">Senha Atual</label>
                  <input
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">Nova Senha</label>
                  <input
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <button 
                  onClick={handleAlterarSenha}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Alterar Senha
                </button>
              </div>
            </div>

            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Autenticação de Dois Fatores</h3>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-white">Autenticação por SMS</p>
                  <p className="text-sm text-[#8b8b8b]">Receba códigos via SMS para maior segurança</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">App Autenticador</p>
                  <p className="text-sm text-[#8b8b8b]">Use um app como Google Authenticator</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Configurar
                </button>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5" />
                Zona de Perigo
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-white mb-2">Excluir Conta</p>
                  <p className="text-sm text-[#8b8b8b] mb-4">
                    Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
                  </p>
                  <button 
                    onClick={handleExcluirConta}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Excluir Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notificacoes':
        return (
          <div className="space-y-6">
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Notificações de Treino</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Lembretes de Treino</p>
                    <p className="text-sm text-[#8b8b8b]">Receba lembretes para seus treinos agendados</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificacoesTreino}
                      onChange={(e) => setNotificacoesTreino(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Desafios e Conquistas</p>
                    <p className="text-sm text-[#8b8b8b]">Notificações sobre novos desafios e badges conquistadas</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificacoesDesafios}
                      onChange={(e) => setNotificacoesDesafios(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Notificações Sociais</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Atividade de Amigos</p>
                    <p className="text-sm text-[#8b8b8b]">Notificações sobre treinos e conquistas de amigos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificacoesSocial}
                      onChange={(e) => setNotificacoesSocial(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Métodos de Entrega</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Notificações Push</p>
                    <p className="text-sm text-[#8b8b8b]">Receba notificações no seu dispositivo</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificacoesPush}
                      onChange={(e) => setNotificacoesPush(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-sm text-[#8b8b8b]">Receba notificações por email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificacoesEmail}
                      onChange={(e) => setNotificacoesEmail(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacidade':
        return (
          <div className="space-y-6">
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Visibilidade do Perfil</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Perfil Privado</p>
                    <p className="text-sm text-[#8b8b8b]">Apenas seguidores aprovados podem ver seus treinos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={perfilPrivado}
                      onChange={(e) => setPerfilPrivado(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Mostrar Estatísticas</p>
                    <p className="text-sm text-[#8b8b8b]">Permita que outros vejam suas estatísticas de treino</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={mostrarEstatisticas}
                      onChange={(e) => setMostrarEstatisticas(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Status Online</p>
                    <p className="text-sm text-[#8b8b8b]">Mostrar quando você está online</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={mostrarOnline}
                      onChange={(e) => setMostrarOnline(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Comunicação</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Permitir Mensagens</p>
                    <p className="text-sm text-[#8b8b8b]">Outros usuários podem te enviar mensagens diretas</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={permitirMensagens}
                      onChange={(e) => setPermitirMensagens(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Dados e Privacidade</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={handleExportarDados}
                  className="w-full flex items-center justify-between p-3 bg-[#2d2d30] hover:bg-[#404040] rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <DocumentArrowDownIcon className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <p className="font-medium text-white">Exportar Dados</p>
                      <p className="text-sm text-[#8b8b8b]">Baixar todos os seus dados</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-[#8b8b8b]" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-[#2d2d30] hover:bg-[#404040] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <p className="font-medium text-white">Política de Privacidade</p>
                      <p className="text-sm text-[#8b8b8b]">Como usamos seus dados</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-[#8b8b8b]" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferencias':
        return (
          <div className="space-y-6">
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Aparência</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Tema Escuro</p>
                    <p className="text-sm text-[#8b8b8b]">Interface em modo escuro</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={theme === 'dark'}
                      onChange={toggleTheme}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-[#2d2d30] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Idioma e Região</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">Idioma</label>
                  <select
                    value={idioma}
                    onChange={(e) => setIdioma(e.target.value)}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Unidades de Medida</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">Peso</label>
                  <select
                    value={unidadePeso}
                    onChange={(e) => setUnidadePeso(e.target.value)}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="kg">Quilogramas (kg)</option>
                    <option value="lbs">Libras (lbs)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">Distância</label>
                  <select
                    value={unidadeDistancia}
                    onChange={(e) => setUnidadeDistancia(e.target.value)}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="km">Quilômetros (km)</option>
                    <option value="miles">Milhas</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">Altura</label>
                  <select
                    value={unidadeMedida}
                    onChange={(e) => setUnidadeMedida(e.target.value)}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="cm">Centímetros (cm)</option>
                    <option value="inches">Polegadas (in)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ajuda':
        return (
          <div className="space-y-6">
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Central de Ajuda</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-[#2d2d30] hover:bg-[#404040] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <p className="font-medium text-white">Perguntas Frequentes</p>
                      <p className="text-sm text-[#8b8b8b]">Respostas para dúvidas comuns</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-[#8b8b8b]" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-[#2d2d30] hover:bg-[#404040] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <p className="font-medium text-white">Contato</p>
                      <p className="text-sm text-[#8b8b8b]">Entre em contato conosco</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-[#8b8b8b]" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-[#2d2d30] hover:bg-[#404040] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <DocumentArrowDownIcon className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <p className="font-medium text-white">Termos de Uso</p>
                      <p className="text-sm text-[#8b8b8b]">Termos e condições de uso</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-[#8b8b8b]" />
                </button>
              </div>
            </div>

            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Sobre o SAGA</h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">S</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white">SAGA Fitness</h4>
                  <p className="text-[#8b8b8b]">Versão 1.0.0</p>
                </div>
                
                <div className="text-center pt-4 border-t border-[#2d2d30]">
                  <p className="text-sm text-[#8b8b8b] mb-4">
                    Sua jornada fitness personalizada com gamificação e comunidade.
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <button className="text-purple-400 hover:text-purple-300 text-sm">
                      Avalie o App
                    </button>
                    <button className="text-purple-400 hover:text-purple-300 text-sm">
                      Compartilhar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Sair</h3>
              
              <button className="w-full flex items-center justify-center gap-3 p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="font-medium">Fazer Logout</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">⚙️ Configurações</h1>
          <p className="text-[#8b8b8b] text-lg">Gerencie suas preferências e configurações de conta</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar com abas */}
          <div className="w-64 space-y-2">
            {abas.map((aba) => {
              const Icone = aba.icone;
              return (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    abaAtiva === aba.id
                      ? 'bg-purple-600 text-white'
                      : 'text-[#8b8b8b] hover:bg-[#1a1a1b] hover:text-white'
                  }`}
                >
                  <Icone className="w-5 h-5" />
                  <span className="font-medium">{aba.nome}</span>
                </button>
              );
            })}
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1">
            {renderConteudoAba()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 