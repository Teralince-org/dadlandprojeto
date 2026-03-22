# 🐳 Guia de Infraestrutura (Docker)

Este diretório contém a orquestração oficial para erguer e modelar uniformemente a nossa árvore inteira local do projeto Dadland e interconectar a malha de rede em Docker. Mantemos com segurança o ambiente virtualizado em um único provedor via `docker-compose.yml`.

## Serviços Configurados e Portas Mapeadas Associativas

Nosso Compose invoca as instâncias dos microsserviços do projeto utilizando três contêineres paralelos:

1. **`db` (PostgreSQL 16):**
   - **Mapeamento/Bind:** Porta host e interna espelhadas na porta **`5432`**.
   - **Responsabilidade:** Única central para o armazenamento das abstrações modeladas vindos do Django e injetados com credenciais exclusivas. Mantemos este canal de porta exposto a fim de você (host da máquina de desenvolvimento) conectar externamente seus softwares para consultas ou debugar diretamente (Ex: DBeaver, PGAdmin).

2. **`backend` (Camada da API - Django):**
   - **Mapeamento/Bind:**  Porta mapeada **`8000`**.
   - **Responsabilidade:** Alojamento local do serviço do framework para a lógica. Possui uma trava na rotina onde apenas habilita requisições aos modelos após o healthcheck certificar o serviço do `db` disponível.

3. **`frontend` (Camada de Tela - Next.js):**
   - **Mapeamento/Bind:** Porta **`3000`**.
   - **Responsabilidade:** Renderiza os portfólios no seu navegador enquanto consulta as redes unificadas base do `backend` (porta 8000) por rede invisível em formato `bridge` e rede de nomes.

## Volumes Persistentes

Um de nossos cuidados explícitos ao trabalhar com contêineres descartáveis foi focar em gravar com eficácia permanente um Volume.  
Temos um volume com o flag `postgres-data`. Uma vez que você interrompe (`stop` ou `down`) a plataforma do Postgres de rodar, ou até reiniciar a sua máquina particular, toda base de dados e seeds aplicadas na carga da rota se mantêm blindadas.

## Comandos, Limpeza de Serviços e Debugging (Troubleshooting)

Estes são os principais canais de gestão e verificação vitais do sistema do Docker do repósitorio:

**1. Rodando todo o Ambiente Completo Localmente:**
A partir da raiz do repositório digite:
```bash
docker compose -f dadlandinfra/docker-compose.yml up -d --build
```
*(As flags `-d` liberam a janela do processo enquanto o `--build` compila sem retenções de cache caso mudem)*.

**2. Observando Problemas com Logs em Tempo Real:**
O código não reage como deveria ou apresenta 500 (Erro)? Visualize instantaneamente no painel a execução:
```bash
# Debugando o frontend individualmente (ou modifique para 'backend' / 'db'):
docker compose logs -f frontend
```

**3. Navegar Dentro dos Bastidores (Entrando nos Contêineres de Desenvolvimento):**
Pode ser que seja solicitado que observe o contexto visual interno acionando o Shell interativo:
```bash
docker compose exec backend sh
```

**4. Parando Provisoriamente o Motor:**
Desliga todos os pods temporariamente consumindo os serviços do cache.
```bash
docker compose stop
```

**5. Limpando Geral ("Hard Reset"): Destruindo e Reiniciando**
Algum loop no banco travou sua migração? Caso tudo perca a essência relacional das integrações e seu dia paralizar de forma bruta por conflitos nos componentes e bases sujas:

Execute com rigor em seu prompt forçando erradicação de containers passados + volumes atrelados no database:

```bash
docker compose -f dadlandinfra/docker-compose.yml down -v
```
*(Após isto, será mandatório reiniciar do zero rodando os `createsuperuser` e `migrate` originais para carregar a formatação)*.
