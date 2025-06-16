import React from 'react';
import { Activity, Search, AlertCircle, Loader2 } from './Icons';

// ============================================================================
// LOADING COMPONENTS
// ============================================================================

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Spinner: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <div className={`animate-spin ${sizeClasses[size]}`}>
        <Loader2 className="w-full h-full text-primary" />
      </div>
      {text && (
        <span className="text-sm text-muted-foreground animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export const LoadingCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`card p-6 ${className}`}>
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-3">
        <div className="skeleton w-10 h-10 rounded-full"></div>
        <div className="flex-1">
          <div className="skeleton h-4 w-3/4 mb-2"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-5/6"></div>
        <div className="skeleton h-4 w-4/6"></div>
      </div>
      
      <div className="flex space-x-2">
        <div className="skeleton h-8 w-20 rounded-lg"></div>
        <div className="skeleton h-8 w-24 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export const LoadingGrid: React.FC<{ 
  items?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}> = ({ 
  items = 6, 
  columns = 3,
  className = '' 
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-4 ${className}`}>
      {[...Array(items)].map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </div>
  );
};

interface LoadingPageProps {
  title?: string;
  description?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  title = "Carregando...",
  description = "Aguarde enquanto carregamos seus dados"
}) => (
  <div className="container-responsive py-8 animate-fade-in">
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="skeleton h-8 w-64"></div>
        <div className="skeleton h-5 w-48"></div>
      </div>

      {/* Main content skeleton */}
      <LoadingGrid items={6} columns={3} />

      {/* Centered loading indicator */}
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" />
        <h3 className="mt-4 text-lg font-medium text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md text-center">
          {description}
        </p>
      </div>
    </div>
  </div>
);

// ============================================================================
// EMPTY STATES
// ============================================================================

interface EmptyStateProps {
  icon?: React.ComponentType<any>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Search,
  title,
  description,
  action,
  className = ''
}) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
      <Icon className="w-8 h-8 text-muted-foreground" />
    </div>
    
    <h3 className="text-lg font-semibold text-foreground mb-2">
      {title}
    </h3>
    
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      {description}
    </p>
    
    {action && (
      action.href ? (
        <a
          href={action.href}
          className="btn btn-primary"
          onClick={action.onClick}
        >
          {action.label}
        </a>
      ) : (
        <button
          onClick={action.onClick}
          className="btn btn-primary"
        >
          {action.label}
        </button>
      )
    )}
  </div>
);

export const EmptyWorkouts: React.FC<{ onCreateRoutine: () => void }> = ({ 
  onCreateRoutine 
}) => (
  <EmptyState
    icon={Activity}
    title="Nenhum treino encontrado"
    description="Você ainda não possui treinos registrados. Comece criando sua primeira rotina de treino!"
    action={{
      label: "Criar primeira rotina",
      onClick: onCreateRoutine
    }}
  />
);

export const EmptySearch: React.FC<{ 
  searchTerm: string;
  onClearSearch: () => void;
}> = ({ searchTerm, onClearSearch }) => (
  <EmptyState
    icon={Search}
    title="Nenhum resultado encontrado"
    description={`Não encontramos resultados para "${searchTerm}". Tente usar termos diferentes ou verifique a ortografia.`}
    action={{
      label: "Limpar busca",
      onClick: onClearSearch
    }}
  />
);

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Algo deu errado",
  description = "Ocorreu um erro inesperado. Tente novamente em alguns instantes.",
  onRetry,
  className = ''
}) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <AlertCircle className="w-8 h-8 text-destructive" />
    </div>
    
    <h3 className="text-lg font-semibold text-foreground mb-2">
      {title}
    </h3>
    
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      {description}
    </p>
    
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn btn-outline"
      >
        Tentar novamente
      </button>
    )}
  </div>
);

// ============================================================================
// SKELETON COMPONENTS
// ============================================================================

export const SkeletonCard: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => (
  <div className={`card p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="skeleton w-10 h-10 rounded-full"></div>
        <div className="flex-1">
          <div className="skeleton h-4 w-3/4 mb-1"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="skeleton h-3 w-full"></div>
        <div className="skeleton h-3 w-5/6"></div>
        <div className="skeleton h-3 w-4/6"></div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-16"></div>
        <div className="skeleton h-8 w-20 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export const SkeletonList: React.FC<{ 
  items?: number;
  className?: string;
}> = ({ items = 5, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {[...Array(items)].map((_, index) => (
      <div key={index} className="card p-4">
        <div className="animate-pulse flex items-center space-x-4">
          <div className="skeleton w-12 h-12 rounded-lg"></div>
          <div className="flex-1">
            <div className="skeleton h-4 w-3/4 mb-2"></div>
            <div className="skeleton h-3 w-1/2"></div>
          </div>
          <div className="skeleton w-8 h-8 rounded-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonStats: React.FC<{ 
  items?: number;
  className?: string;
}> = ({ items = 4, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
    {[...Array(items)].map((_, index) => (
      <div key={index} className="card p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="skeleton w-10 h-10 rounded-lg"></div>
            <div className="skeleton w-12 h-6 rounded-full"></div>
          </div>
          <div className="skeleton h-8 w-16 mb-2"></div>
          <div className="skeleton h-4 w-24 mb-1"></div>
          <div className="skeleton h-3 w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

// ============================================================================
// LOADING OVERLAY
// ============================================================================

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  backdrop?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = "Carregando...",
  backdrop = true
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {backdrop && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      )}
      
      <div className="relative card p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          <Spinner size="lg" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            {text}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Isso pode levar alguns segundos...
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PROGRESS COMPONENTS
// ============================================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  className = '',
  showPercentage = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-foreground">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-muted-foreground">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = ''
}) => (
  <div className={`flex items-center ${className}`}>
    {steps.map((step) => (
      <React.Fragment key={step}>
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              index < currentStep
                ? 'bg-primary text-primary-foreground'
                : index === currentStep
                ? 'bg-primary/20 text-primary border-2 border-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {index + 1}
          </div>
          
          <span
            className={`ml-2 text-sm font-medium ${
              index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {step}
          </span>
        </div>
        
        {index < steps.length - 1 && (
          <div className="flex-1 h-px bg-border mx-4" />
        )}
      </React.Fragment>
    ))}
  </div>
); 