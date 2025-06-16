-- ========================================
-- FITTRACK DATABASE - SEED INITIAL DATA
-- ========================================

-- ========================================
-- MUSCLE GROUPS
-- ========================================
INSERT INTO muscle_groups (name, name_pt, description) VALUES
('Chest', 'Peito', 'Chest muscles including pectorals'),
('Back', 'Costas', 'Back muscles including lats and rhomboids'),
('Legs', 'Pernas', 'Leg muscles including quads, hamstrings, and calves'),
('Shoulders', 'Ombros', 'Shoulder muscles including deltoids'),
('Arms', 'Braços', 'Arm muscles including biceps and triceps'),
('Core', 'Abdômen', 'Core muscles including abs and obliques'),
('Glutes', 'Glúteos', 'Glute muscles'),
('Cardio', 'Cardio', 'Cardiovascular exercises');

-- ========================================
-- EQUIPMENTS
-- ========================================
INSERT INTO equipments (name, name_pt, description) VALUES
('Barbell', 'Barra', 'Olympic barbell and weights'),
('Dumbbell', 'Halter', 'Dumbbells and adjustable weights'),
('Bodyweight', 'Peso Corporal', 'No equipment needed'),
('Cable Machine', 'Máquina de Cabo', 'Cable pulley system'),
('Machine', 'Máquina', 'Weight machines'),
('Kettlebell', 'Kettlebell', 'Kettlebell weights'),
('Resistance Band', 'Fita Elástica', 'Elastic resistance bands'),
('Pull-up Bar', 'Barra Fixa', 'Pull-up bar or assisted machine'),
('Bench', 'Banco', 'Workout bench'),
('Swiss Ball', 'Bola Suíça', 'Exercise ball');

-- ========================================
-- DIFFICULTY LEVELS
-- ========================================
INSERT INTO difficulty_levels (name, level_order, description) VALUES
('Beginner', 1, 'Suitable for beginners'),
('Intermediate', 2, 'Requires some experience'),
('Advanced', 3, 'For experienced athletes');

-- ========================================
-- SAMPLE EXERCISES
-- ========================================
INSERT INTO exercises (name, name_pt, description, description_pt, instructions, instructions_pt, muscle_group_id, equipment_id, difficulty_level_id, image_url, gif_url) VALUES
-- CHEST EXERCISES
('Push-ups', 'Flexões', 'Basic bodyweight chest exercise', 'Exercício básico de peito com peso corporal', 'Start in plank position, lower body to ground, push back up', 'Comece na posição de prancha, desça o corpo até o chão, empurre de volta para cima', 1, 3, 1, '/images/pushups.jpg', '/gifs/pushups.gif'),
('Bench Press', 'Supino Reto', 'Classic barbell chest press', 'Supino clássico com barra', 'Lie on bench, lower bar to chest, press up', 'Deite no banco, desça a barra até o peito, empurre para cima', 1, 1, 2, '/images/bench-press.jpg', '/gifs/bench-press.gif'),
('Dumbbell Flyes', 'Crucifixo com Halteres', 'Isolation exercise for chest', 'Exercício de isolamento para o peito', 'Lie on bench, open arms wide, bring dumbbells together', 'Deite no banco, abra os braços, junte os halteres', 1, 2, 2, '/images/dumbbell-flyes.jpg', '/gifs/dumbbell-flyes.gif'),

-- BACK EXERCISES
('Pull-ups', 'Barra Fixa', 'Upper body pulling exercise', 'Exercício de puxada para parte superior', 'Hang from bar, pull body up until chin over bar', 'Pendure na barra, puxe o corpo até o queixo passar da barra', 2, 8, 2, '/images/pullups.jpg', '/gifs/pullups.gif'),
('Bent-over Row', 'Remada Curvada', 'Barbell rowing exercise', 'Exercício de remada com barra', 'Bend forward, row barbell to lower chest', 'Curve-se para frente, puxe a barra até o peito inferior', 2, 1, 2, '/images/bent-over-row.jpg', '/gifs/bent-over-row.gif'),
('Lat Pulldown', 'Puxada na Polia', 'Cable machine back exercise', 'Exercício de costas na máquina de cabo', 'Sit at machine, pull bar down to upper chest', 'Sente na máquina, puxe a barra até o peito superior', 2, 4, 1, '/images/lat-pulldown.jpg', '/gifs/lat-pulldown.gif'),

