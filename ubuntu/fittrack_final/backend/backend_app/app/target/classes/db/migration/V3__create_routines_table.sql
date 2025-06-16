-- V1__create_routines_table.sql

CREATE TABLE routines (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_weeks INTEGER,
    division VARCHAR(255) NOT NULL,
    target_profile_level VARCHAR(255) -- Mapeado do Enum UserProfileLevel
);

