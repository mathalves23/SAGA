// Analytics utilities for SAGA
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Configuração do Google Analytics
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Tipos de eventos
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Configuração de debug
const IS_DEBUG = process.env.NODE_ENV === 'development';

// Inicializar Google Analytics
export const initializeAnalytics = () => {
  if (typeof window === 'undefined') return;

  // Carregar gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Inicializar dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer?.push(arguments);
  };

  // Configurar GA4
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    // Conformidade com LGPD/GDPR
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    // Configurações personalizadas
    custom_map: {
      custom_user_type: 'user_type',
      custom_workout_type: 'workout_type',
      custom_subscription_plan: 'subscription_plan'
    }
  });

  if (IS_DEBUG) {
    console.log('🔍 Analytics initialized (DEBUG mode)');
  }
};

// Função principal para tracking de eventos
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window === 'undefined' || !window.gtag) {
    if (IS_DEBUG) {
      console.log('📊 Analytics not available, event:', event);
    }
    return;
  }

  try {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters
    });

    if (IS_DEBUG) {
      console.log('📊 Event tracked:', event);
    }
  } catch (error) {
    console.error('❌ Analytics error:', error);
  }
};

// Eventos específicos do SAGA
export const AnalyticsEvents = {
  // Autenticação
  AUTH: {
    SIGN_UP: (method: string) => trackEvent({
      action: 'sign_up',
      category: 'auth',
      label: method
    }),
    
    LOGIN: (method: string) => trackEvent({
      action: 'login',
      category: 'auth',
      label: method
    }),
    
    LOGOUT: () => trackEvent({
      action: 'logout',
      category: 'auth'
    })
  },

  // Treinos
  WORKOUT: {
    START: (workoutType: string) => trackEvent({
      action: 'workout_start',
      category: 'fitness',
      label: workoutType,
      custom_parameters: { workout_type: workoutType }
    }),
    
    COMPLETE: (workoutType: string, duration: number, exercises: number) => trackEvent({
      action: 'workout_complete',
      category: 'fitness',
      label: workoutType,
      value: duration,
      custom_parameters: {
        workout_type: workoutType,
        duration_minutes: duration,
        exercises_count: exercises
      }
    }),
    
    ABANDON: (workoutType: string, timeSpent: number) => trackEvent({
      action: 'workout_abandon',
      category: 'fitness',
      label: workoutType,
      value: timeSpent,
      custom_parameters: { time_spent: timeSpent }
    })
  },

  // Coach IA
  AI_COACH: {
    INTERACTION: (feature: string) => trackEvent({
      action: 'ai_coach_interaction',
      category: 'ai',
      label: feature
    }),
    
    RECOMMENDATION_ACCEPTED: (type: string) => trackEvent({
      action: 'ai_recommendation_accepted',
      category: 'ai',
      label: type
    }),
    
    FEEDBACK_PROVIDED: (rating: number) => trackEvent({
      action: 'ai_feedback',
      category: 'ai',
      value: rating
    })
  },

  // Social
  SOCIAL: {
    POST_WORKOUT: (workoutType: string) => trackEvent({
      action: 'post_workout',
      category: 'social',
      label: workoutType
    }),
    
    LIKE_POST: () => trackEvent({
      action: 'like_post',
      category: 'social'
    }),
    
    COMMENT: () => trackEvent({
      action: 'comment',
      category: 'social'
    }),
    
    FOLLOW_USER: () => trackEvent({
      action: 'follow_user',
      category: 'social'
    })
  },

  // Navegação
  NAVIGATION: {
    PAGE_VIEW: (pageName: string) => trackEvent({
      action: 'page_view',
      category: 'navigation',
      label: pageName
    }),
    
    FEATURE_CLICK: (feature: string) => trackEvent({
      action: 'feature_click',
      category: 'navigation',
      label: feature
    })
  },

  // Gamificação
  GAMIFICATION: {
    ACHIEVEMENT_UNLOCKED: (achievement: string, level: number) => trackEvent({
      action: 'achievement_unlocked',
      category: 'gamification',
      label: achievement,
      value: level
    }),
    
    LEVEL_UP: (newLevel: number) => trackEvent({
      action: 'level_up',
      category: 'gamification',
      value: newLevel
    }),
    
    STREAK_MILESTONE: (days: number) => trackEvent({
      action: 'streak_milestone',
      category: 'gamification',
      value: days
    })
  },

  // Erros
  ERROR: {
    GENERAL: (errorType: string, errorMessage: string) => trackEvent({
      action: 'error',
      category: 'technical',
      label: errorType,
      custom_parameters: { error_message: errorMessage }
    }),
    
    API_ERROR: (endpoint: string, statusCode: number) => trackEvent({
      action: 'api_error',
      category: 'technical',
      label: endpoint,
      value: statusCode
    })
  }
};

// Hook para tracking automático de página
export const usePageTracking = () => {
  React.useEffect(() => {
    const currentPath = window.location.pathname;
    const pageName = currentPath === '/' ? 'home' : currentPath.slice(1).replace(/\//g, '_');
    
    AnalyticsEvents.NAVIGATION.PAGE_VIEW(pageName);
  }, []);
};

// Tracking de performance
export const trackPerformance = (metricName: string, value: number) => {
  trackEvent({
    action: 'performance_metric',
    category: 'technical',
    label: metricName,
    value: Math.round(value)
  });
};

// Tracking de user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    custom_map: properties
  });

  if (IS_DEBUG) {
    console.log('👤 User properties set:', properties);
  }
};

// Tracking de conversões
export const trackConversion = (conversionName: string, value?: number) => {
  trackEvent({
    action: 'conversion',
    category: 'business',
    label: conversionName,
    value
  });
};

// Monitorar Web Vitals
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        trackPerformance(entry.name, entry.duration);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['measure'] });
    
    // FCP (First Contentful Paint)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        trackPerformance('first_contentful_paint', entry.startTime);
      }
    }).observe({ entryTypes: ['paint'] });

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      trackPerformance('largest_contentful_paint', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

  } catch (error) {
    console.warn('⚠️ Web Vitals tracking not supported');
  }
};

// Consentimento de privacidade
export const setAnalyticsConsent = (granted: boolean) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied' // SAGA não usa ads personalizados
  });

  if (IS_DEBUG) {
    console.log(`🔒 Analytics consent: ${granted ? 'granted' : 'denied'}`);
  }
};

export default {
  initializeAnalytics,
  trackEvent,
  AnalyticsEvents,
  usePageTracking,
  trackPerformance,
  setUserProperties,
  trackConversion,
  trackWebVitals,
  setAnalyticsConsent
}; 