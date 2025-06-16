import React from 'react';
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

function App() {
  return (
    <CartProvider>
      <Router>
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
      </Router>
    </CartProvider>
  );
}

export default App;

