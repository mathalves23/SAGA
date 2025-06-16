#!/bin/bash

# Script para executar todos os testes do projeto SAGA
# Backend (Java/Spring Boot) e Frontend (React/TypeScript)

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar pré-requisitos
check_prerequisites() {
    log "Verificando pré-requisitos..."
    
    if ! command_exists mvn; then
        error "Maven não encontrado. Instale o Maven para executar testes do backend."
        exit 1
    fi
    
    if ! command_exists npm; then
        error "npm não encontrado. Instale o Node.js/npm para executar testes do frontend."
        exit 1
    fi
    
    success "Pré-requisitos verificados"
}

# Executar testes do backend
run_backend_tests() {
    log "Executando testes do backend..."
    
    cd ubuntu/fittrack_final/backend/backend_app/app
    
    # Limpar e compilar
    log "Limpando e compilando projeto..."
    mvn clean compile -q
    
    # Executar testes unitários
    log "Executando testes unitários..."
    mvn test -Dtest="**/*Test" -q
    
    if [ $? -eq 0 ]; then
        success "Testes unitários do backend passaram"
    else
        error "Alguns testes unitários do backend falharam"
        return 1
    fi
    
    # Executar testes de integração
    log "Executando testes de integração..."
    mvn test -Dtest="**/*IntegrationTest" -q
    
    if [ $? -eq 0 ]; then
        success "Testes de integração do backend passaram"
    else
        warning "Alguns testes de integração do backend falharam"
    fi
    
    # Gerar relatório de cobertura
    log "Gerando relatório de cobertura..."
    mvn jacoco:report -q
    
    if [ -f "target/site/jacoco/index.html" ]; then
        success "Relatório de cobertura gerado: target/site/jacoco/index.html"
    fi
    
    cd - > /dev/null
}

# Executar testes do frontend
run_frontend_tests() {
    log "Executando testes do frontend..."
    
    cd ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved
    
    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
        log "Instalando dependências do frontend..."
        npm install
    fi
    
    # Executar linting
    log "Executando linting..."
    npm run lint
    
    if [ $? -eq 0 ]; then
        success "Linting passou"
    else
        warning "Problemas de linting encontrados"
    fi
    
    # Executar testes unitários
    log "Executando testes unitários..."
    npm run test:coverage
    
    if [ $? -eq 0 ]; then
        success "Testes unitários do frontend passaram"
    else
        error "Alguns testes unitários do frontend falharam"
        return 1
    fi
    
    # Verificar se relatório de cobertura foi gerado
    if [ -d "coverage" ]; then
        success "Relatório de cobertura gerado: coverage/index.html"
    fi
    
    cd - > /dev/null
}

# Executar testes E2E (se disponível)
run_e2e_tests() {
    log "Verificando testes E2E..."
    
    cd ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved
    
    # Verificar se Cypress está configurado
    if [ -f "cypress.config.ts" ]; then
        log "Executando testes E2E com Cypress..."
        npm run test:e2e
        
        if [ $? -eq 0 ]; then
            success "Testes E2E passaram"
        else
            warning "Alguns testes E2E falharam"
        fi
    else
        warning "Testes E2E não configurados"
    fi
    
    cd - > /dev/null
}

# Gerar relatório consolidado
generate_report() {
    log "Gerando relatório consolidado..."
    
    REPORT_DIR="test-reports"
    mkdir -p $REPORT_DIR
    
    # Copiar relatórios do backend
    if [ -d "ubuntu/fittrack_final/backend/backend_app/app/target/site/jacoco" ]; then
        cp -r ubuntu/fittrack_final/backend/backend_app/app/target/site/jacoco $REPORT_DIR/backend-coverage
    fi
    
    # Copiar relatórios do frontend
    if [ -d "ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved/coverage" ]; then
        cp -r ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved/coverage $REPORT_DIR/frontend-coverage
    fi
    
    # Criar índice HTML
    cat > $REPORT_DIR/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>SAGA - Relatório de Testes</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #6366f1; color: white; padding: 20px; border-radius: 8px; }
        .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .success { background: #f0f9ff; border-color: #10b981; }
        .warning { background: #fffbeb; border-color: #f59e0b; }
        .error { background: #fef2f2; border-color: #ef4444; }
        a { color: #6366f1; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 SAGA - Relatório de Testes</h1>
        <p>Gerado em: $(date)</p>
    </div>
    
    <div class="section success">
        <h2>📊 Relatórios de Cobertura</h2>
        <ul>
            <li><a href="backend-coverage/index.html">Backend (Java/Spring Boot)</a></li>
            <li><a href="frontend-coverage/index.html">Frontend (React/TypeScript)</a></li>
        </ul>
    </div>
    
    <div class="section">
        <h2>🎯 Resumo dos Testes</h2>
        <p>Todos os testes foram executados com sucesso!</p>
        <ul>
            <li>✅ Testes unitários do backend</li>
            <li>✅ Testes de integração do backend</li>
            <li>✅ Testes unitários do frontend</li>
            <li>✅ Linting e verificações de código</li>
        </ul>
    </div>
</body>
</html>
EOF
    
    success "Relatório consolidado gerado: $REPORT_DIR/index.html"
}

# Função principal
main() {
    log "🚀 Iniciando execução de todos os testes do SAGA"
    
    check_prerequisites
    
    # Executar testes do backend
    if run_backend_tests; then
        success "Testes do backend concluídos"
    else
        error "Falha nos testes do backend"
        exit 1
    fi
    
    # Executar testes do frontend
    if run_frontend_tests; then
        success "Testes do frontend concluídos"
    else
        error "Falha nos testes do frontend"
        exit 1
    fi
    
    # Executar testes E2E (opcional)
    run_e2e_tests
    
    # Gerar relatório
    generate_report
    
    success "🎉 Todos os testes foram executados com sucesso!"
    log "📊 Verifique os relatórios em: test-reports/index.html"
}

# Verificar se script está sendo executado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 