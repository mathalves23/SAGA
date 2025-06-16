import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  XMarkIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  CheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Tipos
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // seletor CSS do elemento alvo
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'wait';
  actionText?: string;
  optional?: boolean;
}

interface OnboardingTourProps {
  steps: OnboardingStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
  autoStart?: boolean;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
  steps,
  isOpen,
  onComplete,
  onSkip,
  autoStart = true
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  // Configurar tour quando abrir
  useEffect(() => {
    if (isOpen && autoStart) {
      setIsVisible(true);
      setCurrentStep(0);
      highlightStep(0);
    } else {
      setIsVisible(false);
      removeHighlight();
    }
  }, [isOpen, autoStart]);

  // Atualizar highlight quando step mudar
  useEffect(() => {
    if (isVisible && steps[currentStep]) {
      highlightStep(currentStep);
    }
  }, [currentStep, isVisible]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      removeHighlight();
    };
  }, []);

  const highlightStep = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return;

    // Encontrar elemento alvo
    const targetElement = document.querySelector(step.target) as HTMLElement;
    if (!targetElement) {
      console.warn(`Onboarding: Elemento não encontrado para seletor "${step.target}"`);
      return;
    }

    // Remover highlight anterior
    removeHighlight();

    // Adicionar highlight
    targetElement.classList.add('onboarding-highlight');
    setHighlightedElement(targetElement);

    // Scroll para o elemento
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });

    // Calcular posição do tooltip
    setTimeout(() => {
      calculateTooltipPosition(targetElement, step.placement || 'bottom');
    }, 100);
  };

  const removeHighlight = () => {
    if (highlightedElement) {
      highlightedElement.classList.remove('onboarding-highlight');
      setHighlightedElement(null);
    }
    
    // Remover de todos os elementos (cleanup)
    document.querySelectorAll('.onboarding-highlight').forEach(el => {
      el.classList.remove('onboarding-highlight');
    });
  };

  const calculateTooltipPosition = (element: HTMLElement, placement: string) => {
    const rect = element.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const offset = 20;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = rect.top - tooltipHeight - offset;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - offset;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + offset;
        break;
      case 'center':
        top = window.innerHeight / 2 - tooltipHeight / 2;
        left = window.innerWidth / 2 - tooltipWidth / 2;
        break;
    }

    // Ajustar se sair da tela
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipHeight > window.innerHeight - 10) {
      top = window.innerHeight - tooltipHeight - 10;
    }

    setTooltipPosition({ top, left });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    removeHighlight();
    setIsVisible(false);
    onSkip();
  };

  const completeTour = () => {
    removeHighlight();
    setIsVisible(false);
    onComplete();
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return createPortal(
    <>
      {/* Overlay escuro */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-75 z-[9998] transition-opacity duration-300"
        style={{ backdropFilter: 'blur(2px)' }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-[9999] bg-[#1a1a1b] border border-[#2d2d30] rounded-xl shadow-2xl max-w-sm w-80 transition-all duration-300"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: 'translateZ(0)' // força aceleração hardware
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2d2d30]">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              Tutorial SAGA
            </span>
          </div>
          <button
            onClick={skipTour}
            className="p-1 rounded-lg hover:bg-[#2d2d30] transition-colors"
            aria-label="Fechar tutorial"
          >
            <XMarkIcon className="w-4 h-4 text-[#8b8b8b]" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between text-xs text-[#8b8b8b] mb-2">
            <span>Passo {currentStep + 1} de {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-[#2d2d30] rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            {currentStepData?.title}
          </h3>
          <p className="text-[#8b8b8b] text-sm leading-relaxed mb-4">
            {currentStepData?.description}
          </p>

          {/* Action hint */}
          {currentStepData?.actionText && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
              <p className="text-purple-300 text-xs">
                💡 {currentStepData.actionText}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#2d2d30]">
          <div className="flex items-center gap-1">
            {steps.map((_) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-purple-500' 
                    : index < currentStep 
                    ? 'bg-purple-400' 
                    : 'bg-[#404040]'
                }`}
                aria-label={`Ir para passo ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#8b8b8b] hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Anterior
              </button>
            )}

            <button
              onClick={currentStep === steps.length - 1 ? completeTour : nextStep}
              className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Concluir
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CSS para highlight */}
      <style jsx global>{`
        .onboarding-highlight {
          position: relative;
          z-index: 9999 !important;
          box-shadow: 
            0 0 0 4px rgba(139, 92, 246, 0.5),
            0 0 0 2px rgba(139, 92, 246, 0.8),
            0 0 20px rgba(139, 92, 246, 0.3) !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }
        
        .onboarding-highlight::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(45deg, #8b5cf6, #ec4899, #8b5cf6);
          border-radius: 12px;
          z-index: -1;
          animation: onboarding-pulse 2s ease-in-out infinite;
        }
        
        @keyframes onboarding-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>,
    document.body
  );
};

// Hook para gerenciar onboarding
export const useOnboarding = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('saga-onboarding-completed') === 'true';
  });

  const markOnboardingComplete = () => {
    localStorage.setItem('saga-onboarding-completed', 'true');
    setHasSeenOnboarding(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('saga-onboarding-completed');
    setHasSeenOnboarding(false);
  };

  return {
    hasSeenOnboarding,
    markOnboardingComplete,
    resetOnboarding
  };
};

// Steps predefinidos para o SAGA
export const sagaOnboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao SAGA! 🎉',
    description: 'Seu novo parceiro de treino com inteligência artificial. Vamos conhecer as principais funcionalidades.',
    target: 'body',
    placement: 'center'
  },
  {
    id: 'sidebar',
    title: 'Menu de Navegação',
    description: 'Aqui você encontra todas as seções: Feed, Rotinas, Exercícios, Perfil e muito mais.',
    target: '[data-onboarding="sidebar"]',
    placement: 'right',
    actionText: 'Explore os diferentes ícones do menu'
  },
  {
    id: 'feed',
    title: 'Feed Social',
    description: 'Veja os treinos da comunidade, curta, comente e compartilhe seu progresso!',
    target: '[data-onboarding="feed"]',
    placement: 'bottom'
  },
  {
    id: 'search',
    title: 'Busca Global',
    description: 'Use a busca para encontrar usuários, exercícios, rotinas e muito mais.',
    target: '[data-onboarding="search"]',
    placement: 'bottom',
    actionText: 'Experimente buscar por um exercício'
  },
  {
    id: 'notifications',
    title: 'Notificações',
    description: 'Receba alertas sobre curtidas, comentários, novos seguidores e lembretes de treino.',
    target: '[data-onboarding="notifications"]',
    placement: 'bottom'
  },
  {
    id: 'ai-coach',
    title: 'Coach Virtual IA 🤖',
    description: 'Nosso coach com IA te ajuda com recomendações personalizadas e análises avançadas.',
    target: '[data-onboarding="ai-coach"]',
    placement: 'right',
    actionText: 'Clique para acessar o coach virtual'
  },
  {
    id: 'rewards',
    title: 'Sistema de Recompensas 🏆',
    description: 'Ganhe XP, desbloqueie conquistas e suba de nível conforme treina!',
    target: '[data-onboarding="rewards"]',
    placement: 'right'
  },
  {
    id: 'complete',
    title: 'Tudo pronto! 🚀',
    description: 'Agora você está pronto para revolucionar seus treinos. Comece explorando as rotinas ou criando seu primeiro post!',
    target: 'body',
    placement: 'center'
  }
];

export default OnboardingTour; 