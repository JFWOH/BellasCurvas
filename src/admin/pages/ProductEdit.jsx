import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import ImageUploader from '../components/ImageUploader'
import PublicationControl from './PublicationControl'
import { Save, Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react'

const CATEGORIES = ['vestidos', 'blusas', 'saias', 'calças', 'conjuntos', 'acessórios']
const OCCASIONS = ['casual', 'trabalho', 'festa', 'praia', 'noite']
const SIZES = ['36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60']

export default function ProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`*, product_images(*), product_variants(*)`)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
  })

  const [form, setForm] = useState(null)
  const [variants, setVariants] = useState([])
  const [images, setImages] = useState([])

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description ?? '',
        price: product.price.toString(),
        original_price: product.original_price?.toString() ?? '',
        category: product.category,
        occasion: product.occasion ?? 'casual',
        features: product.features?.length > 0 ? product.features : [''],
        is_active: product.is_active,
        is_featured: product.is_featured,
      })
      setVariants(product.product_variants ?? [])
      setImages(product.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? [])
    }
  }, [product])

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('products')
        .update({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          original_price: form.original_price ? parseFloat(form.original_price) : null,
          category: form.category,
          occasion: form.occasion,
          features: form.features.filter(Boolean),
          is_active: form.is_active,
          is_featured: form.is_featured,
        })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-product', id] })
    },
  })

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  if (isLoading || !form) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/produtos')} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Editar Produto</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-900">Informações</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                  <input type="number" step="0.01" value={form.price} onChange={e => setField('price', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Original</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                  <input type="number" step="0.01" value={form.original_price} onChange={e => setField('original_price', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select value={form.category} onChange={e => setField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ocasião</label>
                <select value={form.occasion} onChange={e => setField('occasion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {OCCASIONS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" value={f} onChange={e => setForm(prev => { const features = [...prev.features]; features[i] = e.target.value; return { ...prev, features } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  {form.features.length > 1 && (
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }))}
                      className="p-2 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setForm(prev => ({ ...prev, features: [...prev.features, ''] }))}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                <Plus className="h-3 w-3" />Adicionar característica
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Fotos do Produto</h3>
            <ImageUploader productId={id} images={images} onImagesChange={setImages} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-900">Configurações</h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={e => setField('is_active', e.target.checked)}
                className="w-4 h-4 text-primary rounded" />
              <div>
                <p className="text-sm font-medium text-gray-700">Exibir na Vitrine</p>
                <p className="text-xs text-gray-400">Aparece no catálogo público</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => setField('is_featured', e.target.checked)}
                className="w-4 h-4 text-primary rounded" />
              <div>
                <p className="text-sm font-medium text-gray-700">Produto Destaque</p>
                <p className="text-xs text-gray-400">Aparece na página inicial</p>
              </div>
            </label>

            <button onClick={() => save.mutate()} disabled={save.isPending}
              className="w-full btn-primary py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Alterações
            </button>
            {save.isSuccess && <p className="text-xs text-green-600 text-center">✓ Salvo com sucesso</p>}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <PublicationControl productId={id} productName={form.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
