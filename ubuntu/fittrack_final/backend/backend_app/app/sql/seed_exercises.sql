-- seed_exercises.sql
-- Dois exemplos de exercícios corrigidos

INSERT INTO exercises (
  name, description, instructions, tips,
  primary_muscle_group_id, secondary_muscle_group_id,
  difficulty_level_id, equipment_id, exercise_type_id,
  secondary_muscle_groups, video_url
) VALUES (
  'Rosca Direta com Barra',
  'Exercício clássico para bíceps',
  '1. Pegue a barra supinada. 2. Flexione o cotovelo. 3. Controle a descida.',
  'Não balance o tronco.',
  4, -- Bíceps
  7, -- Antebraço
  1, -- Iniciante
  3, -- Barra
  2, -- Isolado
  NULL, NULL
);

INSERT INTO exercises (
  name, description, instructions, tips,
  primary_muscle_group_id, secondary_muscle_group_id,
  difficulty_level_id, equipment_id, exercise_type_id,
  secondary_muscle_groups, video_url
) VALUES (
  'Supino Reto com Barra',
  'Exercício clássico de peito',
  '1. Deite no banco. 2. Abaixe a barra ao tórax. 3. Empurre até estender.',
  'Use spotter.',
  6,  -- Peito
  15, -- Tríceps
  2,  -- Intermediário
  3,  -- Barra
  1,  -- Composto
  NULL, NULL
);
