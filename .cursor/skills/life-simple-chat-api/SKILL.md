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
Chatbot → useChat → services/gemini (fetch)
                         ↓
              POST /api/chat  Authorization: Bearer <Firebase ID token>
                         ↓
     plugins/geminiApiPlugin (dev/preview)  |  server/production.ts (start)
                         ↓
              server/geminiApi.ts  →  Google Gemini
```

Histórico opcional: Firestore `chats/{uid}/messages` (regras em `firestore.rules`).

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

**Rate limit**

- Janela 60 s, máx. 20 hits
- Chaves: IP **e** `uid`
- IP: `X-Forwarded-For` só se `TRUST_PROXY=true`

**Resposta**

- Sucesso: texto do modelo (JSON conforme handler atual)
- Erros: 400/401/413/429/5xx com mensagem segura (sem vazar stack/keys)

## Prompt do sistema (`buildSystemPrompt`)

- Assistente da Life Simple; tom educado; **não** se apresentar como IA
- **Nunca** diagnosticar nem prescrever
- Dados de contato/horário/produtos vêm de `constants/contact` + `productNames`
- Sem resposta útil → orientar WhatsApp / e-mail / endereço

Ao mudar catálogo ou contato, o prompt já reflete automaticamente se usar essas fontes.

## Cliente

- `services/firebase.ts` — auth anônima
- `services/gemini.ts` — só chama `/api/chat` com token; **sem** chave Gemini
- `hooks/useChat.ts` — estado, envio, erros de rate limit/rede
- `Chatbot.tsx` — UI flutuante; manter lazy no Index

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
- [ ] Testes em `server/chatLimits.test.ts` atualizados se mudar limites
- [ ] Dev (`vite` plugin) e `production.ts` compartilham o mesmo handler

## O que evitar

- Chamar Gemini direto do browser
- Confiar em IP sem `TRUST_PROXY` em produção com proxy
- Afrouxar regras Firestore
- Prescrição/diagnóstico no system prompt
