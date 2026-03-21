# ⚛️ Guia do Frontend (Next.js)

Este diretório contém a camada de apresentação do projeto Dadland, baseada no Next.js (App Router).

## Tecnologias e Frameworks

- **Next.js 16+:** Framework React para construção da aplicação, roteamento (App Router) e renderização na nuvem (Server-Side) / cliente (Client-Side).
- **React 19+:** Biblioteca componentizada de construção de interfaces.
- **Tailwind CSS v4:** Framework CSS utilitário integrado via PostCSS.
- **TypeScript:** Para consistência, tipagem estática do código e DX fluida.
- **Jest & React Testing Library:** Suítes combinadas focadas na validação unitária.
- **ESLint:** Linter para uniformizar a padronização e prevenir defeitos críticos.

## Estrutura de Pastas de Desenvolvimento

A organização aderida respeita os conceitos do Next.js moderno:

```text
dadlandfrontend/
├── app/               # Rotas, diretórios aninhados, layouts principais e páginas construídas do software
├── public/            # Assets estáticos servidos no root da aplicação (fonts, svg, imagens)
├── __tests__/         # Agrupador rigoroso de todos os testes unitários do projeto (Jest)
├── package.json       # Manifesto de pacote e bibliotecas contendo também os scripts do dev
├── eslint.config.mjs  # Aterramento das checagens do Linter
├── postcss.config.mjs # Processamento do Tailwind via CLI
└── tsconfig.json      # As regras imperativas de uso do TypeScript Server
```

## Comandos Essenciais do `package.json`

Ainda que o ciclo de build local completo possa ser executado puramente pelo Docker Compose de forma unificada, possuímos os atalhos disponíveis localmente que você usará com frequência na plataforma se necessitar rodar pontualmente do seu computador:

- **`npm run dev`**: Inicializa o servidor localmente habilitando o Live Reload no `localhost:3000`.
- **`npm run lint`**: Analisador estático contra a formatação nativa para identificar deslizes.
- **`npm run test`**: Ativa a suíte `jest` de ponta a ponta informando se ocorreu quebra de código nos seus testes.
- **`npm run test:watch`**: Aciona os testes interativos para quem opta por práticas com o código espelhando e recarregando os testes.

## ⚠️ A Importância do `npm install` Local (Estando com o Docker Ligado)

A infraestrutura roda magicamente com o `docker compose up --build` – ele instalará o script todo debaixo d'agua do contêiner, e então construirá o localhost, mas:

**É MANDATÓRIO executar o comando `npm install` da sua máquina de desenvolvedor no diretório de trabalho `dadlandfrontend/` e na raiz do projeto.**

Isso ocorre porque sua **IDE (VSCode, WebStorm, etc)** está instalada _na sua máquina (host)_ e precisa entender ativamente para onde os objetos da API são construídos e o suporte nativo.
Com o npm install executado visualmente na raiz do frontend, os seguintes suportes fluirão naturalmente:
1. O Linter base da IDE reconhecerá a árvore de caminhos reportando problemas antes mesmo do build explodir;
2. As extensões oficiais como o de Tailwind Intellisense começarão a trabalhar autocompletando cores ou responsividade de forma contínua;
3. O autocompletar e o formatador centralizado da equipe (Prettier/ESLint) trabalhará com assertividade e você não ficará parando para observar logs de imports falhos.
