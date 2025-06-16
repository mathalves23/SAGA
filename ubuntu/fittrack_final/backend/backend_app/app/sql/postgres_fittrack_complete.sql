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
  date_of_birth DATE,
  gender VARCHAR(20),
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Grupos Musculares (muscle_groups)
CREATE TABLE muscle_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  body_region VARCHAR(20) NOT NULL
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
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- 5. Tipos de Exercício (exercise_types)
CREATE TABLE exercise_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

-- 6. Exercícios (exercises)
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  primary_muscle_group_id INT NOT NULL,
  secondary_muscle_group_id INT,
  difficulty_level_id INT,
  equipment_id INT,
  exercise_type_id INT,
  tips TEXT,
  secondary_muscle_groups TEXT,
  instructions TEXT,
  video_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (primary_muscle_group_id) REFERENCES muscle_groups(id),
  FOREIGN KEY (secondary_muscle_group_id) REFERENCES muscle_groups(id),
  FOREIGN KEY (difficulty_level_id) REFERENCES difficulty_levels(id),
  FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  FOREIGN KEY (exercise_type_id) REFERENCES exercise_types(id)
);

-- 7. Imagens de Exercícios (exercise_images)
CREATE TABLE exercise_images (
  id SERIAL PRIMARY KEY,
  exercise_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- 8. Rotinas (routines)
CREATE TABLE routines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  creator_id INT,
  is_public BOOLEAN DEFAULT FALSE,
  difficulty_level_id INT,
  duration_weeks INT,
  frequency_per_week INT,
  goal VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id),
  FOREIGN KEY (difficulty_level_id) REFERENCES difficulty_levels(id)
);

-- 9. Exercícios da Rotina (routine_exercises)
CREATE TABLE routine_exercises (
  id SERIAL PRIMARY KEY,
  routine_id INT NOT NULL,
  exercise_id INT NOT NULL,
  day_number INT NOT NULL,
  sets INT NOT NULL,
  reps VARCHAR(50) NOT NULL,
  rest_time INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (routine_id) REFERENCES routines(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- 10. Treinos (workouts)
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  routine_id INT,
  name VARCHAR(100),
  date TIMESTAMP NOT NULL,
  duration INT,
  notes TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (routine_id) REFERENCES routines(id)
);

-- 11. Exercícios do Treino (workout_exercises)
CREATE TABLE workout_exercises (
  id SERIAL PRIMARY KEY,
  workout_id INT NOT NULL,
  exercise_id INT NOT NULL,
  order_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workout_id) REFERENCES workouts(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- 12. Séries (sets)
CREATE TABLE sets (
  id SERIAL PRIMARY KEY,
  workout_exercise_id INT NOT NULL,
  set_number INT NOT NULL,
  weight DECIMAL(6,2),
  reps INT,
  duration INT,
  distance DECIMAL(6,2),
  is_completed BOOLEAN DEFAULT FALSE,
  is_warmup BOOLEAN DEFAULT FALSE,
  is_failure BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id)
);

-- 13. Favoritos (favorites)
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

-- 14. Tags (tags)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Tags de Exercícios (exercise_tags)
CREATE TABLE exercise_tags (
  id SERIAL PRIMARY KEY,
  exercise_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
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

-- 17. Reações (reactions)
CREATE TABLE reactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  workout_id INT,
  routine_id INT,
  comment_id INT,
  emoji VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (workout_id) REFERENCES workouts(id),
  FOREIGN KEY (routine_id) REFERENCES routines(id),
  FOREIGN KEY (comment_id) REFERENCES comments(id)
);

-- 18. Conquistas (achievements)
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon_url VARCHAR(255) NOT NULL,
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. Conquistas do Usuário (user_achievements)
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  achievement_id INT NOT NULL,
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);

