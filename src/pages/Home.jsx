import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';
import { getFeaturedProducts, products } from '../data/products';

const Home = () => {
  const featuredProducts = getFeaturedProducts(products, 3);

  const testimonials = [
    {
      name: 'Maria Silva',
      text: 'Finalmente encontrei roupas que valorizam minhas curvas! A qualidade é excepcional.',
      rating: 5,
    },
    {
      name: 'Ana Costa',
      text: 'O atendimento é maravilhoso e as peças são lindas. Me sinto mais confiante!',
      rating: 5,
    },
    {
      name: 'Carla Santos',
      text: 'Variedade incrível de tamanhos e modelos. Recomendo para todas as amigas!',
      rating: 5,
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Celebre Suas Curvas
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Moda feminina plus size que valoriza sua beleza natural. 
            Descubra peças únicas que combinam estilo, conforto e elegância.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalogo"
              className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center"
            >
              Ver Catálogo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/provador-virtual"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Provador Virtual
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça algumas das nossas peças mais amadas pelas clientes
            </p>
          </div>

          <div className="grid-auto-fit">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="aspect-product overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-4">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>
                  <div className="flex space-x-2">
                    <button className="flex-1 btn-primary py-2 rounded-lg font-medium inline-flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Comprar
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/catalogo"
              className="btn-primary px-8 py-3 rounded-lg font-semibold inline-flex items-center"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nossa Missão
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Na Bella Curvas, acreditamos que toda mulher merece se sentir 
                linda e confiante, independentemente do seu tamanho. Nossa missão 
                é oferecer moda plus size de qualidade que valoriza e celebra 
                todas as curvas.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Cada peça é cuidadosamente selecionada pensando no conforto, 
                estilo e na autoestima de nossas clientes. Porque beleza não 
                tem tamanho!
              </p>
              <Link
                to="/sobre"
                className="btn-primary px-6 py-3 rounded-lg font-semibold inline-flex items-center"
              >
                Saiba Mais
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/Generated Image June 15, 2025 - 2_13AM (2).jpeg"
                alt="Moda Plus Size"
                className="rounded-lg shadow-lg"
              />
              <img
                src="/images/Generated Image June 15, 2025 - 7_45PM.jpeg"
                alt="Estilo e Elegância"
                className="rounded-lg shadow-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O Que Nossas Clientes Dizem
            </h2>
            <p className="text-lg text-gray-600">
              Histórias reais de mulheres que se apaixonaram pela Bella Curvas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronta para Descobrir Seu Estilo?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Cadastre-se em nossa newsletter e receba 10% de desconto na primeira compra
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Cadastrar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

