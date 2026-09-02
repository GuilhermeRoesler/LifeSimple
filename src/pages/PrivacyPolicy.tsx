import { LegalLayout } from '@/components/LegalLayout';
import { SITE_NAME } from '@/constants/contact';

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Política de Privacidade" updatedAt="2 de setembro de 2026">
      <p>
        Esta Política descreve como a {SITE_NAME} (“nós”) coleta, usa e protege dados pessoais
        quando você utiliza nosso site, formulários de contato, chatbot e canais de atendimento.
      </p>

      <h2>1. Dados que podemos coletar</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Dados de identificação e contato: nome, e-mail, telefone e mensagem enviada.</li>
        <li>Dados de navegação e técnicos: endereço IP, tipo de navegador e páginas visitadas.</li>
        <li>
          Conteúdo do chat: mensagens trocadas com o assistente virtual, vinculadas a um
          identificador anônimo.
        </li>
      </ul>

      <h2>2. Finalidades</h2>
      <p>Utilizamos os dados para:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Atender solicitações, orçamentos e dúvidas sobre produtos manipulados;</li>
        <li>Melhorar o atendimento (incluindo o assistente virtual);</li>
        <li>Cumprir obrigações legais e regulatórias aplicáveis a farmácias;</li>
        <li>Proteger a segurança do site e prevenir abusos.</li>
      </ul>

      <h2>3. Bases legais (LGPD)</h2>
      <p>
        O tratamento ocorre com base no consentimento (quando solicitado no formulário), na
        execução de medidas pré-contratuais a pedido do titular e no legítimo interesse para
        segurança e melhoria do serviço, sempre respeitando seus direitos.
      </p>

      <h2>4. Compartilhamento</h2>
      <p>
        Podemos utilizar prestadores de serviço (hospedagem, Firebase/Google e provedores de
        IA) estritamente para operar o site e o chat. Não vendemos seus dados pessoais.
      </p>

      <h2>5. Retenção</h2>
      <p>
        Mantemos os dados pelo tempo necessário ao atendimento e às obrigações legais. Mensagens
        do chat podem ser excluídas ou anonimizadas periodicamente.
      </p>

      <h2>6. Seus direitos</h2>
      <p>
        Você pode solicitar acesso, correção, anonimização, portabilidade ou eliminação dos seus
        dados, além de revogar consentimentos, pelos canais indicados no rodapé desta página.
      </p>

      <h2>7. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais razoáveis. Nenhum meio digital é
        absolutamente seguro; recomendamos não enviar dados sensíveis de saúde no chat sem
        necessidade.
      </p>

      <h2>8. Alterações</h2>
      <p>
        Esta política pode ser atualizada. A data no topo indica a versão vigente.
      </p>
    </LegalLayout>
  );
}
