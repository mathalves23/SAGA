-- Script de inicialização do PostgreSQL para SAGA
-- Este script cria o usuário e configura as permissões necessárias

-- Criação do usuário saga_user se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'saga_user') THEN
        CREATE USER saga_user WITH PASSWORD 'sua_senha';
    END IF;
END
$$;

-- Garantir que o banco de dados saga existe
SELECT 'CREATE DATABASE saga'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'saga')\gexec

-- Conectar ao banco saga e dar permissões ao usuário
\c saga;

-- Dar permissões completas ao usuário saga_user no banco saga
GRANT ALL PRIVILEGES ON DATABASE saga TO saga_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO saga_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO saga_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO saga_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO saga_user;

-- Dar permissões padrão para futuras tabelas
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO saga_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO saga_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO saga_user; 