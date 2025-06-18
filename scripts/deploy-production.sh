#!/bin/bash

# SAGA Fitness - Script de Deploy Profissional
# Versão: 2.0.0
# Autor: SAGA Team

set -euo pipefail

# Configurações
PROJECT_NAME="SAGA Fitness"
FRONTEND_DIR="ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved"
BACKEND_DIR="ubuntu/fittrack_final/backend/backend_app/app"
MOBILE_DIR="SAGA-Mobile"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar dependências
check_dependencies() {
    log_info "Verificando dependências..."
    
    commands=("node" "npm" "java" "mvn" "docker" "git")
    
    for cmd in "${commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "$cmd não está instalado"
            exit 1
        fi
    done
    
    log_success "Todas as dependências estão instaladas"
}

# Executar testes
run_tests() {
    log_info "Executando testes..."
    
    # Frontend tests
    cd "$FRONTEND_DIR"
    if [ -f "package.json" ]; then
        npm test -- --coverage --watchAll=false
        log_success "Testes do frontend passaram"
    fi
    
    # Backend tests
    cd "../../../$BACKEND_DIR"
    if [ -f "pom.xml" ]; then
        mvn test
        log_success "Testes do backend passaram"
    fi
    
    cd "../../../../../../"
}

# Build do frontend
build_frontend() {
    log_info "Fazendo build do frontend..."
    
    cd "$FRONTEND_DIR"
    
    # Instalar dependências
    npm ci --only=production
    
    # Build de produção
    npm run build
    
    # Verificar se build foi criado
    if [ ! -d "dist" ] && [ ! -d "build" ]; then
        log_error "Falha no build do frontend"
        exit 1
    fi
    
    log_success "Build do frontend concluído"
    cd "../../../../../../"
}

# Build do backend
build_backend() {
    log_info "Fazendo build do backend..."
    
    cd "$BACKEND_DIR"
    
    # Limpar e fazer build
    mvn clean package -DskipTests
    
    # Verificar se JAR foi criado
    if [ ! -f "target/*.jar" ]; then
        log_error "Falha no build do backend"
        exit 1
    fi
    
    log_success "Build do backend concluído"
    cd "../../../../../../"
}

# Deploy para Netlify (Frontend)
deploy_netlify() {
    log_info "Fazendo deploy para Netlify..."
    
    cd "$FRONTEND_DIR"
    
    # Instalar Netlify CLI se não estiver instalado
    if ! command -v netlify &> /dev/null; then
        npm install -g netlify-cli
    fi
    
    # Deploy
    netlify deploy --prod --dir=dist
    
    log_success "Deploy para Netlify concluído"
    cd "../../../../../../"
}

# Deploy para Railway (Backend)
deploy_railway() {
    log_info "Fazendo deploy para Railway..."
    
    # Instalar Railway CLI se não estiver instalado
    if ! command -v railway &> /dev/null; then
        curl -fsSL https://railway.app/install.sh | sh
    fi
    
    # Login no Railway (se necessário)
    railway login
    
    # Deploy
    railway up
    
    log_success "Deploy para Railway concluído"
}

# Deploy para Docker
deploy_docker() {
    log_info "Criando containers Docker..."
    
    # Build das imagens
    docker-compose -f docker-compose.yml build
    
    # Subir containers
    docker-compose -f docker-compose.yml up -d
    
    log_success "Containers Docker criados"
}

# Verificar saúde da aplicação
health_check() {
    log_info "Verificando saúde da aplicação..."
    
    # Verificar frontend
    if curl -f -s http://localhost:3000/health > /dev/null; then
        log_success "Frontend está funcionando"
    else
        log_warning "Frontend não está respondendo"
    fi
    
    # Verificar backend
    if curl -f -s http://localhost:8080/actuator/health > /dev/null; then
        log_success "Backend está funcionando"
    else
        log_warning "Backend não está respondendo"
    fi
}

