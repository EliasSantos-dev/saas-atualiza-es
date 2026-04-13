# Fase 5: Dashboard Next.js & Stripe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a Landing Page comercial, Dashboard Admin e integração de pagamentos com Stripe para o SaaS Pendrive.

**Architecture:** Frontend em Next.js (App Router) consumindo a API FastAPI. Pagamentos via Stripe Hosted Checkout. Liberação de acesso via Webhooks no Backend.

**Tech Stack:** Next.js 14, Tailwind CSS, Axios, Stripe SDK.

---

### Task 1: Landing Page Comercial (Vitrine)

**Files:**
- Create: `src/web-dashboard/src/app/page.tsx`
- Modify: `src/web-dashboard/src/app/globals.css`

- [ ] **Step 1: Implement Landing Page Hero and CTA**
```tsx
// src/web-dashboard/src/app/page.tsx
import { Disc, Zap, Music, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="p-6 flex justify-between items-center border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2"><Disc className="text-green-500" /> SaaS Pendrive</h1>
        <button className="bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium">Entrar</button>
      </nav>
      
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          O "Git Pull" do seu som automotivo.
        </h2>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          Esqueça copiar e colar. Plugue seu pendrive e atualize para o Top 100 Brasil e Sua Música com um clique. 320kbps e volume normalizado sempre.
        </p>
        <button className="bg-green-600 hover:bg-green-500 transition-colors px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2 mx-auto">
          Garantir Atualização de Abril <ArrowRight size={20} />
        </button>
      </section>
    </main>
  )
}
```

---

### Task 2: Integração de Checkout (Stripe)

**Files:**
- Create: `src/api/routers/payments.py`
- Modify: `src/api/main.py`

- [ ] **Step 1: Implement Stripe Checkout Session in FastAPI**
```python
# src/api/routers/payments.py
import stripe
from fastapi import APIRouter, Header, Request

stripe.api_key = "sk_test_..." # Use env var

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/create-checkout-session")
async def create_checkout(user_id: str):
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': 'price_id_abril',
            'quantity': 1,
        }],
        mode='payment',
        success_url='http://localhost:3000/success',
        cancel_url='http://localhost:3000/cancel',
        client_reference_id=user_id
    )
    return {"url": session.url}
```

- [ ] **Step 2: Implement Webhook for payment confirmation**
```python
@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    # Verify signature and update user status in DB
    # await db.users.update_one({"id": session.client_reference_id}, {"$set": {"is_active": True}})
    return {"status": "success"}
```

---

### Task 3: Dashboard Administrativo (Snapshot Control)

**Files:**
- Create: `src/web-dashboard/src/app/admin/page.tsx`

- [ ] **Step 1: Implement Admin View for Snapshots**
```tsx
// src/web-dashboard/src/app/admin/page.tsx
export default function Admin() {
  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-8">Painel Administrativo</h1>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold mb-4">Últimas Versões do Pendrive</h3>
        {/* Map through snapshots from API */}
        <div className="flex justify-between items-center p-4 bg-slate-950 rounded-lg">
          <div>
            <p className="font-mono">v1.0 - Atualização de Abril</p>
            <p className="text-xs text-slate-500">Criado em: 06/04/2026</p>
          </div>
          <span className="bg-green-900 text-green-400 px-3 py-1 rounded-full text-xs font-bold">ATIVA</span>
        </div>
      </div>
    </div>
  )
}
```
