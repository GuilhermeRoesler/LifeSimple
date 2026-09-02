import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin, Shield } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import {
  INSTAGRAM_URL,
  EMAIL,
  PHONE_DISPLAY,
  ADDRESS_LINES,
  BUSINESS_HOURS,
} from '@/constants/contact';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Life Simple</h3>
            <p className="text-sm opacity-90">
              Farmácia de manipulação especializada em fórmulas personalizadas para sua saúde e
              bem-estar.
            </p>
            <div className="flex items-center mt-4 space-x-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Farmácia Registrada</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#produtos" className="hover:underline opacity-90 hover:opacity-100">
                  Produtos
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:underline opacity-90 hover:opacity-100">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:underline opacity-90 hover:opacity-100">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:underline opacity-90 hover:opacity-100">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="opacity-90">{ADDRESS_LINES[0]}</span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-3 mb-4">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
            <div className="text-sm opacity-90">
              <p className="font-semibold mb-1">Horário:</p>
              <p>{BUSINESS_HOURS.weekdays}</p>
              <p>{BUSINESS_HOURS.saturday}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="opacity-90">© {currentYear} Life Simple. Todos os direitos reservados.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4 md:mt-0">
              <Link to="/privacidade" className="hover:underline opacity-90 hover:opacity-100">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="hover:underline opacity-90 hover:opacity-100">
                Termos de Uso
              </Link>
              <Link to="/lgpd" className="hover:underline opacity-90 hover:opacity-100">
                LGPD
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
