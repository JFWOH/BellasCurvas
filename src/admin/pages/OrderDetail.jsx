import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrderById, updateOrderStatus } from '../../lib/api/orders'
import { ArrowLeft, Loader2, Package, User, MapPin, CreditCard } from 'lucide-react'

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
const STATUS_LABELS = { pending: 'Aguardando', paid: 'Pago', shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado' }

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => getOrderById(id),
  })

  const updateStatus = useMutation({
    mutationFn: (status) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    },
  })

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
  if (!order) return null

  const items = order.items ?? []

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/pedidos')} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Pedido</h2>
        <span className="text-gray-400 text-sm font-mono">{order.id.slice(0, 8)}...</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900 text-sm">Cliente</h3>
          </div>
          <p className="text-gray-700">{order.customer_name}</p>
          <p className="text-sm text-gray-500">{order.customer_email}</p>
          {order.customer_phone && <p className="text-sm text-gray-500">{order.customer_phone}</p>}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900 text-sm">Pagamento</h3>
          </div>
          <p className="text-gray-700 capitalize">{order.payment_method ?? '—'}</p>
          <p className="text-sm text-gray-500 capitalize">{order.payment_status ?? '—'}</p>
          <p className="text-lg font-bold text-gray-900 mt-2">R$ {(order.total ?? 0).toFixed(2).replace('.', ',')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Status do Pedido</h3>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => updateStatus.mutate(s)}
              disabled={order.status === s || updateStatus.isPending}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                order.status === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Itens do Pedido</h3>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                <p className="text-xs text-gray-400">Tamanho: {item.size} • Qtd: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900 text-sm">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
