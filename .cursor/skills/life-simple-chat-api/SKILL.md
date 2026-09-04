---
name: life-simple-chat-api
description: >-
  Contrato e segurança do chatbot Life Simple — POST /api/chat, Firebase ID
  token, rate limit, limites de payload, prompt do sistema, Firestore e cliente
  useChat/gemini. Use ao alterar server/, plugins/, services/, useChat ou
  Chatbot.
---

# Life Simple — Chat / API

## Arquitetura

```
Chatbot → useChat → services/gemini (fetch stream)
                         ↓
              POST /api/chat  Authorization: Bearer <Firebase ID token>
                         ↓
     plugins/geminiApiPlugin (dev/preview)  |  server/production.ts (start)
                         ↓
              server/geminiApi.ts  →  Google Gemini (SSE)
```

Histórico: Firestore `chats/{uid}/messages` (regras em `firestore.rules`).
Erros de envio ficam só no cliente (ephemeral) — não gravam no Firestore.

## Contrato `POST /api/chat`

**Headers**

- `Authorization: Bearer <Firebase ID token>` (obrigatório)
- `Content-Type: application/json`

**Body**

```ts
{ message: string; history?: { role: 'user' | 'model'; text: string }[] }
```

Validação em `server/chatLimits.ts`:

| Limite | Valor |
|--------|-------|
| Body | 16 384 bytes |
| Mensagem | 2 000 chars |
| History | últimos 12 itens |
| Item history | 2 000 chars |

**Auth**

- Extrair Bearer → `verifyFirebaseIdToken` (`server/firebaseAuth.ts`)
- Project ID: `FIREBASE_PROJECT_ID` ou fallback `VITE_FIREBASE_PROJECT_ID`

**Rate limit** (`server/rateLimit.ts`)

- Janela 60 s, máx. 20 hits
- Chaves: IP **e** `uid`
- IP: `X-Forwarded-For` só se `TRUST_PROXY=true`
- Persistência em `.data/rate-limit.json` (sobrevive a restart na mesma máquina)

**Resposta**

- Sucesso: `text/plain; charset=utf-8` em stream (chunks do modelo)
- Erros: 400/401/413/429/5xx com JSON `{ error }` (sem vazar stack/keys)

## Prompt do sistema (`buildSystemPrompt`)

- Assistente da Life Simple; tom educado; **não** se apresentar como IA
- **Nunca** diagnosticar nem prescrever
- Contato de `constants/contact`; catálogo via `buildProductCatalogForPrompt`; FAQ via `buildFaqForPrompt`
- Incluir link `https://wa.me/{WHATSAPP_NUMBER}` quando orientar contato

## Cliente

- `services/firebase.ts` — auth anônima
- `services/gemini.ts` — stream `/api/chat` com token; **sem** chave Gemini
- `hooks/useChat.ts` — estado, streaming, anti-double-send, erros ephemeral
- `Chatbot.tsx` — UI flutuante, quick replies, links WhatsApp; manter lazy no Index

## Firestore (`firestore.rules`)

```
chats/{userId} e messages: read/write só se request.auth.uid == userId
```

Não abrir leitura pública. Auth anônima deve estar ativa no console Firebase.

## Checklist de mudança segura

- [ ] Nenhuma `VITE_` com chave Gemini
- [ ] Validação de body/history inalterada ou com limites explícitos
- [ ] Rate limit por IP e uid preservado
- [ ] Token Firebase obrigatório
- [ ] Testes em `server/chatLimits.test.ts` / `rateLimit` atualizados se mudar limites
- [ ] Dev (`vite` plugin) e `production.ts` compartilham o mesmo handler
- [ ] Sucesso continua em stream `text/plain`; erros em JSON

## O que evitar

- Chamar Gemini direto do browser
- Confiar em IP sem `TRUST_PROXY` em produção com proxy
- Afrouxar regras Firestore
- Prescrição/diagnóstico no system prompt
- Gravar mensagens de erro de API no Firestore (polui o history do modelo)
