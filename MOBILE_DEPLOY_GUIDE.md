# 📱 SAGA Fitness - Guia Completo Deploy Mobile

## 🎯 **VISÃO GERAL**

Este guia te ensina como transformar o SAGA Fitness em aplicativos **Android** e **iOS** profissionais e publicá-los nas lojas oficiais.

---

## 🛠️ **PASSO 1: CONFIGURAÇÃO INICIAL**

### **1.1 Criar Conta Expo**
1. Acesse: https://expo.dev
2. Clique em "Sign Up"
3. Use seu email ou conecte com GitHub
4. Confirme o email

### **1.2 Instalar Ferramentas**
```bash
# Instalar Expo CLI e EAS CLI
npm install -g @expo/cli eas-cli

# Fazer login no Expo
npx expo login

# Ir para o diretório mobile
cd SAGA-Mobile

# Instalar dependências
npm install
```

### **1.3 Configurar Projeto**
```bash
# Inicializar configuração EAS
eas init --id your-project-id

# Configurar build
eas build:configure
```

---

## 🤖 **PASSO 2: APLICATIVO ANDROID**

### **2.1 Configurações Android**

#### **Atualizar package.json**
```json
{
  "name": "saga-fitness-mobile",
  "version": "2.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "submit:android": "eas submit --platform android",
    "submit:ios": "eas submit --platform ios"
  }
}
```

#### **Configurações no app.json**
O arquivo já está configurado com:
- ✅ Package: `com.sagafitness.app`
- ✅ Permissões: Câmera, Localização, Armazenamento
- ✅ Deep links: `sagafitness://`
- ✅ Ícones adaptativos

### **2.2 Build Android**

#### **Build de Teste (APK)**
```bash
# Build APK para testes
eas build --platform android --profile preview

# O link do APK aparecerá no terminal
# Baixe e teste no seu dispositivo
```

#### **Build de Produção (AAB)**
```bash
# Build AAB para Google Play Store
eas build --platform android --profile production
```

### **2.3 Publicar no Google Play Store**

#### **Preparar Conta Google Play Console**
1. Acesse: https://play.google.com/console
2. Pague taxa única de $25
3. Crie perfil de desenvolvedor

#### **Criar App no Play Console**
1. "Criar app"
2. Nome: "SAGA Fitness"
3. Idioma padrão: Português (Brasil)
4. Tipo: App
5. Categoria: Saúde e fitness

#### **Upload do App**
```bash
# Submeter para Play Store
eas submit --platform android

# Ou manual:
# 1. Baixe o AAB do EAS
# 2. Upload manual no Play Console
```

#### **Configurar Listagem da Loja**
```
Título: SAGA Fitness - AI Coach & Treinos
Descrição curta: Transforme seu treino com IA, gamificação e analytics avançados

Descrição completa:
🤖 SAGA Fitness - A Revolução do Fitness com Inteligência Artificial

Transforme sua jornada fitness com nossa plataforma completa que combina:

✨ AI COACH PESSOAL
• Análise de movimentos em tempo real
• Pontuação de forma (0-100)
• Correções instantâneas
• Planos personalizados

🎮 GAMIFICAÇÃO COMPLETA
• 50+ conquistas únicas
• Sistema de XP e níveis
• Ranking com amigos
• Desafios semanais

📊 ANALYTICS AVANÇADOS
• Dashboard de progresso
• Métricas detalhadas
• Recordes pessoais
• Composição corporal

🍎 NUTRIÇÃO INTELIGENTE
• Contador de calorias
• 1000+ alimentos
• Scanner de códigos
• Receitas saudáveis

⌚ INTEGRAÇÃO WEARABLES
• Apple Watch
• Fitbit
• Garmin
• Sync automático

🔔 NOTIFICAÇÕES SMART
• Lembretes personalizados
• Sugestões por IA
• Horários otimizados

💪 FUNCIONALIDADES PREMIUM
• Planos ilimitados
• Análise biomecânica
• Suporte prioritário
• Relatórios avançados

Junte-se a 150.000+ usuários que já transformaram seus treinos!

Palavras-chave: fitness, treino, IA, gamificação, saúde, exercício
```

#### **Assets da Loja**
Você precisará criar:
- **Ícone**: 512x512px
- **Screenshots**: 5-8 imagens do app
- **Banner**: 1024x500px
- **Vídeo promocional** (opcional)

---

## 🍎 **PASSO 3: APLICATIVO iOS**

### **3.1 Configurações iOS**

