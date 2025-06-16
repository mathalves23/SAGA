-- schema.sql
-- Script SQL completo para PostgreSQL
-- Convertido de MySQL para PostgreSQL para o banco de dados SAGA
-- Data: 21/05/2025

-- Criação das tabelas

-- 1. Usuários (users)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  bio TEXT,
  profile_image_url VARCHAR(255),
  date_of_birth DATE
);

-- 2. Tags (tags)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

-- 3. Níveis de Dificuldade (difficulty_levels)
CREATE TABLE difficulty_levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

-- 4. Equipamentos (equipment)
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

-- 5. Tipos de Exercício (exercise_types)
CREATE TABLE exercise_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

-- 6. Grupos Musculares (muscle_groups)
CREATE TABLE muscle_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  body_region VARCHAR(20) NOT NULL
);

-- 7. Tabela de Exercícios (exercises)
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,
  tips TEXT,
  primary_muscle_group_id INT NOT NULL,
  secondary_muscle_group_id INT,
  difficulty_level_id INT NOT NULL,
  equipment_id INT NOT NULL,
  exercise_type_id INT NOT NULL,
  secondary_muscle_groups TEXT,
  video_url TEXT,
  FOREIGN KEY (primary_muscle_group_id) REFERENCES muscle_groups(id),
  FOREIGN KEY (secondary_muscle_group_id) REFERENCES muscle_groups(id),
  FOREIGN KEY (difficulty_level_id) REFERENCES difficulty_levels(id),
  FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  FOREIGN KEY (exercise_type_id) REFERENCES exercise_types(id)
);

-- 8. Rotinas (routines)
CREATE TABLE routines (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  creator_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- 9. Associação Rotina ⇄ Exercício (routine_exercises)
CREATE TABLE routine_exercises (
  id SERIAL PRIMARY KEY,
  routine_id INT NOT NULL,
  exercise_id INT NOT NULL,
  position INT NOT NULL,
  sets INT,
  reps INT,
  rest_seconds INT,
  FOREIGN KEY (routine_id) REFERENCES routines(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- 10. Treinos (workouts)
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  routine_id INT,
  date date NOT NULL,
  duration_minutes INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (routine_id) REFERENCES routines(id)
);

-- 11. Favoritos (favorites)
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  exercise_id INT,
  routine_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (routine_id) REFERENCES routines(id)
);

-- 12. Tags em Exercícios (exercise_tags)
CREATE TABLE exercise_tags (
  id SERIAL PRIMARY KEY,
  exercise_id INT NOT NULL,
  tag_id INT NOT NULL,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- 13. Reações (reactions)
CREATE TABLE reactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  workout_id INT,
  routine_id INT,
  comment_id INT,
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (workout_id) REFERENCES workouts(id),
  FOREIGN KEY (routine_id) REFERENCES routines(id),
  FOREIGN KEY (comment_id) REFERENCES comments(id)
);

-- 14. Progresso do Usuário (user_progress)
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  exercise_id INT NOT NULL,
  achieved_on DATE NOT NULL,
  value FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- 15. Recordes Pessoais (personal_records)
CREATE TABLE personal_records (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  exercise_id INT NOT NULL,
  record_value FLOAT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- 16. Comentários (comments)
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  workout_id INT,
  routine_id INT,
  parent_comment_id INT,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (workout_id) REFERENCES workouts(id),
  FOREIGN KEY (routine_id) REFERENCES routines(id),
  FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
);

-- 17. Desafios (challenges)
CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  creator_id INT NOT NULL,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- 18. Progresso em Desafios (challenge_progress)
CREATE TABLE challenge_progress (
  id SERIAL PRIMARY KEY,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  progress_value FLOAT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Função de trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON routines
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_records_updated_at BEFORE UPDATE ON personal_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices de performance
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_exercise ON favorites(exercise_id);
CREATE INDEX idx_favorites_routine ON favorites(routine_id);
CREATE INDEX idx_exercise_tags_exercise ON exercise_tags(exercise_id);
CREATE INDEX idx_exercise_tags_tag ON exercise_tags(tag_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_workout ON comments(workout_id);
CREATE INDEX idx_comments_routine ON comments(routine_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_reactions_user ON reactions(user_id);
CREATE INDEX idx_reactions_workout ON reactions(workout_id);
CREATE INDEX idx_reactions_routine ON reactions(routine_id);
CREATE INDEX idx_reactions_comment ON reactions(comment_id);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_exercise ON user_progress(exercise_id);
CREATE INDEX idx_personal_records_user ON personal_records(user_id);
CREATE INDEX idx_personal_records_exercise ON personal_records(exercise_id);
CREATE INDEX idx_challenges_creator ON challenges(creator_id);
CREATE INDEX idx_challenge_progress_challenge ON challenge_progress(challenge_id);
CREATE INDEX idx_challenge_progress_user ON challenge_progress(user_id);
