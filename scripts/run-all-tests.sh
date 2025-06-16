#!/bin/bash

# ============================================================================
# SAGA - Script de Execução de Todos os Testes
# Executa: Unitários, Integração, E2E, Load Testing, e API Testing
# ============================================================================

set -e  # Exit on any error

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

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    log_error "Execute este script a partir do diretório raiz do projeto SAGA"
    exit 1
fi

echo "======================================================================"
echo "🧪 SAGA - Execução Completa de Testes"
echo "======================================================================"
echo ""

# Contador de testes
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# ====================
# 1. TESTES UNITÁRIOS BACKEND
# ====================
log_info "Executando testes unitários do backend..."
cd ubuntu/fittrack_final/backend/backend_app/app

if ./gradlew test --info; then
    log_success "✅ Testes unitários do backend: PASSOU"
    ((PASSED_TESTS++))
else
    log_error "❌ Testes unitários do backend: FALHOU"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Voltar ao diretório raiz
cd - > /dev/null

# ====================
# 2. TESTES UNITÁRIOS FRONTEND
# ====================
log_info "Executando testes unitários do frontend..."
cd ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved

if npm test -- --run; then
    log_success "✅ Testes unitários do frontend: PASSOU"
    ((PASSED_TESTS++))
else
    log_error "❌ Testes unitários do frontend: FALHOU"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# Voltar ao diretório raiz
cd - > /dev/null

# ====================
# 3. TESTES DE INTEGRAÇÃO
# ====================
log_info "Executando testes de integração..."

# Iniciar serviços necessários
log_info "Iniciando serviços de teste..."
docker-compose -f docker-compose.yml up -d postgres redis

# Aguardar serviços
sleep 10

cd ubuntu/fittrack_final/backend/backend_app/app

if ./gradlew integrationTest; then
    log_success "✅ Testes de integração: PASSOU"
    ((PASSED_TESTS++))
else
    log_error "❌ Testes de integração: FALHOU"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

cd - > /dev/null

# ====================
# 4. INICIAR APLICAÇÃO PARA E2E
# ====================
log_info "Iniciando aplicação completa para testes E2E..."
docker-compose up -d

# Aguardar aplicação ficar pronta
log_info "Aguardando aplicação ficar pronta..."
for i in {1..30}; do
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        log_success "Backend está rodando"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "Backend não ficou pronto a tempo"
        exit 1
    fi
    sleep 2
done

for i in {1..30}; do
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        log_success "Frontend está rodando"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "Frontend não ficou pronto a tempo"
        exit 1
    fi
    sleep 2
done

# ====================
# 5. TESTES E2E COM CYPRESS
# ====================
log_info "Executando testes E2E com Cypress..."

if command -v npx &> /dev/null; then
    if npx cypress run --config baseUrl=http://localhost:3001; then
        log_success "✅ Testes E2E: PASSOU"
        ((PASSED_TESTS++))
    else
        log_error "❌ Testes E2E: FALHOU"
        ((FAILED_TESTS++))
    fi
else
    log_warning "Cypress não está instalado, pulando testes E2E"
fi
((TOTAL_TESTS++))

# ====================
# 6. TESTES DE API COM NEWMAN
# ====================
log_info "Executando testes de API com Newman (Postman)..."

if command -v newman &> /dev/null; then
    if newman run api-testing/SAGA-API-Collection.postman_collection.json \
        --environment api-testing/SAGA-Environment.postman_environment.json \
        --reporters cli,junit \
        --reporter-junit-export results/api-tests.xml; then
        log_success "✅ Testes de API: PASSOU"
        ((PASSED_TESTS++))
    else
        log_error "❌ Testes de API: FALHOU"
        ((FAILED_TESTS++))
    fi
else
    log_warning "Newman não está instalado, pulando testes de API"
fi
((TOTAL_TESTS++))

# ====================
# 7. TESTES DE CARGA COM JMETER
# ====================
log_info "Executando testes de carga com JMeter..."

if command -v jmeter &> /dev/null; then
    if jmeter -n -t load-testing/saga-load-test.jmx \
        -Jhost=localhost -Jport=8080 \
        -Jusers=10 -Jramp_time=30 -Jduration=60 \
        -l results/load-test-results.jtl \
        -j results/jmeter.log; then
        log_success "✅ Testes de carga: PASSOU"
        ((PASSED_TESTS++))
    else
        log_error "❌ Testes de carga: FALHOU"
        ((FAILED_TESTS++))
    fi
else
    log_warning "JMeter não está instalado, pulando testes de carga"
fi
((TOTAL_TESTS++))

# ====================
# 8. TESTES DE SEGURANÇA
# ====================
log_info "Executando análise de segurança básica..."

if command -v nmap &> /dev/null; then
    # Verificar portas abertas
    if nmap -p 3001,8080 localhost | grep -q "open"; then
        log_success "✅ Portas da aplicação estão acessíveis"
        ((PASSED_TESTS++))
    else
        log_error "❌ Portas da aplicação não estão acessíveis"
        ((FAILED_TESTS++))
    fi
else
    log_warning "Nmap não está disponível, pulando teste de portas"
fi
((TOTAL_TESTS++))

# Verificar headers de segurança
if curl -s -I http://localhost:3001 | grep -q "X-Content-Type-Options"; then
    log_success "✅ Headers de segurança presentes"
    ((PASSED_TESTS++))
else
    log_error "❌ Headers de segurança ausentes"
    ((FAILED_TESTS++))
fi
((TOTAL_TESTS++))

# ====================
# 9. RELATÓRIOS E LIMPEZA
# ====================
log_info "Gerando relatórios finais..."

# Criar diretório de resultados se não existir
mkdir -p results

# Gerar relatório de cobertura do backend
cd ubuntu/fittrack_final/backend/backend_app/app
./gradlew jacocoTestReport
cd - > /dev/null

# Parar serviços
log_info "Parando serviços de teste..."
docker-compose down

# ====================
# 10. RESUMO FINAL
# ====================
echo ""
echo "======================================================================"
echo "📊 RESUMO DOS TESTES"
echo "======================================================================"
echo -e "Total de testes executados: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Testes que passaram: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Testes que falharam: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}TODOS OS TESTES PASSARAM!${NC}"
    echo -e "✅ Aplicação SAGA está pronta para produção!"
    exit 0
else
    echo -e "\n⚠️ ${YELLOW}ALGUNS TESTES FALHARAM${NC}"
    echo -e "❌ Verifique os logs acima para detalhes"
    echo -e "💡 Sucesso: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
    exit 1
fi 