import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, User, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getCartItemsCount } = useCart();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Sobre Nós', href: '/sobre' },
    { name: 'Guia de Tamanhos', href: '/guia-tamanhos' },
    { name: 'Blog', href: '/blog' },
    { name: 'Provador Virtual', href: '/provador-virtual' },
    { name: 'Contato', href: '/contato' },
  ];

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Bella Curvas</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button className="p-2 text-gray-600 hover:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Favorites */}
              <button className="p-2 text-gray-600 hover:text-primary transition-colors">
                <Heart className="h-5 w-5" />
              </button>

              {/* User */}
              <button className="p-2 text-gray-600 hover:text-primary transition-colors">
                <User className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-gray-600 hover:text-primary transition-colors relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;

