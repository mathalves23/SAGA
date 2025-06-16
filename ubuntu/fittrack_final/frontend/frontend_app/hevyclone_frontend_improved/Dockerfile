# Multi-stage build
FROM node:18-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Imagem final com Nginx
FROM nginx:alpine

# Copiar configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos build do React
COPY --from=build /app/dist /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Comando para executar Nginx
CMD ["nginx", "-g", "daemon off;"] 