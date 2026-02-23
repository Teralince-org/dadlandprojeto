# Documentação do Sistema Dadland

> **Status da Análise**: ✅ Aprovado (Infraestrutura, Segurança e Arquitetura).

Este documento descreve a arquitetura técnica do projeto Dadland, validada para garantir integridade na conteinerização, segurança na comunicação fullstack e organização de código.

---

## 1. Estrutura do Projeto

O projeto segue uma arquitetura **repositório único** organizada para separar responsabilidades de infraestrutura e código de aplicação.

*   `dadlandinfra/`: Orquestração de containers (Docker Compose) e variáveis de ambiente.
*   `dadlandbackend/`: API Rest desenvolvida em Django (Python).
*   `dadlandfrontend/`: Aplicação Client-side desenvolvida em Next.js (Node.js).

---

## 2. Infraestrutura (Docker)

A infraestrutura é definida no `docker-compose.yml`, otimizada para desenvolvimento local com persistência de dados e *hot-reload*.

### Serviços

*   **Frontend (`frontend`)**:
    *   **Porta Externa**: `3000` (Acesso do usuário).
    *   **Hot-Reload**: Mapeado via volumes para refletir mudanças em tempo real.
    *   **Comunicação**: Consome a API do backend via HTTP.

*   **Backend (`backend`)**:
    *   **Porta Externa**: `8000` (API e Painel Admin).
    *   **Driver de Banco**: Utiliza `psycopg2` (compilado) para máxima compatibilidade e performance com PostgreSQL.
    *   **Segurança**: Variáveis sensíveis (`SECRET_KEY`, Senhas) injetadas via `.env`, sem exposição no código.

*   **Banco de Dados (`db`)**:
    *   **Imagem**: `postgres:16-alpine` (Leve e segura).
    *   **Persistência**: Dados salvos no volume docker `postgres-data`.
    *   **Healthcheck**: O Backend aguarda nativamente o banco estar saudável antes de iniciar.

---

## 3. Comunicação Fullstack & Rede

### Fluxo de Dados
A comunicação segue o padrão REST via HTTP.

1.  **Browser (Cliente)** -> Acessa `http://localhost:3000`.
2.  **Next.js (Frontend)** -> Faz requisições `fetch` para `http://localhost:8000`.
3.  **Django (Backend)** -> Processa e retorna JSON.

### Configuração de CORS (Cross-Origin Resource Sharing)
Para permitir que o frontend (porta 3000) converse com o backend (porta 8000), a segurança foi configurada:

*   **Backend (`settings.py`)**: A lista `CORS_ALLOWED_ORIGINS` libera explicitamente:
    *   `http://localhost:3000`
    *   `http://127.0.0.1:3000`
*   **Segurança**: Bloqueia requisições de outras origens não autorizadas.

---

## 4. Ambiente de Desenvolvimento Local

Para garantir que seu ambiente local (`machine`) seja idêntico ao ambiente Docker, utilizamos gerenciadores de versão.

### Frontend: Node.js 20 (LTS)
O projeto utiliza a versão **20** do Node.js.
*   **Gerenciamento**: Via `nvm` (Node Version Manager).
*   **Comando para rodar**:
    ```bash
    npm run dev
    ```

### Backend: Python 3.11
O projeto utiliza Python **3.11**.
*   **Gerenciamento**: Via `pyenv` (Isolamento de versão) + `venv` (Ambiente Virtual).
*   **Comando para rodar**:
    ```bash
    source dadlandbackend/venv/bin/activate
    python manage.py runserver
    ```

---

## 5. Resumo da Configuração Atual

| Componente | Tecnologia | Versão | Porta Local |
| **Frontend** | Next.js / React | 15+ / 19 | 3000 |
| **Backend** | Django | 4.2 LTS | 8000 |
| **Database** | PostgreSQL | 16 Alpine | 5432 |
| **Infra** | Docker Compose | v2+ | - |

---
*Documentação gerada automaticamente após análise de integridade do sistema.*
