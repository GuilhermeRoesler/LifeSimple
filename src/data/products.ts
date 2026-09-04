import type { Product } from '../types/index.ts';

/**
 * Catálogo estático — fonte única de verdade do site.
 * Para um CMS leve no futuro, substitua este módulo por fetch em build-time
 * (ex.: Notion/Sanity) mantendo o mesmo tipo `Product`.
 */
export const initialProducts: Product[] = [
  // Emagrecimento - 10 produtos
  {
    id: "m-emag-01",
    nome: "Slim Fórmula A",
    categoria: "Emagrecimento",
    descricao_curta: "Complexo termogênico com L-carnitina.",
    descricao_longa: "Composto para apoio ao emagrecimento, com L-carnitina, cafeína e inositol. Uso conforme orientação profissional.",
    preco: "79.90",
    imagem: "/img/slim.webp"
  },
  {
    id: "m-emag-02",
    nome: "Bloqueador Carbo",
    categoria: "Emagrecimento",
    descricao_curta: "Auxílio na absorção de carboidratos.",
    descricao_longa: "Fórmula com extratos naturais para auxiliar na redução da absorção de carboidratos. Faseolamina e cromo.",
    preco: "64.90",
    imagem: "/img/bloqueador-carbo.webp"
  },
  {
    id: "m-emag-03",
    nome: "Termo Fit",
    categoria: "Emagrecimento",
    descricao_curta: "Termogênico suave para uso diário.",
    descricao_longa: "Termogênico de baixa irritabilidade para auxiliar em treinos e metabolismo. Contém gengibre e pimenta cayena.",
    preco: "69.90",
    imagem: "/img/termogenico.webp"
  },
  {
    id: "m-emag-04",
    nome: "Detox Plus",
    categoria: "Emagrecimento",
    descricao_curta: "Fórmula detoxificante e diurética.",
    descricao_longa: "Blend de fitoterápicos para eliminação de toxinas e redução de retenção líquida. Chá verde, hibisco e cavalinha.",
    preco: "54.90",
    imagem: "/img/detox-plus.webp"
  },
  {
    id: "m-emag-05",
    nome: "Seca Barriga",
    categoria: "Emagrecimento",
    descricao_curta: "Redução de medidas abdominais.",
    descricao_longa: "Fórmula específica para redução de gordura localizada na região abdominal. CLA e óleo de cártamo.",
    preco: "89.90",
    imagem: "/img/seca-barriga.webp"
  },
  {
    id: "m-emag-06",
    nome: "Control Apetite",
    categoria: "Emagrecimento",
    descricao_curta: "Moderador natural de apetite.",
    descricao_longa: "Ajuda no controle da saciedade e redução da compulsão alimentar. 5-HTP e garcínia cambogia.",
    preco: "74.90",
    imagem: "/img/control-apetite.webp"
  },
  {
    id: "m-emag-07",
    nome: "Lipo Redux",
    categoria: "Emagrecimento",
    descricao_curta: "Acelerador do metabolismo lipídico.",
    descricao_longa: "Fórmula avançada para metabolização de gorduras. Contém colina, inositol e metionina.",
    preco: "94.90",
    imagem: "/img/lipo-redux.webp"
  },
  {
    id: "m-emag-08",
    nome: "Fibras Plus",
    categoria: "Emagrecimento",
    descricao_curta: "Mix de fibras solúveis e insolúveis.",
    descricao_longa: "Melhora o trânsito intestinal e aumenta a saciedade. Psyllium, ágar-ágar e glucomannan.",
    preco: "49.90",
    imagem: "/img/fibras-plus.webp"
  },
  {
    id: "m-emag-09",
    nome: "Night Burn",
    categoria: "Emagrecimento",
    descricao_curta: "Termogênico noturno sem estimulantes.",
    descricao_longa: "Ativa o metabolismo durante o sono sem afetar a qualidade do descanso. L-triptofano e cromo.",
    preco: "84.90",
    imagem: "/img/night-burn.webp"
  },
  {
    id: "m-emag-10",
    nome: "Shake Proteico Slim",
    categoria: "Emagrecimento",
    descricao_curta: "Substituto de refeição proteico.",
    descricao_longa: "Shake com proteínas, vitaminas e minerais para substituição de refeições. Whey protein e colágeno.",
    preco: "99.90",
    imagem: "/img/shake-proteico.webp"
  },

  // Academia - 9 produtos
  {
    id: "m-acad-02",
    nome: "Creatina Pura",
    categoria: "Academia",
    descricao_curta: "Creatina monohidratada farmacêutica.",
    descricao_longa: "Creatina micronizada para aumento de força e volume muscular. 100% pura, sem aditivos.",
    preco: "49.90",
    imagem: "/img/creatina.webp"
  },
  {
    id: "m-acad-03",
    nome: "Pré-Treino Focus",
    categoria: "Academia",
    descricao_curta: "Energia e foco para treinos intensos.",
    descricao_longa: "Pré-treino com cafeína, beta-alanina e taurina para melhorar desempenho. Arginina e citrulina.",
    preco: "79.90",
    imagem: "/img/pre-treino.webp"
  },
  {
    id: "m-acad-04",
    nome: "Mass Builder",
    categoria: "Academia",
    descricao_curta: "Hipercalórico para ganho de massa.",
    descricao_longa: "Fórmula completa para ganho de peso e massa muscular. Carboidratos complexos e proteínas.",
    preco: "119.90",
    imagem: "/img/construtor-massa.webp"
  },
  {
    id: "m-acad-05",
    nome: "Glutamina Premium",
    categoria: "Academia",
    descricao_curta: "L-glutamina para recuperação imunológica.",
    descricao_longa: "Glutamina pura para recuperação muscular e fortalecimento do sistema imune. Grau farmacêutico.",
    preco: "64.90",
    imagem: "/img/glutamina.webp"
  },
  {
    id: "m-acad-06",
    nome: "ZMA Complex",
    categoria: "Academia",
    descricao_curta: "Zinco, magnésio e B6 para recuperação.",
    descricao_longa: "Melhora a qualidade do sono e recuperação muscular. Aumenta níveis de testosterona natural.",
    preco: "54.90",
    imagem: "/img/ZMA.webp"
  },
  {
    id: "m-acad-07",
    nome: "Beta Alanina",
    categoria: "Academia",
    descricao_curta: "Redução de fadiga muscular.",
    descricao_longa: "Beta alanina pura para aumento de resistência e redução do ácido lático. 3.2g por dose.",
    preco: "69.90",
    imagem: "/img/beta-alanina.webp"
  },
  {
    id: "m-acad-08",
    nome: "Whey Isolado",
    categoria: "Academia",
    descricao_curta: "Proteína isolada de alta pureza.",
    descricao_longa: "Whey protein isolado com 90% de proteína. Rápida absorção e baixo teor de carboidratos.",
    preco: "139.90",
    imagem: "/img/whey-isolado.webp"
  },
  {
    id: "m-acad-10",
    nome: "Test Booster",
    categoria: "Academia",
    descricao_curta: "Estimulante natural de testosterona.",
    descricao_longa: "Tribulus terrestris, maca peruana e D-ácido aspártico. Aumento natural dos níveis hormonais.",
    preco: "109.90",
    imagem: "/img/reforco-teste.webp"
  },
  // Pele - 10 produtos
  {
    id: "m-pele-01",
    nome: "Colágeno Premium",
    categoria: "Pele",
    descricao_curta: "Colágeno hidrolisado anti-aging.",
    descricao_longa: "Colágeno tipo I e III com vitamina C e ácido hialurônico. Melhora elasticidade e reduz rugas.",
    preco: "89.90",
    imagem: "/img/colageno-premium.webp"
  },
  {
    id: "m-pele-02",
    nome: "Antioxidante Complex",
    categoria: "Pele",
    descricao_curta: "Proteção antioxidante completa.",
    descricao_longa: "Vitaminas C, E, resveratrol e licopeno. Combate radicais livres e previne envelhecimento.",
    preco: "79.90",
    imagem: "/img/antioxidante.webp"
  },
  {
    id: "m-pele-03",
    nome: "Ácido Hialurônico",
    categoria: "Pele",
    descricao_curta: "Hidratação profunda da pele.",
    descricao_longa: "Ácido hialurônico de baixo peso molecular para hidratação e preenchimento natural. Via oral.",
    preco: "124.90",
    imagem: "/img/acido-hialuronico.webp"
  },
  {
    id: "m-pele-04",
    nome: "Vitamina C Pura",
    categoria: "Pele",
    descricao_curta: "Vitamina C para luminosidade.",
    descricao_longa: "Ácido ascórbico estabilizado com bioflavonoides. Estimula colágeno e clareia manchas.",
    preco: "54.90",
    imagem: "/img/vitamina-c.webp"
  },
  {
    id: "m-pele-05",
    nome: "Ceramidas Skin",
    categoria: "Pele",
    descricao_curta: "Restauração da barreira cutânea.",
    descricao_longa: "Ceramidas naturais para reparação e proteção da barreira da pele. Ácidos graxos essenciais.",
    preco: "94.90",
    imagem: "/img/ceramidas.webp"
  },
  {
    id: "m-pele-06",
    nome: "Glutationa Clareador",
    categoria: "Pele",
    descricao_curta: "Clareamento e detox celular.",
    descricao_longa: "L-glutationa reduzida para clareamento natural da pele. Potente antioxidante e detoxificante.",
    preco: "109.90",
    imagem: "/img/glutationa.webp"
  },
  {
    id: "m-pele-07",
    nome: "Zinco Quelado",
    categoria: "Pele",
    descricao_curta: "Cicatrização e controle oleosidade.",
    descricao_longa: "Zinco bisglicinato para tratamento de acne e cicatrização. Regula produção sebácea.",
    preco: "39.90",
    imagem: "/img/zinco-pele.webp"
  },
  {
    id: "m-pele-08",
    nome: "Beauty Omegas",
    categoria: "Pele",
    descricao_curta: "Ômegas 3, 6 e 9 para beleza.",
    descricao_longa: "Ácidos graxos essenciais para hidratação e elasticidade da pele. Óleo de borragem e linhaça.",
    preco: "69.90",
    imagem: "/img/omegas-beleza.webp"
  },
  {
    id: "m-pele-09",
    nome: "Probióticos Skin",
    categoria: "Pele",
    descricao_curta: "Microbiota intestinal para pele saudável.",
    descricao_longa: "Probióticos específicos para saúde da pele. Lactobacillus e Bifidobacterium selecionados.",
    preco: "84.90",
    imagem: "/img/probioticos-pele.webp"
  },
  {
    id: "m-pele-10",
    nome: "Retinol Natural",
    categoria: "Pele",
    descricao_curta: "Renovação celular anti-idade.",
    descricao_longa: "Beta-caroteno e vitamina A para renovação celular. Reduz linhas finas e melhora textura.",
    preco: "74.90",
    imagem: "/img/retinol-natural.webp"
  }
];

export const productNames = initialProducts.map((p) => p.nome).join(', ');

/** Catálogo resumido para o system prompt do chat (nome, categoria, descrição, preço). */
export function buildProductCatalogForPrompt(): string {
  return initialProducts
    .map(
      (p) =>
        `- ${p.nome} | ${p.categoria} | ${p.descricao_curta} | a partir de R$ ${p.preco.replace('.', ',')}`
    )
    .join('\n');
}
