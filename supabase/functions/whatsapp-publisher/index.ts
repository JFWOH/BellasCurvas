import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL')!
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY')!
const EVOLUTION_INSTANCE = Deno.env.get('EVOLUTION_INSTANCE_NAME') ?? 'bella-curvas'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

interface ProductData {
  id: string
  name: string
  price: number
  description: string
  sizes: string[]
  imageUrl: string
  storeUrl: string
}

function formatCaption(p: ProductData): string {
  return `*${p.name}* ✨

${p.description}

📏 Tamanhos: ${p.sizes.join(' | ')}
💰 R$ ${p.price.toFixed(2).replace('.', ',')}

🛍️ Ver na loja: ${p.storeUrl}

_Bella Curvas — Celebre Suas Curvas!_`
}

async function sendToGroup(groupId: string, product: ProductData): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(
      `${EVOLUTION_API_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number: groupId,
          mediatype: 'image',
          mimetype: 'image/jpeg',
          media: product.imageUrl,
          caption: formatCaption(product),
        }),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: text }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { productId } = await req.json()
    if (!productId) return new Response('productId required', { status: 400 })

    // Buscar dados do produto
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        id, name, price, description, slug,
        product_images (public_url, is_primary),
        product_variants (size)
      `)
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 })
    }

    // Buscar configurações da loja
    const { data: storeSettings } = await supabase
      .from('app_settings')
      .select('key, value')
      .in('key', ['store_url', 'store_name'])

    const settings = Object.fromEntries((storeSettings ?? []).map(s => [s.key, s.value]))
    const storeUrl = settings.store_url
      ? `${settings.store_url}/catalogo`
      : 'https://bellacurvas.com.br/catalogo'

    const primaryImage = product.product_images?.find((i: any) => i.is_primary)?.public_url
      ?? product.product_images?.[0]?.public_url ?? ''

    const sizes = [...new Set((product.product_variants ?? []).map((v: any) => v.size))].sort() as string[]

    const productData: ProductData = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description ?? '',
      sizes,
      imageUrl: primaryImage,
      storeUrl,
    }

    // Buscar grupos ativos
    const { data: groups } = await supabase
      .from('whatsapp_groups')
      .select('id, group_id, name')
      .eq('is_active', true)

    if (!groups || groups.length === 0) {
      return new Response(JSON.stringify({ message: 'No active groups' }), { status: 200 })
    }

    // Enviar para cada grupo e registrar log
    const results = []
    for (const group of groups) {
      const result = await sendToGroup(group.group_id, productData)
      await supabase.from('whatsapp_send_log').insert({
        product_id: productId,
        group_id: group.id,
        status: result.ok ? 'sent' : 'failed',
        error_msg: result.error ?? null,
      })
      results.push({ group: group.name, ...result })
    }

    // Atualizar timestamp de envio
    await supabase
      .from('product_publications')
      .update({ whatsapp_sent_at: new Date().toISOString() })
      .eq('product_id', productId)

    return new Response(JSON.stringify({ results }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
