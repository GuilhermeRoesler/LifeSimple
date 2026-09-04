---
name: life-simple-overview
description: >-
  Especificação geral do Life Simple — stack, pastas, scripts, env, CI/CD e
  restrições de segurança. Use ao iniciar trabalho no repo, alterar arquitetura,
  rotas, deploy, variáveis de ambiente ou decisões cross-cutting.
---

# Life Simple — Overview

## Produto

Landing **one-page** responsiva para farmácia de manipulação **Life Simple** (Porto Alegre), com:

- Catálogo filtrável + modal + CTA WhatsApp
- FAQ (JSON-LD), depoimentos, contato com consentimento LGPD
- Páginas legais `/privacidade`, `/termos`, `/lgpd`
- Chatbot flutuante (lazy) via proxy Gemini + Firebase Auth anônima

Conversão principal: **WhatsApp**. Tom: educado, atencioso, sem diagnóstico/prescrição.

## Stack

| Camada | Tecnologia |
|--------|------------|
| UI | React 19, TypeScript strict, Vite 8 |
| Estilo | Tailwind CSS 4 + shadcn/ui (Radix) |
| Rotas | react-router-dom 7 (`BrowserRouter` + `basename` de `BASE_URL`) |
| Backend chat | Node (`server/`) + plugin Vite (`plugins/geminiApiPlugin.ts`) |
| Auth/histórico | Firebase Auth anônima + Firestore |
| LLM | Google Gemini — **somente servidor** |
| Testes | Vitest |

## Estrutura

```
src/
  components/   # Seções da landing + ui/ (shadcn)
  constants/    # Contatos, mapas, SITE_NAME
  data/         # Catálogo e FAQ
  hooks/        # useChat
  lib/          # format, whatsapp, utils (cn, publicUrl)
  pages/        # Index, legais, 404
  services/     # firebase, gemini (cliente → /api/chat)
  types/        # Product, ContactForm
server/         # Proxy Gemini + production.ts
plugins/        # geminiApiPlugin (dev/preview)
public/         # assets, robots, sitemap
```

## Scripts

| Comando | Uso |
|---------|-----|
| `npm run dev` | Dev + proxy `/api/chat` (porta 8080) |
| `npm run build` | `tsc -b` + Vite build |
| `npm run typecheck` | Só TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run preview` | Preview + proxy |
| `npm run start` | Serve `dist/` + API (produção local) |

## Env (regras de ouro)

- `GEMINI_API_KEY` — **nunca** com prefixo `VITE_` (não entra no bundle)
- `VITE_*` — só o que o cliente precisa (site URL, Firebase client config)
- `TRUST_PROXY` — só em produção atrás de reverse proxy (rate limit por IP)
- Template: `.env.example`

## Deploy

- **GitHub Pages**: só front estático — chatbot **não** funciona sem host da API
- Produção com chat: `npm run start` (ou mesmo handler) + `GEMINI_API_KEY` no servidor
- CI: `.github/workflows/ci.yml` (lint → typecheck → test → build)
- Pages: `.github/workflows/deploy-pages.yml`

## Princípios

1. Não expor secrets no cliente; chat sempre via `POST /api/chat`
2. Contatos e catálogo vêm de `constants/` e `data/` — uma fonte
3. Manter TypeScript strict; tipar em `src/types/`
4. Chatbot lazy em `Index` (`Suspense`)
5. Imagens públicas via `publicUrl()` para respeitar `BASE_URL` (GitHub Pages)

## Skills relacionadas

- UI/componentes → `life-simple-frontend`
- Chat/API → `life-simple-chat-api`
- Catálogo/contato/legais → `life-simple-content`
