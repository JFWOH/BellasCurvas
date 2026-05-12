import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function getSettings() {
  const { data } = await supabase
    .from('app_settings')
    .select('key, value')
  return Object.fromEntries((data ?? []).map(s => [s.key, s.value]))
}

function generateCaption(product: any, storeUrl: string): string {
  const hashtags = [
    '#bellacurvas',
    '#modaplussize',
    '#plussize',
    '#modafeminina',
    '#curvygirl',
    `#${product.category ?? 'moda'}`,
    '#estilo',
    '#moda',
    '#modabrasileira',
    '#vidasemtamanho',
    '#acessibilidademoda',
  ].join(' ')

  return `✨ ${product.name}

${product.description ?? ''}

📏 Tamanhos: ${(product.sizes ?? []).join(' | ')}
💰 R$ ${product.price.toFixed(2).replace('.', ',')}

🛍️ Link na bio para comprar!

${hashtags}`
}

async function postToInstagram(imageUrl: string, caption: string, settings: Record<string, string>) {
  const userId = settings.instagram_user_id
  const token = settings.instagram_access_token
  if (!userId || !token) throw new Error('Instagram credentials not configured')

  // Passo 1: Criar container de mídia
  const createRes = await fetch(
    `https://graph.facebook.com/v19.0/${userId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: token,
      }),
    }
  )

  if (!createRes.ok) {
    const err = await createRes.text()
    throw new Error(`Instagram container creation failed: ${err}`)
  }

  const { id: containerId } = await createRes.json()

  // Aguardar processamento
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Passo 2: Publicar o container
  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${userId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: token,
      }),
    }
  )

  if (!publishRes.ok) {
    const err = await publishRes.text()
    throw new Error(`Instagram publish failed: ${err}`)
  }

  const { id: postId } = await publishRes.json()
  return postId
}

async function postToFacebook(imageUrl: string, caption: string, settings: Record<string, string>) {
  const pageId = settings.facebook_page_id
  const token = settings.facebook_access_token
  if (!pageId || !token) return null

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}/photos`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: imageUrl,
        caption,
        access_token: token,
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Facebook post failed: ${err}`)
  }

  const { id } = await res.json()
  return id
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { productId, channels = ['instagram', 'facebook'] } = await req.json()
    if (!productId) return new Response('productId required', { status: 400 })

    const settings = await getSettings()

    // Buscar produto
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        id, name, price, description, category, slug,
        product_images (public_url, is_primary),
        product_variants (size)
      `)
      .eq('id', productId)
      .single()

    if (error || !product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 })
    }

    const primaryImage = (product.product_images as any[])?.find(i => i.is_primary)?.public_url
      ?? (product.product_images as any[])?.[0]?.public_url

    if (!primaryImage) {
      return new Response(JSON.stringify({ error: 'Product has no image' }), { status: 400 })
    }

    const sizes = [...new Set((product.product_variants as any[])?.map(v => v.size) ?? [])].sort()
    const productWithSizes = { ...product, sizes }

    const storeUrl = settings.store_url ?? 'https://bellacurvas.com.br'
    const caption = generateCaption(productWithSizes, storeUrl)

    const updates: Record<string, string> = {}
    const results: Record<string, any> = {}

    if (channels.includes('instagram')) {
      try {
        const postId = await postToInstagram(primaryImage, caption, settings)
        updates.instagram_post_id = postId
        results.instagram = { ok: true, postId }
      } catch (err) {
        results.instagram = { ok: false, error: String(err) }
      }
    }

    if (channels.includes('facebook')) {
      try {
        const postId = await postToFacebook(primaryImage, caption, settings)
        if (postId) {
          updates.facebook_post_id = postId
          results.facebook = { ok: true, postId }
        }
      } catch (err) {
        results.facebook = { ok: false, error: String(err) }
      }
    }

    // Salvar IDs dos posts
    if (Object.keys(updates).length > 0) {
      await supabase
        .from('product_publications')
        .update(updates)
        .eq('product_id', productId)
    }

    return new Response(JSON.stringify({ results }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
