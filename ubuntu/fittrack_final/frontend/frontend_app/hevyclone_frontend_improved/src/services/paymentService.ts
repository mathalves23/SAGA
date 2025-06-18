// Payment Service - Sistema de monetização SAGA Fitness
import { analytics } from './analyticsService';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  stripePriceId: string;
}

interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
}

class PaymentService {
  private apiUrl: string;
  private stripePublicKey: string;

  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    this.stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_...';
  }

  // Planos de assinatura
  getSubscriptionPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'free',
        name: 'SAGA Free',
        price: 0,
        currency: 'BRL',
        interval: 'month',
        stripePriceId: '',
        features: [
          '✅ Acesso básico aos exercícios',
          '✅ Treinos pré-definidos limitados',
          '✅ Tracking básico de progresso',
          '❌ AI Coach limitado (5 análises/mês)',
          '❌ Planos de treino personalizados'
        ]
      },
      {
        id: 'premium',
        name: 'SAGA Premium',
        price: 29.90,
        currency: 'BRL',
        interval: 'month',
        stripePriceId: 'price_premium_monthly',
        popular: true,
        features: [
          '✅ Todos os recursos do Free',
          '✅ AI Coach ilimitado',
          '✅ Planos de treino personalizados',
          '✅ Análises detalhadas de progresso',
          '✅ Biblioteca completa de exercícios'
        ]
      },
      {
        id: 'premium_yearly',
        name: 'SAGA Premium Anual',
        price: 299.90,
        currency: 'BRL',
        interval: 'year',
        stripePriceId: process.env.REACT_APP_STRIPE_PREMIUM_YEARLY_PRICE_ID || 'price_premium_yearly',
        features: [
          '✅ Todos os recursos Premium',
          '✅ 2 meses grátis (economize 33%)',
          '✅ Acesso antecipado a novos recursos',
          '✅ Consultoria fitness 1x/mês',
          '✅ Planos de nutrição personalizados'
        ]
      },
      {
        id: 'pro',
        name: 'SAGA Pro',
        price: 79.90,
        currency: 'BRL',
        interval: 'month',
        stripePriceId: process.env.REACT_APP_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
        features: [
          '✅ Todos os recursos Premium',
          '✅ Personal trainer virtual dedicado',
          '✅ Análise biomecânica avançada',
          '✅ Planos de reabilitação',
          '✅ API access para desenvolvedores',
          '✅ White-label para academias',
          '✅ Suporte prioritário 24/7',
          '✅ Consultoria mensal com especialistas'
        ]
      }
    ];
  }

  // Inicializar Stripe
  async initializeStripe() {
    if (typeof window !== 'undefined' && !window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.head.appendChild(script);
      
      return new Promise((resolve) => {
        script.onload = () => {
          window.Stripe = window.Stripe || (() => console.error('Stripe not loaded'));
          resolve(window.Stripe(this.stripePublicKey));
        };
      });
    }
    return window.Stripe(this.stripePublicKey);
  }

  // Criar intenção de pagamento
  async createPaymentIntent(planId: string): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ planId })
      });

      if (!response.ok) {
        throw new Error('Falha ao criar intenção de pagamento');
      }

      const data = await response.json();
      
      // Track analytics
      analytics.track({
        action: 'payment_intent_created',
        category: 'monetization',
        label: planId,
        customProperties: {
          plan_id: planId,
          amount: this.getSubscriptionPlans().find(p => p.id === planId)?.price
        }
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar payment intent:', error);
      analytics.trackError('create_payment_intent_failed', error.message);
      throw error;
    }
  }

  // Criar assinatura
  async createSubscription(planId: string, paymentMethodId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/subscriptions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          planId,
          paymentMethodId
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao criar assinatura');
      }

      const subscription = await response.json();
      
      // Update local storage
      localStorage.setItem('userTier', planId);
      localStorage.setItem('subscriptionStatus', JSON.stringify(subscription));

      // Track analytics
      const plan = this.getSubscriptionPlans().find(p => p.id === planId);
      analytics.trackSubscriptionUpgrade('free', planId, plan?.price || 0);

      return subscription;
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      analytics.trackError('create_subscription_failed', error.message);
      throw error;
    }
  }

  // Cancelar assinatura
  async cancelSubscription(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao cancelar assinatura');
      }

      // Track analytics
      analytics.track({
        action: 'subscription_cancelled',
        category: 'monetization',
        customProperties: {
          previous_tier: localStorage.getItem('userTier')
        }
      });

      // Update local storage
      localStorage.setItem('userTier', 'free');
      localStorage.removeItem('subscriptionStatus');
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      analytics.trackError('cancel_subscription_failed', error.message);
      throw error;
    }
  }

  // Obter status da assinatura
  async getSubscriptionStatus(): Promise<SubscriptionStatus | null> {
    try {
      const response = await fetch(`${this.apiUrl}/subscriptions/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        return null;
      }

      const status = await response.json();
      localStorage.setItem('subscriptionStatus', JSON.stringify(status));
      return status;
    } catch (error) {
      console.error('Erro ao obter status da assinatura:', error);
      return null;
    }
  }

  // Verificar se tem acesso a recurso premium
  hasFeatureAccess(feature: string): boolean {
    const userTier = localStorage.getItem('userTier') || 'free';
    
    const featurePermissions = {
      ai_coach_unlimited: ['premium', 'premium_yearly', 'pro'],
      custom_workout_plans: ['premium', 'premium_yearly', 'pro'],
      advanced_analytics: ['premium', 'premium_yearly', 'pro']
    };

    return featurePermissions[feature]?.includes(userTier) || false;
  }

  // Mostrar paywall
  showPaywall(feature: string, requiredTier: string): void {
    console.log(`Paywall: ${feature} requires ${requiredTier}`);
  }

  // Aplicar cupom de desconto
  async applyCoupon(couponCode: string, planId: string): Promise<{ valid: boolean; discount?: number; error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ couponCode, planId })
      });

      const result = await response.json();
      
      analytics.track({
        action: 'coupon_applied',
        category: 'monetization',
        label: couponCode,
        customProperties: {
          coupon_code: couponCode,
          plan_id: planId,
          valid: result.valid,
          discount: result.discount
        }
      });

      return result;
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      return { valid: false, error: 'Erro ao validar cupom' };
    }
  }

  // Obter histórico de faturas
  async getInvoices(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiUrl}/billing/invoices`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar faturas');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
      return [];
    }
  }

  // Métricas de monetização
  getMonetizationMetrics() {
    const userTier = localStorage.getItem('userTier') || 'free';
    const subscriptionData = localStorage.getItem('subscriptionStatus');
    
    return {
      currentTier: userTier,
      isPayingCustomer: userTier !== 'free',
      subscriptionStatus: subscriptionData ? JSON.parse(subscriptionData) : null,
      lifetimeValue: this.calculateLifetimeValue(),
      conversionFunnel: this.getConversionFunnelData()
    };
  }

  private calculateLifetimeValue(): number {
    const userTier = localStorage.getItem('userTier') || 'free';
    const plan = this.getSubscriptionPlans().find(p => p.id === userTier);
    
    if (!plan || plan.price === 0) return 0;
    
    // Estimativa baseada na retenção média
    const monthlyValue = plan.interval === 'year' ? plan.price / 12 : plan.price;
    const averageLifetimeMonths = 12; // 1 ano de retenção média
    
    return monthlyValue * averageLifetimeMonths;
  }

  private getConversionFunnelData() {
    // Dados simulados - implementar com analytics reais
    return {
      visitors: 10000,
      signups: 2000,      // 20% conversion rate
      trialUsers: 1500,   // 75% start trial
      paidUsers: 300,     // 20% convert to paid
      conversionRate: 0.03 // 3% overall conversion
    };
  }
}

export const paymentService = new PaymentService();
export default paymentService; 