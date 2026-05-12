import { supabase } from '../supabase'

export async function fetchProducts(filters = {}) {
  let query = supabase
    .from('products')
    .select(`
      *,
      product_images (id, public_url, is_primary, sort_order, alt_text),
      product_variants (id, size, color, color_hex, stock_qty)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }
  if (filters.occasion && filters.occasion !== 'all') {
    query = query.eq('occasion', filters.occasion)
  }
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }
  if (filters.priceRange && filters.priceRange !== 'all') {
    const ranges = {
      'under200': [0, 200],
      '200-300': [200, 300],
      '300-400': [300, 400],
      'over400': [400, 99999],
    }
    const [min, max] = ranges[filters.priceRange] ?? [0, 99999]
    query = query.gte('price', min).lte('price', max)
  }

  const { data, error } = await query
  if (error) throw error
  return normalizeProducts(data)
}

export async function fetchFeaturedProducts(limit = 3) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (id, public_url, is_primary, sort_order),
      product_variants (id, size, color, stock_qty)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) throw error
  return normalizeProducts(data)
}

export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (id, public_url, is_primary, sort_order, alt_text),
      product_variants (id, size, color, color_hex, stock_qty, sku)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return normalizeProduct(data)
}

// Normaliza o formato do Supabase para o formato usado nos componentes
function normalizeProduct(p) {
  if (!p) return null
  const images = (p.product_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(img => img.public_url)

  const primaryImage = p.product_images?.find(img => img.is_primary)
  const sizes = [...new Set((p.product_variants ?? []).map(v => v.size))].sort()
  const colors = [...new Set((p.product_variants ?? []).map(v => v.color).filter(Boolean))]
  const inStock = (p.product_variants ?? []).some(v => v.stock_qty > 0)

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.original_price,
    category: p.category,
    occasion: p.occasion,
    features: p.features ?? [],
    rating: p.rating ?? 0,
    reviews: p.review_count ?? 0,
    description: p.description ?? '',
    image: primaryImage?.public_url ?? images[0] ?? '',
    images,
    sizes,
    colors,
    inStock,
    isFeatured: p.is_featured,
    variants: p.product_variants ?? [],
  }
}

function normalizeProducts(data) {
  return (data ?? []).map(normalizeProduct)
}
