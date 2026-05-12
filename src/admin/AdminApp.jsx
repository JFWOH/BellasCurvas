import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider, useAdminAuth } from './auth/AdminAuthContext'
import AdminLogin from './auth/AdminLogin'
import AdminLayout from './AdminLayout'
import { Loader2 } from 'lucide-react'

// Páginas do admin com lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ProductList = lazy(() => import('./pages/ProductList'))
const ProductNew = lazy(() => import('./pages/ProductNew'))
const ProductEdit = lazy(() => import('./pages/ProductEdit'))
const OrderList = lazy(() => import('./pages/OrderList'))
const OrderDetail = lazy(() => import('./pages/OrderDetail'))
const WhatsAppGroups = lazy(() => import('./pages/WhatsAppGroups'))
const SocialSettings = lazy(() => import('./pages/SocialSettings'))
const AdminSettings = lazy(() => import('./pages/AdminSettings'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="h-7 w-7 animate-spin text-primary mr-2" />
      <span className="text-gray-400 text-sm">Carregando...</span>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth()

  if (loading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return children
}

function AdminRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="login" element={<AdminLoginWrapper />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="produtos" element={<ProductList />} />
                    <Route path="produtos/novo" element={<ProductNew />} />
                    <Route path="produtos/:id/editar" element={<ProductEdit />} />
                    <Route path="pedidos" element={<OrderList />} />
                    <Route path="pedidos/:id" element={<OrderDetail />} />
                    <Route path="whatsapp" element={<WhatsAppGroups />} />
                    <Route path="redes-sociais" element={<SocialSettings />} />
                    <Route path="configuracoes" element={<AdminSettings />} />
                  </Routes>
                </Suspense>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}

// Redireciona para dashboard se já estiver logado
function AdminLoginWrapper() {
  const { isAuthenticated, loading } = useAdminAuth()
  if (loading) return <PageLoader />
  if (isAuthenticated) return <Navigate to="/admin" replace />
  return <AdminLogin />
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminRoutes />
    </AdminAuthProvider>
  )
}
