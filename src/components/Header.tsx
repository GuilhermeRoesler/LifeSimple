import { useEffect, useState } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { publicUrl } from '@/lib/utils';
import { INSTAGRAM_URL } from '@/constants/contact';
import { openWhatsApp } from '@/lib/whatsapp';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Produtos', href: '#produtos' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contato' },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-primary/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-0">
        <div className="flex items-center justify-between h-16 lg:h-20 px-4">
          <div className="flex items-center">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="flex items-center space-x-3"
            >
              <img
                src={publicUrl('/favicon.svg')}
                alt="Life Simple"
                width={40}
                height={40}
                className="h-9 w-9 lg:h-10 lg:w-10"
              />
              <span className="text-xl lg:text-2xl text-white font-light font-inter">
                Life Simple
              </span>
            </a>
          </div>

          <nav className="hidden lg:flex items-center space-x-8" aria-label="Principal">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-white hover:text-primary-light transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir WhatsApp"
                onClick={() => openWhatsApp()}
              >
                <MessageCircle className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir Instagram"
                onClick={() => window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer')}
              >
                <InstagramIcon className="h-5 w-5 text-white" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden bg-primary text-white"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden py-4 border-t border-border animate-slide-up px-4 bg-white"
          >
            <nav className="flex flex-col space-y-3" aria-label="Mobile">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-accent-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center space-x-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openWhatsApp()}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer')}
                  className="flex-1"
                >
                  <InstagramIcon className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
