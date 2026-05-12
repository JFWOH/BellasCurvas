import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getOrders } from '../../lib/api/orders'
import { Loader2, ChevronRight, Package } from 'lucide-react'

const STATUS_LABELS = {
  pending: { label: 'Aguardando', className: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Pago', className: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'Enviado', className: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Entregue', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
}

export default function OrderList() {
  const [status, setStatus] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', status],
    queryFn: () => getOrders({ status: status || undefined }),
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pedidos</h2>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(data?.orders ?? []).map(order => {
              const st = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending
              return (
                <Link key={order.id} to={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${st.className}`}>{st.label}</span>
                    <span className="font-semibold text-gray-900 text-sm">R$ {(order.total ?? 0).toFixed(2).replace('.', ',')}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              )
            })}
            {(data?.orders ?? []).length === 0 && (
              <div className="py-12 text-center text-gray-400">Nenhum pedido encontrado.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
