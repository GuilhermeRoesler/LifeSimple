---
name: life-simple-frontend
description: >-
  Convenções de UI do Life Simple — seções da landing, shadcn/ui, tokens
  Tailwind, tipografia, CTAs WhatsApp e padrões React. Use ao criar ou editar
  componentes, páginas, estilos ou layout em src/.
---

# Life Simple — Frontend

## Identidade visual

- Paleta **verde-água / branco** (`primary` ~ HSL `175 40% 45%`)
- Tokens em `:root` + `@theme inline` em `src/index.css` — preferir classes semânticas (`bg-primary`, `text-muted-foreground`) a cores soltas
- Fontes: **Inter** (corpo) e **Poppins** (títulos via utilitários do tema)
- Radius base `--radius: 0.75rem`
- Gradientes: `gradient-primary`, overlays no hero (não inventar tema roxo/escuro genérico)

## Anatomia da landing (`pages/Index.tsx`)

Ordem fixa:

1. `Header` → `Hero` → `HowItWorks` → `Products` → `Testimonials` → `Faq` → `Contact` → `Footer`
2. `Chatbot` lazy + `Suspense fallback={null}`

Âncoras: `#home`, `#produtos`, etc. — manter IDs estáveis para scroll/header.

## Componentes

| Pasta | Regra |
|-------|--------|
| `components/ui/` | Primitivos shadcn — alterar com cuidado; alinhar a `components.json` |
| `components/` | Seções de negócio — composição, não lógica de API pesada |
| `pages/` | Rotas finas; legais usam `LegalLayout` |

- Preferir componentes funcionais
- Ícones: `lucide-react` (exceção: `icons/InstagramIcon`)
- Classes: `cn()` de `@/lib/utils`
- Alias `@/` → `src/`

## Padrões de interação

- CTA principal: `openWhatsApp(mensagem)` de `@/lib/whatsapp` (nunca hardcodar `wa.me` fora desse módulo)
- Assets em `public/`: sempre `publicUrl('/caminho')` por causa do `BASE_URL` no Pages
- Formulário de contato: exige `consentimento` LGPD antes de enviar
- Modal de produto: descrição longa + preço formatado + WhatsApp com contexto do produto

## Catálogo na UI

- Dados de `initialProducts` / helpers em `utils/products` e `data/products`
- Categorias: `Emagrecimento` \| `Academia` \| `Pele`
- Filtro + busca + empty state já existem em `Products` — estender, não reinventar

## Rotas

```
/              Index
/privacidade   PrivacyPolicy
/termos        TermsOfUse
/lgpd          LgpdPage
*              NotFound
```

`basename` = `import.meta.env.BASE_URL` sem barra final.

## Acessibilidade e responsivo

- Mobile-first; breakpoints Tailwind padrão
- Imagens decorativas: `aria-hidden` quando aplicável
- Botões/links com texto claro (não só ícone sem label)

## O que evitar

- Colocar `GEMINI_API_KEY` ou lógica de chave no cliente
- Duplicar número/e-mail/endereço fora de `constants/contact.ts`
- Cards/estilos fora do design system sem necessidade
- Quebrar lazy load do chatbot
