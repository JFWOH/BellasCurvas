import { supabase } from '../supabase'

export async function getPublication(productId) {
  const { data, error } = await supabase
    .from('product_publications')
    .select('*')
    .eq('product_id', productId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertPublication(productId, updates) {
  const { data, error } = await supabase
    .from('product_publications')
    .upsert({ product_id: productId, ...updates }, { onConflict: 'product_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getWhatsAppGroups() {
  const { data, error } = await supabase
    .from('whatsapp_groups')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data ?? []
}

export async function upsertWhatsAppGroup(group) {
  const { data, error } = await supabase
    .from('whatsapp_groups')
    .upsert(group)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteWhatsAppGroup(id) {
  const { error } = await supabase
    .from('whatsapp_groups')
    .update({ is_active: false })
    .eq('id', id)

  if (error) throw error
}

export async function getWhatsAppSendLog(productId) {
  const { data, error } = await supabase
    .from('whatsapp_send_log')
    .select('*, whatsapp_groups(name)')
    .eq('product_id', productId)
    .order('sent_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getAppSetting(key) {
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) throw error
  return data?.value
}

export async function setAppSetting(key, value) {
  const { error } = await supabase
    .from('app_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) throw error
}

export async function getAllAppSettings() {
  const { data, error } = await supabase
    .from('app_settings')
    .select('key, value')

  if (error) throw error
  return Object.fromEntries((data ?? []).map(s => [s.key, s.value]))
}
