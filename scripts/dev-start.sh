#!/bin/bash

# Script para iniciar o ambiente de desenvolvimento
# SAGA Development Start

echo "🏋️ SAGA - Iniciando Ambiente de Desenvolvimento"
echo "===================================================="

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

# Verificar se arquivo .env existe
check_env_file() {
    if [ ! -f ".env" ]; then
        warning "Arquivo .env não encontrado!"
        log "Criando .env a partir do .env.example..."
        
        if [ -f ".env.example" ]; then
            cp .env.example .env
            warning "Por favor, configure as variáveis no arquivo .env antes de continuar"
            exit 1
        else
            error "Arquivo .env.example não encontrado. Execute ./scripts/dev-setup.sh primeiro"
            exit 1
        fi
    fi
}

# Iniciar serviços com Docker Compose
start_services() {
    log "Iniciando serviços com Docker Compose..."
    
    # Parar serviços existentes
    docker-compose down 2>/dev/null
    
    # Iniciar serviços
    docker-compose up -d database redis
    
    success "Serviços de infraestrutura iniciados"
    
    # Aguardar serviços ficarem prontos
    log "Aguardando serviços ficarem prontos..."
    sleep 10
    
    # Verificar se serviços estão saudáveis
    if docker-compose ps | grep -q "database.*healthy"; then
        success "Banco de dados está pronto"
    else
        warning "Banco de dados pode não estar pronto ainda"
    fi
    
    if docker-compose ps | grep -q "redis.*healthy"; then
        success "Redis está pronto"
    else
        warning "Redis pode não estar pronto ainda"
    fi
}

# Iniciar backend em modo desenvolvimento
start_backend_dev() {
    log "Iniciando backend em modo desenvolvimento..."
    
    cd ubuntu/fittrack_final/backend/backend_app/app
    
    # Verificar se Maven está disponível
    if ! command -v mvn &> /dev/null; then
        error "Maven não encontrado. Não é possível iniciar o backend."
        return 1
    fi
    
    # Iniciar backend em background
    echo "Executando: mvn spring-boot:run"
    mvn spring-boot:run > ../../../backend.log 2>&1 &
    BACKEND_PID=$!
    
    echo $BACKEND_PID > ../../../backend.pid
    success "Backend iniciado em background (PID: $BACKEND_PID)"
    log "Logs do backend: ubuntu/fittrack_final/backend.log"
    
    cd - > /dev/null
}

# Iniciar frontend em modo desenvolvimento
start_frontend_dev() {
    log "Iniciando frontend em modo desenvolvimento..."
    
    cd ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved
    
    # Verificar se npm está disponível
    if ! command -v npm &> /dev/null; then
        error "npm não encontrado. Não é possível iniciar o frontend."
        return 1
    fi
    
    # Iniciar frontend em background
    echo "Executando: npm run dev"
    npm run dev > ../../../frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    echo $FRONTEND_PID > ../../../frontend.pid
    success "Frontend iniciado em background (PID: $FRONTEND_PID)"
    log "Logs do frontend: ubuntu/fittrack_final/frontend.log"
    
    cd - > /dev/null
}

# Mostrar status dos serviços
show_status() {
    echo
    echo "📊 Status dos Serviços"
    echo "====================="
    
    # Docker services
    echo "🐳 Serviços Docker:"
    docker-compose ps
    
    echo
    
    # Backend
    if [ -f "ubuntu/fittrack_final/backend.pid" ]; then
        BACKEND_PID=$(cat ubuntu/fittrack_final/backend.pid)
        if ps -p $BACKEND_PID > /dev/null; then
            echo "🔧 Backend: Executando (PID: $BACKEND_PID)"
        else
            echo "🔧 Backend: Parado"
        fi
    else
        echo "🔧 Backend: Não iniciado"
    fi
    
    # Frontend
    if [ -f "ubuntu/fittrack_final/frontend.pid" ]; then
        FRONTEND_PID=$(cat ubuntu/fittrack_final/frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null; then
            echo "⚛️ Frontend: Executando (PID: $FRONTEND_PID)"
        else
            echo "⚛️ Frontend: Parado"
        fi
    else
        echo "⚛️ Frontend: Não iniciado"
    fi
}

# Mostrar URLs de acesso
show_urls() {
    echo
    echo "🌐 URLs de Acesso"
    echo "=================="
    echo "Frontend: http://localhost:3001"
    echo "Backend API: http://localhost:8080"
    echo "API Docs (Swagger): http://localhost:8080/swagger-ui.html"
    echo "Database: localhost:5432"
    echo "Redis: localhost:6379"
}

# Função principal
main() {
    case "$1" in
        "stop")
            log "Parando todos os serviços..."
            docker-compose down
            
            # Parar backend
            if [ -f "ubuntu/fittrack_final/backend.pid" ]; then
                BACKEND_PID=$(cat ubuntu/fittrack_final/backend.pid)
                kill $BACKEND_PID 2>/dev/null
                rm ubuntu/fittrack_final/backend.pid
            fi
            
            # Parar frontend
            if [ -f "ubuntu/fittrack_final/frontend.pid" ]; then
                FRONTEND_PID=$(cat ubuntu/fittrack_final/frontend.pid)
                kill $FRONTEND_PID 2>/dev/null
                rm ubuntu/fittrack_final/frontend.pid
            fi
            
            success "Todos os serviços foram parados"
            ;;
        "status")
            show_status
            show_urls
            ;;
        "logs")
            case "$2" in
                "backend")
                    tail -f ubuntu/fittrack_final/backend.log
                    ;;
                "frontend")
                    tail -f ubuntu/fittrack_final/frontend.log
                    ;;
                *)
                    echo "Use: $0 logs [backend|frontend]"
                    ;;
            esac
            ;;
        *)
            check_env_file
            start_services
            
            echo
            log "Aguardando 15 segundos para serviços estabilizarem..."
            sleep 15
            
            start_backend_dev
            sleep 5
            start_frontend_dev
            
            echo
            success "Ambiente de desenvolvimento iniciado!"
            show_urls
            
            echo
            echo "💡 Comandos úteis:"
            echo "  $0 stop           - Parar todos os serviços"
            echo "  $0 status         - Ver status dos serviços"
            echo "  $0 logs backend   - Ver logs do backend"
            echo "  $0 logs frontend  - Ver logs do frontend"
            ;;
    esac
}

# Executar função principal
main "$@" 