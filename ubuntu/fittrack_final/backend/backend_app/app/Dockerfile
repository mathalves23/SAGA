# Multi-stage build para otimizar o tamanho da imagem
FROM maven:3.8.6-openjdk-17-slim AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas pom.xml primeiro (cache de layers)
COPY pom.xml .

# Baixar dependências (será cacheado se pom.xml não mudar)
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar aplicação
RUN mvn clean package -DskipTests

# Imagem final
FROM openjdk:17-jre-slim

# Instalar dependências necessárias
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root para segurança
RUN adduser --disabled-password --gecos '' appuser

# Definir diretório de trabalho
WORKDIR /app

# Copiar JAR da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Criar diretório para logs
RUN mkdir -p /app/logs && chown -R appuser:appuser /app

# Mudar para usuário não-root
USER appuser

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Configurar JVM para containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Comando para executar a aplicação
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 