import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// Esta função é chamada a cada 5 minutos pelo pg_cron
// Verifica publicações agendadas e as processa
Deno.serve(async () => {
  const now = new Date().toISOString()

  // Buscar publicações com envio WhatsApp agendado que não foram enviadas ainda
  const { data: pendingWhatsApp } = await supabase
    .from('product_publications')
    .select('product_id, publish_whatsapp_at')
    .lte('publish_whatsapp_at', now)
    .is('whatsapp_sent_at', null)
    .not('publish_whatsapp_at', 'is', null)

  // Buscar publicações com post social agendado
  const { data: pendingSocial } = await supabase
    .from('product_publications')
    .select('product_id, publish_social_at, instagram_post_id')
    .lte('publish_social_at', now)
    .is('instagram_post_id', null)
    .not('publish_social_at', 'is', null)

  // Buscar produtos com vitrine agendada
  const { data: pendingVitrine } = await supabase
    .from('product_publications')
    .select('product_id, publish_vitrine_at')
    .lte('publish_vitrine_at', now)
    .not('publish_vitrine_at', 'is', null)

  const results = {
    whatsapp: pendingWhatsApp?.length ?? 0,
    social: pendingSocial?.length ?? 0,
    vitrine: pendingVitrine?.length ?? 0,
  }

  // Ativar na vitrine os produtos agendados
  for (const pub of pendingVitrine ?? []) {
    await supabase.from('products').update({ is_active: true }).eq('id', pub.product_id)
    await supabase
      .from('product_publications')
      .update({ publish_vitrine_at: null })
      .eq('product_id', pub.product_id)
  }

  // Disparar envio WhatsApp
  for (const pub of pendingWhatsApp ?? []) {
    await supabase.functions.invoke('whatsapp-publisher', {
      body: { productId: pub.product_id },
    }).catch(() => null)
  }

  // Disparar post social
  for (const pub of pendingSocial ?? []) {
    await supabase.functions.invoke('social-publisher', {
      body: { productId: pub.product_id },
    }).catch(() => null)
  }

  return new Response(JSON.stringify({ processed: results, timestamp: now }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
