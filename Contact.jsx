import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de envio do formulário
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefone',
      info: '(11) 9999-9999',
      description: 'Segunda a sexta, 9h às 18h',
    },
    {
      icon: Mail,
      title: 'E-mail',
      info: 'contato@bellacurvas.com',
      description: 'Respondemos em até 24h',
    },
    {
      icon: MapPin,
      title: 'Endereço',
      info: 'São Paulo, SP',
      description: 'Atendimento online',
    },
    {
      icon: Clock,
      title: 'Horário',
      info: '9h às 18h',
      description: 'Segunda a sexta-feira',
    },
  ];

  const faqItems = [
    {
      question: 'Como posso rastrear meu pedido?',
      answer: 'Após a confirmação do pagamento, você receberá um código de rastreamento por e-mail.',
    },
    {
      question: 'Qual é o prazo de entrega?',
      answer: 'O prazo varia de 3 a 7 dias úteis, dependendo da sua localização.',
    },
    {
      question: 'Posso trocar um produto?',
      answer: 'Sim! Você tem até 30 dias para solicitar a troca, desde que o produto esteja em perfeitas condições.',
    },
    {
      question: 'Vocês fazem entrega em todo o Brasil?',
      answer: 'Sim, entregamos em todo o território nacional através dos Correios.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h1>
          <p className="text-lg text-gray-600">
            Estamos aqui para ajudar você. Fale conosco!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envie sua Mensagem
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida-produto">Dúvida sobre produto</option>
                    <option value="pedido">Acompanhar pedido</option>
                    <option value="troca">Troca/Devolução</option>
                    <option value="elogio">Elogio</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Escreva sua mensagem aqui..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn-primary px-8 py-3 rounded-lg font-semibold inline-flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Informações de Contato
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-gray-900 font-medium">
                        {item.info}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Perguntas Frequentes
              </h3>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      {item.question}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Siga-nos nas Redes Sociais
              </h3>
              
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">IG</span>
                  </div>
                  <span className="text-gray-700 font-medium">@bellacurvas</span>
                </a>
                
                <a
                  href="#"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">FB</span>
                  </div>
                  <span className="text-gray-700 font-medium">Bella Curvas</span>
                </a>
                
                <a
                  href="#"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">WA</span>
                  </div>
                  <span className="text-gray-700 font-medium">(11) 9999-9999</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

