# 🚀 Configuração do Netlify para SAGA Fitness

## ⚠️ Problema Identificado
O deploy estava sendo feito do repositório inteiro, mas a aplicação web está localizada em uma subpasta específica. 

## 📁 Estrutura do Projeto
```
SAGA/
├── netlify.toml (✅ CRIADO - configuração na raiz)
├── ubuntu/
    └── fittrack_final/
        └── frontend/
            └── frontend_app/
                └── hevyclone_frontend_improved/  ← Aplicação React
                    ├── src/
                    ├── dist/
                    ├── package.json
                    └── netlify.toml (configuração local)
```

## 🔧 Configuração Correta no Netlify

### 1. Configuração Automática (Recomendado)
O arquivo `netlify.toml` na raiz já está configurado corretamente com:
- **Base directory**: `ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved`
- **Build command**: `npm ci && npm run build:prod`
- **Publish directory**: `ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved/dist`

### 2. Configuração Manual no Dashboard
Se precisar configurar manualmente no dashboard do Netlify:

1. **Site Settings** → **Build & Deploy** → **Build Settings**
2. Configure:
   - **Base directory**: `ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved`
   - **Build command**: `npm ci && npm run build:prod`
   - **Publish directory**: `ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved/dist`

### 3. Variáveis de Ambiente
Adicione no **Site Settings** → **Environment Variables**:
```
VITE_API_URL=https://sua-api-backend-url.com/api
VITE_ENCRYPTION_KEY=saga-secret-key-production
VITE_APP_NAME=SAGA Fitness
VITE_APP_VERSION=1.0.0
NODE_VERSION=18
NPM_VERSION=9
CI=true
```

## 🚀 Como Aplicar a Correção

### Opção 1: Trigger Novo Deploy
1. Faça push deste commit para o GitHub
2. O Netlify detectará o `netlify.toml` e fará novo deploy automaticamente

### Opção 2: Deploy Manual
```bash
# Na pasta da aplicação
cd ubuntu/fittrack_final/frontend/frontend_app/hevyclone_frontend_improved

# Build de produção
npm ci && npm run build:prod

# Deploy via CLI (se tiver netlify-cli instalado)
netlify deploy --prod --dir=dist
```

## ✅ Verificações Pós-Deploy
- [ ] Site carrega em https://sagafit.netlify.app
- [ ] Rotas SPA funcionam (refresh na página não dá 404)
- [ ] Assets estáticos carregam corretamente
- [ ] Console do navegador sem erros críticos
- [ ] Funcionalidades principais funcionam

## 🐛 Resolução de Problemas Comuns

### Erro "Page not found"
- Verifique se o `netlify.toml` está na raiz do repositório
- Confirme que o **Base directory** está correto

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme que o Node.js está na versão 18

### Aplicação carrega mas funciona parcialmente
- Configure as variáveis de ambiente no Netlify
- Verifique se o backend está funcionando
- Configure CORS no backend para aceitar o domínio do Netlify

## 📞 Próximos Passos
1. Configurar backend em produção (Railway, Render, etc.)
2. Configurar variáveis de ambiente
3. Testar funcionalidades completas
4. Configurar domínio personalizado (opcional)

---
**Status**: ✅ Configuração corrigida - Ready for deploy! 