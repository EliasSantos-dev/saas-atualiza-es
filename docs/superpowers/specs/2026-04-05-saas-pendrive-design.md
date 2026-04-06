# SaaS Pendrive Automotivo - Design Specification (v2 - MongoDB & Auto-Update)

## 1. Visão Geral do Produto
Plataforma B2B2C para curadoria e comercialização de repertórios musicais automotivos. 
*   **Revendedores:** Criam e personalizam "perfis de pendrive".
*   **Clientes Finais:** Compram o acesso à atualização do perfil de um revendedor específico.
*   **Plataforma:** Provê o motor de download, processamento de áudio, infraestrutura de pagamentos e o app de sincronização.

## 2. O Ecossistema de Revenda

### 2.1. Perfis de Pendrive (Curadoria)
*   **Modo Manual:** O revendedor escolhe cada CD/música, faz uploads e organiza as 32 pastas do zero.
*   **Modo Piloto Automático (Auto-Update):** O revendedor assina um "Canal de Tendências" da plataforma (ex: Canal Sertanejo Gold, Canal Paredão Top). O sistema atualiza as pastas dele automaticamente assim que o nosso robô detecta novidades no "Sua Música" ou YouTube, mantendo o pendrive dele sempre "fresco" para o cliente final sem que ele precise logar no sistema.
*   **Modo Híbrido:** O revendedor usa o nosso "Template Gold" como base, mas trava algumas pastas fixas (ex: "Meus Melhores Sets") e deixa outras no automático.

### 2.2. Monetização e Marketplace
*   **Links de Venda:** Cada revendedor tem uma URL única (ex: `saaspendrive.com/kelcds`).
*   **Split de Pagamento:** Integração com Gateway (Stripe/Asaas). 
    *   Ex: Cliente paga R$ 50 -> R$ 10 (Plataforma) + R$ 40 (Revendedor).
*   **Dashboard do Revendedor:** Gráficos de vendas, gestão de clientes e ferramentas de marketing (gerador de capas/banners automáticos).

## 3. Arquitetura Técnica

### 3.1. Banco de Dados: MongoDB
Usaremos o Mongo pela sua natureza documental, ideal para representar árvores de arquivos:
*   **Coleção `Users`:** Dados de revendedores e clientes finais.
*   **Coleção `Profiles`:** Define a estrutura do pendrive (ID do revendedor, nome do perfil, configurações de auto-update).
*   **Coleção `Structures`:** Onde a "mágica" acontece. Um documento por perfil contendo um array aninhado de pastas e subpastas:
    ```json
    {
      "profile_id": "rev_01",
      "version": "2026.04",
      "folders": [
        {
          "index": "01",
          "name": "HITS",
          "auto_update": true,
          "source": "suamusica_trending",
          "items": [...]
        }
      ]
    }
    ```
*   **Coleção `Media_Library`:** Cadastro global de todas as músicas já processadas (evita duplicidade de arquivos no storage).

### 3.2. Motor de Download (Python + yt-dlp + ffmpeg)
*   **Workers em Background:** Processam as filas de download e conversão.
*   **Normalização de Áudio:** Padronização de volume para evitar oscilações no som do carro.
*   **Metadata Injection:** Inserção automática de capas e informações nas tags ID3.

### 3.3. Entrega e Sincronização
*   **API de Diferencial (Delta):** O App Desktop envia a lista de arquivos atuais do pendrive; a API responde apenas o que deve ser deletado, renomeado ou baixado.
*   **Storage Otimizado:** Uso de CDN para garantir que o download das músicas no carro seja o mais rápido possível.

## 4. Fases de Desenvolvimento (SDD)
1.  **Fase 1: Engine de Processamento:** Crawler do Sua Música e conversor MP3 320kbps.
2.  **Fase 2: Estrutura MongoDB & API:** CRUD de perfis e pastas virtuais.
3.  **Fase 3: Modo Piloto Automático:** Lógica de atualização programada (Cron jobs).
4.  **Fase 4: Dashboard & Checkout:** Painel do revendedor e integração de pagamento.
5.  **Fase 5: Sincronizador Desktop:** O App de "um clique" para o cliente final.
