# 🐍 Guia do Backend (Django)

Este diretório contém toda a API e as regras de negócio centralizadas do projeto Dadland, processadas sob uma arquitetura de alta performance com Django.

## Tecnologias e Dependências

- **Django 4.2 LTS:** Web Framework Python responsável pelas regras e modelo de domínio da nossa REST (ou View).
- **Python 3.12:** Linguagem base de arquitetura do desenvolvimento.
- **PostgreSQL 16 (Driver psycopg2):** Banco de dados relacional (SQL) espelhando a segurança rigorosa e transacionamento no backend.
- **Black & Flake8:** Analisador estático oficial exigível de PEP-8 da nossa aplicação, acionável antes do ciclo dos commits.

## Estrutura dos Apps do Django

Diferentemente do boilerplate primário global do repositório, esta caixa fechada tem seus aplicativos bem demarcados por escopo dentro de `/dadlandbackend`:

```text
dadlandbackend/
├── api/               # É o invólucro para domínios ou agrupadores da estrutura de Models e API, onde grande parte das rotinas acontece de fato.
├── core/              # O cerne global da instalação do projeto contendo settings.py, e as rotas raiz urls.py responsáveis pelo dispatch. 
├── manage.py          # Entrypoint de terminal responsável pelos command lines vitais de controle, teste, admin e migração.
├── requirements.txt   # Controle de lock de todas as versões do backend para provisionamento determinístico de instâncias do serviço.
└── venv/              # Ambiente de encapsulamento seguro e isolado das importações do terminal/python local.
```

## Dia a Dia Produtivo do Desenvolvedor

Suas iterações locais como modelador da rede dependem da capacidade de alternância entre as instruções locais e as enviadas aos contêineres pela rede interna, acompanhando as demandas:

### 1. Lidando Com Pacotes e Linter (IDE)

Do mesmo jeito que no frontend onde exigimos o `node_modules` local (fora do Docker), por favor tenha seu respectivo **`venv` ativo**. Sem ele instalado e configurado, o VSCode da sua máquina não processará que você dispõe de classes válidas importadas em tela, apontando falsos positivos na formatação.

- Crie e ligue seu venv: `python -m venv venv` e `source venv/bin/activate`.
- Alinhe o pacote da ramificação de código com as instalações atuais via `pip install -r requirements.txt`.

### 2. Comandos do Django via Docker (Operando)

Operações que acessam o banco de dados nativo do Docker e instâncias devem ser processados chamando a API do `docker compose exec`.
Mantenha os contêineres ligados no background via `docker compose up -d` ou outra janela interativa.

Os comandos na sequência devem orientar tarefas do motor do Django acionados da sua raiz do _Docker ou Projeto_:

**Mapear Modelos no Banco de Dados (Gerar Migrations):**
```bash
docker compose exec backend python manage.py makemigrations
```

**Sincronizar Banco de Dados (Aplicar Migrations):**
```bash
docker compose exec backend python manage.py migrate
```

**Criar Usuário Administrador de Segurança:**
Habilita você para navegar na página de backoffice `http://localhost:8000/admin`:
```bash
docker compose exec backend python manage.py createsuperuser
```

**Executar os Testes em Tempo Focado:**
Valida todo o escopo de suíte unitárias de ponta a ponta isolado na branch:
```bash
docker compose exec backend python manage.py test
```
