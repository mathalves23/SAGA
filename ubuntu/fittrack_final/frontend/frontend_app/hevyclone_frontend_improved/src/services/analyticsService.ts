// Analytics Service - Tracking profissional para SAGA Fitness
import { User } from '../types/User';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    mixpanel: any;
    fbq: (...args: any[]) => void;
  }
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  customProperties?: Record<string, any>;
}

interface UserProperties {
  userId: string;
  email: string;
  name: string;
  subscriptionTier: 'free' | 'premium' | 'pro';
  registrationDate: Date;
  lastActiveDate: Date;
  totalWorkouts: number;
  favoriteExercises: string[];
  fitnessGoals: string[];
}

class AnalyticsService {
  private isInitialized = false;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async initialize() {
    try {
      // Inicializar Google Analytics 4
      await this.initializeGA4();
      
      // Inicializar Mixpanel
      await this.initializeMixpanel();
      
      // Inicializar Facebook Pixel
      await this.initializeFacebookPixel();
      
      this.isInitialized = true;
      console.log('✅ Analytics service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize analytics:', error);
    }
  }

  private async initializeGA4() {
    const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
    
    // Carregar script do Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Configurar gtag
    window.gtag = window.gtag || function() {
      (window.gtag as any).q = (window.gtag as any).q || [];
      (window.gtag as any).q.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: 'SAGA Fitness',
      page_location: window.location.href,
      custom_map: {
        'custom_parameter_1': 'user_tier',
        'custom_parameter_2': 'workout_type'
      }
    });
  }

  private async initializeMixpanel() {
    const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || 'your_mixpanel_token';
    
    // Carregar Mixpanel
    const script = document.createElement('script');
    script.innerHTML = `
      (function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);
    `;
    document.head.appendChild(script);

    // Aguardar carregamento e inicializar
    setTimeout(() => {
      if (window.mixpanel) {
        window.mixpanel.init(MIXPANEL_TOKEN, {
          debug: process.env.NODE_ENV === 'development',
          track_pageview: true,
          persistence: 'localStorage'
        });
      }
    }, 1000);
  }

  private async initializeFacebookPixel() {
    const FB_PIXEL_ID = process.env.REACT_APP_FB_PIXEL_ID || 'your_pixel_id';
    
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }

  // Identificar usuário
  identify(user: UserProperties) {
    this.userId = user.userId;
    
    // Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID!, {
        user_id: user.userId,
        custom_map: {
          'subscription_tier': user.subscriptionTier,
          'total_workouts': user.totalWorkouts.toString()
        }
      });
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.identify(user.userId);
      window.mixpanel.people.set({
        '$email': user.email,
        '$name': user.name,
        'subscription_tier': user.subscriptionTier,
        'registration_date': user.registrationDate,
        'total_workouts': user.totalWorkouts,
        'favorite_exercises': user.favoriteExercises,
        'fitness_goals': user.fitnessGoals
      });
    }
  }

  // Rastrear eventos
  track(event: AnalyticsEvent) {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized yet');
      return;
    }

    const eventData = {
      ...event.customProperties,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: new Date().toISOString()
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_1: eventData.subscription_tier,
        custom_parameter_2: eventData.workout_type
      });
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track(event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
        ...eventData
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', event.action, eventData);
    }

    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', { event, eventData });
    }
  }

  // Eventos específicos do fitness
  trackWorkoutStarted(workoutType: string, duration: number) {
    this.track({
      action: 'workout_started',
      category: 'fitness',
      label: workoutType,
      value: duration,
      customProperties: {
        workout_type: workoutType,
        expected_duration: duration
      }
    });
  }

  trackWorkoutCompleted(workoutType: string, actualDuration: number, exercisesCompleted: number) {
    this.track({
      action: 'workout_completed',
      category: 'fitness',
      label: workoutType,
      value: actualDuration,
      customProperties: {
        workout_type: workoutType,
        actual_duration: actualDuration,
        exercises_completed: exercisesCompleted,
        completion_rate: (exercisesCompleted / 10) * 100 // Assumindo 10 exercícios por treino
      }
    });
  }

  trackSubscriptionUpgrade(fromTier: string, toTier: string, amount: number) {
    this.track({
      action: 'subscription_upgraded',
      category: 'monetization',
      label: `${fromTier}_to_${toTier}`,
      value: amount,
      customProperties: {
        from_tier: fromTier,
        to_tier: toTier,
        amount: amount,
        currency: 'BRL'
      }
    });

    // Evento de conversão Facebook
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: amount,
        currency: 'BRL',
        content_type: 'subscription',
        content_ids: [toTier]
      });
    }
  }

  trackFeatureUsage(feature: string, context?: string) {
    this.track({
      action: 'feature_used',
      category: 'engagement',
      label: feature,
      customProperties: {
        feature: feature,
        context: context,
        user_tier: this.getUserTier()
      }
    });
  }

  trackError(error: string, context: string) {
    this.track({
      action: 'error_occurred',
      category: 'technical',
      label: error,
      customProperties: {
        error_message: error,
        context: context,
        user_agent: navigator.userAgent,
        url: window.location.href
      }
    });
  }

  trackPageView(pageName: string) {
    this.track({
      action: 'page_view',
      category: 'navigation',
      label: pageName,
      customProperties: {
        page_name: pageName,
        referrer: document.referrer,
        user_tier: this.getUserTier()
      }
    });
  }

  trackAICoachUsage(feature: string, result?: any) {
    this.track({
      action: 'ai_coach_used',
      category: 'ai',
      label: feature,
      customProperties: {
        ai_feature: feature,
        result: result,
        user_tier: this.getUserTier()
      }
    });
  }

  trackNutritionGoal(goalType: string, targetValue: number) {
    this.track({
      action: 'nutrition_goal_set',
      category: 'nutrition',
      label: goalType,
      value: targetValue,
      customProperties: {
        goal_type: goalType,
        target_value: targetValue
      }
    });
  }

  trackSocialShare(content: string, platform: string) {
    this.track({
      action: 'content_shared',
      category: 'social',
      label: platform,
      customProperties: {
        content_type: content,
        platform: platform
      }
    });
  }

  private getUserTier(): string {
    // Implementar lógica para obter tier do usuário
    return localStorage.getItem('userTier') || 'free';
  }

  // Método para parar tracking (GDPR compliance)
  optOut() {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    if (window.mixpanel) {
      window.mixpanel.opt_out_tracking();
    }
    
    localStorage.setItem('analytics_opted_out', 'true');
  }

  // Método para retomar tracking
  optIn() {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
    
    if (window.mixpanel) {
      window.mixpanel.opt_in_tracking();
    }
    
    localStorage.removeItem('analytics_opted_out');
  }
}

export const analytics = new AnalyticsService();
export default analytics; 