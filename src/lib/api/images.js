import { supabase } from '../supabase'
import imageCompression from 'browser-image-compression'

const BUCKET = 'product-images'

export async function uploadProductImage(productId, file, isPrimary = false) {
  const compressed = await imageCompression(file, {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  })

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const storagePath = `products/${productId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, compressed, { contentType: file.type, upsert: false })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath)

  const { data, error: dbError } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      storage_path: storagePath,
      public_url: publicUrl,
      is_primary: isPrimary,
      alt_text: file.name.replace(/\.[^.]+$/, ''),
    })
    .select()
    .single()

  if (dbError) throw dbError
  return data
}

export async function deleteProductImage(imageId, storagePath) {
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath])

  if (storageError) throw storageError

  const { error: dbError } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)

  if (dbError) throw dbError
}

export async function setPrimaryImage(productId, imageId) {
  await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', productId)

  const { error } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId)

  if (error) throw error
}

export async function updateImageOrder(images) {
  const updates = images.map((img, index) =>
    supabase.from('product_images').update({ sort_order: index }).eq('id', img.id)
  )
  await Promise.all(updates)
}
