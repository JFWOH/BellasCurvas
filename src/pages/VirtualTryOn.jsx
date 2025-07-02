import React, { useState } from 'react';
import { Camera, Upload, Sparkles, RotateCcw, Download, Info } from 'lucide-react';

const VirtualTryOn = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Vestido Plissado Verde Esmeralda',
      image: '/images/Generated Image June 14, 2025 - 10_23PM (1).jpeg',
      price: 'R$ 299,90',
    },
    {
      id: 2,
      name: 'Vestido Listrado Elegante',
      image: '/images/Generated Image June 14, 2025 - 10_24PM (4).jpeg',
      price: 'R$ 259,90',
    },
    {
      id: 3,
      name: 'Vestido Tropical Verão',
      image: '/images/Generated Image June 15, 2025 - 2_13AM (1).jpeg',
      price: 'R$ 199,90',
    },
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = () => {
    if (!selectedImage || !selectedProduct) {
      alert('Por favor, selecione uma foto e um produto para experimentar.');
      return;
    }
    
    setIsProcessing(true);
    // Simular processamento
    setTimeout(() => {
      setIsProcessing(false);
      alert('Provador virtual processado! Esta é uma demonstração da funcionalidade.');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Provador Virtual
              </h1>
              <p className="text-lg text-gray-600">
                Experimente nossas peças virtualmente antes de comprar
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Como Funciona o Provador Virtual
              </h3>
              <div className="text-blue-800 space-y-2">
                <p>1. Faça upload de uma foto sua (de corpo inteiro, de frente)</p>
                <p>2. Selecione o produto que deseja experimentar</p>
                <p>3. Clique em "Experimentar" e veja como ficaria em você</p>
                <p className="text-sm italic">
                  * Esta é uma funcionalidade em desenvolvimento. A demonstração atual simula o processo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                1. Sua Foto
              </h2>
              
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Adicione sua foto
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Para melhores resultados, use uma foto de corpo inteiro, de frente, 
                    com boa iluminação e fundo neutro.
                  </p>
                  <label className="btn-primary px-6 py-3 rounded-lg font-semibold inline-flex items-center cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Escolher Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Sua foto"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <label className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Trocar Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Suas Medidas
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>46</option>
                    <option>48</option>
                    <option>50</option>
                    <option>52</option>
                    <option>54</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="165"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="70"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                2. Escolha o Produto
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-primary font-bold">
                          {product.price}
                        </p>
                      </div>
                      {selectedProduct?.id === product.id && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Try On Button */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                3. Experimentar
              </h3>
              
              <button
                onClick={handleTryOn}
                disabled={!selectedImage || !selectedProduct || isProcessing}
                className={`w-full py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center ${
                  !selectedImage || !selectedProduct || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-3" />
                    Experimentar Agora
                  </>
                )}
              </button>
              
              {(!selectedImage || !selectedProduct) && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  {!selectedImage && !selectedProduct
                    ? 'Adicione uma foto e selecione um produto'
                    : !selectedImage
                    ? 'Adicione uma foto para continuar'
                    : 'Selecione um produto para experimentar'}
                </p>
              )}
            </div>

            {/* Result Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Resultado
              </h3>
              
              <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>O resultado aparecerá aqui</p>
                  <p className="text-sm">após experimentar um produto</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center cursor-not-allowed"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Resultado
                </button>
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Recursos do Provador Virtual
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Tecnologia Avançada
              </h4>
              <p className="text-gray-600">
                Utilizamos IA para mapear seu corpo e ajustar as peças virtualmente
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Resultado Realista
              </h4>
              <p className="text-gray-600">
                Veja como as roupas ficam em você com alta precisão e realismo
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Salve e Compartilhe
              </h4>
              <p className="text-gray-600">
                Baixe os resultados e compartilhe com amigas para pedir opinião
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;

