import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from './auth/AdminAuthContext'
import {
  LayoutDashboard, Package, Plus, ShoppingCart, MessageCircle,
  Share2, Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/produtos', icon: Package, label: 'Produtos' },
  { to: '/admin/produtos/novo', icon: Plus, label: 'Novo Produto' },
  { to: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
  { to: '/admin/whatsapp', icon: MessageCircle, label: 'WhatsApp' },
  { to: '/admin/redes-sociais', icon: Share2, label: 'Redes Sociais' },
  { to: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
]

export default function AdminLayout({ children }) {
  const { signOut } = useAdminAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  const Sidebar = () => (
    <nav className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">Bella Curvas</h1>
        <p className="text-xs text-gray-400 mt-0.5">Painel Admin</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </nav>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-gray-200 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-60 bg-white shadow-xl">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-gray-900">Bella Curvas Admin</span>
          <div className="w-5" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