-- 20. Desafios (challenges)
CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  creator_id INT NOT NULL,
  opponent_id INT NOT NULL,
  exercise_id INT,
  goal_type VARCHAR(50) NOT NULL,
  goal_value INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'declined')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id),
  FOREIGN KEY (opponent_id) REFERENCES users(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- 21. Progresso do Usuário (user_progress)
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  weight DECIMAL(5,2),
  body_fat DECIMAL(4,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 22. Recordes Pessoais (personal_records)
CREATE TABLE personal_records (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  exercise_id INT NOT NULL,
  record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('weight', 'reps', 'volume', 'time', 'distance')),
  record_value DECIMAL(10,2) NOT NULL,
  achieved_at TIMESTAMP NOT NULL,
  workout_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (workout_id) REFERENCES workouts(id)
);

-- Criação de índices recomendados
CREATE INDEX idx_exercises_primary_muscle_group ON exercises(primary_muscle_group_id);
CREATE INDEX idx_exercises_difficulty_level ON exercises(difficulty_level_id);
CREATE INDEX idx_exercises_equipment ON exercises(equipment_id);
CREATE INDEX idx_exercises_exercise_type ON exercises(exercise_type_id);
CREATE INDEX idx_exercise_images_exercise ON exercise_images(exercise_id);
CREATE INDEX idx_routine_exercises_routine ON routine_exercises(routine_id);
CREATE INDEX idx_routine_exercises_exercise ON routine_exercises(exercise_id);
CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise ON workout_exercises(exercise_id);
CREATE INDEX idx_sets_workout_exercise ON sets(workout_exercise_id);
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
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_challenges_creator ON challenges(creator_id);
CREATE INDEX idx_challenges_opponent ON challenges(opponent_id);
CREATE INDEX idx_challenges_exercise ON challenges(exercise_id);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_personal_records_user ON personal_records(user_id);
CREATE INDEX idx_personal_records_exercise ON personal_records(exercise_id);
CREATE INDEX idx_personal_records_workout ON personal_records(workout_id);

-- Criar função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Aplicar triggers para atualização automática do campo updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Inserção dos dados básicos

-- Inserção dos grupos musculares
INSERT INTO muscle_groups (name, description, body_region) VALUES 
('Abdominais', 'Músculos da região central do corpo, responsáveis pela estabilidade do tronco e flexão da coluna.', 'core'),
('Abdutores', 'Músculos que movem os membros para longe da linha média do corpo.', 'lower_body'),
('Adutores', 'Músculos que movem os membros em direção à linha média do corpo.', 'lower_body'),
('Bíceps', 'Músculos localizados na parte frontal do braço, responsáveis pela flexão do cotovelo.', 'upper_body'),
('Panturrilhas', 'Músculos localizados na parte posterior da perna, responsáveis pela flexão plantar do pé.', 'lower_body'),
('Peito', 'Músculos da região peitoral, responsáveis pela adução horizontal do braço.', 'upper_body'),
('Antebraço', 'Músculos do antebraço, responsáveis pelos movimentos do punho e dedos.', 'upper_body'),
('Glúteos', 'Músculos da região dos glúteos, responsáveis pela extensão do quadril.', 'lower_body'),
('Isquiotibiais', 'Músculos da parte posterior da coxa, responsáveis pela flexão do joelho.', 'lower_body'),
('Latíssimo do Dorso', 'Músculos das costas, responsáveis pela adução e extensão do ombro.', 'upper_body'),
('Lombar', 'Músculos da região lombar, responsáveis pela extensão da coluna.', 'core'),
('Trapézio', 'Músculos da região superior das costas e pescoço.', 'upper_body'),
('Quadríceps', 'Músculos da parte frontal da coxa, responsáveis pela extensão do joelho.', 'lower_body'),
('Ombros', 'Músculos do ombro, responsáveis pelos movimentos do braço.', 'upper_body'),
('Tríceps', 'Músculos da parte posterior do braço, responsáveis pela extensão do cotovelo.', 'upper_body');

-- Inserção dos níveis de dificuldade
INSERT INTO difficulty_levels (name, description) VALUES 
('Iniciante', 'Exercícios adequados para pessoas sem experiência prévia com treinamento físico ou que estão retornando após longo período de inatividade. Foco em técnica básica e adaptação neuromuscular.'),
('Intermediário', 'Exercícios para praticantes com experiência básica em treinamento, que já dominam os movimentos fundamentais e possuem condicionamento físico moderado.'),
('Avançado', 'Exercícios para praticantes experientes, com boa técnica e condicionamento físico. Requerem força, mobilidade e coordenação desenvolvidas.'),
('Elite', 'Exercícios para atletas e praticantes de alto nível, com anos de experiência em treinamento. Exigem excelente condicionamento físico, técnica refinada e capacidades físicas bem desenvolvidas.');

-- Inserção dos equipamentos
INSERT INTO equipment (name, description) VALUES 
('Peso Corporal', 'Exercícios que utilizam apenas o peso do próprio corpo como resistência.'),
('Halteres', 'Pesos livres segurados com uma mão, disponíveis em diferentes cargas.'),
('Barra', 'Barra longa com pesos nas extremidades, utilizada com as duas mãos.'),
('Kettlebell', 'Peso em formato de bola com alça, permitindo movimentos balísticos.'),
('Máquinas', 'Equipamentos com sistema de polias, alavancas ou pesos guiados.'),
('Cabos', 'Sistema de polias e cabos que permitem resistência constante em diferentes ângulos.'),
('Bola Suíça', 'Bola grande e inflável que adiciona instabilidade aos exercícios.'),
('TRX/Suspensão', 'Sistema de fitas ajustáveis para treino em suspensão.'),
('Elásticos', 'Faixas elásticas que oferecem resistência progressiva.'),
('Barra Fixa', 'Barra horizontal elevada para exercícios de puxada.'),
('Paralelas', 'Barras paralelas para exercícios de empurrar.'),
('Banco', 'Superfície plana ou ajustável para suporte durante exercícios.'),
('Corda', 'Corda grossa para exercícios de força e condicionamento.'),
('Anilhas', 'Discos de peso que podem ser usados sozinhos ou em barras.'),
('Esteira', 'Equipamento para caminhada ou corrida estacionária.'),
('Bicicleta Ergométrica', 'Bicicleta estacionária para exercícios cardiovasculares.'),
('Elíptico', 'Equipamento que simula caminhada, corrida e subida de escadas.'),
('Escada Ergométrica', 'Equipamento que simula subida de escadas.'),
('Remo Ergométrico', 'Equipamento que simula o movimento de remar.'),
('Sem Equipamento', 'Exercícios que não requerem nenhum equipamento específico.');

-- Inserção dos tipos de exercícios
INSERT INTO exercise_types (name, description) VALUES 
('Força', 'Exercícios focados no desenvolvimento de força muscular, geralmente com cargas altas e poucas repetições.'),
('Hipertrofia', 'Exercícios voltados para o aumento do tamanho muscular, geralmente com cargas moderadas e volume moderado a alto.'),
('Resistência Muscular', 'Exercícios que visam melhorar a capacidade do músculo de sustentar esforço por períodos prolongados, geralmente com cargas mais leves e muitas repetições.'),
('Cardiovascular', 'Exercícios que elevam a frequência cardíaca e melhoram a capacidade cardiorrespiratória.'),
('Flexibilidade', 'Exercícios que aumentam a amplitude de movimento das articulações.'),
('Equilíbrio', 'Exercícios que melhoram a estabilidade corporal e a propriocepção.'),
('Potência', 'Exercícios explosivos que combinam força e velocidade.'),
('Funcional', 'Exercícios que simulam movimentos do dia a dia ou específicos de esportes.'),
('Pliométrico', 'Exercícios que utilizam o ciclo de alongamento-encurtamento muscular para desenvolver potência explosiva.'),
('Isométrico', 'Exercícios que envolvem contração muscular sem movimento articular.'),
('Composto', 'Exercícios que envolvem múltiplas articulações e grupos musculares.'),
('Isolado', 'Exercícios que focam em um grupo muscular específico e geralmente envolvem apenas uma articulação.'),
('Calistenia', 'Exercícios que utilizam o peso corporal como resistência.'),
('HIIT', 'Treinamento intervalado de alta intensidade, alternando períodos de esforço intenso com períodos de recuperação.'),
('Mobilidade', 'Exercícios que melhoram a capacidade de mover as articulações de forma ativa através de sua amplitude de movimento.');

-- Inserção dos exercícios de bíceps
INSERT INTO exercises (
  name, 
  description, 
  instructions, 
  tips, 
  primary_muscle_group_id, 
  secondary_muscle_groups, 
  difficulty_level_id, 
  equipment_id, 
  exercise_type_id
) VALUES 
(
  'Rosca Concentrada', 
  'A rosca concentrada é um exercício de isolamento para bíceps que permite máxima concentração e contração do músculo. É excelente para desenvolver o pico do bíceps e melhorar a definição muscular.',
  '1. Sente-se na ponta de um banco com as pernas abertas.\n2. Segure um halter com uma mão e apoie o cotovelo na parte interna da coxa correspondente.\n3. O braço deve estar estendido, com a palma voltada para a coxa oposta.\n4. Mantendo o cotovelo fixo, flexione o antebraço e levante o halter em direção ao ombro.\n5. Contraia o bíceps no topo do movimento.\n6. Abaixe o halter lentamente até a posição inicial, estendendo completamente o braço.\n7. Complete todas as repetições com um braço antes de trocar para o outro.',
  'Mantenha o cotovelo firmemente apoiado na coxa durante todo o movimento. Concentre-se na contração do bíceps no topo do movimento. Evite movimentar o ombro ou usar impulso para levantar o peso. Use um peso que permita manter a técnica correta.',
  4, -- ID do grupo muscular Bíceps
  'Antebraço, Braquial',
  1, -- ID do nível Iniciante
  2, -- ID do equipamento Halteres
  12  -- ID do tipo Isolado
),
(
  'Rosca Scott', 
  'A rosca Scott, também conhecida como rosca no banco Scott ou rosca no banco preacher, é um exercício que isola os bíceps usando um banco inclinado especial. Este exercício é excelente para desenvolver a parte inferior dos bíceps.',
  '1. Ajuste o banco Scott à altura adequada e sente-se confortavelmente.\n2. Segure uma barra EZ ou halteres com as mãos na largura dos ombros, palmas voltadas para cima.\n3. Apoie a parte posterior dos braços na almofada inclinada do banco.\n4. Comece com os braços quase completamente estendidos, mas sem travar os cotovelos.\n5. Flexione os cotovelos e levante o peso em direção aos ombros.\n6. Contraia os bíceps no topo do movimento.\n7. Abaixe o peso lentamente até quase estender completamente os braços.\n8. Repita pelo número desejado de repetições.',
  'Mantenha os braços firmemente apoiados na almofada durante todo o movimento. Não deixe os cotovelos saírem da almofada. Evite usar impulso ou balançar o corpo para ajudar no movimento. Concentre-se na contração dos bíceps no topo do movimento.',
  4, -- ID do grupo muscular Bíceps
  'Antebraço, Braquial',
  2, -- ID do nível Intermediário
  3, -- ID do equipamento Barra
  12  -- ID do tipo Isolado
),
(
  'Rosca Martelo', 
  'A rosca martelo é uma variação da rosca direta que enfatiza tanto os bíceps quanto os músculos do antebraço, especialmente o braquiorradial. O nome vem da posição das mãos, que lembra segurar um martelo.',
  '1. Fique em pé com os pés na largura dos ombros, segurando um halter em cada mão.\n2. Mantenha os braços estendidos ao lado do corpo com uma pegada neutra (polegares apontando para frente).\n3. Mantenha os cotovelos próximos ao corpo e os braços superiores imóveis.\n4. Flexione os cotovelos e levante os halteres em direção aos ombros, mantendo a pegada neutra (sem girar os pulsos).\n5. Contraia os bíceps e antebraços no topo do movimento.\n6. Abaixe os halteres lentamente até a posição inicial, estendendo completamente os braços.\n7. Repita pelo número desejado de repetições.',
  'Mantenha os cotovelos fixos ao lado do corpo durante todo o movimento. Concentre-se na contração dos bíceps e antebraços no topo do movimento. Realize o movimento de forma lenta e controlada. Evite usar impulso ou balançar o corpo para ajudar no movimento.',
  4, -- ID do grupo muscular Bíceps
  'Antebraço, Braquiorradial, Braquial',
  1, -- ID do nível Iniciante
  2, -- ID do equipamento Halteres
  12  -- ID do tipo Isolado
);

-- Inserção dos exercícios de peito
INSERT INTO exercises (
  name, 
  description, 
  instructions, 
  tips, 
  primary_muscle_group_id, 
  secondary_muscle_groups, 
  difficulty_level_id, 
  equipment_id, 
  exercise_type_id
) VALUES 
(
  'Supino com Halteres', 
  'O supino com halteres é um exercício simples e acessível para o peito que desenvolve massa muscular e força. Usar halteres é benéfico porque eles proporcionam instabilidade, o que força você a trabalhar mais o equilíbrio.',
  '1. Ajuste um banco de academia em posição plana.\n2. Pegue um par de halteres, sente-se no banco e coloque os pesos sobre as coxas.\n3. Traga os ombros para trás, contraia o abdômen, respire e flexione os braços.\n4. Impulsione os halteres para cima com as coxas enquanto se deita. Isso permitirá que você se posicione no banco e posicione os halteres sobre o peito.\n5. Com os braços esticados e os halteres sobre o peito, pressione as escápulas contra o banco e coloque os pés no chão.\n6. Respire novamente e abaixe os halteres para os lados. Mantenha os cotovelos um pouco recolhidos; evite abri-los para os lados.\n7. Abaixe os pesos até que os cotovelos estejam no nível do tronco e mantenha a posição inferior por um segundo.\n8. Pressione ambos os halteres para a posição inicial, juntando-os e esticando os braços. Expire perto do topo.\n9. Respire novamente e repita.',
  'Configure-se corretamente para garantir estabilidade e segurança. Use amplitude completa de movimento, a menos que esteja sentindo desconforto no ombro. Mantenha os cotovelos próximos ao tronco para proteger os ombros. Evite usar peso excessivo que comprometa a técnica.',
  6, -- ID do grupo muscular Peito
  'Ombros, Tríceps',
  2, -- ID do nível Intermediário
  2, -- ID do equipamento Halteres
  2  -- ID do tipo Hipertrofia
),
(
  'Flexão de Braço', 
  'A flexão de braço é um exercício clássico de peso corporal que trabalha principalmente o peito, além dos ombros e tríceps. É extremamente versátil, podendo ser modificado para diferentes níveis de dificuldade e ênfases musculares.',
  '1. Comece na posição de prancha com as mãos posicionadas um pouco mais largas que a largura dos ombros.\n2. Mantenha o corpo em linha reta da cabeça aos calcanhares, contraindo o core.\n3. Dobre os cotovelos, mantendo-os a um ângulo de aproximadamente 45 graus em relação ao corpo.\n4. Abaixe o corpo até que o peito quase toque o chão.\n5. Pause brevemente na posição mais baixa.\n6. Empurre o corpo de volta à posição inicial, estendendo os braços sem travar os cotovelos.\n7. Repita pelo número desejado de repetições.',
  'Mantenha o corpo reto como uma tábua durante todo o movimento; não deixe o quadril cair ou subir. Posicione as mãos adequadamente: mais largas para enfatizar o peito, mais próximas para enfatizar os tríceps. Para iniciantes, comece com flexões modificadas (joelhos no chão ou mãos elevadas). Para avançados, experimente variações como flexões declinadas ou com palmas.',
  6, -- ID do grupo muscular Peito
  'Ombros, Tríceps, Core',
  1, -- ID do nível Iniciante
  1, -- ID do equipamento Peso Corporal
  13  -- ID do tipo Calistenia
);

-- Inserção das imagens dos exercícios
INSERT INTO exercise_images (exercise_id, image_url, is_primary, created_at) VALUES 
(1, '/home/ubuntu/SAGA/images/exercises/concentration_curl.jpeg', TRUE, CURRENT_TIMESTAMP);
