-- data.sql
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
('Isquiotibiais', 'Músculos posteriores da coxa, responsáveis pela flexão do joelho e extensão do quadril.', 'lower_body'),
('Quadríceps', 'Músculos anteriores da coxa, responsáveis pela extensão do joelho.', 'lower_body'),
('Costas', 'Músculos das costas, incluindo latíssimo do dorso, responsáveis por puxadas e extensões.', 'upper_body'),
('Ombros', 'Músculos deltoides, responsáveis por diversos movimentos de elevação do braço.', 'upper_body'),
('Trapézio', 'Músculos do trapézio, responsáveis pela elevação e retração das escápulas.', 'upper_body'),
('Dorsais', 'Músculos dorsais, que auxiliam na puxada e estabilização do tronco.', 'upper_body'),
('Tríceps', 'Músculos na parte posterior do braço, responsáveis pela extensão do cotovelo.', 'upper_body'),
('Panturrilhas Mediais', 'Parte medial das panturrilhas, importante na estabilidade e empurrão do pé.', 'lower_body'),
('Abdômen Inferior', 'Parte inferior dos abdominais, envolvida na flexão e estabilização do tronco.', 'core'),
('Abdômen Superior', 'Parte superior dos abdominais, envolvida na flexão e estabilização do tronco.', 'core'),
('Cardíacos', 'Músculos cardíacos (uso interno; não aplicável a exercícios.', 'core');

-- Inserção dos níveis de dificuldade
INSERT INTO difficulty_levels (name, description) VALUES
('Iniciante', 'Exercícios recomendados para quem está começando.'),
('Intermediário', 'Exercícios para quem já tem alguma experiência.'),
('Avançado', 'Exercícios que exigem maior controle e força.');

-- Inserção dos equipamentos
INSERT INTO equipment (name, description) VALUES
('Nenhum', 'Peso corporal apenas.'),
('Halteres', 'Par de halteres ajustáveis ou fixos.'),
('Barra', 'Barra olímpica ou barra reta.'),
('Banco', 'Banco para supinos e exercícios sentados.'),
('Máquina', 'Máquinas de cabo, leg press, polia, etc.');

-- Inserção dos tipos de exercício
INSERT INTO exercise_types (name, description) VALUES
('Composto', 'Envolve múltiplas articulações e grupos musculares.'),
('Isolado', 'Foca em um grupo muscular específico.'),
('Cardio', 'Exercícios aeróbicos.'),
('Funcional', 'Movimentos de vida diária ou esportes.');

-- (Opcional) Insira aqui outros dados iniciais, e depois faça o `seed_exercises.sql` com exercícios específicos.
