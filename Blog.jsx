import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: 'Como Valorizar Suas Curvas: Dicas de Styling',
      excerpt: 'Descubra técnicas simples para destacar seus pontos fortes e se sentir mais confiante.',
      author: 'Maria Silva',
      date: '15 de Junho, 2025',
      image: '/images/Generated Image June 15, 2025 - 7_45PM (1).jpeg',
      category: 'Dicas de Estilo',
    },
    {
      id: 2,
      title: 'Tendências Plus Size para o Verão 2025',
      excerpt: 'Conheça as principais tendências da moda plus size para a estação mais quente do ano.',
      author: 'Ana Costa',
      date: '12 de Junho, 2025',
      image: '/images/Generated Image June 15, 2025 - 2_13AM (1).jpeg',
      category: 'Tendências',
    },
    {
      id: 3,
      title: 'Autoestima e Moda: Uma Jornada de Amor Próprio',
      excerpt: 'Como a moda pode ser uma ferramenta poderosa para construir e fortalecer a autoestima.',
      author: 'Carla Santos',
      date: '10 de Junho, 2025',
      image: '/images/Generated Image June 15, 2025 - 10_42PM.jpeg',
      category: 'Bem-estar',
    },
    {
      id: 4,
      title: 'Guia Completo: Vestidos para Cada Ocasião',
      excerpt: 'Do casual ao formal, descubra qual vestido escolher para cada momento especial.',
      author: 'Maria Silva',
      date: '8 de Junho, 2025',
      image: '/images/Generated Image June 14, 2025 - 10_23PM (1).jpeg',
      category: 'Guias',
    },
    {
      id: 5,
      title: 'Cores que Favorecem: Psicologia das Cores na Moda',
      excerpt: 'Entenda como as cores podem influenciar seu humor e a percepção dos outros.',
      author: 'Ana Costa',
      date: '5 de Junho, 2025',
      image: '/images/Generated Image June 15, 2025 - 7_39PM.jpeg',
      category: 'Dicas de Estilo',
    },
    {
      id: 6,
      title: 'Sustentabilidade na Moda Plus Size',
      excerpt: 'Como fazer escolhas mais conscientes e sustentáveis no seu guarda-roupa.',
      author: 'Carla Santos',
      date: '3 de Junho, 2025',
      image: '/images/Generated Image June 15, 2025 - 2_13AM (2).jpeg',
      category: 'Sustentabilidade',
    },
  ];

  const categories = ['Todos', 'Dicas de Estilo', 'Tendências', 'Bem-estar', 'Guias', 'Sustentabilidade'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blog Bella Curvas
          </h1>
          <p className="text-lg text-gray-600">
            Dicas, tendências e inspiração para mulheres que celebram suas curvas
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto">
                <img
                  src={posts[0].image}
                  alt={posts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium mr-3">
                    Destaque
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    {posts[0].category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {posts[0].title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{posts[0].author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{posts[0].date}</span>
                </div>
                <button className="btn-primary px-6 py-3 rounded-lg font-semibold inline-flex items-center w-fit">
                  Ler Artigo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{post.date}</span>
                </div>
                <button className="text-primary font-semibold hover:text-primary/80 transition-colors inline-flex items-center">
                  Ler mais
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Não Perca Nenhuma Novidade
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Assine nossa newsletter e receba dicas exclusivas de moda, tendências 
            e conteúdos especiais diretamente no seu e-mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="btn-primary px-6 py-3 rounded-lg font-semibold">
              Assinar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;

