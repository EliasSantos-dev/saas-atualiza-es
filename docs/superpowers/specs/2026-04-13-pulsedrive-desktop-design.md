# PulseDrive Desktop - Design Specification (MVP)

## 1. Visão Geral do Produto
O **PulseDrive** é o aplicativo desktop oficial para sincronização de repertórios automotivos. Ele conecta a curadoria de alta qualidade da nuvem (SaaS Pendrive) diretamente ao hardware do usuário (Pendrive USB), garantindo que o som do carro esteja sempre atualizado com um clique, sem a necessidade de downloads manuais ou organização de pastas.

## 2. Identidade Visual (Pulse Red Edition)
A interface deve transmitir energia, tecnologia e robustez, alinhada ao público de som automotivo.

*   **Esquema de Cores:**
    *   **Background (Fundo):** `#0B0E14` (Preto Profundo).
    *   **Surface (Cards/Painéis):** `#161B22` (Cinza Metálico Escuro).
    *   **Accent (Destaque):** `#FF3B3B` (Vermelho Pulse).
    *   **Border:** `#30363D` (Cinza Sutil).
    *   **Text Primary:** `#F0F6FC` (Branco Off-white).
    *   **Text Secondary:** `#8B949E` (Cinza Muted).
*   **Tipografia:** Inter ou Manrope (Sans-serif moderna).
*   **Estética:** Cantos arredondados (8px), sombras suaves, efeitos de "glow" em elementos ativos e estados de hover.

## 3. Arquitetura de Telas

### 3.1. Dashboard Principal (Estado Aberto)
A tela inicial onde o usuário aterrissa ao abrir o app.
*   **Hero Section (Hub):**
    *   Grande card visual com a capa do "Repertório Oficial do Mês".
    *   Título: "Atualização de Abril - Kel CDs".
    *   Subtítulo: "O som mais tocado nos paredões do Brasil agora no seu pendrive."
    *   Botão de Ação: "ATUALIZAR MEU PENDRIVE" (Botão grande, vermelho, com ícone de sincronismo).
*   **Activity Feed (O Pulso):**
    *   Painel lateral ou inferior mostrando a "Atividade do Sistema".
    *   Exibe as últimas músicas adicionadas pelo robô de curadoria.
    *   Exemplo: `Artista - Nome da Música [320kbps]`.
*   **Footer de Status:**
    *   Indicador de conexão USB: `[USB Detectado: E:/]` ou `[Aguardando Pendrive...]`.
    *   Barra de espaço em disco do pendrive.

### 3.2. Fluxo de Autenticação (Modal)
*   Exibido apenas quando o usuário tenta sincronizar ou acessar áreas restritas.
*   Campos: E-mail e Senha.
*   Link para "Assinar Plano" (redireciona para Web Dashboard).

### 3.3. Tela de Sincronização (Progresso)
*   Substitui o botão de ação por uma barra de progresso circular ou linear em vermelho.
*   Log de atividades em tempo real:
    *   `[Limpando] Removendo músicas antigas...`
    *   `[Download] Baixando: Artista - Música (15/120)...`
*   Mensagem Final: "Sucesso! Pendrive pronto para o som."

## 4. Funcionamento Técnico (Engine)
*   **Detecção de USB:** O app deve listar apenas unidades removíveis para evitar sobrescrever discos do sistema.
*   **Delta Sync Logic:**
    1. Lê o arquivo oculto `.pulse-drive.json` no pendrive (se existir).
    2. Envia a lista de arquivos atuais e versão para a API.
    3. Recebe a lista de instruções (DELETE, DOWNLOAD, RENAME).
    4. Executa as operações localmente.
*   **Normalização & Tags:** O backend já entrega os arquivos processados, mas o app deve garantir que as capas (APIC) e metadados ID3 estejam íntegros ao salvar no disco.

## 5. Próximos Passos
1. Implementar o novo Layout React com Tailwind CSS.
2. Integrar a lógica de detecção de USB com o Electron `ipcMain`.
3. Criar os Modais de Autenticação integrados à API FastAPI.
