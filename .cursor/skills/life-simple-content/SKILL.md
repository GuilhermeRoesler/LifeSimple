---
name: life-simple-content
description: >-
  Fontes de verdade de conteúdo do Life Simple — produtos, FAQ, contatos,
  WhatsApp, páginas LGPD/legais e SEO estático. Use ao editar catálogo, textos
  institucionais, contato, privacidade, termos, sitemap ou robots.
---

# Life Simple — Conteúdo e dados

## Fontes únicas (não duplicar)

| Conteúdo | Arquivo |
|----------|---------|
| Produtos | `src/data/products.ts` (`initialProducts`, `productNames`, `buildProductCatalogForPrompt`) |
| FAQ | `src/data/faq.ts` (`faqItems`, `buildFaqForPrompt`) |
| Contato / mapas / marca | `src/constants/contact.ts` |
| Tipos | `src/types/index.ts` (`Product`, `ContactForm`) |
| Links WhatsApp | `src/lib/whatsapp.ts` + `WHATSAPP_NUMBER` |
| SEO crawlers | `public/sitemap.xml`, `public/robots.txt` |

UI e server (system prompt do chat) **consomem** esses módulos — não copiar strings.

## Produto (`Product`)

```ts
{
  id: string;                    // ex.: m-emag-01
  nome: string;
  categoria: 'Emagrecimento' | 'Academia' | 'Pele';
  descricao_curta: string;
  descricao_longa: string;
  preco: string;                 // decimal string, ex. "79.90"
  imagem: string;                // path em public/, ex. "/img/slim.webp"
}
```

### Ao adicionar produto

1. Incluir objeto em `initialProducts` na categoria correta
2. Colocar imagem WebP em `public/img/` (rodar `npm run optimize:images` se a fonte for PNG/JPG) e apontar `imagem`
3. Garantir que `productNames` (export derivado) continue coerente — o chat lista produtos
4. Tom: apoio/bem-estar; **sem** alegações clínicas absolutas; reforçar orientação profissional quando fizer sentido
5. `preco` como string numérica; formatação na UI via `lib/format`

IDs estáveis (`m-emag-*`, `m-acad-*`, `m-pele-*`) — evitar renomear IDs já linkados.

## Contato

Campos em `constants/contact.ts`:

- `WHATSAPP_NUMBER` (E.164 sem `+`, ex. `5551...`)
- `PHONE_DISPLAY`, `EMAIL`, `ADDRESS` / `ADDRESS_LINES`
- `BUSINESS_HOURS`, `MAPS_EMBED_URL`, `MAPS_LINK`
- `INSTAGRAM_URL`, `SITE_NAME`

Mensagens pré-preenchidas do WhatsApp: montar via `openWhatsApp` / `buildWhatsAppUrl`.

## FAQ

- Itens em `data/faq.ts`; componente `Faq` + schema JSON-LD
- Perguntas alinhadas ao negócio real (prazos, receita, retirada, etc.)
- Ao mudar FAQ, revisar se o JSON-LD no componente ainda cobre os itens

## Páginas legais

- `/privacidade`, `/termos`, `/lgpd` sob `LegalLayout`
- Manter coerência com consentimento do formulário de contato
- Textos institucionais (CNPJ, endereço, e-mail) devem espelhar `constants/contact` quando aplicável

## SEO estático

- Atualizar `public/sitemap.xml` e Sitemap em `public/robots.txt` com domínio real (`VITE_SITE_URL`)
- OG/canonical dependem de `VITE_SITE_URL` no HTML/build — sem barra final

## Tom de voz

- Português BR, claro, acolhedor
- Farmácia de manipulação: qualidade, orientação, segurança
- Chat e copy de marketing: **não** diagnosticar nem prescrever

## Checklist

- [ ] Sem telefone/e-mail/endereço hardcoded em JSX
- [ ] Nova imagem existe em `public/img/`
- [ ] Categoria é uma das três union types
- [ ] Sitemap/robots coerentes com URL pública
- [ ] Alterações de catálogo refletidas no assistente via `productNames`
