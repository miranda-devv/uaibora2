CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE papel_usuario AS ENUM ('COMUM', 'PROPRIETARIO', 'ADMIN');
CREATE TYPE status_local AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');
CREATE TYPE tipo_entidade AS ENUM ('LOCAL', 'EVENTO');
CREATE TYPE tipo_interacao AS ENUM ('FAVORITOU', 'TENHO_INTERESSE', 'CHECK_IN');

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil papel_usuario DEFAULT 'COMUM',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    status_aprovacao status_local DEFAULT 'PENDENTE',
    sugerido_por_id UUID REFERENCES usuarios(id),
    proprietario_id UUID REFERENCES usuarios(id),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    local_id UUID NOT NULL REFERENCES locais(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interacoes_usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    entidade_id UUID NOT NULL,
    tipo_entidade_val tipo_entidade NOT NULL,
    tipo_interacao_val tipo_interacao NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW vw_feed_descubra AS
SELECT 
    e.id AS evento_id,
    e.titulo AS evento_titulo,
    e.descricao AS evento_descricao,
    e.data_inicio,
    e.data_fim,
    l.id AS local_id,
    l.nome AS local_nome,
    l.categoria AS local_categoria,
    l.latitude,
    l.longitude,
    l.descricao AS local_descricao
FROM 
    eventos e
JOIN 
    locais l ON e.local_id = l.id
WHERE 
    l.status_aprovacao = 'APROVADO' 
    AND e.data_fim >= CURRENT_TIMESTAMP
ORDER BY 
    e.data_inicio ASC;
