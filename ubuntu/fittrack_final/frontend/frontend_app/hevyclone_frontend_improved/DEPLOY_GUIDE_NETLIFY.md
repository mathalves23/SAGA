# 🚀 Guia de Deploy - SAGA Fitness no Netlify

## 📋 Pré-requisitos

1. **Conta no Netlify**: [https://netlify.com](https://netlify.com)
2. **Backend hospedado**: O frontend precisa de um backend em produção
3. **Variáveis de ambiente configuradas**

## 🔧 Configuração do Backend

⚠️ **IMPORTANTE**: O Netlify hospeda apenas aplicações frontend. Você precisa hospedar o backend Spring Boot em outra plataforma.

### Opções para o Backend:

1. **Railway** (Recomendado - Fácil e gratuito)
   - Acesse: [https://railway.app](https://railway.app)
   - Conecte seu repositório
   - Configure PostgreSQL automático
   - Deploy automático

2. **Render** (Alternativa gratuita)
   - Acesse: [https://render.com](https://render.com)
   - Conecte seu repositório
   - Configure PostgreSQL
   - Deploy automático

3. **Heroku** (Pago)
   - Acesse: [https://heroku.com](https://heroku.com)
   - Configure Heroku Postgres
   - Deploy via Git

## 🎯 Passos para Deploy no Netlify

### 1. Preparar Variáveis de Ambiente

Copie o arquivo `env.production.example` para `.env.production` e configure:

```bash
# No terminal
cp env.production.example .env.production
```

Edite `.env.production` com as URLs corretas:
```env
VITE_API_URL=https://sua-api-backend-url.com/api
VITE_ENCRYPTION_KEY=sua-chave-secreta-super-segura
VITE_OPENAI_API_KEY=sua-chave-openai-opcional
```

### 2. Deploy Manual

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login no Netlify
netlify login

# Deploy inicial (dentro da pasta do frontend)
netlify deploy --dir=dist --prod

# Ou usar o comando personalizado
npm run deploy:netlify
```

### 3. Deploy Automático via Git

1. **Conectar Repositório**:
   - Acesse o Netlify Dashboard
   - Clique em "New site from Git"
   - Conecte seu repositório GitHub/GitLab

2. **Configurar Build**:
   - **Build command**: `npm ci && npm run build:prod`
   - **Publish directory**: `dist`
   - **Base directory**: `frontend/frontend_app/hevyclone_frontend_improved`

3. **Configurar Variáveis de Ambiente**:
   - Vá em Site Settings → Environment Variables
   - Adicione as variáveis:
     ```
     VITE_API_URL=https://sua-api-backend-url.com/api
     VITE_ENCRYPTION_KEY=sua-chave-secreta
     VITE_OPENAI_API_KEY=sua-chave-openai
     NODE_VERSION=18
     NPM_VERSION=9
     CI=true
     ```

## 🔒 Configurações de Segurança

O arquivo `netlify.toml` já inclui:
- Headers de segurança (CSP, XSS Protection, etc.)
- Cache otimizado para assets
- Redirecionamento SPA

## 🌐 Configuração CORS do Backend

⚠️ **CRITICAL**: Configure o CORS no backend para aceitar seu domínio do Netlify:

```properties
# application.properties (Backend)
cors.allowed-origins=https://seu-app.netlify.app,http://localhost:3001
```

## ✅ Checklist Final

- [ ] Backend hospedado e funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado no backend
- [ ] Build local funciona (`npm run build:prod`)
- [ ] Deploy realizado no Netlify
- [ ] Teste funcionalidades principais
- [ ] Configurar domínio personalizado (opcional)

## 🐛 Resolução de Problemas

### Erro 404 em rotas
- Verifique se o redirecionamento SPA está configurado no `netlify.toml`

### Erro de CORS
- Configure `cors.allowed-origins` no backend com o domínio do Netlify

### Build falha
- Verifique se todas as dependências estão no `package.json`
- Confirme que o Node.js e npm estão na versão correta

### API não responde
- Verifique se `VITE_API_URL` está correto
- Confirme que o backend está online
- Teste as rotas da API diretamente

## 📞 Próximos Passos

1. **Configurar domínio personalizado**
2. **Configurar SSL/HTTPS automático**
3. **Configurar analytics**
4. **Configurar monitoring de erros**
5. **Configurar CI/CD com GitHub Actions**

---

## 🚀 Deploy Rápido

```bash
# 1. Configurar variáveis de ambiente
cp env.production.example .env.production
# Editar .env.production com suas URLs

# 2. Build de produção
npm run build:prod

# 3. Deploy no Netlify
npm run deploy:netlify
```

**🎉 Sua aplicação estará online em poucos minutos!** 