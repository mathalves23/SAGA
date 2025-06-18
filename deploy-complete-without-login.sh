#!/bin/bash

# 🚀 SAGA FITNESS - DEPLOY COMPLETO SEM LOGIN
# Este script prepara todos os deployments sem fazer login agora
# Você executa quando tiver criado todas as contas necessárias

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Arte ASCII
print_logo() {
    echo -e "${CYAN}"
    echo "   ███████╗ █████╗  ██████╗  █████╗ "
    echo "   ██╔════╝██╔══██╗██╔════╝ ██╔══██╗"
    echo "   ███████╗███████║██║  ███╗███████║"
    echo "   ╚════██║██╔══██║██║   ██║██╔══██║"
    echo "   ███████║██║  ██║╚██████╔╝██║  ██║"
    echo "   ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝"
    echo -e "${NC}"
    echo -e "${GREEN}🏋️‍♂️  SAGA FITNESS - DEPLOY COMPLETO  🏋️‍♂️${NC}"
    echo -e "${YELLOW}================================================${NC}"
    echo
}

# Função para exibir menu
show_menu() {
    echo -e "${BLUE}📋 MENU DE DEPLOY SAGA FITNESS${NC}"
    echo -e "${YELLOW}================================${NC}"
    echo -e "${GREEN}1.${NC} 🔍 Verificar Estrutura do Projeto"
    echo -e "${GREEN}2.${NC} 🌐 Preparar Deploy Frontend (Netlify)"
    echo -e "${GREEN}3.${NC} 🛠️  Preparar Deploy Backend (Railway)"
    echo -e "${GREEN}4.${NC} 📱 Preparar Deploy Mobile (Expo)"
    echo -e "${GREEN}5.${NC} 📊 Configurar Analytics"
    echo -e "${GREEN}6.${NC} 💰 Configurar Monetização"
    echo -e "${GREEN}7.${NC} 🧹 Limpar e Organizar Repositório"
    echo -e "${GREEN}8.${NC} 📚 Gerar Documentação Completa"
    echo -e "${GREEN}9.${NC} 🚀 Executar TUDO (Deploy Completo)"
    echo -e "${GREEN}10.${NC} ❓ Mostrar Contas Necessárias"
    echo -e "${GREEN}0.${NC} 🚪 Sair"
    echo
    echo -e "${CYAN}Digite sua escolha (0-10):${NC}"
}

# Verificar estrutura do projeto
check_project_structure() {
    echo -e "${BLUE}🔍 VERIFICANDO ESTRUTURA DO PROJETO...${NC}"
    echo
    
    # Verificar diretórios principais
    directories=(
        "ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved"
        "ubuntu/fittrack_final/backend/backend_app/app"
        "SAGA-Mobile"
    )
    
    for dir in "${directories[@]}"; do
        if [ -d "$dir" ]; then
            echo -e "${GREEN}✅ $dir - ENCONTRADO${NC}"
        else
            echo -e "${RED}❌ $dir - NÃO ENCONTRADO${NC}"
        fi
    done
    
    echo
    echo -e "${BLUE}📁 Estrutura atual do projeto:${NC}"
    tree -L 3 -I 'node_modules|.git|dist|build|target' || ls -la
    
    echo
    echo -e "${GREEN}✅ Verificação da estrutura concluída!${NC}"
    read -p "Pressione Enter para continuar..."
}

