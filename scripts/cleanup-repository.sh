#!/bin/bash

# SAGA Fitness - Script de Limpeza do Repositório
# Versão: 1.0.0
# Autor: SAGA Team

set -euo pipefail

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

# Arquivos e diretórios para remover
CLEANUP_PATTERNS=(
    # Arquivos temporários
    "*.tmp"
    "*.temp"
    "*.log"
    "*.cache"
    ".DS_Store"
    "Thumbs.db"
    
    # Node.js
    "node_modules/"
    "npm-debug.log*"
    "yarn-debug.log*"
    "yarn-error.log*"
    ".npm"
    ".yarn-integrity"
    
    # Build outputs
    "build/"
    "dist/"
    "target/"
    "*.class"
    
    # IDE files
    ".vscode/settings.json"
    ".idea/"
    "*.swp"
    "*.swo"
    "*~"
    
    # OS generated files
    ".DS_Store?"
    "._*"
    ".Spotlight-V100"
    ".Trashes"
    "ehthumbs.db"
    
    # Test coverage
    "coverage/"
    ".nyc_output"
    
    # Dependencies que podem ser reinstaladas
    ".gradle/"
    "gradle/"
    
    # Arquivos de backup
    "*.bak"
    "*.backup"
    "*.old"
)

# Diretórios desnecessários para estrutura profissional
UNNECESSARY_DIRS=(
    "data/"
    "assets/"
    "api-testing/"
    "load-testing/"
    "cypress/"
)

# Arquivos desnecessários
UNNECESSARY_FILES=(
    "deploy-to-production.sh"
    "docker-compose.monitoring.yml"
    "cypress.config.ts"
)

# Backup antes da limpeza
create_backup() {
    log_info "Criando backup antes da limpeza..."
    
    BACKUP_DIR="backups/cleanup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Lista de arquivos importantes para backup
    IMPORTANT_FILES=(
        "README.md"
        "SAGA_COMPLETE_FEATURES.md"
        ".gitignore"
        "LICENSE"
        "env.example"
        "init.sql"
        "netlify.toml"
        "NETLIFY_SETUP.md"
        "security-config.md"
        "docker-compose.yml"
    )
    
    for file in "${IMPORTANT_FILES[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$BACKUP_DIR/"
        fi
    done
    
    log_success "Backup criado em $BACKUP_DIR"
}

# Limpar arquivos temporários
clean_temp_files() {
    log_info "Removendo arquivos temporários..."
    
    for pattern in "${CLEANUP_PATTERNS[@]}"; do
        find . -name "$pattern" -type f -delete 2>/dev/null || true
        find . -name "$pattern" -type d -exec rm -rf {} + 2>/dev/null || true
    done
    
    log_success "Arquivos temporários removidos"
}

# Remover diretórios desnecessários
remove_unnecessary_dirs() {
    log_info "Removendo diretórios desnecessários..."
    
    for dir in "${UNNECESSARY_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            log_warning "Removendo diretório: $dir"
            rm -rf "$dir"
        fi
    done
    
    log_success "Diretórios desnecessários removidos"
}

# Remover arquivos desnecessários
remove_unnecessary_files() {
    log_info "Removendo arquivos desnecessários..."
    
    for file in "${UNNECESSARY_FILES[@]}"; do
        if [ -f "$file" ]; then
            log_warning "Removendo arquivo: $file"
            rm -f "$file"
        fi
    done
    
    log_success "Arquivos desnecessários removidos"
}

# Organizar estrutura do projeto
organize_structure() {
    log_info "Organizando estrutura do projeto..."
    
    # Criar diretório docs se não existir
    mkdir -p docs
    
    # Mover documentação para docs/
    if [ -f "SAGA_COMPLETE_FEATURES.md" ]; then
        mv "SAGA_COMPLETE_FEATURES.md" "docs/"
    fi
    
    if [ -f "NETLIFY_SETUP.md" ]; then
        mv "NETLIFY_SETUP.md" "docs/"
    fi
    
    if [ -f "RAILWAY_DEPLOY_GUIDE.md" ]; then
        mv "RAILWAY_DEPLOY_GUIDE.md" "docs/"
    fi
    
    if [ -f "security-config.md" ]; then
        mv "security-config.md" "docs/"
    fi
    
    # Criar diretório scripts se não existir
    mkdir -p scripts
    
    log_success "Estrutura organizada"
}