-- LEG EXERCISES
('Squats', 'Agachamento', 'Fundamental leg exercise', 'Exercício fundamental de pernas', 'Stand with feet shoulder-width apart, squat down, stand back up', 'Fique em pé com os pés na largura dos ombros, agache, levante-se', 3, 3, 1, '/images/squats.jpg', '/gifs/squats.gif'),
('Deadlift', 'Levantamento Terra', 'Full body compound movement', 'Movimento composto de corpo inteiro', 'Stand over bar, bend down, lift bar up', 'Fique sobre a barra, curve-se, levante a barra', 3, 1, 3, '/images/deadlift.jpg', '/gifs/deadlift.gif'),
('Lunges', 'Afundo', 'Single leg exercise', 'Exercício unilateral de pernas', 'Step forward into lunge position, return to start', 'Dê um passo à frente em posição de afundo, volte ao início', 3, 3, 2, '/images/lunges.jpg', '/gifs/lunges.gif'),

-- SHOULDER EXERCISES
('Overhead Press', 'Desenvolvimento', 'Shoulder pressing movement', 'Movimento de empurrar para os ombros', 'Press weight overhead from shoulder level', 'Empurre o peso acima da cabeça a partir do nível dos ombros', 4, 1, 2, '/images/overhead-press.jpg', '/gifs/overhead-press.gif'),
('Lateral Raises', 'Elevação Lateral', 'Shoulder isolation exercise', 'Exercício de isolamento para ombros', 'Raise arms to sides until parallel with ground', 'Levante os braços para os lados até ficarem paralelos ao chão', 4, 2, 1, '/images/lateral-raises.jpg', '/gifs/lateral-raises.gif'),

-- ARM EXERCISES
('Bicep Curls', 'Rosca Bíceps', 'Basic arm exercise', 'Exercício básico de braços', 'Curl weight up to shoulders, lower slowly', 'Curve o peso até os ombros, desça lentamente', 5, 2, 1, '/images/bicep-curls.jpg', '/gifs/bicep-curls.gif'),
('Tricep Dips', 'Mergulho para Tríceps', 'Tricep bodyweight exercise', 'Exercício de tríceps com peso corporal', 'Support body on bench, lower and raise', 'Apoie o corpo no banco, desça e suba', 5, 9, 2, '/images/tricep-dips.jpg', '/gifs/tricep-dips.gif'),

-- CORE EXERCISES
('Plank', 'Prancha', 'Core stability exercise', 'Exercício de estabilidade do core', 'Hold plank position, keep body straight', 'Mantenha a posição de prancha, mantenha o corpo reto', 6, 3, 1, '/images/plank.jpg', '/gifs/plank.gif'),
('Crunches', 'Abdominais', 'Basic ab exercise', 'Exercício básico de abdômen', 'Lie on back, crunch up towards knees', 'Deite de costas, contraia em direção aos joelhos', 6, 3, 1, '/images/crunches.jpg', '/gifs/crunches.gif'),

-- CARDIO EXERCISES
('Running', 'Corrida', 'Cardiovascular exercise', 'Exercício cardiovascular', 'Run at steady pace for set duration', 'Corra em ritmo constante pela duração definida', 8, 3, 1, '/images/running.jpg', '/gifs/running.gif'),
('Burpees', 'Burpees', 'Full body cardio exercise', 'Exercício cardio de corpo inteiro', 'Squat down, jump back to plank, jump forward, jump up', 'Agache, pule para trás em prancha, pule para frente, pule para cima', 8, 3, 3, '/images/burpees.jpg', '/gifs/burpees.gif');

