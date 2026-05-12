import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import PublicationStatusBadge from '../components/PublicationStatusBadge'
import { Plus, Edit, Eye, EyeOff, Search, Loader2, Trash2 } from 'lucide-react'

async function fetchAdminProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, price, category, is_active, is_featured, created_at,
      product_images (public_url, is_primary),
      product_publications (status)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export default function ProductList() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAdminProducts,
  })

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }) => {
      const { error } = await supabase.from('products').update({ is_active: !is_active }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  })

  const filtered = (products ?? []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
        <Link
          to="/admin/produtos/novo"
          className="btn-primary px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Produto</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Preço</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Vitrine</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(product => {
                  const thumb = product.product_images?.find(i => i.is_primary)?.public_url
                    ?? product.product_images?.[0]?.public_url
                  const pubStatus = product.product_publications?.[0]?.status ?? 'rascunho'

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {thumb ? (
                            <img src={thumb} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-gray-700 font-medium">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <PublicationStatusBadge status={pubStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive.mutate({ id: product.id, is_active: product.is_active })}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {product.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {product.is_active ? 'Visível' : 'Oculto'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/produtos/${product.id}/editar`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
