# SaaS Pendrive - Design Specification (Fase 5: Dashboard & Checkout)

## 1. Visão Geral
A Fase 5 foca na comercialização e gestão do produto. Teremos um frontend em Next.js que servirá tanto como vitrine para novos clientes quanto como painel de controle para o administrador.

## 2. Componentes do Frontend (Next.js)

### 2.1. Landing Page Comercial
*   **Hero Section:** Pitch de vendas focando na facilidade do "Plug & Play" e na qualidade do áudio (320kbps + Normalização).
*   **Preços:** Card de oferta única para a atualização de Abril ou Assinatura Anual.
*   **Login/Cadastro:** Fluxo integrado com a API FastAPI (JWT).

### 2.2. Admin Dashboard (Protegido)
*   **Métricas:** Total de vendas (via Stripe API integration), usuários ativos.
*   **Controle de Snapshots:** Interface para visualizar o `manifest.json` atual na nuvem e disparar a "promoção" de um novo snapshot para a versão estável.
*   **Log de Sincronização:** Ver quais usuários fizeram "Git Pull" recentemente.

## 3. Fluxo de Pagamento (Stripe)

1.  **Início:** Usuário clica em "Comprar" no Next.js.
2.  **Checkout:** Redirecionamento para o Stripe Checkout (Seguro).
3.  **Confirmação:** Após o pagamento, o Stripe envia um **Webhook** para o Backend FastAPI (`/payments/webhook`).
4.  **Liberação:** O Backend localiza o usuário pelo e-mail e ativa o acesso (`is_active = True`).
5.  **Sync:** O usuário abre o App Desktop/Mobile, faz login, e o botão "Sincronizar" fica habilitado.

## 4. Pilha Tecnológica
*   **Framework:** Next.js 14 (App Router).
*   **Estilização:** Tailwind CSS + Lucide React (ícones).
*   **Gateway de Pagamento:** Stripe.
*   **Deploy Sugerido:** Vercel (Frontend) e a mesma infra do FastAPI (Backend).

## 5. Critérios de Aceite
1.  Um novo usuário consegue se cadastrar e pagar via Stripe.
2.  O Admin consegue ver que o pagamento foi aprovado no painel.
3.  O acesso à sincronização no App só é liberado para usuários com pagamento ativo.
