import React from 'react';
import { Heart, Users, Award, Truck } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Amor Próprio',
      description: 'Acreditamos que toda mulher merece se sentir linda e confiante, independentemente do seu tamanho.',
    },
    {
      icon: Users,
      title: 'Inclusão',
      description: 'Nossa missão é criar um espaço onde todas as mulheres se sintam representadas e acolhidas.',
    },
    {
      icon: Award,
      title: 'Qualidade',
      description: 'Selecionamos cuidadosamente cada peça, priorizando conforto, durabilidade e estilo.',
    },
    {
      icon: Truck,
      title: 'Compromisso',
      description: 'Estamos comprometidas em oferecer a melhor experiência de compra e atendimento.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nossa História
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Nascemos do sonho de celebrar a beleza em todas as suas formas
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Como Tudo Começou
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  A Bella Curvas nasceu em 2020, durante um período em que muitas mulheres 
                  estavam redefinindo sua relação com a moda e a autoestima. Fundada por 
                  três amigas que compartilhavam a frustração de não encontrar roupas 
                  bonitas e bem feitas em tamanhos plus size.
                </p>
                <p>
                  O que começou como uma pequena loja online rapidamente se transformou 
                  em uma comunidade de mulheres que celebram suas curvas e se apoiam 
                  mutuamente. Cada peça em nossa coleção é escolhida pensando na mulher 
                  real, com suas necessidades e desejos únicos.
                </p>
                <p>
                  Hoje, somos mais que uma loja de roupas. Somos um movimento que 
                  acredita que beleza não tem tamanho e que toda mulher merece se 
                  sentir poderosa e confiante.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/Generated Image June 15, 2025 - 7_45PM (1).jpeg"
                alt="Nossa História"
                className="rounded-lg shadow-lg"
              />
              <img
                src="/images/Generated Image June 15, 2025 - 10_27PM.jpeg"
                alt="Moda Plus Size"
                className="rounded-lg shadow-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Os princípios que guiam cada decisão que tomamos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Nossa Missão
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Democratizar a moda plus size, oferecendo peças que valorizam 
            as curvas femininas e promovem a autoestima. Queremos que cada 
            mulher se sinta linda, confiante e representada em nossa coleção.
          </p>
          <div className="bg-primary/5 p-8 rounded-lg">
            <blockquote className="text-2xl font-medium text-gray-900 italic">
              "Beleza não tem tamanho. Confiança não tem limite. 
              Estilo não tem regras."
            </blockquote>
            <cite className="block mt-4 text-primary font-semibold">
              - Equipe Bella Curvas
            </cite>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                10.000+
              </div>
              <p className="text-lg text-gray-600">
                Clientes Satisfeitas
              </p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                500+
              </div>
              <p className="text-lg text-gray-600">
                Produtos Únicos
              </p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                98%
              </div>
              <p className="text-lg text-gray-600">
                Avaliações Positivas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-lg text-gray-600">
              Conheça as pessoas por trás da Bella Curvas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Maria Silva
              </h3>
              <p className="text-primary font-medium mb-2">
                CEO & Fundadora
              </p>
              <p className="text-gray-600 text-sm">
                Especialista em moda plus size com 15 anos de experiência no mercado.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-secondary to-primary rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ana Costa
              </h3>
              <p className="text-primary font-medium mb-2">
                Diretora de Design
              </p>
              <p className="text-gray-600 text-sm">
                Designer de moda apaixonada por criar peças que empoderam mulheres.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-accent to-secondary rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Carla Santos
              </h3>
              <p className="text-primary font-medium mb-2">
                Gerente de Experiência
              </p>
              <p className="text-gray-600 text-sm">
                Focada em garantir que cada cliente tenha a melhor experiência possível.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

