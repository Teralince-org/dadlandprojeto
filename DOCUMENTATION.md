# Documentação Oficial - Dadland

## 1. Visão Geral do Projeto

Este repositório adota a arquitetura de repositório único, unificando as três principais camadas da nossa aplicação: Frontend, Backend e Infraestrutura. O objetivo principal deste padrão é centralizar o código-fonte, garantir o sincronismo nas entregas de ponta a ponta e melhorar a Developer Experience (DX). Com todas as camadas em um único repositório, simplificamos a automação (CI/CD), padronizamos ferramentas de linting e garantimos que uma funcionalidade seja implementada e testada integralmente no mesmo fluxo ("commit").

---

## 2. Stack Tecnológica

O projeto foi desenhado sob uma arquitetura moderna e estável, com as seguintes tecnologias:

### Frontend
- **Framework Principal:** [Next.js]<https://nextjs.org/> (versão 16+)
- **Biblioteca de UI:** [React]<https://react.dev/> (versão 19+)
- **Linguagem:** TypeScript                             
- **Estilização:** Tailwind CSS v4 + PostCSS

### Backend
- **Framework Principal:** [Django]<https://www.djangoproject.com/> (versão 4.2 LTS)
- **Linguagem:** Python 3.12
- **Banco de Dados:** PostgreSQL 16

### Infraestrutura
- **Orquestração de Contêineres:** Docker & Docker Compose
- **Isolamento de Redes:** Rede privada em bridge (`dadland-network`)

### Automação & DevOps
- **CI/CD:** GitHub Actions (Pipeline para validação de código)
- **Hooks de Git:** Husky + lint-staged (Validação de commit local)

### Qualidade de Código e Testes
- **Frontend:** Jest + React Testing Library, ESLint
- **Backend:** Black (Formatação), Flake8 (Linting)

---

## 3. Arquitetura de Diretórios

O repositório único está organizado de forma modular. Abaixo, a estrutura de mais alto nível para navegação:

```
dadlandprojeto/
├── .github/workflows/    # Pipelines de CI/CD (GitHub Actions)
├── dadlandbackend/       # 🐍 Camada de Backend (API em Django)
│   ├── api/              # Aplicativos/módulos do Django
│   ├── core/             # Configurações raiz do projeto Django
│   ├── requirements.txt  # Dependências do Python
│   └── manage.py         # Entrypoint do CLI do Django
├── dadlandfrontend/      # ⚛️ Camada de Frontend (Next.js)
│   ├── app/              # Rotas e páginas (App Router)
│   ├── public/           # Assets estáticos (imagens, ícones)
│   ├── __tests__/        # Testes unitários com Jest
│   └── package.json      # Dependências do Node.js
├── dadlandinfra/         # 🐳 Camada de Infraestrutura e Docker
│   └── docker-compose.yml# Orquestração local dos serviços
├── .env.example          # Template das variáveis de ambiente globais
├── .gitignore            # Regras globais de exclusão do Git
└── package.json          # Root package focado em automações (Husky)
```

---

## 4. Guia de Setup Local (CRUCIAL)

Nosso ambiente local roda inteiramente com Docker, simulando o ambiente de produção. Siga os passos abaixo, rigorosamente, para configurar o projeto pela primeira vez.

### Passo 1: Configuração das Variáveis de Ambiente (`.env`)
Todo o sistema depende do arquivo `.env` para orquestrar as portas, comunicação com o banco de dados e chaves de segurança.

1. Na **raiz** do projeto, crie uma cópia do arquivo de exemplo e renomeie para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Abra o arquivo `.env` recém-criado e ajuste os valores para o ambiente local padrão.

### Passo 2: O Link Simbólico (Atenção Máxima!)
Como a estrutura de containers do `docker-compose` está isolada na pasta `dadlandinfra`, mas o `.env` global está na raiz, **é obrigatório** criar um link simbólico. Dessa forma, o Docker "enxergará" as variáveis globais.

Execute o comando exato abaixo a partir da raiz do repositório:
```bash
cd dadlandinfra && ln -s ../.env .env && cd ..
```
*(No Windows, se estiver usando um terminal que não suporta `ln`, utilize o atalho de sistema ou abra um Git Bash com permissão de administrador).*

### Passo 3: Subindo os Contêineres
Com o `--build`, o Docker compilará a infraestrutura completa (Frontend, Backend e o PostgreSQL 16) baseando-se nas variáveis injetadas.

A partir da **raiz do projeto**, rode:
```bash
docker-compose -f dadlandinfra/docker-compose.yml up -d --build
```

**Verificação Rápida e Health Checks:** 

