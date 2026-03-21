# Visão Geral da Stack - Dadland

Este documento descreve a arquitetura macro do template base fullstack (Dadland), suas tecnologias e a topologia geral do projeto. Adotamos uma arquitetura estruturada, orquestrada via Docker, mantendo Frontend, Backend e Infraestrutura no mesmo repositório (Monorepo) para otimizar a Developer Experience (DX).

## Tecnologias Escolhidas e Seus Papéis

- **Next.js (v16+) & React (v19+):** 
  Responsável pela camada de **Frontend**. O Next.js gerencia as rotas (App Router), a renderização na nuvem (Server-Side) ou navegador (Client-Side) e toda a interface do usuário. Utilizamos **Tailwind CSS v4** para estilização utilitária e escalável.
  
- **Django (v4.2 LTS) & Python 3.11.9:**
  Responsável pela camada de **Backend**. O Django foi escolhido por prover de forma ágil uma camada de segurança robusta, painel administrativo "out-of-the-box" e um ORM poderoso. Ele serve a API consumida pelo Frontend.

- **PostgreSQL 16:**
  Nosso **Banco de Dados Relacional**. Armazena de forma persistente os dados dinâmicos da aplicação, gerenciado de ponta a ponta pelo framework Django.

- **Docker & Docker Compose:**
  Nossa camada de **Infraestrutura**. Orquestra os ambientes, garantindo que a máquina de desenvolvimento simule o ambiente de homologação e produção fielmente, além de agilizar radicalmente o setup inicial do time.

## Comunicação entre os Serviços

Os serviços rodam de maneira isolada em contêineres e conversam via rede interna bridge (`dadland-network`):

1. **Frontend -> Backend:**
   O contêiner do Frontend consome a API do Django. Quando processado no lado do servidor (SSR), o Next.js se comunica diretamente pela rede do Docker via `http://backend:8000`. No lado do cliente (browser do usuário), as chamadas apontam para a porta exposta localmente (ex: `http://localhost:8000`).

2. **Backend -> Banco de Dados:**
   O Django consome o PostgreSQL via porta `5432` através do host interno `db`. O acesso é estritamente autenticado e injetado pelas variáveis do ambiente (`.env`).

3. **Acesso do Desenvolvedor:**
   - O banco de dados mapeia a porta `5432` na sua máquina, permitindo inspeções manuais (ex: DBeaver, PGAdmin).
   - Interface Web (Frontend) mapeada na porta `3000`.
   - API e Painel Admin mapeados na porta `8000`.

## Topologia Geral do Template

O template está particionado em três módulos essenciais:

```text
dadlandprojeto/
├── dadlandfrontend/      # ⚛️ Camada de Apresentação (Next.js, Tailwind, Jest)
├── dadlandbackend/       # 🐍 Camada de Negócios (Django, APIs, Testes Python)
└── dadlandinfra/         # 🐳 Camada de Orquestração (docker-compose.yml)
```
Essa separação dá a liberdade para lidarmos simultaneamente com contextos distintos, respeitando os padrões de cada ecossistema (npm/node vs pip/python) enquanto o Docker une tudo em um ambiente centralizado.
