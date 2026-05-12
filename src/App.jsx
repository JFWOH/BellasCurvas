import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import About from './pages/About';
import SizeGuide from './pages/SizeGuide';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import VirtualTryOn from './pages/VirtualTryOn';
import './App.css';

// Painel admin carregado somente quando acessado (não aumenta bundle público)
const AdminApp = lazy(() => import('./admin/AdminApp'));

function AdminLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Carregando painel...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Painel administrativo — sem Header/Footer públicos */}
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminApp />
              </Suspense>
            }
          />

          {/* Site público */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/guia-tamanhos" element={<SizeGuide />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contato" element={<Contact />} />
                    <Route path="/provador-virtual" element={<VirtualTryOn />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

