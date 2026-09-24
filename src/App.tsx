import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Analyses from '@/pages/Analyses';
import AnalysisCategory from '@/pages/AnalysisCategory';
import AnalysisDetail from '@/pages/AnalysisDetail';
import Doctors from '@/pages/Doctors';
import Contact from '@/pages/Contact';
import Account from '@/pages/Account';

function App() {
  return (
    <ThemeProvider>
      <Router basename="/GenesisLab">
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/analyses" element={<Analyses />} />
              <Route path="/analyses/:categoryId" element={<AnalysisCategory />} />
              <Route path="/analyses/:categoryId/:analysisId" element={<AnalysisDetail />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/*" element={<Account />} />
              {/* Legacy redirects */}
              <Route path="/services" element={<Navigate to="/analyses" replace />} />
              <Route path="/partnership" element={<Navigate to="/doctors" replace />} />
            </Routes>
          </main>
          <Footer />
          <MobileBottomNav />
          <ScrollToTopButton />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
