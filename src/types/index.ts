export interface Product {
  id: string;
  nome: string;
  categoria: 'Emagrecimento' | 'Academia' | 'Pele';
  descricao_curta: string;
  descricao_longa: string;
  preco: string;
  imagem: string;
}

export interface ContactForm {
  nome: string;
  email: string;
  telefone?: string;
  mensagem: string;
  consentimento: boolean;
}
