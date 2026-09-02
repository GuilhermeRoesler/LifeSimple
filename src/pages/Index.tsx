import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Products from '@/components/Products';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Chatbot = lazy(() => import('@/components/Chatbot'));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Products />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </div>
  );
};

export default Index;
