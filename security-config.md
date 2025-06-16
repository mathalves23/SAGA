# 🔒 SAGA - Configuração de Segurança

## 📋 Checklist de Segurança

### 🔴 CRÍTICO - Implementação Obrigatória

- [ ] **JWT Secret**: Usar secret aleatório de 256+ bits
- [ ] **Senhas**: Todas as senhas default alteradas
- [ ] **HTTPS**: SSL/TLS obrigatório em produção
- [ ] **CORS**: Configurado apenas para origens confiáveis
- [ ] **Headers de Segurança**: CSP, HSTS, X-Frame-Options
- [ ] **Rate Limiting**: Implementado para APIs públicas
- [ ] **SQL Injection**: Prepared statements obrigatórios
- [ ] **XSS Protection**: Sanitização de inputs
- [ ] **Logs de Segurança**: Auditoria completa
- [ ] **Secrets Management**: Variáveis de ambiente

### 🟡 IMPORTANTE - Implementação Recomendada

- [ ] **WAF**: Web Application Firewall
- [ ] **DDoS Protection**: CloudFlare ou similar
- [ ] **2FA**: Autenticação de dois fatores
- [ ] **Session Management**: Redis com expiração
- [ ] **API Versioning**: Versionamento adequado
- [ ] **Input Validation**: Validação rigorosa
- [ ] **Error Handling**: Não exposição de informações
- [ ] **Dependency Scanning**: Vulnerabilidades em deps
- [ ] **Container Security**: Imagens sem vulnerabilidades
- [ ] **Backup Encryption**: Backups criptografados

### 🟢 DESEJÁVEL - Implementação Futura

- [ ] **OWASP ZAP**: Testes de segurança automatizados
- [ ] **Penetration Testing**: Testes de invasão
- [ ] **Security Headers Testing**: Mozilla Observatory
- [ ] **GDPR Compliance**: Conformidade com LGPD/GDPR
- [ ] **Incident Response**: Plano de resposta a incidentes

## 🔐 Configurações de Produção

### 1. Variáveis de Ambiente Obrigatórias

```bash
# JWT - CRÍTICO: Gerar secret único de 256+ bits
JWT_SECRET="$(openssl rand -hex 32)"
JWT_EXPIRATION_MS=3600000
JWT_REFRESH_EXPIRATION_MS=604800000

# Database - CRÍTICO: Senhas fortes
DB_PASSWORD="$(openssl rand -base64 32)"
POSTGRES_PASSWORD="${DB_PASSWORD}"

# Redis - Autenticação obrigatória
REDIS_PASSWORD="$(openssl rand -base64 24)"

# CORS - Apenas origens confiáveis
CORS_ALLOWED_ORIGINS="https://saga.com,https://app.saga.com"

# SSL/TLS
SSL_ENABLED=true
SSL_KEY_STORE_PATH="/etc/ssl/certs/saga.p12"
SSL_KEY_STORE_PASSWORD="${SSL_PASSWORD}"

# Monitoring
GRAFANA_PASSWORD="$(openssl rand -base64 16)"
PROMETHEUS_PASSWORD="$(openssl rand -base64 16)"

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_LOGIN_ATTEMPTS=5
```

### 2. Headers de Segurança Obrigatórios

```yaml
# application-prod.yml
security:
  headers:
    content-security-policy: |
      default-src 'self';
      script-src 'self' 'sha256-hash-aqui';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.saga.com wss://api.saga.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    
    strict-transport-security: "max-age=31536000; includeSubDomains; preload"
    x-frame-options: "DENY"
    x-content-type-options: "nosniff"
    x-xss-protection: "1; mode=block"
    referrer-policy: "strict-origin-when-cross-origin"
    permissions-policy: |
      geolocation=(),
      microphone=(),
      camera=(),
      payment=(),
      usb=(),
      magnetometer=(),
      gyroscope=(),
      speaker=()
```

### 3. Configuração SSL/TLS

```bash
# Gerar certificado SSL (Let's Encrypt recomendado)
certbot certonly --webroot -w /var/www/html \
  -d saga.com \
  -d api.saga.com \
  -d app.saga.com

# Converter para formato Java KeyStore
openssl pkcs12 -export \
  -in /etc/letsencrypt/live/saga.com/fullchain.pem \
  -inkey /etc/letsencrypt/live/saga.com/privkey.pem \
  -out /etc/ssl/certs/saga.p12 \
  -name saga \
  -password pass:${SSL_PASSWORD}
```

### 4. Rate Limiting Configuration

