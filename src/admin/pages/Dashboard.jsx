import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

async function fetchDashboardStats() {
  const [products, orders, lowStock] = await Promise.all([
    supabase.from('products').select('id, is_active', { count: 'exact' }),
    supabase.from('orders').select('id, total, status', { count: 'exact' }).gte('created_at', new Date(Date.now() - 86400000 * 7).toISOString()),
    supabase.from('product_variants').select('id, product_id, stock_qty').lte('stock_qty', 2).gt('stock_qty', 0),
  ])
  return {
    totalProducts: products.count ?? 0,
    activeProducts: (products.data ?? []).filter(p => p.is_active).length,
    ordersThisWeek: orders.count ?? 0,
    revenueThisWeek: (orders.data ?? []).filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total ?? 0), 0),
    lowStockCount: lowStock.data?.length ?? 0,
  }
}

function StatCard({ icon: Icon, label, value, sub, color = 'blue', to }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  const card = (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
  return to ? <Link to={to}>{card}</Link> : card
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchDashboardStats,
    staleTime: 60000,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <Link
          to="/admin/produtos/novo"
          className="btn-primary px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            label="Produtos Ativos"
            value={stats?.activeProducts ?? 0}
            sub={`de ${stats?.totalProducts ?? 0} cadastrados`}
            color="purple"
            to="/admin/produtos"
          />
          <StatCard
            icon={ShoppingCart}
            label="Pedidos (7 dias)"
            value={stats?.ordersThisWeek ?? 0}
            color="blue"
            to="/admin/pedidos"
          />
          <StatCard
            icon={TrendingUp}
            label="Receita (7 dias)"
            value={`R$ ${(stats?.revenueThisWeek ?? 0).toFixed(2).replace('.', ',')}`}
            color="green"
          />
          {stats?.lowStockCount > 0 && (
            <StatCard
              icon={AlertTriangle}
              label="Estoque Baixo"
              value={stats.lowStockCount}
              sub="produtos com ≤ 2 unidades"
              color="amber"
            />
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/produtos/novo" className="btn-primary px-4 py-2 rounded-lg text-sm font-medium">
            Cadastrar Produto
          </Link>
          <Link to="/admin/produtos" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
            Gerenciar Vitrine
          </Link>
          <Link to="/admin/whatsapp" className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100">
            Configurar WhatsApp
          </Link>
          <Link to="/admin/redes-sociais" className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
            Redes Sociais
          </Link>
        </div>
      </div>
    </div>
  )
}
