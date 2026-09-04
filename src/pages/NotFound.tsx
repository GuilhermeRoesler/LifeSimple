import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404: rota não encontrada:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Página não encontrada</p>
        <Button asChild className="gradient-primary hover:brightness-110 hover:shadow-md hover:shadow-primary/25">
          <Link to="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