# Preparar deploy frontend
prepare_frontend_deploy() {
    echo -e "${BLUE}🌐 PREPARANDO DEPLOY FRONTEND (NETLIFY)...${NC}"
    echo
    
    FRONTEND_DIR="ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved"
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        echo -e "${RED}❌ Diretório frontend não encontrado!${NC}"
        return 1
    fi
    
    cd "$FRONTEND_DIR"
    
    echo -e "${YELLOW}📦 Instalando dependências do frontend...${NC}"
    if [ -f "package.json" ]; then
        npm install --legacy-peer-deps
    else
        echo -e "${RED}❌ package.json não encontrado!${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}🔧 Criando arquivos de configuração para Netlify...${NC}"
    
    # Criar netlify.toml
    cat > netlify.toml << 'EOF'
[build]
  base = "ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
EOF
    
    # Criar _redirects
    cat > public/_redirects << 'EOF'
/*    /index.html   200
EOF
    
    # Criar script de deploy
    cat > deploy-frontend.sh << 'EOF'
#!/bin/bash

echo "🌐 FAZENDO DEPLOY DO FRONTEND NO NETLIFY..."

# Verificar se está logado no Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI não encontrado. Instalando..."
    npm install -g netlify-cli
fi

# Login (será solicitado)
echo "🔐 Fazendo login no Netlify..."
netlify login

# Deploy
echo "🚀 Fazendo deploy..."
netlify deploy --prod --dir=dist

echo "✅ Deploy do frontend concluído!"
EOF
    
    chmod +x deploy-frontend.sh
    
    echo -e "${YELLOW}🏗️  Fazendo build do projeto...${NC}"
    npm run build
    
    echo
    echo -e "${GREEN}✅ Frontend preparado para deploy!${NC}"
    echo -e "${CYAN}📋 PRÓXIMOS PASSOS:${NC}"
    echo -e "${YELLOW}1. Crie conta no Netlify: https://netlify.com${NC}"
    echo -e "${YELLOW}2. Execute: cd $FRONTEND_DIR && ./deploy-frontend.sh${NC}"
    echo -e "${YELLOW}3. Configure variáveis de ambiente no Netlify:${NC}"
    echo -e "   - NODE_ENV=production"
    echo -e "   - REACT_APP_API_URL=https://seu-backend.railway.app"
    echo -e "   - REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX"
    echo -e "   - REACT_APP_STRIPE_PUBLIC_KEY=pk_live_..."
    echo
    
    cd - > /dev/null
    read -p "Pressione Enter para continuar..."
}

# Preparar deploy backend
prepare_backend_deploy() {
    echo -e "${BLUE}🛠️  PREPARANDO DEPLOY BACKEND (RAILWAY)...${NC}"
    echo
    
    BACKEND_DIR="ubuntu/fittrack_final/backend/backend_app/app"
    
    if [ ! -d "$BACKEND_DIR" ]; then
        echo -e "${RED}❌ Diretório backend não encontrado!${NC}"
        return 1
    fi
    
    cd "$BACKEND_DIR"
    
    echo -e "${YELLOW}🔧 Criando arquivos de configuração para Railway...${NC}"
    
    # Criar railway.json
    cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE"
  }
}
EOF
    
    # Criar Procfile para Railway
    cat > Procfile << 'EOF'
web: java -Dserver.port=$PORT -Dspring.profiles.active=railway -jar target/*.jar
EOF
    
    # Criar nixpacks.toml para Railway
    cat > nixpacks.toml << 'EOF'
[phases.build]
cmds = ["mvn clean package -DskipTests"]

[phases.start]
cmd = "java -Dserver.port=$PORT -Dspring.profiles.active=railway -jar target/*.jar"
EOF
    
    # Criar script de deploy
    cat > deploy-backend.sh << 'EOF'
#!/bin/bash

echo "🛠️ FAZENDO DEPLOY DO BACKEND NO RAILWAY..."

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não encontrado. Instalando..."
    npm install -g @railway/cli
fi

# Login (será solicitado)
echo "🔐 Fazendo login no Railway..."
railway login

# Inicializar projeto
echo "🚀 Inicializando projeto..."
railway link

# Deploy
echo "🚀 Fazendo deploy..."
railway up

echo "✅ Deploy do backend concluído!"
EOF
    
    chmod +x deploy-backend.sh
    
    # Criar application-railway.yml
    mkdir -p src/main/resources
    cat > src/main/resources/application-railway.yml << 'EOF'
spring:
  datasource:
    url: ${DATABASE_URL}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  redis:
    url: ${REDIS_URL}
  
server:
  port: ${PORT:8080}

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000

stripe:
  api-key: ${STRIPE_SECRET_KEY}
  webhook-secret: ${STRIPE_WEBHOOK_SECRET}

logging:
  level:
    com.saga.fitness: INFO
EOF
    
    echo
    echo -e "${GREEN}✅ Backend preparado para deploy!${NC}"
    echo -e "${CYAN}📋 PRÓXIMOS PASSOS:${NC}"
    echo -e "${YELLOW}1. Crie conta no Railway: https://railway.app${NC}"
    echo -e "${YELLOW}2. Execute: cd $BACKEND_DIR && ./deploy-backend.sh${NC}"
    echo -e "${YELLOW}3. Adicione bancos de dados no Railway:${NC}"
    echo -e "   - PostgreSQL"
    echo -e "   - Redis"
    echo -e "${YELLOW}4. Configure variáveis de ambiente:${NC}"
    echo -e "   - DATABASE_URL (automaticamente do PostgreSQL)"
    echo -e "   - REDIS_URL (automaticamente do Redis)"
    echo -e "   - JWT_SECRET=seu_jwt_secreto_super_seguro"
    echo -e "   - STRIPE_SECRET_KEY=sk_live_..."
    echo -e "   - STRIPE_WEBHOOK_SECRET=whsec_..."
    echo
    
    cd - > /dev/null
    read -p "Pressione Enter para continuar..."
}

# Preparar deploy mobile
prepare_mobile_deploy() {
    echo -e "${BLUE}📱 PREPARANDO DEPLOY MOBILE (EXPO)...${NC}"
    echo
    
    MOBILE_DIR="SAGA-Mobile"
    
    if [ ! -d "$MOBILE_DIR" ]; then
        echo -e "${RED}❌ Diretório mobile não encontrado!${NC}"
        return 1
    fi
    
    cd "$MOBILE_DIR"
    
    echo -e "${YELLOW}📦 Instalando dependências do mobile...${NC}"
    if [ -f "package.json" ]; then
        npm install
    else
        echo -e "${RED}❌ package.json não encontrado!${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}🔧 Criando scripts de deploy mobile...${NC}"
    
    # Script para Android
    cat > deploy-android.sh << 'EOF'
#!/bin/bash

echo "🤖 FAZENDO DEPLOY ANDROID..."

# Verificar Expo CLI
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI não encontrado. Instalando..."
    npm install -g eas-cli
fi

# Login no Expo
echo "🔐 Fazendo login no Expo..."
npx expo login

# Inicializar EAS
echo "⚙️ Inicializando EAS..."
eas init

# Build APK para teste
echo "🏗️ Fazendo build APK para teste..."
eas build --platform android --profile preview

# Build AAB para produção
echo "🏗️ Fazendo build AAB para produção..."
eas build --platform android --profile production

echo "✅ Build Android concluído!"
echo "📲 Para publicar no Google Play Store:"
echo "   eas submit --platform android"
EOF
    
    # Script para iOS
    cat > deploy-ios.sh << 'EOF'
#!/bin/bash

echo "🍎 FAZENDO DEPLOY iOS..."

# Verificar Expo CLI
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI não encontrado. Instalando..."
    npm install -g eas-cli
fi

# Login no Expo
echo "🔐 Fazendo login no Expo..."
npx expo login

# Build para TestFlight
echo "🏗️ Fazendo build para TestFlight..."
eas build --platform ios --profile preview

# Build para App Store
echo "🏗️ Fazendo build para App Store..."
eas build --platform ios --profile production

echo "✅ Build iOS concluído!"
echo "📲 Para publicar na App Store:"
echo "   eas submit --platform ios"
EOF
    
    chmod +x deploy-android.sh
    chmod +x deploy-ios.sh
    
    # Criar script completo
    cat > deploy-mobile-complete.sh << 'EOF'
#!/bin/bash

echo "📱 DEPLOY COMPLETO MOBILE - ANDROID E iOS"

# Android
echo "🤖 Iniciando deploy Android..."
./deploy-android.sh

echo ""
echo "⏳ Aguardando 30 segundos antes do iOS..."
sleep 30

# iOS  
echo "🍎 Iniciando deploy iOS..."
./deploy-ios.sh

echo ""
echo "✅ Deploy mobile completo finalizado!"
EOF
    
    chmod +x deploy-mobile-complete.sh
    
    echo
    echo -e "${GREEN}✅ Mobile preparado para deploy!${NC}"
    echo -e "${CYAN}📋 PRÓXIMOS PASSOS:${NC}"
    echo -e "${YELLOW}1. Crie conta no Expo: https://expo.dev${NC}"
    echo -e "${YELLOW}2. Para Android:${NC}"
    echo -e "   - Crie conta Google Play Console ($25)"
    echo -e "   - Execute: cd $MOBILE_DIR && ./deploy-android.sh"
    echo -e "${YELLOW}3. Para iOS:${NC}"
    echo -e "   - Crie conta Apple Developer ($99/ano)"
    echo -e "   - Execute: cd $MOBILE_DIR && ./deploy-ios.sh"
    echo -e "${YELLOW}4. Para ambos: ./deploy-mobile-complete.sh${NC}"
    echo
    
    cd - > /dev/null
    read -p "Pressione Enter para continuar..."
}

# Configurar analytics
configure_analytics() {
    echo -e "${BLUE}📊 CONFIGURANDO ANALYTICS...${NC}"
    echo
    
    # Verificar se o arquivo já existe
    ANALYTICS_FILE="ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved/src/services/analyticsService.ts"
    
    if [ -f "$ANALYTICS_FILE" ]; then
        echo -e "${GREEN}✅ Analytics já configurado!${NC}"
        echo -e "${CYAN}📋 Arquivo encontrado em: $ANALYTICS_FILE${NC}"
    else
        echo -e "${YELLOW}⚠️  Arquivo de analytics não encontrado${NC}"
    fi
    
    echo
    echo -e "${CYAN}📋 CONTAS NECESSÁRIAS PARA ANALYTICS:${NC}"
    echo -e "${YELLOW}1. Google Analytics 4:${NC}"
    echo -e "   - Acesse: https://analytics.google.com"
    echo -e "   - Crie propriedade GA4"
    echo -e "   - Copie Measurement ID (G-XXXXXXXXXX)"
    echo
    echo -e "${YELLOW}2. Mixpanel (opcional):${NC}"
    echo -e "   - Acesse: https://mixpanel.com"
    echo -e "   - Crie projeto"
    echo -e "   - Copie token do projeto"
    echo
    echo -e "${YELLOW}3. Facebook Pixel (opcional):${NC}"
    echo -e "   - Acesse: https://business.facebook.com"
    echo -e "   - Crie pixel"
    echo -e "   - Copie Pixel ID"
    echo
    
    read -p "Pressione Enter para continuar..."
}

# Configurar monetização
configure_monetization() {
    echo -e "${BLUE}💰 CONFIGURANDO MONETIZAÇÃO...${NC}"
    echo
    
    # Verificar se o arquivo já existe
    PAYMENT_FILE="ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved/src/services/paymentService.ts"
    
    if [ -f "$PAYMENT_FILE" ]; then
        echo -e "${GREEN}✅ Sistema de pagamentos já configurado!${NC}"
        echo -e "${CYAN}📋 Arquivo encontrado em: $PAYMENT_FILE${NC}"
    else
        echo -e "${YELLOW}⚠️  Arquivo de pagamentos não encontrado${NC}"
    fi
    
    echo
    echo -e "${CYAN}📋 CONFIGURAÇÃO STRIPE NECESSÁRIA:${NC}"
    echo -e "${YELLOW}1. Crie conta Stripe:${NC}"
    echo -e "   - Acesse: https://stripe.com"
    echo -e "   - Complete verificação da conta"
    echo -e "   - Ative modo produção"
    echo
    echo -e "${YELLOW}2. Configure produtos:${NC}"
    echo -e "   - SAGA Premium: R$ 29,90/mês"
    echo -e "   - SAGA Pro: R$ 79,90/mês"
    echo
    echo -e "${YELLOW}3. Copie chaves:${NC}"
    echo -e "   - Chave pública: pk_live_..."
    echo -e "   - Chave secreta: sk_live_..."
    echo -e "   - Webhook secret: whsec_..."
    echo
    echo -e "${YELLOW}4. Configure webhook:${NC}"
    echo -e "   - URL: https://seu-backend.railway.app/api/webhooks/stripe"
    echo -e "   - Eventos: customer.subscription.created, customer.subscription.updated"
    echo
    
    read -p "Pressione Enter para continuar..."
}

# Limpar repositório
clean_repository() {
    echo -e "${BLUE}🧹 LIMPANDO E ORGANIZANDO REPOSITÓRIO...${NC}"
    echo
    
    if [ -f "cleanup-repository.sh" ]; then
        echo -e "${YELLOW}🔄 Executando script de limpeza...${NC}"
        chmod +x cleanup-repository.sh
        ./cleanup-repository.sh
    else
        echo -e "${RED}❌ Script cleanup-repository.sh não encontrado${NC}"
        echo -e "${YELLOW}🔄 Executando limpeza básica...${NC}"
        
        # Limpeza básica
        find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
        find . -name ".DS_Store" -delete 2>/dev/null || true
        find . -name "Thumbs.db" -delete 2>/dev/null || true
        find . -name "*.log" -delete 2>/dev/null || true
        find . -name "*.tmp" -delete 2>/dev/null || true
        
        echo -e "${GREEN}✅ Limpeza básica concluída${NC}"
    fi
    
    echo
    echo -e "${GREEN}✅ Repositório limpo e organizado!${NC}"
    read -p "Pressione Enter para continuar..."
}

# Gerar documentação
generate_documentation() {
    echo -e "${BLUE}📚 GERANDO DOCUMENTAÇÃO COMPLETA...${NC}"
    echo
    
    # Verificar se arquivos existem
    docs=(
        "README.md"
        "DEPLOY_GUIDE.md"
        "MOBILE_DEPLOY_GUIDE.md"
        "API_DOCUMENTATION.md"
    )
    
    for doc in "${docs[@]}"; do
        if [ -f "$doc" ]; then
            echo -e "${GREEN}✅ $doc - ENCONTRADO${NC}"
        else
            echo -e "${YELLOW}⚠️  $doc - FALTANDO${NC}"
        fi
    done
    
    echo
    echo -e "${CYAN}📋 DOCUMENTAÇÃO DISPONÍVEL:${NC}"
    echo -e "${YELLOW}1. README.md - Documentação principal do projeto${NC}"
    echo -e "${YELLOW}2. DEPLOY_GUIDE.md - Guia completo de deploy${NC}"
    echo -e "${YELLOW}3. MOBILE_DEPLOY_GUIDE.md - Guia deploy mobile${NC}"
    echo -e "${YELLOW}4. API_DOCUMENTATION.md - Documentação da API${NC}"
    echo
    
    read -p "Pressione Enter para continuar..."
}

# Mostrar contas necessárias
show_required_accounts() {
    echo -e "${BLUE}❓ CONTAS NECESSÁRIAS PARA DEPLOY COMPLETO${NC}"
    echo -e "${YELLOW}==============================================${NC}"
    echo
    
    echo -e "${CYAN}🌐 FRONTEND (Netlify):${NC}"
    echo -e "${YELLOW}• URL: https://netlify.com${NC}"
    echo -e "${YELLOW}• Custo: GRATUITO${NC}"
    echo -e "${YELLOW}• Login: GitHub recomendado${NC}"
    echo
    
    echo -e "${CYAN}🛠️ BACKEND (Railway):${NC}"
    echo -e "${YELLOW}• URL: https://railway.app${NC}"
    echo -e "${YELLOW}• Custo: $5/mês após trial${NC}"
    echo -e "${YELLOW}• Login: GitHub recomendado${NC}"
    echo
    
    echo -e "${CYAN}📱 MOBILE (Expo):${NC}"
    echo -e "${YELLOW}• URL: https://expo.dev${NC}"
    echo -e "${YELLOW}• Custo: GRATUITO${NC}"
    echo -e "${YELLOW}• Login: Email ou GitHub${NC}"
    echo
    
    echo -e "${CYAN}🤖 GOOGLE PLAY STORE:${NC}"
    echo -e "${YELLOW}• URL: https://play.google.com/console${NC}"
    echo -e "${YELLOW}• Custo: $25 (taxa única)${NC}"
    echo -e "${YELLOW}• Requisito: Conta Google${NC}"
    echo
    
    echo -e "${CYAN}🍎 APPLE APP STORE:${NC}"
    echo -e "${YELLOW}• URL: https://developer.apple.com${NC}"
    echo -e "${YELLOW}• Custo: $99/ano${NC}"
    echo -e "${YELLOW}• Requisito: Apple ID${NC}"
    echo
    
    echo -e "${CYAN}📊 ANALYTICS:${NC}"
    echo -e "${YELLOW}• Google Analytics: https://analytics.google.com (GRATUITO)${NC}"
    echo -e "${YELLOW}• Mixpanel: https://mixpanel.com (GRATUITO até 1k users)${NC}"
    echo
    
    echo -e "${CYAN}💰 PAGAMENTOS:${NC}"
    echo -e "${YELLOW}• Stripe: https://stripe.com (2.9% + 30¢ por transação)${NC}"
    echo
    
    echo -e "${GREEN}💡 TOTAL ESTIMADO MENSAL:${NC}"
    echo -e "${YELLOW}• Mínimo: $5/mês (Railway)${NC}"
    echo -e "${YELLOW}• Com iOS: $5/mês + $99/ano${NC}"
    echo -e "${YELLOW}• Completo: ~$15-30/mês (dependendo do tráfego)${NC}"
    echo
    
    read -p "Pressione Enter para continuar..."
}

# Deploy completo
deploy_complete() {
    echo -e "${BLUE}🚀 EXECUTANDO DEPLOY COMPLETO DO SAGA FITNESS!${NC}"
    echo -e "${YELLOW}=============================================${NC}"
    echo
    
    echo -e "${CYAN}📋 ETAPAS QUE SERÃO EXECUTADAS:${NC}"
    echo -e "${YELLOW}1. ✅ Verificar estrutura do projeto${NC}"
    echo -e "${YELLOW}2. 🌐 Preparar deploy frontend${NC}"
    echo -e "${YELLOW}3. 🛠️  Preparar deploy backend${NC}"
    echo -e "${YELLOW}4. 📱 Preparar deploy mobile${NC}"
    echo -e "${YELLOW}5. 🧹 Limpar repositório${NC}"
    echo
    
    read -p "Deseja continuar com o deploy completo? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}❌ Deploy cancelado pelo usuário${NC}"
        return
    fi
    
    echo -e "${GREEN}🚀 Iniciando deploy completo...${NC}"
    echo
    
    # Executar todas as etapas
    check_project_structure
    prepare_frontend_deploy
    prepare_backend_deploy
    prepare_mobile_deploy
    clean_repository
    
    echo
    echo -e "${GREEN}🎉 DEPLOY COMPLETO PREPARADO COM SUCESSO!${NC}"
    echo -e "${YELLOW}=======================================${NC}"
    echo
    echo -e "${CYAN}📋 PRÓXIMOS PASSOS:${NC}"
    echo -e "${YELLOW}1. Crie todas as contas necessárias (opção 10)${NC}"
    echo -e "${YELLOW}2. Execute os scripts de deploy gerados:${NC}"
    echo -e "   - Frontend: ./deploy-frontend.sh"
    echo -e "   - Backend: ./deploy-backend.sh"
    echo -e "   - Mobile: ./deploy-mobile-complete.sh"
    echo -e "${YELLOW}3. Configure variáveis de ambiente${NC}"
    echo -e "${YELLOW}4. Teste todas as funcionalidades${NC}"
    echo
    echo -e "${GREEN}🏆 SAGA FITNESS ESTARÁ PRONTO PARA PRODUÇÃO!${NC}"
    echo
}

# Loop principal
main() {
    print_logo
    
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1)
                check_project_structure
                ;;
            2)
                prepare_frontend_deploy
                ;;
            3)
                prepare_backend_deploy
                ;;
            4)
                prepare_mobile_deploy
                ;;
            5)
                configure_analytics
                ;;
            6)
                configure_monetization
                ;;
            7)
                clean_repository
                ;;
            8)
                generate_documentation
                ;;
            9)
                deploy_complete
                ;;
            10)
                show_required_accounts
                ;;
            0)
                echo -e "${GREEN}👋 Obrigado por usar o SAGA FITNESS Deploy!${NC}"
                echo -e "${CYAN}🏋️‍♂️ Boa sorte com seu projeto fitness revolucionário!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Opção inválida. Escolha entre 0-10.${NC}"
                read -p "Pressione Enter para tentar novamente..."
                ;;
        esac
        
        clear
        print_logo
    done
}

# Executar script principal
main 