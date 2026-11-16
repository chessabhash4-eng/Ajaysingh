import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import Nav from './components/Nav';
import Page from './components/Page';
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import Admin from './pages/admin/Admin';

function NotFound() {
  return (
    <Page label="404">
      <div className="flex min-h-[90vh] flex-col items-center justify-center px-5 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Media offline</p>
        <h1 className="mt-3 text-[30vw] font-extrabold leading-none tracking-[-0.06em] md:text-[20vw]">404</h1>
        <p className="text-muted">This scene ended up on the cutting-room floor.</p>
        <Link to="/" className="mt-8 rounded-full bg-paper px-6 py-3 text-ink">Back to the start</Link>
      </div>
    </Page>
  );
}

function Shell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [loaded, setLoaded] = useState(() => isAdmin || sessionStorage.getItem('fc_loaded') === '1');

  return (
    <>
      <div className="grain" />
      <AnimatePresence>
        {!loaded && (
          <Preloader
            onDone={() => {
              sessionStorage.setItem('fc_loaded', '1');
              setLoaded(true);
            }}
          />
        )}
      </AnimatePresence>
      {!isAdmin && <Nav />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={isAdmin ? location.pathname === '/admin/login' ? 'login' : 'admin' : location.pathname}>
          <Route path="/" element={<Home ready={loaded} />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </BrowserRouter>
  );
}