- **Acesse o Frontend:** 
<http://localhost:3000> (Interface de usuário em Next.js)
- **Acesse o Backend (Raiz):** 
<http://localhost:8000> (Servidor Django)
- **Acesse o Painel Admin:** 
<http://localhost:8000/admin> (Interface administrativa segura)
- **Health Check do Backend:** 
<http://localhost:8000/api/health-check/> (Retorna um JSON confirmando se o Django está de pé e se o Banco de Dados está conectado)
- **Health Check do Frontend:** 
<http://localhost:3000/api/health-check> (Retorna um JSON confirmando se o Next.js consegue se comunicar internamente com a API do Django)
- **Acesso ao Banco de Dados (PostgreSQL):** 
Utilize um cliente de SGBD ou o terminal (`psql`) conectando-se a `localhost` na porta `5432`, usando as credenciais definidas no seu arquivo `.env`.

---

## 5. Qualidade de Código e Testes

Para mantermos a consistência e segurança na base do código, implementamos um conjunto rígido de ferramentas de linting e testes.

### Frontend
- **Testes Unitários:** Usamos o `Jest` em conjunto com a `React Testing Library`. No arquivo `package.json` do frontend (`dadlandfrontend`), configuramos dois comandos distintos para o seu fluxo de trabalho:

  - **Execução Única:** Executa toda a suíte de testes uma vez e finaliza o processo. Ideal para checar se está tudo verde antes de criar um commit.
    ```bash
    npm run test
    ```
  - **Modo Interativo (Watch Mode):** Mantém o terminal aberto e reexecuta os testes automaticamente toda vez que você salva um arquivo. Excelente para usar enquanto estiver programando um componente novo.
    ```bash
    npm run test:watch
    ```

  - **Execução na Nuvem (Ambiente de CI/CD):** No pipeline automatizado (GitHub Actions), nosso script de CI orquestra o comando injetando flags de segurança (como `--watchAll=false`). Isso força o motor de testes a rodar a suíte inteira de ponta a ponta apenas uma vez e encerrar o processo, determinando se o Pull Request será aprovado ou bloqueado.

### Backend
- **Formatação e Linting:** Utilizamos o `Black` (formatador opinativo) e o `Flake8` (analisador estático) para garantir que o código Python siga a PEP-8 e o nosso limite de 100 caracteres por linha.

  - **Automação Local (Husky):** Nosso setup de Git Hooks (`lint-staged`), no exato momento em que você digita `git commit`, o sistema roda o Black e o Flake8 **automaticamente** apenas nos arquivos `.py` que você modificou. Se o código estiver quebrado, o commit é abortado.

  - **Execução na Nuvem (Ambiente de CI/CD):** No pipeline do GitHub Actions, o robô roda o comando com uma flag de checagem: `black --check .`. Isso significa que, na nuvem, o Black não vai formatar o código para você; ele vai **falhar o pipeline** se descobrir que algum arquivo subiu sem formatação.

---

## 6. Automação e CI/CD

O projeto possui duas camadas primárias de validação de código que garantem que nenhuma alteração quebre o build.

### 6.1 Git Hooks (Segurança Local)
Na raiz, configuramos o **Husky** com o **lint-staged**. Antes de cada `git commit`, o hook é acionado automaticamente.
- Se arquivos Python foram alterados: Executa o `black` e `flake8`.
- Se arquivos JS/TS foram alterados no React: Roda a suíte de testes do `Jest`.
- **O commit é bloqueado** caso existam erros de lint ou se algum teste relacionado falhar.

### 6.2 GitHub Actions (Pipeline na Nuvem)
O arquivo `.github/workflows/ci.yml` contém as etapas automatizadas que rodam a cada **Push** ou **Pull Request** direcionado às branches principais. 
O pipeline executa, em containers paralelos (Ubuntu), as verificações de Backend (Instala dependências do SO, Python e roda o Black/Flake8) e Frontend (Efetua o `npm ci` no Node 20 e roda a suíte Jest completa). Isso blinda os ambientes contra quebras de compatibilidade ou erros lógicos.

---

## 7. Padrão de Versionamento (Git Flow Modificado)

Nossa esteira de entrega se apoia diretamente na nossa arquitetura de branches. Siga rigidamente a nomenclatura e os papéis de cada branch:

- **`main`**: Código em estado de **Produção**. Estável, imutável diretamente (recebe merges apenas de `staging` ou `hotfix`).
- **`staging`**: Ambiente de homologação. Reúne funcionalidades de desenvolvimento prontas para testes finais. Funciona como espelho exato antes de enviar à produção.
- **`develop`**: A principal ramificação iterativa de desenvolvimento interno integrado. Aqui residem as validações contínuas.
- **`feature/nome-da-feature`**: Para novos desenvolvimentos. Elas nascem a partir de `develop` e morrem ao retornar via PR para a mesma. 
- **`bugfix/nome-da-correcao`**: Para correções de bugs encontrados nos testes a partir da branch `staging` (ou `develop`).
- **`hotfix/nome-da-correcao`**: Para correções de emergência originadas a partir da branch `main`. (Importante: ao finalizar a correção, deve-se fazer o back-merge em cascata para `staging` e `develop` garantindo que a correção não seja perdida nos próximos deploys).


