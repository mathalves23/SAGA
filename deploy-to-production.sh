#!/bin/bash

# 🚀 SAGA - Script de Deploy para Produção
# Este script automatiza o processo de deploy

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções helper
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
  ____    _    ____    _    
 / ___|  / \  / ___|  / \   
 \___ \ / _ \ \___ \ / _ \  
  ___) / ___ \ ___) / ___ \ 
 |____/_/   \_\____/_/   \_\
                            
 🚀 Deploy para Produção
EOF
echo -e "${NC}"

# Verificar se está no diretório correto
if [ ! -f "README.md" ] || [ ! -d "ubuntu" ]; then
    error "Execute este script a partir da raiz do projeto SAGA"
    exit 1
fi

# PASSO 1: Verificar configurações do backend
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔧 PASSO 1: Verificando configurações do backend${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"

BACKEND_DIR="ubuntu/fittrack_final/backend/backend_app/app"
if [ ! -f "$BACKEND_DIR/pom.xml" ]; then
    error "Arquivo pom.xml não encontrado em $BACKEND_DIR"
    exit 1
fi

log "Backend encontrado em: $BACKEND_DIR"

# Verificar se arquivo de configuração Railway existe
if [ -f "$BACKEND_DIR/src/main/resources/application-railway.properties" ]; then
    success "Configuração Railway encontrada ✅"
else
    warning "Configuração Railway não encontrada"
fi

# PASSO 2: Gerar chave JWT segura
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔐 PASSO 2: Gerando chave JWT segura${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"

if command -v openssl &> /dev/null; then
    JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    log "Nova chave JWT gerada"
    echo -e "${GREEN}JWT_SECRET=${JWT_SECRET}${NC}"
    echo ""
    warning "⚠️  IMPORTANTE: Copie esta chave e adicione no Railway!"
else
    warning "OpenSSL não encontrado. Use a chave padrão do projeto."
fi

# PASSO 3: Mostrar URLs importantes
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🌐 PASSO 3: URLs importantes${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"

echo -e "${GREEN}🚀 Railway:${NC} https://railway.app"
echo -e "${GREEN}🌐 Netlify:${NC} https://app.netlify.com"
echo -e "${GREEN}📱 App Frontend:${NC} https://sagafit.netlify.app"
echo -e "${GREEN}📖 Guia de Deploy:${NC} RAILWAY_DEPLOY_GUIDE.md"

# PASSO 4: Verificar se pode fazer build local
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔨 PASSO 4: Teste de build local (opcional)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"

read -p "Deseja testar o build local antes do deploy? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    log "Iniciando build local..."
    cd "$BACKEND_DIR"
    
    if command -v ./mvnw &> /dev/null; then
        log "Executando build Maven..."
        if ./mvnw clean package -DskipTests; then
            success "Build local realizado com sucesso ✅"
        else
            error "Build falhou. Verifique os erros acima."
            exit 1
        fi
    else
        warning "Maven wrapper não encontrado. Pulando build local."
    fi
    
    cd - > /dev/null
else
    log "Pulando build local."
fi

# PASSO 5: Instruções finais
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 PRÓXIMOS PASSOS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"

echo -e "${GREEN}1.${NC} Abra o guia: ${YELLOW}RAILWAY_DEPLOY_GUIDE.md${NC}"
echo -e "${GREEN}2.${NC} Acesse: ${YELLOW}https://railway.app${NC}"
echo -e "${GREEN}3.${NC} Conecte seu repositório GitHub"
echo -e "${GREEN}4.${NC} Configure Root Directory: ${YELLOW}ubuntu/fittrack_final/backend/backend_app/app${NC}"
echo -e "${GREEN}5.${NC} Adicione PostgreSQL"
echo -e "${GREEN}6.${NC} Configure variáveis de ambiente"
echo -e "${GREEN}7.${NC} Faça o deploy!"

echo -e "\n${GREEN}🎉 Após o deploy, sua app estará 90% completa!${NC}"
echo -e "${GREEN}📱 Frontend: https://sagafit.netlify.app${NC}"
echo -e "${GREEN}⚙️  Backend: https://sua-app.railway.app${NC}"

# Perguntar se quer abrir os links
echo -e "\n"
read -p "Deseja abrir o Railway no navegador? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://railway.app"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://railway.app"
    else
        log "Abra manualmente: https://railway.app"
    fi
fi

success "Script concluído! Siga o guia RAILWAY_DEPLOY_GUIDE.md para continuar." 