-- ========================================
-- SAMPLE USER FOR TESTING
-- ========================================
INSERT INTO users (username, email, password_hash, first_name, last_name, height, weight, activity_level) VALUES
('fittrack_demo', 'demo@fittrack.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyPw5eee6gTExA5fJ2QXMK', 'Demo', 'User', 1.75, 70.0, 'ACTIVE');

-- ========================================
-- SAMPLE USER PROFILE
-- ========================================
INSERT INTO user_profiles (user_id, bio, fitness_goals, experience_level) VALUES
(1, 'Demo user for FitTrack application testing', ARRAY['Weight Loss', 'Muscle Gain', 'Strength'], 'INTERMEDIATE');

-- ========================================
-- SAMPLE WORKOUT TEMPLATE
-- ========================================
INSERT INTO workout_templates (user_id, name, description, duration_minutes, difficulty_level, is_public) VALUES
(1, 'Push Pull Legs', 'Classic 3-day split routine', 60, 'INTERMEDIATE', true),
(1, 'Full Body Beginner', 'Complete beginner full body workout', 45, 'BEGINNER', true),
(1, 'Upper Body Strength', 'Focus on upper body strength', 50, 'ADVANCED', true);

-- ========================================
-- SAMPLE WORKOUT
-- ========================================
INSERT INTO workouts (user_id, template_id, name, notes, status, duration_minutes) VALUES
(1, 1, 'Push Day - Week 1', 'Focus on progressive overload', 'COMPLETED', 62);

-- ========================================
-- SAMPLE WORKOUT EXERCISES
-- ========================================
INSERT INTO workout_exercises (workout_id, exercise_id, order_index, notes, rest_time_seconds) VALUES
(1, 2, 1, 'Focus on form', 120), -- Bench Press
(1, 10, 2, 'Control the movement', 90), -- Overhead Press
(1, 3, 3, 'Squeeze at the top', 90), -- Dumbbell Flyes
(1, 11, 4, 'Full range of motion', 60); -- Lateral Raises

-- ========================================
-- SAMPLE EXERCISE SETS
-- ========================================
INSERT INTO exercise_sets (workout_exercise_id, set_number, reps, weight, rpe, is_completed) VALUES
-- Bench Press sets
(1, 1, 12, 60.0, 6.5, true),
(1, 2, 10, 65.0, 7.0, true),
(1, 3, 8, 70.0, 8.0, true),
-- Overhead Press sets
(2, 1, 10, 40.0, 6.0, true),
(2, 2, 8, 42.5, 7.5, true),
(2, 3, 6, 45.0, 8.5, true),
-- Dumbbell Flyes sets
(3, 1, 12, 15.0, 6.0, true),
(3, 2, 10, 17.5, 7.0, true),
(3, 3, 8, 20.0, 8.0, true),
-- Lateral Raises sets
(4, 1, 15, 10.0, 5.5, true),
(4, 2, 12, 12.5, 6.5, true),
(4, 3, 10, 15.0, 7.5, true);

-- ========================================
-- SAMPLE PERSONAL RECORDS
-- ========================================
INSERT INTO personal_records (user_id, exercise_id, record_type, record_value, record_unit, workout_id, notes) VALUES
(1, 2, 'MAX_WEIGHT', 70.0, 'kg', 1, 'New bench press PR!'),
(1, 8, 'MAX_WEIGHT', 100.0, 'kg', 1, 'Deadlift personal best'),
(1, 1, 'MAX_REPS', 25, 'reps', 1, '25 consecutive push-ups');

-- ========================================
-- SAMPLE BODY MEASUREMENTS
-- ========================================
INSERT INTO body_measurements (user_id, measurement_date, weight, body_fat_percentage, chest, waist, biceps) VALUES
(1, CURRENT_DATE - INTERVAL '30 days', 72.0, 15.5, 95.0, 80.0, 32.0),
(1, CURRENT_DATE - INTERVAL '15 days', 71.0, 14.8, 96.0, 79.0, 32.5),
(1, CURRENT_DATE, 70.0, 14.2, 97.0, 78.0, 33.0); 