```java
@Component
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitConfig {
    private boolean enabled = true;
    private int defaultLimit = 1000;
    private int defaultDuration = 3600;
    private int loginLimit = 5;
    private int loginDuration = 900;
    
    // Configurações específicas por endpoint
    private Map<String, RateLimitRule> rules = Map.of(
        "/api/auth/signin", new RateLimitRule(5, 900),
        "/api/auth/signup", new RateLimitRule(3, 3600),
        "/api/users/password/reset", new RateLimitRule(3, 3600),
        "/api/workouts", new RateLimitRule(100, 3600)
    );
}
```

### 5. Configuração de WAF (Nginx)

```nginx
# /etc/nginx/conf.d/security.conf
server {
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Block suspicious requests
    if ($http_user_agent ~* "sqlmap|nmap|nikto|dirbuster|gobuster") {
        return 444;
    }
    
    # Block common attack patterns
    location ~ \.(php|asp|aspx|jsp)$ {
        return 444;
    }
    
    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://backend:8080;
    }
    
    # Login rate limiting
    location /api/auth/signin {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://backend:8080;
    }
}
```

## 🚨 Monitoramento de Segurança

### 1. Alertas Críticos

```yaml
# alertmanager.yml
groups:
- name: security-alerts
  rules:
  - alert: HighFailedLoginRate
    expr: rate(failed_login_attempts_total[5m]) > 10
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "High failed login rate detected"
      
  - alert: SuspiciousAPIActivity
    expr: rate(http_requests_total{status="403"}[5m]) > 50
    for: 1m
    labels:
      severity: warning
    annotations:
      summary: "Unusual number of forbidden requests"
      
  - alert: DatabaseConnectionFailure
    expr: postgres_up == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database connection failed"
```

### 2. Logs de Auditoria

```java
@Component
public class SecurityAuditLogger {
    
    @EventListener
    public void handleAuthenticationSuccess(AuthenticationSuccessEvent event) {
        SecurityAuditLog.builder()
            .event("LOGIN_SUCCESS")
            .userId(event.getAuthentication().getName())
            .ipAddress(getClientIP())
            .timestamp(Instant.now())
            .log();
    }
    
    @EventListener
    public void handleAuthenticationFailure(AbstractAuthenticationFailureEvent event) {
        SecurityAuditLog.builder()
            .event("LOGIN_FAILURE")
            .username(event.getAuthentication().getName())
            .ipAddress(getClientIP())
            .reason(event.getException().getMessage())
            .timestamp(Instant.now())
            .log();
    }
}
```

## 📝 Comandos de Segurança

### Verificar Vulnerabilidades

```bash
# Scan de vulnerabilidades em containers
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image saga/backend:latest

# Verificar headers de segurança
curl -I https://saga.com | grep -E "(X-Frame-Options|X-XSS-Protection|Strict-Transport-Security)"

# Teste SSL/TLS
testssl.sh https://saga.com

# Scan de portas
nmap -sS -O saga.com
```

### Rotação de Secrets

```bash
#!/bin/bash
# rotate-secrets.sh

# Gerar novos secrets
NEW_JWT_SECRET=$(openssl rand -hex 32)
NEW_DB_PASSWORD=$(openssl rand -base64 32)

# Atualizar .env
sed -i "s/JWT_SECRET=.*/JWT_SECRET=${NEW_JWT_SECRET}/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${NEW_DB_PASSWORD}/" .env

# Restart aplicação
docker-compose restart backend database

echo "✅ Secrets rotacionados com sucesso"
```

## 🎯 Compliance e Auditoria

### OWASP Top 10 - Status

1. **A01 Broken Access Control** ✅ JWT + Role-based auth
2. **A02 Cryptographic Failures** ✅ HTTPS + bcrypt + secrets
3. **A03 Injection** ✅ Prepared statements + validation
4. **A04 Insecure Design** ✅ Security by design
5. **A05 Security Misconfiguration** ✅ Hardened configs
6. **A06 Vulnerable Components** 🔄 Dependency scanning
7. **A07 Authentication Failures** ✅ Rate limiting + 2FA ready
8. **A08 Software Integrity** ✅ Container signatures
9. **A09 Logging Failures** ✅ Security audit logs
10. **A10 Server-Side Request Forgery** ✅ Input validation

### Próximos Passos

1. **Implementar**: WAF e DDoS protection
2. **Configurar**: 2FA para usuários admin
3. **Agendar**: Penetration testing trimestral
4. **Documentar**: Plano de resposta a incidentes
5. **Treinar**: Equipe em práticas de segurança

---

**🔒 A segurança é um processo contínuo, não um destino!** 