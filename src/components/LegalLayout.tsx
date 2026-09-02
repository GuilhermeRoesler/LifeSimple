import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SITE_NAME, EMAIL, ADDRESS, PHONE_DISPLAY } from '@/constants/contact';

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm opacity-90 hover:opacity-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
          <span className="font-semibold">{SITE_NAME}</span>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: {updatedAt}</p>
        <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_a]:text-primary">
          {children}
        </div>
        <div className="mt-12 pt-6 border-t border-border text-sm text-muted-foreground">
          <p>
            Contato do controlador: {EMAIL} · {PHONE_DISPLAY}
          </p>
          <p>{ADDRESS}</p>
        </div>
      </main>
    </div>
  );
}
