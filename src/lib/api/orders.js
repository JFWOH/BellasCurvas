import { supabase } from '../supabase'

export async function createOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getOrders({ page = 1, pageSize = 20, status } = {}) {
  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (status) query = query.eq('status', status)

  const { data, error, count } = await query
  if (error) throw error
  return { orders: data ?? [], total: count ?? 0 }
}

export async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updateOrderStatus(id, status, extra = {}) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, ...extra, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function subscribeNewsletter(email, name) {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email, name, subscribed: true }, { onConflict: 'email' })

  if (error) throw error
}
