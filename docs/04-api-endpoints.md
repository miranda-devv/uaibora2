# API Endpoints - UaiBora

Esta documentação descreve as rotas de API (Next.js Route Handlers) necessárias para o funcionamento do MVP.

## Base URL: `/api`

### 1. Autenticação

| Endpoint | Método | Descrição | Parâmetros (JSON) |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Cria um novo usuário. | `nome, email, senha` |
| `/auth/login` | `POST` | Autentica o usuário. | `email, senha` |
| `/auth/logout` | `POST` | Encerra a sessão. | - |

### 2. Locais e Sugestões

| Endpoint | Método | Descrição | Parâmetros (JSON) |
| :--- | :--- | :--- | :--- |
| `/locais` | `GET` | Lista locais aprovados. | - |
| `/locais/sugerir` | `POST` | Sugere um novo local (status pendente). | `nome, descricao, categoria, lat, long` |
| `/admin/locais/pendentes` | `GET` | Lista locais para aprovação (Apenas Admin). | - |
| `/admin/locais/:id/aprovar`| `PATCH`| Aprova ou rejeita um local (Apenas Admin). | `status_aprovacao` |

### 3. Eventos

| Endpoint | Método | Descrição | Parâmetros (JSON) |
| :--- | :--- | :--- | :--- |
| `/eventos` | `GET` | Lista eventos futuros. | - |
| `/eventos` | `POST` | Cria um evento (Apenas Proprietário). | `local_id, titulo, descricao, inicio, fim` |
| `/feed/descubra` | `GET` | Consome a View `vw_feed_descubra`. | - |

### 4. Interações

| Endpoint | Método | Descrição | Parâmetros (JSON) |
| :--- | :--- | :--- | :--- |
| `/interacoes` | `POST` | Registra interesse ou check-in. | `entidade_id, tipo_entidade, tipo_interacao` |
| `/interacoes/usuario`| `GET` | Lista favoritos do usuário logado. | - |

## Formato de Resposta (Sucesso)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

## Formato de Resposta (Erro)
```json
{
  "success": false,
  "error": "Descrição do erro",
  "status": 400
}
```
