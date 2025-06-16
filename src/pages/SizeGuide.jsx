import React from 'react';
import { Ruler, Info } from 'lucide-react';

const SizeGuide = () => {
  const sizeChart = [
    { size: '44', bust: '96-100', waist: '78-82', hip: '104-108' },
    { size: '46', bust: '100-104', waist: '82-86', hip: '108-112' },
    { size: '48', bust: '104-108', waist: '86-90', hip: '112-116' },
    { size: '50', bust: '108-112', waist: '90-94', hip: '116-120' },
    { size: '52', bust: '112-116', waist: '94-98', hip: '120-124' },
    { size: '54', bust: '116-120', waist: '98-102', hip: '124-128' },
    { size: '56', bust: '120-124', waist: '102-106', hip: '128-132' },
    { size: '58', bust: '124-128', waist: '106-110', hip: '132-136' },
  ];

  const measurementTips = [
    {
      title: 'Busto',
      description: 'Meça na parte mais cheia do busto, mantendo a fita métrica paralela ao chão.',
    },
    {
      title: 'Cintura',
      description: 'Meça na parte mais estreita do tronco, geralmente acima do umbigo.',
    },
    {
      title: 'Quadril',
      description: 'Meça na parte mais larga dos quadris, cerca de 20cm abaixo da cintura.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center">
            <Ruler className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Guia de Tamanhos
              </h1>
              <p className="text-lg text-gray-600">
                Encontre o tamanho perfeito para você
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* How to Measure */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Como Tirar Suas Medidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {measurementTips.map((tip, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Dica Importante
                </h4>
                <p className="text-sm text-blue-800">
                  Use uma fita métrica flexível e peça ajuda de alguém para obter medidas mais precisas. 
                  Vista apenas roupas íntimas durante a medição.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Size Chart */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tabela de Medidas (em cm)
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Tamanho
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Busto
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Cintura
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Quadril
                  </th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((size, index) => (
                  <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="py-3 px-4 font-semibold text-primary">
                      {size.size}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {size.bust}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {size.waist}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {size.hip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Fit Guide */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Guia de Caimento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vestidos
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Vestidos evasê: escolha seu tamanho normal para um caimento solto</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Vestidos ajustados: considere um tamanho acima se preferir mais conforto</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Vestidos com elastano: geralmente têm boa flexibilidade</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Blusas e Tops
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Blusas oversized: podem ser usadas um tamanho menor</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Tops ajustados: siga exatamente sua medida de busto</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Camisetas: geralmente têm caimento confortável</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                E se eu estiver entre dois tamanhos?
              </h3>
              <p className="text-gray-600">
                Recomendamos escolher o tamanho maior para maior conforto. Lembre-se que nossas peças 
                são pensadas para valorizar suas curvas com conforto.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Posso trocar se o tamanho não servir?
              </h3>
              <p className="text-gray-600">
                Sim! Oferecemos troca gratuita em até 30 dias. Consulte nossa política de trocas 
                para mais detalhes.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                As medidas podem variar entre produtos?
              </h3>
              <p className="text-gray-600">
                Pode haver pequenas variações dependendo do tecido e modelo. Sempre consulte 
                as medidas específicas de cada produto na página do item.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SizeGuide;