# Atualizar .gitignore
update_gitignore() {
    log_info "Atualizando .gitignore..."
    
    cat > .gitignore << 'EOL'
# SAGA Fitness - .gitignore Profissional

# Dependências
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Build outputs
/build
/dist
/target
*.class

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/settings.json
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Test coverage
coverage/
.nyc_output
*.lcov

# Logs
logs
*.log
npm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Java
*.class
*.jar
*.war
*.ear
hs_err_pid*

# Maven
target/
.mvn/

# Gradle
.gradle/
build/

# Database
*.db
*.sqlite

# Temporary files
*.tmp
*.temp
*.bak
*.backup
*.old

# Cache directories
.cache/
.parcel-cache/

# Backup files
backups/

# Production builds
/frontend/build
/frontend/dist

# Mobile
SAGA-Mobile/node_modules/
SAGA-Mobile/.expo/
SAGA-Mobile/dist/
EOL
    
    log_success ".gitignore atualizado"
}

# Limpar histórico do Git (opcional)
clean_git_history() {
    log_warning "Esta operação irá limpar o histórico do Git. Continuar? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        log_info "Limpando histórico do Git..."
        
        # Remover histórico
        rm -rf .git
        
        # Inicializar novo repositório
        git init
        git add .
        git commit -m "Initial commit - SAGA Fitness v2.0"
        
        log_success "Histórico do Git limpo"
    else
        log_info "Histórico do Git mantido"
    fi
}

# Verificar tamanho do repositório
check_repo_size() {
    log_info "Verificando tamanho do repositório..."
    
    SIZE=$(du -sh . | cut -f1)
    log_info "Tamanho atual do repositório: $SIZE"
    
    # Contar arquivos
    FILE_COUNT=$(find . -type f | wc -l)
    log_info "Número de arquivos: $FILE_COUNT"
    
    # Listar os maiores arquivos
    log_info "Top 10 maiores arquivos:"
    find . -type f -exec ls -lh {} + | sort -k5 -hr | head -10 | awk '{print $5 " " $9}'
}

# Otimizar arquivos de imagem (se existirem)
optimize_images() {
    log_info "Verificando se há imagens para otimizar..."
    
    # Verificar se imagemagick está instalado
    if command -v convert &> /dev/null; then
        find . -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | while read -r img; do
            if [ -f "$img" ]; then
                # Reduzir qualidade para 85%
                convert "$img" -quality 85 "$img.optimized"
                mv "$img.optimized" "$img"
                log_info "Otimizada: $img"
            fi
        done
        log_success "Imagens otimizadas"
    else
        log_warning "ImageMagick não encontrado, pulando otimização de imagens"
    fi
}

# Verificar dependências do package.json
check_dependencies() {
    log_info "Verificando dependências do projeto..."
    
    # Frontend
    if [ -f "ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved/package.json" ]; then
        cd "ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved"
        
        # Verificar dependências desatualizadas
        if command -v npm &> /dev/null; then
            npm outdated || true
        fi
        
        cd "../../../../../"
    fi
    
    # Mobile
    if [ -f "SAGA-Mobile/package.json" ]; then
        cd "SAGA-Mobile"
        
        if command -v npm &> /dev/null; then
            npm outdated || true
        fi
        
        cd ".."
    fi
}

# Menu principal
show_menu() {
    echo -e "\n${BLUE}=== SAGA Fitness - Limpeza do Repositório ===${NC}"
    echo -e "${GREEN}1.${NC} Limpeza completa (recomendado)"
    echo -e "${GREEN}2.${NC} Limpar apenas arquivos temporários"
    echo -e "${GREEN}3.${NC} Remover diretórios desnecessários"
    echo -e "${GREEN}4.${NC} Organizar estrutura do projeto"
    echo -e "${GREEN}5.${NC} Atualizar .gitignore"
    echo -e "${GREEN}6.${NC} Otimizar imagens"
    echo -e "${GREEN}7.${NC} Verificar dependências"
    echo -e "${GREEN}8.${NC} Verificar tamanho do repositório"
    echo -e "${GREEN}9.${NC} Limpar histórico do Git (perigoso!)"
    echo -e "${GREEN}10.${NC} Sair"
    echo -e "\n${YELLOW}Escolha uma opção:${NC} "
}

# Função principal
main() {
    clear
    log_info "Iniciando limpeza do repositório SAGA Fitness"
    
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1)
                log_info "Iniciando limpeza completa..."
                create_backup
                clean_temp_files
                remove_unnecessary_dirs
                remove_unnecessary_files
                organize_structure
                update_gitignore
                optimize_images
                check_repo_size
                log_success "Limpeza completa concluída!"
                ;;
            2)
                clean_temp_files
                ;;
            3)
                remove_unnecessary_dirs
                ;;
            4)
                organize_structure
                ;;
            5)
                update_gitignore
                ;;
            6)
                optimize_images
                ;;
            7)
                check_dependencies
                ;;
            8)
                check_repo_size
                ;;
            9)
                clean_git_history
                ;;
            10)
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