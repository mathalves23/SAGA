#!/bin/bash

# 🚀 Script de Deploy Automático para Netlify - SAGA Fitness

echo "🎯 Iniciando deploy do SAGA Fitness para Netlify..."
echo "=================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório do frontend"
    exit 1
fi

# Verificar se o arquivo .env.production existe
if [ ! -f ".env.production" ]; then
    echo "⚠️  Arquivo .env.production não encontrado!"
    echo "📝 Copiando arquivo de exemplo..."
    cp env.production.example .env.production
    echo "✅ Arquivo .env.production criado!"
    echo "🔧 IMPORTANTE: Edite o arquivo .env.production com suas configurações antes de continuar"
    echo "   - VITE_API_URL: URL do seu backend em produção"
    echo "   - VITE_ENCRYPTION_KEY: Chave de criptografia segura"
    echo "   - VITE_OPENAI_API_KEY: Chave da OpenAI (opcional)"
    read -p "✋ Pressione Enter após configurar o .env.production..."
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf dist node_modules/.vite

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Executar testes de tipo
echo "🔍 Verificando tipos TypeScript..."
npm run type-check

# Build de produção
echo "🏗️  Executando build de produção..."
npm run build:prod

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    echo "❌ Erro: Build falhou!"
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# Verificar se está logado no Netlify
echo "🔐 Verificando login no Netlify..."
netlify status > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "🔑 Fazendo login no Netlify..."
    netlify login
fi

# Deploy
echo "🚀 Fazendo deploy no Netlify..."
netlify deploy --dir=dist --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
    echo "=================================================="
    echo "✅ Sua aplicação está online!"
    echo "🌐 Acesse o Netlify Dashboard para ver a URL"
    echo "📊 Monitore logs e métricas no painel"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. Configure domínio personalizado (opcional)"
    echo "   2. Configure SSL/HTTPS automático"
    echo "   3. Configure analytics"
    echo "   4. Teste todas as funcionalidades"
    echo ""
    echo "🆘 Em caso de problemas:"
    echo "   - Verifique se o backend está online"
    echo "   - Configure CORS no backend"
    echo "   - Verifique variáveis de ambiente"
    echo "=================================================="
else
    echo "❌ Erro durante o deploy!"
    echo "🔍 Verifique os logs acima para mais detalhes"
    exit 1
fi 