import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { analytics } from '../../services/analyticsService';

const PricingPage: React.FC = () => {
  const [plans] = useState(paymentService.getSubscriptionPlans());
  const [currentTier, setCurrentTier] = useState('free');
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    analytics.trackPageView('pricing');
    setCurrentTier(localStorage.getItem('userTier') || 'free');
  }, []);

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    setSelectedPlan(planId);
    
    try {
      analytics.track({
        action: 'upgrade_initiated',
        category: 'monetization',
        label: planId,
        customProperties: {
          from_tier: currentTier,
          to_tier: planId
        }
      });

      // Simular processo de upgrade
      setTimeout(() => {
        localStorage.setItem('userTier', planId);
        setCurrentTier(planId);
        setLoading(false);
        setSelectedPlan(null);
        
        // Mostrar confirmação
        alert(`Parabéns! Você foi upgradado para o ${plans.find(p => p.id === planId)?.name}!`);
      }, 2000);
      
    } catch (error) {
      console.error('Erro no upgrade:', error);
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Zap className="w-6 h-6" />;
      case 'premium': 
      case 'premium_yearly': return <Star className="w-6 h-6" />;
      case 'pro': return <Crown className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'from-gray-500 to-gray-600';
      case 'premium': 
      case 'premium_yearly': return 'from-purple-500 to-pink-500';
      case 'pro': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Escolha seu plano <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">SAGA</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transforme sua jornada fitness com nossa plataforma completa de treino e nutrição personalizada
          </p>
          
          {/* Current Plan Badge */}
          {currentTier !== 'free' && (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <Check className="w-4 h-4" />
              Plano atual: {plans.find(p => p.id === currentTier)?.name}
            </div>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? 'border-purple-500 scale-105' : 'border-gray-200 hover:border-purple-300'
              } ${currentTier === plan.id ? 'ring-4 ring-green-400' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {currentTier === plan.id && (
                <div className="absolute -top-4 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Atual
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getPlanColor(plan.id)} text-white mb-4`}>
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {plan.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-gray-500">
                    /{plan.interval === 'month' ? 'mês' : 'ano'}
                  </span>
                </div>
                {plan.interval === 'year' && plan.price > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Economize 33% no plano anual!
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      feature.startsWith('✅') ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {feature.startsWith('✅') ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      )}
                    </div>
                    <span className={`text-sm ${
                      feature.startsWith('✅') ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {feature.replace(/^[✅❌]\s*/, '')}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading || currentTier === plan.id || (plan.id === 'free' && currentTier !== 'free')}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  currentTier === plan.id
                    ? 'bg-green-100 text-green-800 cursor-default'
                    : plan.id === 'free'
                    ? currentTier !== 'free' 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                    : plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                } ${loading && selectedPlan === plan.id ? 'opacity-75' : ''}`}
              >
                {loading && selectedPlan === plan.id ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </div>
                ) : currentTier === plan.id ? (
                  'Plano Atual'
                ) : plan.id === 'free' ? (
                  currentTier !== 'free' ? 'Downgrade não disponível' : 'Plano Gratuito'
                ) : (
                  `Escolher ${plan.name}`
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Compare todos os recursos
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 text-gray-900 font-semibold">Recursos</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">Free</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">Premium</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: 'Biblioteca de exercícios', free: '100+', premium: '500+', pro: 'Ilimitado' },
                  { feature: 'AI Coach análises', free: '5/mês', premium: 'Ilimitado', pro: 'Ilimitado + Avançado' },
                  { feature: 'Planos personalizados', free: false, premium: true, pro: true },
                  { feature: 'Analytics avançados', free: false, premium: true, pro: true },
                  { feature: 'Suporte prioritário', free: false, premium: 'Chat', pro: '24/7 + Ligação' },
                  { feature: 'Integração wearables', free: false, premium: true, pro: true },
                  { feature: 'API Access', free: false, premium: false, pro: true },
                  { feature: 'White-label', free: false, premium: false, pro: true }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-gray-900 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : 
                        <span className="text-gray-400">—</span>
                      ) : (
                        <span className="text-gray-700">{row.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : 
                        <span className="text-gray-400">—</span>
                      ) : (
                        <span className="text-gray-700">{row.premium}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : 
                        <span className="text-gray-400">—</span>
                      ) : (
                        <span className="text-gray-700">{row.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Posso cancelar minha assinatura a qualquer momento?',
                a: 'Sim! Você pode cancelar sua assinatura a qualquer momento. Você continuará tendo acesso aos recursos premium até o final do período pago.'
              },
              {
                q: 'Existe período de teste gratuito?',
                a: 'Sim! Todos os planos pagos incluem 7 dias de teste gratuito. Você pode cancelar antes do fim do período sem cobrança.'
              },
              {
                q: 'Posso fazer upgrade ou downgrade do meu plano?',
                a: 'Claro! Você pode alterar seu plano a qualquer momento. Mudanças entram em vigor imediatamente e ajustamos a cobrança proporcionalmente.'
              },
              {
                q: 'Os dados ficam salvos se eu cancelar?',
                a: 'Seus dados de treino e progresso ficam salvos por 90 dias após o cancelamento, permitindo que você reative sem perder informações.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage; 