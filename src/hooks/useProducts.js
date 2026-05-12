import { useQuery } from '@tanstack/react-query'
import { fetchProducts, fetchFeaturedProducts } from '../lib/api/products'
import { products as staticProducts, getFeaturedProducts } from '../data/products'

const supabaseConfigured =
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: supabaseConfigured ? undefined : staticProducts,
    enabled: supabaseConfigured,
    // se Supabase não configurado, usa dados estáticos diretamente
    select: supabaseConfigured ? undefined : (d) => d,
  })
}

export function useFeaturedProducts(limit = 3) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => fetchFeaturedProducts(limit),
    staleTime: 5 * 60 * 1000,
    placeholderData: supabaseConfigured ? undefined : getFeaturedProducts(staticProducts, limit),
    enabled: supabaseConfigured,
  })
}