#### **Requisitos**
- **Apple Developer Account** ($99/ano)
- **Xcode** (apenas em Mac)
- **Certificados iOS**

### **3.2 Configurar Apple Developer**

#### **Criar Conta Developer**
1. Acesse: https://developer.apple.com
2. Enroll no programa ($99/ano)
3. Aguarde aprovação (1-2 dias)

#### **Configurar Identifiers**
1. No Developer Portal: Certificates, Identifiers & Profiles
2. Identifiers → App IDs
3. Criar novo: `com.sagafitness.app`
4. Capabilities: Push Notifications, Associated Domains

#### **Gerar Certificados**
```bash
# EAS vai gerar automaticamente, mas você pode fazer manual:
# 1. Distribution Certificate
# 2. Provisioning Profile
```

### **3.3 Build iOS**

#### **Build de Teste**
```bash
# Build para TestFlight
eas build --platform ios --profile preview
```

#### **Build de Produção**
```bash
# Build para App Store
eas build --platform ios --profile production
```

### **3.4 Publicar na App Store**

#### **App Store Connect**
1. Acesse: https://appstoreconnect.apple.com
2. "Meus apps" → "+"
3. Configurar:
   ```
   Nome: SAGA Fitness
   Bundle ID: com.sagafitness.app
   SKU: SAGA-FITNESS-001
   ```

#### **Upload do App**
```bash
# Submeter para App Store
eas submit --platform ios

# Preencher informações necessárias:
# - Apple ID
# - App Store Connect App ID
# - Team ID
```

#### **Configurar Listagem**
```
Nome: SAGA Fitness
Subtítulo: AI Coach & Treinos Inteligentes
Categoria: Saúde e fitness
Classificação: 4+

Descrição (igual ao Android, mas otimizada para iOS):
Transform your fitness journey with artificial intelligence...
```

#### **Assets iOS**
- **App Icon**: 1024x1024px
- **Screenshots**: iPhone e iPad
- **App Preview**: Vídeo 15-30s (opcional)

---

## 🚀 **PASSO 4: FUNCIONALIDADES AVANÇADAS**

### **4.1 Push Notifications**

#### **Configurar Firebase**
```bash
# Instalar Firebase
expo install expo-notifications firebase

# Configurar firebase.js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "saga-fitness.firebaseapp.com",
  projectId: "saga-fitness",
  storageBucket: "saga-fitness.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:android:abcdef"
};
```

#### **Implementar Notificações**
```typescript
import * as Notifications from 'expo-notifications';

// Configurar notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Registrar para push notifications
async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  
  const token = await Notifications.getExpoPushTokenAsync();
  console.log('Push token:', token);
}
```

### **4.2 Deep Links**

#### **Configuração**
```typescript
// app.json já configurado com:
"scheme": "sagafitness",
"associatedDomains": ["applinks:sagafitness.com"]

// Implementar navegação
import { Linking } from 'react-native';

Linking.addEventListener('url', (event) => {
  // sagafitness://workout/123
  // https://sagafitness.com/workout/123
  handleDeepLink(event.url);
});
```

### **4.3 Analytics Mobile**

#### **Implementar Tracking**
```typescript
import analytics from '@react-native-firebase/analytics';

// Track eventos
await analytics().logEvent('workout_completed', {
  workout_type: 'strength',
  duration: 45,
  exercises_completed: 12
});

// Track telas
await analytics().logScreenView({
  screen_name: 'WorkoutPage',
  screen_class: 'WorkoutPage'
});
```

---

## 💰 **PASSO 5: MONETIZAÇÃO MOBILE**

### **5.1 In-App Purchases**

#### **Configurar Products**
```typescript
// Google Play Console
// 1. Monetização → Produtos → Assinaturas
// 2. Criar produtos:
//    - saga_premium_monthly (R$ 29,90)
//    - saga_pro_monthly (R$ 79,90)

// App Store Connect  
// 1. Funcionalidades → Compras no app
// 2. Criar mesmos produtos
```

#### **Implementar Purchases**
```bash
# Instalar biblioteca
expo install expo-in-app-purchases

# Implementar
import * as InAppPurchases from 'expo-in-app-purchases';

const purchasePremium = async () => {
  await InAppPurchases.purchaseItemAsync('saga_premium_monthly');
};
```

### **5.2 Subscription Management**

```typescript
// Verificar status da assinatura
const checkSubscription = async () => {
  const history = await InAppPurchases.getPurchaseHistoryAsync();
  const activeSubscription = history.find(purchase => 
    purchase.productId === 'saga_premium_monthly' && 
    !purchase.acknowledged
  );
  return activeSubscription;
};
```

