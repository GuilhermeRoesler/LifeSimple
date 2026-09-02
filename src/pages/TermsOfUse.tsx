import { LegalLayout } from '@/components/LegalLayout';
import { SITE_NAME } from '@/constants/contact';
import { Link } from 'react-router-dom';

export default function TermsOfUse() {
  return (
    <LegalLayout title="Termos de Uso" updatedAt="2 de setembro de 2026">
      <p>
        Ao acessar o site da {SITE_NAME}, você concorda com estes Termos. Se não concordar,
        interrompa o uso.
      </p>

      <h2>1. Objeto</h2>
      <p>
        O site apresenta informações institucionais e de produtos manipulados, facilita o
        contato (WhatsApp, formulário e assistente virtual) e não substitui consulta
        farmacêutica ou médica presencial quando exigida.
      </p>

      <h2>2. Conteúdo e produtos</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Preços, estoque e prazos são indicativos e podem mudar sem aviso prévio.</li>
        <li>
          Alguns produtos exigem receita ou avaliação profissional antes da manipulação.
        </li>
        <li>
          Informações do site têm caráter geral e não constituem prescrição, diagnóstico ou
          tratamento.
        </li>
      </ul>

      <h2>3. Conduta do usuário</h2>
      <p>
        É proibido usar o site para fins ilícitos, tentar explorar falhas de segurança, enviar
        conteúdo ofensivo ou automatizar abusivamente o chatbot.
      </p>

      <h2>4. Assistente virtual</h2>
      <p>
        O chat é um canal de atendimento auxiliar. Em caso de dúvida clínica, priorize o
        atendimento humano da farmácia.
      </p>

      <h2>5. Propriedade intelectual</h2>
      <p>
        Marcas, textos, layout e imagens do site pertencem à {SITE_NAME} ou a licenciadores e
        não podem ser reproduzidos sem autorização.
      </p>

      <h2>6. Limitação de responsabilidade</h2>
      <p>
        Empregamos esforços para manter o site disponível e atualizado, mas não garantimos
        ausência de interrupções ou erros. O uso do conteúdo é de sua responsabilidade.
      </p>

      <h2>7. Privacidade</h2>
      <p>
        O tratamento de dados pessoais é regido pela nossa{' '}
        <Link to="/privacidade">Política de Privacidade</Link> e pela página de{' '}
        <Link to="/lgpd">LGPD</Link>.
      </p>

      <h2>8. Foro</h2>
      <p>
        Estes Termos são interpretados conforme a legislação brasileira, com foro preferencial
        na comarca de Porto Alegre/RS, salvo disposição legal em contrário.
      </p>
    </LegalLayout>
  );
}
