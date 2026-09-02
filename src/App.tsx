import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import LgpdPage from './pages/LgpdPage';

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <BrowserRouter basename={basename || undefined}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/privacidade" element={<PrivacyPolicy />} />
      <Route path="/termos" element={<TermsOfUse />} />
      <Route path="/lgpd" element={<LgpdPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
