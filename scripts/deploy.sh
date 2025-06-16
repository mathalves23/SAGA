#!/bin/bash

# Script de build e deploy
# SAGA Deployment Script

echo "🏋️ SAGA - Script de Deploy"
echo "================================"

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

# Verificar ambiente
check_environment() {
    log "Verificando ambiente..."
    
    if [ ! -f ".env" ]; then
        error "Arquivo .env não encontrado. Execute ./scripts/dev-setup.sh primeiro"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado"
        exit 1
    fi
    
    success "Ambiente verificado"
}

# Executar testes
run_tests() {
    log "Executando testes..."
    
    # Testes do backend
    log "Executando testes do backend..."
    cd ubuntu/fittrack_final/backend/backend_app/app
    
    if command -v mvn &> /dev/null; then
        mvn test -q
        if [ $? -eq 0 ]; then
            success "Testes do backend passaram"
        else
            warning "Alguns testes do backend falharam, mas continuando..."
        fi
    else
        warning "Maven não encontrado, pulando testes do backend"
    fi
    
    cd - > /dev/null
    
    # Testes do frontend
    log "Executando testes do frontend..."
    cd ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved
    
    if command -v npm &> /dev/null; then
        if [ -f "package.json" ] && grep -q '"test"' package.json; then
            npm test -- --run > /dev/null 2>&1
            if [ $? -eq 0 ]; then
                success "Testes do frontend passaram"
            else
                warning "Alguns testes do frontend falharam, mas continuando..."
            fi
        else
            warning "Scripts de teste do frontend não configurados"
        fi
    else
        warning "npm não encontrado, pulando testes do frontend"
    fi
    
    cd - > /dev/null
}

# Build das imagens Docker
build_images() {
    log "Fazendo build das imagens Docker..."
    
    # Parar containers existentes
    docker-compose down 2>/dev/null
    
    # Build das imagens
    docker-compose build --no-cache
    
    if [ $? -eq 0 ]; then
        success "Build das imagens concluído"
    else
        error "Falha no build das imagens"
        exit 1
    fi
}

# Deploy para desenvolvimento
deploy_dev() {
    log "Fazendo deploy para desenvolvimento..."
    
    # Iniciar todos os serviços
    docker-compose up -d
    
    # Aguardar serviços ficarem prontos
    log "Aguardando serviços ficarem prontos..."
    sleep 30
    
    # Verificar se serviços estão rodando
    if docker-compose ps | grep -q "Up"; then
        success "Deploy de desenvolvimento concluído"
        
        echo
        echo "🌐 Aplicação disponível em:"
        echo "Frontend: http://localhost"
        echo "Backend API: http://localhost:8080"
        echo "API Docs: http://localhost:8080/swagger-ui.html"
        
    else
        error "Falha no deploy - alguns serviços não iniciaram"
        docker-compose logs
        exit 1
    fi
}

# Deploy para produção
deploy_prod() {
    log "Preparando deploy para produção..."
    
    # Verificar se variáveis de produção estão configuradas
    if ! grep -q "SPRING_PROFILES_ACTIVE=prod" .env; then
        warning "Profile não está configurado como 'prod' no arquivo .env"
    fi
    
    # Criar arquivo docker-compose.prod.yml
    log "Criando configuração de produção..."
    
    cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  database:
    restart: always
    environment:
      POSTGRES_DB: saga
      POSTGRES_USER: saga_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports: []
    networks:
      - internal

  redis:
    restart: always
    volumes:
      - redis_data:/data
    ports: []
    networks:
      - internal

  backend:
    restart: always
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://database:5432/saga
      SPRING_DATASOURCE_USERNAME: saga_user
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      SPRING_REDIS_HOST: redis
      SPRING_REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET}
      CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS}
    volumes:
      - backend_logs:/app/logs
    ports: []
    networks:
      - internal
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(\`api.saga.com\`)"
      - "traefik.http.services.backend.loadbalancer.server.port=8080"

  frontend:
    restart: always
    ports:
      - "80:80"
      - "443:443"
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(\`fittrack.com\`)"
      - "traefik.http.services.frontend.loadbalancer.server.port=80"

volumes:
  postgres_data:
  redis_data:
  backend_logs:

networks:
  internal:
    driver: bridge
  web:
    external: true
EOF

    # Deploy com configuração de produção
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    
    success "Deploy de produção iniciado"
    
    echo
    echo "🎉 Deploy de produção concluído!"
    echo "📋 Verifique os logs com: docker-compose logs"
    echo "📊 Status dos serviços: docker-compose ps"
}

# Mostrar status
show_status() {
    echo
    echo "📊 Status dos Serviços"
    echo "====================="
    
    docker-compose ps
    
    echo
    echo "💾 Uso de recursos:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

# Backup do banco de dados
backup_database() {
    log "Fazendo backup do banco de dados..."
    
    BACKUP_DIR="backups"
    BACKUP_FILE="fittrack_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    mkdir -p $BACKUP_DIR
    
    docker-compose exec -T database pg_dump -U fittrack_user fittrack > "$BACKUP_DIR/$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        success "Backup criado: $BACKUP_DIR/$BACKUP_FILE"
    else
        error "Falha ao criar backup"
        exit 1
    fi
}

# Função principal
main() {
    case "$1" in
        "dev")
            check_environment
            run_tests
            build_images
            deploy_dev
            ;;
        "prod")
            check_environment
            run_tests
            build_images
            deploy_prod
            ;;
        "test")
            check_environment
            run_tests
            ;;
        "build")
            check_environment
            build_images
            ;;
        "status")
            show_status
            ;;
        "backup")
            backup_database
            ;;
        "stop")
            log "Parando todos os serviços..."
            docker-compose down
            success "Serviços parados"
            ;;
        *)
            echo "Uso: $0 {dev|prod|test|build|status|backup|stop}"
            echo
            echo "Comandos:"
            echo "  dev     - Deploy para desenvolvimento"
            echo "  prod    - Deploy para produção"
            echo "  test    - Executar apenas testes"
            echo "  build   - Build das imagens Docker"
            echo "  status  - Mostrar status dos serviços"
            echo "  backup  - Fazer backup do banco de dados"
            echo "  stop    - Parar todos os serviços"
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@" 