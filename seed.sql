-- Inserir Usuário Admin se não existir
INSERT INTO usuarios (id, nome, email, senha_hash, perfil)
VALUES ('75997232-602c-4740-84c4-72795ec0a544', 'Admin Usuário', 'admin@uaibora.com', '$2b$10$S6JpT3pEjFfO5yS0ZpL5e.9/7e9O.2u7u2u2u2u2u2u2u2u2u2u2u', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Inserir Locais de Teste (APROVADO)
INSERT INTO locais (id, nome, descricao, categoria, status_aprovacao, sugerido_por_id)
VALUES 
('d1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Praça da Liberdade', 'Ponto turístico icônico de BH.', 'Cultura', 'APROVADO', '75997232-602c-4740-84c4-72795ec0a544'),
('f6e5d4c3-b2a1-0f9e-8d7c-6b5a4a3b2c1d', 'Mercado Central', 'O melhor queijo de minas.', 'Gastronomia', 'APROVADO', '75997232-602c-4740-84c4-72795ec0a544')
ON CONFLICT (id) DO NOTHING;

-- Inserir Eventos para esses locais
INSERT INTO eventos (id, local_id, titulo, descricao, data_inicio, data_fim)
VALUES 
('e1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'd1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Feira de Artesanato', 'Artesanato local nos jardins.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + interval '1 day'),
('e6e5d4c3-b2a1-0f9e-8d7c-6b5a4a3b2c1d', 'f6e5d4c3-b2a1-0f9e-8d7c-6b5a4a3b2c1d', 'Degustação de Queijos', 'Venha provar o melhor de MG.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + interval '2 days')
ON CONFLICT (id) DO NOTHING;
