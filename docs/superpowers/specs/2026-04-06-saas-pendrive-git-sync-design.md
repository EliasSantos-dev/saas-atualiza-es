# Plano de Implementação - SaaS Pendrive (MVP Git-like Sync)

## 1. Visão Geral do Produto (MVP)
A plataforma SaaS Pendrive vai fornecer um Pendrive atualizado automaticamente com as músicas mais tocadas do Brasil, funcionando no modelo "Plug & Play". 
Nesta fase inicial (MVP), teremos **1 Perfil Único Oficial** (baseado no repertório do Kel CDs de Abril).

*   **Foco do MVP:** Construir o motor que constrói a árvore JSON baseada em pastas locais, e o App Sincronizador (Desktop/Mobile) que faz o "git pull" (Delta Sync) para o pendrive do cliente.

## 2. Escopo do Desenvolvimento Atual

### 2.1. O Perfil Base (Local Folder -> JSON)
*   Em vez de fazer scraping (baixar da internet) para os CDs iniciais, o sistema vai ler uma pasta local no PC (ex: `16GB ATUALIZAÇÃO ABRIL 2026 KEL CDS`).
*   O sistema vai varrer cada subpasta, ler os arquivos MP3, e montar o **Manifesto JSON Inicial** (com os caminhos e Hashes SHA-256 de cada música).
*   **Auto-Update Complementar:** O Robô rodará diariamente para buscar novidades e atualizar a base automaticamente:
    *   **Sua Música:** Verificar se há novos CDs/atualizações nas páginas/perfis de referência.
    *   **Spotify:** Baixar as novidades das playlists "Top Brasil" e "Top Semana" usando o YouTube.

### 2.2. O Mecanismo "Git-like" (Sincronização Delta)
*   **O Manifesto Local (`.saas-pendrive.json`):** Arquivo oculto na raiz do pendrive contendo o `Profile ID` e a `Version` atual instalada.
*   **O Hash Check (Robustez):** O App varre os arquivos mp3 do pendrive e gera um hash (SHA-256) garantindo integridade.
*   **A Chamada Delta (API):** O App compara o estado real do pendrive com a versão na API (Backend).
*   **Strict Mirror (Full Sync):** O pendrive espelha exatamente a Nuvem. Arquivos pessoais ou fora do perfil serão DELETADOS.

### 2.3. Aplicativos Clientes (Sincronizadores)
*   **Autenticação (Segurança):** Ambos os aplicativos terão uma tela de **Login** inicial (E-mail e Senha). O login vai gerar um **Token JWT** que será usado para comunicar de forma segura com a API na nuvem, garantindo que apenas assinantes consigam fazer o "Git Pull".
*   **App Desktop (Electron + React):** Interface para PC. Processa o diff através de comunicação autenticada com a Nuvem.
*   **App Mobile (React Native + OTG):** App Android para atualizar via conexão OTG pelo celular.

### 2.4. Banco de Dados e Versionamento
*   **Backend FastAPI + MongoDB:** Guardará os "Snapshots" das músicas e gerenciará as contas de usuários (Auth, Cadastro, JWT). A Versão 1 de música será a árvore local do mês de Abril.

## 3. Plano de Fases (Foco MVP)

*   **Fase 1:** Script de Importação Local (Gerador do JSON Base a partir da pasta do PC) + Engine Complementar (Spotify).
*   **Fase 2:** Backend FastAPI & MongoDB (Armazenamento de Snapshots e Cálculo de Delta).
*   **Fase 3:** App Desktop Sincronizador (Electron + React) para "Git Pull".
*   **Fase 4:** App Mobile Sincronizador via OTG (React Native).

---

### Tarefas Imediatas para Execução (Fase 1 Engine)
1. Construir o script (`importer.py`) para ler a pasta local "Atualização Abril", gerar Hashes SHA-256 de cada arquivo e exportar a estrutura como um arquivo JSON inicial.
2. Construir o script (`crawler.py`) para raspar o Top Brasil e Top Semana do Spotify.
3. Construir o script (`suamusica_crawler.py`) para monitorar atualizações em perfis/CDs alvo no Sua Música.
4. Integrar o motor `yt-dlp` e `ffmpeg` para processar e formatar as músicas novas que o robô encontrar.