---

## 📊 **PASSO 6: TESTES E QUALIDADE**

### **6.1 Testes Automatizados**

```bash
# Instalar Detox
npm install detox --save-dev

# Configurar testes E2E
detox init -r jest

# Executar testes
detox test
```

### **6.2 Performance**

```bash
# Análise de bundle
npx expo export --dev
npx expo-analyze

# Otimizações
# 1. Lazy loading de telas
# 2. Otimização de imagens
# 3. Code splitting
```

### **6.3 Distribuição Beta**

#### **Android - Internal Testing**
```bash
# Upload para teste interno
eas submit --platform android --latest

# Google Play Console → Testes → Teste interno
# Adicionar testadores por email
```

#### **iOS - TestFlight**
```bash
# Upload para TestFlight
eas submit --platform ios --latest

# App Store Connect → TestFlight
# Adicionar testadores externos
```

---

## 🔄 **PASSO 7: ATUALIZAÇÕES OTA**

### **7.1 Expo Updates**

```bash
# Configurar updates
expo install expo-updates

# Publicar update
expo publish --channel production

# Update automático no app
import * as Updates from 'expo-updates';

const checkForUpdates = async () => {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    Updates.reloadAsync();
  }
};
```

---

## 📈 **PASSO 8: MONITORAMENTO**

### **8.1 Crash Reporting**

```bash
# Sentry para mobile
expo install @sentry/react-native

# Configurar
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
});
```

### **8.2 Performance Monitoring**

```typescript
// Firebase Performance
import perf from '@react-native-firebase/perf';

const trace = await perf().startTrace('workout_load');
// ... carregamento
await trace.stop();
```

---

## ✅ **CHECKLIST FINAL**

### **Antes de Publicar**
- [ ] App testado em devices reais
- [ ] Screenshots profissionais criados
- [ ] Descrições otimizadas para ASO
- [ ] Políticas de privacidade criadas
- [ ] Termos de uso atualizados
- [ ] Analytics configurados
- [ ] Push notifications testadas
- [ ] In-app purchases funcionando
- [ ] Deep links configurados
- [ ] Performance otimizada

### **Pós-Publicação**
- [ ] Monitorar reviews e ratings
- [ ] Responder comentários dos usuários
- [ ] Análisar métricas de engajamento
- [ ] Planejar updates regulares
- [ ] A/B testing para funcionalidades
- [ ] Marketing ASO (App Store Optimization)

---

## 🎯 **CRONOGRAMA ESTIMADO**

### **Semana 1: Setup e Configuração**
- Criar contas (Expo, Apple, Google)
- Configurar builds
- Testes iniciais

### **Semana 2: Build e Testes**
- Builds Android e iOS
- Testes em dispositivos
- Correções de bugs

### **Semana 3: Listagens e Assets**
- Screenshots profissionais
- Descrições otimizadas
- Vídeos promocionais

### **Semana 4: Submissão**
- Upload para lojas
- Review process
- Publicação

### **Cronograma de Review**
- **Google Play**: 1-3 dias
- **App Store**: 7-14 dias

---

## 💡 **DICAS IMPORTANTES**

### **Para Sucesso nas Lojas**
1. **ASO (App Store Optimization)**:
   - Keywords relevantes
   - Screenshots atrativas
   - Descrição persuasiva
   - Reviews positivas

2. **Performance**:
   - Startup rápido (< 3s)
   - Smooth animations (60fps)
   - Consumo baixo de bateria
   - Tamanho otimizado (< 50MB)

3. **Engagement**:
   - Onboarding intuitivo
   - Push notifications relevantes
   - Gamificação efetiva
   - Social features

### **Compliance**
- **LGPD/GDPR**: Consentimento de dados
- **Políticas das Lojas**: Seguir guidelines
- **Acessibilidade**: Suporte a deficiências
- **Segurança**: Criptografia de dados

---

## 🚀 **PRONTO PARA LANÇAR!**

Com este guia, você terá:
- ✅ App Android no Google Play Store
- ✅ App iOS na App Store  
- ✅ Sistema de monetização
- ✅ Analytics e monitoramento
- ✅ Distribuição profissional

**🎉 SAGA Fitness mobile está pronto para conquistar milhões de usuários!**

---

## 📞 **Suporte**

Se precisar de ajuda:
- 📧 Email: dev@sagafitness.com
- 💬 Discord: SAGA Dev Community
- 📚 Docs: https://docs.sagafitness.com/mobile 