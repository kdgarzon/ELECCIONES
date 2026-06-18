-- Nota: Ejecutar esta línea por separado si estás en una consola limpia.
-- CREATE DATABASE electoral_db;

-- Asegúrate de estar conectada a la base de datos 'electoral_db' antes de continuar.

DROP TABLE IF EXISTS votos CASCADE;
DROP TABLE IF EXISTS candidatos CASCADE;
DROP TABLE IF EXISTS partidos CASCADE;

CREATE TABLE partidos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    sigla VARCHAR(20) NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE candidatos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    correo VARCHAR(150) NOT NULL UNIQUE,
    id_partido INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Restricción de Llave Foránea (Garantiza que el partido exista)
    CONSTRAINT fk_candidato_partido 
        FOREIGN KEY (id_partido) 
        REFERENCES partidos(id) 
        ON DELETE RESTRICT -- Impide borrar el partido si tiene candidatos asociados (Regla del partidoService)
        ON UPDATE CASCADE
);

CREATE TABLE votos (
    id SERIAL PRIMARY KEY,
    id_candidato INTEGER NOT NULL,
    id_partido INTEGER NOT NULL,
    fecha_voto TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Toma la fecha actual del servidor automáticamente

    CONSTRAINT fk_voto_candidato 
        FOREIGN KEY (id_candidato) 
        REFERENCES candidatos(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_voto_partido 
        FOREIGN KEY (id_partido) 
        REFERENCES partidos(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Insertar Partidos
INSERT INTO partidos (nombre, sigla, descripcion, created_at, updated_at) VALUES
('Partido Tecnológico Universitario', 'PTU', 'Enfocado en la innovación y educación técnica.', NOW(), NOW()),
('Movimiento de Renovación Distrital', 'MRD', 'Foco en la transparencia institucional.', NOW(), NOW());

-- Insertar Candidatos (El Candidato 1 pertenece al Partido 1, el Candidato 2 al Partido 2)
INSERT INTO candidatos (nombre, apellido, documento, correo, id_partido, created_at, updated_at) VALUES
('Carlos', 'Mendoza', '10102020', 'carlos.mendoza@email.com', 1, NOW(), NOW()),
('Laura', 'Espitia', '20203030', 'laura.espitia@email.com', 2, NOW(), NOW());

-- Insertar Votos Simulados (Simulamos 2 votos para Carlos y 1 para Laura)
INSERT INTO votos (id_candidato, id_partido, fecha_voto) VALUES
(1, 1, NOW()),
(1, 1, NOW()),
(2, 2, NOW());