# Limpar cache e arquivos temporários
cleanup() {
    log_info "Limpando arquivos temporários..."
    
    # Limpar node_modules antigos
    find . -name "node_modules" -type d -prune -exec rm -rf {} +
    
    # Limpar builds antigos
    find . -name "dist" -type d -prune -exec rm -rf {} +
    find . -name "build" -type d -prune -exec rm -rf {} +
    find . -name "target" -type d -prune -exec rm -rf {} +
    
    log_success "Limpeza concluída"
}

# Backup da configuração atual
backup_config() {
    log_info "Fazendo backup da configuração..."
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup de arquivos importantes
    cp -r "$FRONTEND_DIR/src" "$BACKUP_DIR/frontend_src" 2>/dev/null || true
    cp -r "$BACKEND_DIR/src" "$BACKUP_DIR/backend_src" 2>/dev/null || true
    cp .env* "$BACKUP_DIR/" 2>/dev/null || true
    
    log_success "Backup salvo em $BACKUP_DIR"
}

# Configurar variáveis de ambiente
setup_env() {
    log_info "Configurando variáveis de ambiente..."
    
    # Verificar se arquivos .env existem
    if [ ! -f ".env.production" ]; then
        log_warning ".env.production não encontrado, criando..."
        cat > .env.production << EOL
# SAGA Fitness - Configuração de Produção
NODE_ENV=production
REACT_APP_API_URL=https://saga-api.railway.app
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
REACT_APP_MIXPANEL_TOKEN=your_mixpanel_token
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
REACT_APP_FB_PIXEL_ID=your_pixel_id
EOL
    fi
    
    log_success "Variáveis de ambiente configuradas"
}

# Menu principal
show_menu() {
    echo -e "\n${BLUE}=== SAGA Fitness - Deploy de Produção ===${NC}"
    echo -e "${GREEN}1.${NC} Deploy completo (Frontend + Backend)"
    echo -e "${GREEN}2.${NC} Deploy apenas Frontend"
    echo -e "${GREEN}3.${NC} Deploy apenas Backend"
    echo -e "${GREEN}4.${NC} Deploy com Docker"
    echo -e "${GREEN}5.${NC} Executar testes"
    echo -e "${GREEN}6.${NC} Limpar cache"
    echo -e "${GREEN}7.${NC} Backup de configuração"
    echo -e "${GREEN}8.${NC} Verificar saúde"
    echo -e "${GREEN}9.${NC} Sair"
    echo -e "\n${YELLOW}Escolha uma opção:${NC} "
}

# Função principal
main() {
    clear
    log_info "Iniciando deploy do $PROJECT_NAME"
    
    # Verificar dependências
    check_dependencies
    
    # Configurar ambiente
    setup_env
    
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1)
                log_info "Iniciando deploy completo..."
                backup_config
                run_tests
                build_frontend
                build_backend
                deploy_netlify
                deploy_railway
                health_check
                log_success "Deploy completo concluído!"
                ;;
            2)
                log_info "Iniciando deploy do frontend..."
                build_frontend
                deploy_netlify
                log_success "Deploy do frontend concluído!"
                ;;
            3)
                log_info "Iniciando deploy do backend..."
                build_backend
                deploy_railway
                log_success "Deploy do backend concluído!"
                ;;
            4)
                log_info "Iniciando deploy com Docker..."
                build_frontend
                build_backend
                deploy_docker
                health_check
                log_success "Deploy com Docker concluído!"
                ;;
            5)
                run_tests
                ;;
            6)
                cleanup
                ;;
            7)
                backup_config
                ;;
            8)
                health_check
                ;;
            9)
                log_info "Saindo..."
                exit 0
                ;;
            *)
                log_error "Opção inválida"
                ;;
        esac
        
        echo -e "\n${YELLOW}Pressione Enter para continuar...${NC}"
        read -r
    done
}

# Executar função principal
main "$@" 