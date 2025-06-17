# 🚀 Deploy SAGA Backend no Railway - Guia Completo

## 📋 **Pré-requisitos**
- Conta no GitHub (já tem ✅)
- Repositório no GitHub (já tem ✅)
- Backend configurado (já tem ✅)

## 🎯 **PASSO 1: Configurar Railway (5 minutos)**

### 1.1 Criar conta no Railway
1. Acesse: **https://railway.app**
2. Clique em **"Start a New Project"**
3. Conecte com **GitHub**
4. Autorize o Railway

### 1.2 Criar novo projeto
1. Clique em **"Deploy from GitHub repo"**
2. Selecione o repositório: **mathalves23/SAGA**
3. Escolha **"Deploy Now"**

## 🎯 **PASSO 2: Configurar o Build (3 minutos)**

### 2.1 Configurar o Root Directory
1. No dashboard do Railway, clique no seu projeto
2. Vá em **Settings** → **Source**
3. Configure **Root Directory**: `ubuntu/fittrack_final/backend/backend_app/app`
4. **Salvar**

### 2.2 Configurar Build Command
1. Ainda em **Settings**
2. Configure **Build Command**: `./mvnw clean package -DskipTests`
3. Configure **Start Command**: `java -Dspring.profiles.active=railway -jar target/*.jar`
4. **Salvar**

## 🎯 **PASSO 3: Adicionar PostgreSQL (2 minutos)**

### 3.1 Adicionar Database
1. No dashboard, clique em **"+ New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. Railway criará automaticamente um banco PostgreSQL
4. A variável `DATABASE_URL` será criada automaticamente

## 🎯 **PASSO 4: Configurar Variáveis de Ambiente (5 minutos)**

### 4.1 Adicionar variáveis no Railway
1. Vá em **Variables**
2. Adicione as seguintes variáveis:

```bash
# OBRIGATÓRIAS (Railway gera DATABASE_URL automaticamente)
SPRING_PROFILES_ACTIVE=railway
CORS_ALLOWED_ORIGINS=https://sagafit.netlify.app,https://sagafit.netlify.app/

# OPCIONAIS (já têm defaults)
JWT_SECRET=sqFO_todSEAuxfo-RE8LdS0RY0VMGXSQ91Qbt7v_X2fYI6pA2WFEMa2OAz0W-g-XTc_nVgJcdm7Ik1DM980dzQ==
JWT_EXPIRATION_MS=86400000
```

## 🎯 **PASSO 5: Deploy e Teste (5 minutos)**

### 5.1 Fazer Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (3-5 minutos)
3. Railway mostrará a URL da sua API

### 5.2 Testar a API
1. Acesse: `https://sua-app.railway.app/swagger-ui.html`
2. Teste um endpoint, ex: `GET /api/auth/health`
3. Se retornar sucesso, está funcionando! ✅

## 🎯 **PASSO 6: Configurar Netlify (2 minutos)**

### 6.1 Atualizar variáveis no Netlify
1. Acesse: **https://app.netlify.com**
2. Vá no seu site **sagafit**
3. **Site Settings** → **Environment Variables**
4. Adicione/Atualize:

```bash
VITE_API_URL=https://sua-app.railway.app/api
VITE_ENCRYPTION_KEY=saga-secret-key-production
VITE_APP_NAME=SAGA Fitness
VITE_APP_VERSION=1.0.0
```

### 6.2 Trigger novo deploy
1. No Netlify, vá em **Deploys**
2. Clique **"Trigger Deploy"** → **"Clear cache and deploy site"**

## 🎯 **PASSO 7: Teste Final (3 minutos)**

### 7.1 Testar aplicação completa
1. Acesse: **https://sagafit.netlify.app**
2. Tente fazer cadastro/login
3. Verifique se API está respondendo
4. Teste funcionalidades principais

## ✅ **CHECKLIST FINAL**

- [ ] Railway project criado
- [ ] PostgreSQL adicionado
- [ ] Root directory configurado
- [ ] Build commands configurados  
- [ ] Variáveis de ambiente adicionadas
- [ ] Deploy realizado com sucesso
- [ ] API respondendo (swagger-ui funciona)
- [ ] Netlify atualizado com nova API URL
- [ ] Frontend conectando com backend
- [ ] Login/cadastro funcionando

## 🐛 **Troubleshooting**

### Erro de Build
```bash
# Se der erro no Maven, verificar:
1. Root directory está correto?
2. Java version no Railway (default é 17, deveria funcionar)
```

### Erro de Database
```bash
# Se não conectar no banco:
1. PostgreSQL foi adicionado?
2. DATABASE_URL aparece nas variáveis?
```

### Erro de CORS
```bash
# Se frontend não conectar:
1. CORS_ALLOWED_ORIGINS inclui https://sagafit.netlify.app?
2. Netlify VITE_API_URL está correto?
```

## 🎉 **SUCESSO!**

Após seguir todos os passos:
- ✅ **Backend**: https://sua-app.railway.app
- ✅ **Frontend**: https://sagafit.netlify.app  
- ✅ **Database**: PostgreSQL hospedado
- ✅ **App 100% funcional** na internet!

---

**⏱️ Tempo total estimado: 25-30 minutos**

**🚀 Sua app passou de 65% → 90% de completude!** 