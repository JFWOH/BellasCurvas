import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import ImageUploader from '../components/ImageUploader'
import PublicationControl from './PublicationControl'
import { Save, Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react'

const CATEGORIES = ['vestidos', 'blusas', 'saias', 'calças', 'conjuntos', 'acessórios']
const OCCASIONS = ['casual', 'trabalho', 'festa', 'praia', 'noite']
const SIZES = ['36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60']

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProductNew() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: 'vestidos',
    occasion: 'casual',
    features: [''],
    is_active: false,
    is_featured: false,
  })

  const [variants, setVariants] = useState([{ size: '46', color: '', stock_qty: 5 }])
  const [savedProductId, setSavedProductId] = useState(null)
  const [images, setImages] = useState([])

  const save = useMutation({
    mutationFn: async () => {
      const slug = slugify(form.name) + '-' + Date.now()
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          name: form.name,
          slug,
          description: form.description,
          price: parseFloat(form.price),
          original_price: form.original_price ? parseFloat(form.original_price) : null,
          category: form.category,
          occasion: form.occasion,
          features: form.features.filter(Boolean),
          is_active: form.is_active,
          is_featured: form.is_featured,
        })
        .select()
        .single()

      if (error) throw error

      if (variants.length > 0) {
        await supabase.from('product_variants').insert(
          variants.map(v => ({ product_id: product.id, ...v, stock_qty: parseInt(v.stock_qty) || 0 }))
        )
      }

      await supabase.from('product_publications').insert({ product_id: product.id, status: 'rascunho' })

      setSavedProductId(product.id)
      return product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function setFeature(index, value) {
    setForm(prev => {
      const features = [...prev.features]
      features[index] = value
      return { ...prev, features }
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/produtos')} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Novo Produto</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-900">Informações do Produto</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Vestido Plissado Verde Esmeralda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Descreva o produto..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price}
                    onChange={e => setField('price', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Original (opcional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.original_price}
                    onChange={e => setField('original_price', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={form.category}
                  onChange={e => setField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ocasião</label>
                <select
                  value={form.occasion}
                  onChange={e => setField('occasion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {OCCASIONS.map(o => <option key={o} value={o} className="capitalize">{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                </select>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Características do Produto</label>
              <div className="space-y-2">
                {form.features.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={f}
                      onChange={e => setFeature(i, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Ex: Tecido fluido`}
                    />
                    {form.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }))}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, features: [...prev.features, ''] }))}
                className="mt-2 text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Adicionar característica
              </button>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Tamanhos e Estoque</h3>
              <button
                type="button"
                onClick={() => setVariants(prev => [...prev, { size: '46', color: '', stock_qty: 5 }])}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Tamanho
              </button>
            </div>
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                  <select
                    value={v.size}
                    onChange={e => setVariants(prev => prev.map((vv, idx) => idx === i ? { ...vv, size: e.target.value } : vv))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {SIZES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <input
                    type="text"
                    value={v.color}
                    onChange={e => setVariants(prev => prev.map((vv, idx) => idx === i ? { ...vv, color: e.target.value } : vv))}
                    placeholder="Cor (opcional)"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={v.stock_qty}
                      onChange={e => setVariants(prev => prev.map((vv, idx) => idx === i ? { ...vv, stock_qty: e.target.value } : vv))}
                      placeholder="Estoque"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {variants.length > 1 && (
                      <button onClick={() => setVariants(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Fotos do Produto</h3>
            {!savedProductId && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-sm text-amber-700">
                Salve o produto primeiro para fazer upload das fotos.
              </div>
            )}
            <ImageUploader productId={savedProductId} images={images} onImagesChange={setImages} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-900">Configurações</h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e => setField('is_active', e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Exibir na Vitrine</p>
                <p className="text-xs text-gray-400">Aparece no catálogo público</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={e => setField('is_featured', e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Produto Destaque</p>
                <p className="text-xs text-gray-400">Aparece na página inicial</p>
              </div>
            </label>

            <button
              onClick={() => save.mutate()}
              disabled={save.isPending || !form.name || !form.price}
              className="w-full btn-primary py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {savedProductId ? 'Atualizar' : 'Salvar Produto'}
            </button>

            {save.isError && (
              <p className="text-xs text-red-600">{save.error?.message}</p>
            )}
            {savedProductId && (
              <p className="text-xs text-green-600 text-center">✓ Produto salvo com sucesso</p>
            )}
          </div>

          {/* Publication control */}
          {savedProductId && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <PublicationControl productId={savedProductId} productName={form.name} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
