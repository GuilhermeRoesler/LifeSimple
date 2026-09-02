import { LegalLayout } from '@/components/LegalLayout';
import { SITE_NAME, EMAIL } from '@/constants/contact';
import { Link } from 'react-router-dom';

export default function LgpdPage() {
  return (
    <LegalLayout title="LGPD — Direitos do Titular" updatedAt="2 de setembro de 2026">
      <p>
        A {SITE_NAME} trata dados pessoais em conformidade com a Lei nº 13.709/2018 (LGPD).
        Esta página resume seus direitos e como exercê-los.
      </p>

      <h2>1. Controlador</h2>
      <p>
        O controlador dos dados é a {SITE_NAME}, contato: {EMAIL}. Detalhes adicionais estão
        na <Link to="/privacidade">Política de Privacidade</Link>.
      </p>

      <h2>2. Direitos do titular</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Confirmação da existência de tratamento;</li>
        <li>Acesso aos dados;</li>
        <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
        <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>Portabilidade, quando aplicável;</li>
        <li>Informação sobre compartilhamentos;</li>
        <li>Revogação do consentimento;</li>
        <li>Oposição a tratamentos realizados com base em legítimo interesse, quando cabível.</li>
      </ul>

      <h2>3. Como exercer</h2>
      <p>
        Envie um e-mail para {EMAIL} com o assunto “LGPD — Direitos do titular”, informando
        nome completo, meio de contato e a solicitação desejada. Podemos pedir confirmação de
        identidade para proteger seus dados.
      </p>

      <h2>4. Prazo de resposta</h2>
      <p>
        Responderemos em prazo razoável, observado o disposto na LGPD e em normas da ANPD.
      </p>

      <h2>5. Dados sensíveis de saúde</h2>
      <p>
        Evite enviar no site ou no chat informações clínicas detalhadas sem necessidade. Quando
        o atendimento exigir, o tratamento seguirá finalidades legítimas e medidas de proteção
        adequadas.
      </p>

      <h2>6. Autoridade Nacional</h2>
      <p>
        Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados
        (ANPD), sem prejuízo do contato direto conosco.
      </p>
    </LegalLayout>
  );
}
