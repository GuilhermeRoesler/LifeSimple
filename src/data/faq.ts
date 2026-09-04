export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'Quanto tempo leva para manipular meu medicamento?',
    answer:
      'Geralmente de 24 a 48 horas úteis, dependendo da complexidade da fórmula.',
  },
  {
    question: 'Vocês entregam em domicílio?',
    answer:
      'Sim, entregamos em toda a região metropolitana de Porto Alegre, com taxa variável conforme a distância.',
  },
  {
    question: 'Preciso de receita médica?',
    answer:
      'Para alguns medicamentos, sim. Entre em contato para saber mais sobre o seu caso específico.',
  },
  {
    question: 'Qual a validade dos produtos manipulados?',
    answer:
      'A validade varia de 3 a 6 meses, dependendo da formulação. Sempre indicamos na embalagem.',
  },
];

/** FAQ resumida para o system prompt do chat. */
export function buildFaqForPrompt(): string {
  return faqItems.map((item) => `P: ${item.question}\nR: ${item.answer}`).join('\n\n');
}
