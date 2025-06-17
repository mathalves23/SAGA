# 🏋️‍♂️ SAGA Fitness - Plataforma Completa de Fitness

<div align="center">

![SAGA Fitness](https://img.shields.io/badge/SAGA-Fitness-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production-green?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

**Uma plataforma completa de fitness com aplicações web e mobile, backend robusto e recursos avançados de IA**

[🌐 **Demo Web**](https://sagafit.netlify.app) • [📱 **Mobile Demo**](#mobile) • [📖 **Documentação**](#documentation)

</div>

---

## 📋 **Sobre o Projeto**

SAGA Fitness é uma plataforma completa para acompanhamento de fitness que inclui:

- **🌐 Aplicação Web React** - Interface moderna e responsiva
- **📱 Aplicação Mobile React Native** - App nativo para iOS e Android
- **⚙️ Backend Spring Boot** - API REST robusta e segura
- **🤖 Análise de IA** - Análise de vídeos de exercícios
- **📊 Analytics Avançados** - Dashboards e relatórios detalhados

## ✨ **Funcionalidades Principais**

### 🌐 **Aplicação Web**
- 📊 **Dashboard Analytics** com métricas de progresso
- 🏋️ **Biblioteca de Exercícios** com 466+ exercícios
- 🤖 **AI Coach** para análise de movimentos
- 🎯 **Sistema de Metas** personalizáveis
- 👤 **Perfil Completo** com configurações avançadas
- 🌓 **Tema Claro/Escuro** adaptável

### 📱 **Aplicação Mobile**
- 🔐 **Autenticação Segura** com JWT
- 📈 **Rastreamento de Progresso** em tempo real
- 🍎 **Controle Nutricional** completo
- ⏱️ **Timer de Treino** com funcionalidades avançadas
- 🏆 **Sistema de Conquistas** gamificado
- 📶 **Modo Offline** com sincronização automática

### ⚙️ **Backend**
- 🔒 **Autenticação JWT** segura
- 🗄️ **Base de Dados PostgreSQL** otimizada
- 📝 **API REST** completa e documentada
- 🛡️ **Validação e Segurança** implementadas
- 🧪 **Testes Automatizados** com alta cobertura

## 🏗️ **Arquitetura Técnica**

### **Frontend Web**
```
React 19 + TypeScript + Vite
├── 🎨 Tailwind CSS
├── 🧭 React Router v6
├── 📊 Chart.js
├── 🔐 Context API
└── 🌐 Axios
```

### **Mobile App**
```
React Native + Expo SDK 53
├── 📱 TypeScript
├── 🧭 React Navigation 6
├── 💾 AsyncStorage + SecureStore
├── 🔔 Expo Notifications
└── 📷 Expo Camera
```

### **Backend**
```
Spring Boot 3.2 + Java 17
├── 🔐 Spring Security + JWT
├── 🗄️ PostgreSQL + JPA
├── 📝 OpenAPI/Swagger
├── 🧪 JUnit 5
└── 🐳 Docker
```

## 🚀 **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+
- Java 17+
- PostgreSQL 13+
- Git

### **1. Clone o Repositório**
```bash
git clone https://github.com/mathalves23/SAGA.git
cd SAGA
```

### **2. Configurar Backend**
```bash
cd ubuntu/fittrack_final/backend/backend_app/app

# Configurar database
cp application.properties.example application.properties
# Editar application.properties com suas configurações

# Executar
./mvnw spring-boot:run
```

### **3. Configurar Frontend Web**
```bash
cd ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.production.example .env.local
# Editar .env.local com suas configurações

# Executar em desenvolvimento
npm run dev
```

### **4. Configurar Mobile App**
```bash
cd SAGA-Mobile

# Instalar dependências
npm install

# Executar
npx expo start
```

## 🌐 **Deploy**

### **Frontend Web (Netlify)**
A aplicação web está configurada para deploy automático no Netlify:
- **URL**: https://sagafit.netlify.app
- **Deploy**: Automático via GitHub
- **Build**: `npm run build:prod`

### **Backend (Sugestões)**
- **Railway** (Recomendado) - Deploy automático com PostgreSQL
- **Render** - Opção gratuita com PostgreSQL
- **Heroku** - Opção paga com add-ons

### **Mobile App**
- **Android**: Build via `eas build --platform android`
- **iOS**: Build via `eas build --platform ios`

## 📊 **Estrutura do Projeto**

```
SAGA/
├── 📁 ubuntu/fittrack_final/
│   ├── 📁 frontend/frontend_app/hevyclone_frontend_improved/  # React Web App
│   └── 📁 backend/backend_app/app/                          # Spring Boot API
├── 📁 SAGA-Mobile/                                          # React Native App
├── 📁 scripts/                                             # Scripts utilitários
├── 📁 k8s/                                                 # Kubernetes configs
├── 📁 nginx/                                               # Nginx configs
├── 📄 netlify.toml                                         # Netlify config
├── 📄 docker-compose.yml                                   # Docker setup
└── 📄 README.md                                            # Este arquivo
```

## 🧪 **Testes**

### **Frontend**
```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e
```

### **Backend**
```bash
# Testes unitários
./mvnw test

# Testes de integração
./mvnw integration-test
```

## 📈 **Funcionalidades Avançadas**

### **🤖 Análise de IA**
- Análise de postura em tempo real
- Detecção de movimentos incorretos
- Sugestões de melhoria automáticas
- Score de qualidade do exercício

### **📱 Recursos Mobile**
- Notificações push personalizadas
- Modo offline com sincronização
- Integração com wearables
- Timer de treino avançado

### **📊 Analytics**
- Dashboards interativos
- Relatórios de progresso
- Métricas de performance
- Exportação de dados

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 **Equipe**

- **Desenvolvimento Full-Stack** - Implementação completa das aplicações
- **UI/UX Design** - Interface moderna e responsiva
- **DevOps** - Configuração de deploy e infraestrutura

## 📞 **Suporte**

- 🐛 **Issues**: [GitHub Issues](https://github.com/mathalves23/SAGA/issues)
- 📧 **Email**: suporte@sagafitness.com
- 💬 **Discord**: [Comunidade SAGA](https://discord.gg/saga)

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

[⬆ Voltar ao topo](#-saga-fitness---plataforma-completa-de-fitness)

</div> 