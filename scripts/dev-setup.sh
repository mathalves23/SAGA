#!/bin/bash

# Script de configuração do ambiente de desenvolvimento
# SAGA Development Setup

echo "🏋️ SAGA - Configuração do Ambiente de Desenvolvimento"
echo "=========================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
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

# Verificar se Docker está instalado
check_docker() {
    log "Verificando Docker..."
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado. Por favor, instale o Docker primeiro."
        exit 1
    fi
    success "Docker encontrado"
}

# Verificar se Docker Compose está instalado
check_docker_compose() {
    log "Verificando Docker Compose..."
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
        exit 1
    fi
    success "Docker Compose encontrado"
}

# Verificar se Java está instalado
check_java() {
    log "Verificando Java..."
    if ! command -v java &> /dev/null; then
        warning "Java não encontrado. É necessário para desenvolvimento local."
    else
        java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
        success "Java encontrado: $java_version"
    fi
}

# Verificar se Node.js está instalado
check_node() {
    log "Verificando Node.js..."
    if ! command -v node &> /dev/null; then
        warning "Node.js não encontrado. É necessário para desenvolvimento frontend."
    else
        node_version=$(node --version)
        success "Node.js encontrado: $node_version"
    fi
}

# Criar arquivo de exemplo .env
create_env_example() {
    log "Criando arquivo .env.example..."
    
    cat > .env.example << EOF
# SAGA Environment Variables
# Copie este arquivo para .env e configure as variáveis

# Database
DB_PASSWORD=sua_senha_forte_aqui

# JWT Secret (gere um secret forte de 256+ bits)
JWT_SECRET=seu_jwt_secret_super_forte_de_pelo_menos_256_bits

# Spring Profile
SPRING_PROFILES_ACTIVE=dev

# CORS (URLs permitidas separadas por vírgula)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost

# Logs
LOG_LEVEL=INFO
EOF

    success "Arquivo .env.example criado"
}

# Instalar dependências do backend
setup_backend() {
    log "Configurando backend..."
    
    cd ubuntu/fittrack_final/backend/backend_app/app
    
    if command -v mvn &> /dev/null; then
        log "Instalando dependências do Maven..."
        mvn clean install -DskipTests
        success "Dependências do backend instaladas"
    else
        warning "Maven não encontrado. Dependências do backend não foram instaladas."
    fi
    
    cd - > /dev/null
}

# Instalar dependências do frontend
setup_frontend() {
    log "Configurando frontend..."
    
    cd ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved
    
    if command -v npm &> /dev/null; then
        log "Instalando dependências do npm..."
        npm install
        success "Dependências do frontend instaladas"
    else
        warning "npm não encontrado. Dependências do frontend não foram instaladas."
    fi
    
    cd - > /dev/null
}

# Função principal
main() {
    echo
    log "Iniciando configuração..."
    
    # Verificações
    check_docker
    check_docker_compose
    check_java
    check_node
    
    echo
    
    # Configurações
    create_env_example
    setup_backend
    setup_frontend
    
    echo
    echo "🎉 Configuração concluída!"
    echo
    echo "📋 Próximos passos:"
    echo "1. Copie .env.example para .env e configure as variáveis"
    echo "2. Execute 'docker-compose up -d' para iniciar os serviços"
    echo "3. Execute './scripts/dev-start.sh' para desenvolvimento local"
    echo
    echo "📚 Consulte o README.md para mais informações"
}

# Executar função principal
main "$@" 