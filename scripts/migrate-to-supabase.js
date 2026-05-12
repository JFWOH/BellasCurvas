#!/usr/bin/env node
/**
 * Script de Migração: Produtos Estáticos → Supabase
 *
 * USO:
 *   node scripts/migrate-to-supabase.js
 *
 * As variáveis são lidas automaticamente do arquivo .env.local
 *
 * ATENÇÃO: Este script usa o service role key para bypassar RLS.
 * Execute somente uma vez, após criar as tabelas (supabase/schema.sql).
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

// Carrega .env.local automaticamente (sem precisar de dotenv)
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
try {
  const envFile = readFileSync(envPath, 'utf-8')
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
} catch {
  console.warn('⚠️  Arquivo .env.local não encontrado, usando variáveis do sistema.')
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || SUPABASE_URL.includes('placeholder')) {
  console.error('❌ Configure VITE_SUPABASE_URL no arquivo .env.local')
  process.exit(1)
}
if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY.startsWith('eyJ...')) {
  console.error('❌ Configure SUPABASE_SERVICE_ROLE_KEY no arquivo .env.local')
  console.error('   Onde encontrar: Supabase → Settings → API → service_role (secret)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const PRODUCTS = [
  { name: 'Vestido Plissado Verde Esmeralda', price: 299.90, category: 'vestidos', occasion: 'festa', sizes: ['46','48','50','52','54'], rating: 5, review_count: 24, description: 'Vestido longo plissado em tecido fluido, perfeito para ocasiões especiais. O modelo ombro a ombro valoriza o colo e a cintura marcada realça as curvas.', features: ['Tecido fluido','Cintura marcada','Ombro a ombro','Comprimento longo'], image: '/images/Generated Image June 14, 2025 - 10_23PM (1).jpeg', is_featured: true },
  { name: 'Vestido Listrado Elegante', price: 259.90, category: 'vestidos', occasion: 'trabalho', sizes: ['44','46','48','50','52'], rating: 5, review_count: 18, description: 'Vestido midi com listras verticais que alongam a silhueta. Modelo transpassado com mangas longas e cintura ajustável.', features: ['Listras verticais','Modelo transpassado','Mangas longas','Cintura ajustável'], image: '/images/Generated Image June 14, 2025 - 10_24PM (4).jpeg', is_featured: true },
  { name: 'Vestido Tropical Verão', price: 199.90, category: 'vestidos', occasion: 'casual', sizes: ['46','48','50','52','54','56'], rating: 4, review_count: 32, description: 'Vestido longo com estampa tropical vibrante, ideal para dias quentes. Alças finas e fenda lateral para maior conforto.', features: ['Estampa tropical','Alças finas','Fenda lateral','Tecido leve'], image: '/images/Generated Image June 15, 2025 - 2_13AM (1).jpeg', is_featured: false },
  { name: 'Vestido Floral Romântico', price: 279.90, category: 'vestidos', occasion: 'casual', sizes: ['44','46','48','50'], rating: 5, review_count: 15, description: 'Vestido midi com estampa floral delicada e mangas bufantes. Perfeito para um look romântico e feminino.', features: ['Estampa floral','Mangas bufantes','Comprimento midi','Decote em V'], image: '/images/Generated Image June 15, 2025 - 7_45PM.jpeg', is_featured: false },
  { name: 'Vestido Longo Festa Dourado', price: 349.90, category: 'vestidos', occasion: 'festa', sizes: ['46','48','50','52','54'], rating: 5, review_count: 28, description: 'Vestido longo com detalhes dourados, ideal para festas e eventos especiais. Modelagem que valoriza todas as curvas.', features: ['Detalhes dourados','Comprimento longo','Modelagem ajustada','Tecido nobre'], image: '/images/Generated Image June 15, 2025 - 10_42PM.jpeg', is_featured: true },
  { name: 'Vestido Casual Confortável', price: 189.90, category: 'vestidos', occasion: 'casual', sizes: ['44','46','48','50','52','54'], rating: 4, review_count: 41, description: 'Vestido casual em tecido macio e confortável. Ideal para o dia a dia com muito estilo e praticidade.', features: ['Tecido macio','Modelagem confortável','Uso diário','Fácil manutenção'], image: '/images/Generated Image June 15, 2025 - 2_13AM (2).jpeg', is_featured: false },
  { name: 'Vestido Elegante Noite', price: 319.90, category: 'vestidos', occasion: 'festa', sizes: ['46','48','50','52'], rating: 5, review_count: 22, description: 'Vestido preto elegante para ocasiões noturnas. Modelagem sofisticada que garante um look impecável.', features: ['Cor clássica','Modelagem sofisticada','Ocasiões especiais','Tecido premium'], image: '/images/Generated Image June 15, 2025 - 7_45PM (1).jpeg', is_featured: false },
  { name: 'Vestido Estampado Moderno', price: 239.90, category: 'vestidos', occasion: 'casual', sizes: ['44','46','48','50','52','54'], rating: 4, review_count: 19, description: 'Vestido com estampa geométrica moderna e corte contemporâneo. Perfeito para mulheres que gostam de ousar.', features: ['Estampa geométrica','Corte moderno','Design contemporâneo','Versátil'], image: '/images/Generated Image June 15, 2025 - 10_27PM.jpeg', is_featured: false },
  { name: 'Vestido Festa Brilhante', price: 389.90, category: 'vestidos', occasion: 'festa', sizes: ['46','48','50','52','54'], rating: 5, review_count: 31, description: 'Vestido com brilho sutil para festas especiais. Modelagem que realça a feminilidade com muito glamour.', features: ['Brilho sutil','Muito glamour','Ocasiões especiais','Modelagem feminina'], image: '/images/Generated Image June 15, 2025 - 11_06PM.jpeg', is_featured: true },
  { name: 'Vestido Verão Colorido', price: 219.90, category: 'vestidos', occasion: 'casual', sizes: ['44','46','48','50','52','54','56'], rating: 4, review_count: 26, description: 'Vestido colorido perfeito para o verão. Estampa alegre e tecido leve para máximo conforto.', features: ['Estampa alegre','Tecido leve','Perfeito para verão','Conforto máximo'], image: '/images/Generated Image June 15, 2025 - 2_13AM (3).jpeg', is_featured: false },
  { name: 'Vestido Sofisticado Trabalho', price: 289.90, category: 'vestidos', occasion: 'trabalho', sizes: ['44','46','48','50','52'], rating: 5, review_count: 17, description: 'Vestido em azul marinho ideal para ambiente corporativo. Elegância e profissionalismo em uma só peça.', features: ['Azul marinho','Ambiente corporativo','Elegante','Profissional'], image: '/images/Generated Image June 15, 2025 - 2_17AM.jpeg', is_featured: false },
  { name: 'Vestido Festa Luxo', price: 429.90, category: 'vestidos', occasion: 'festa', sizes: ['46','48','50','52','54'], rating: 5, review_count: 35, description: 'Vestido de luxo em tom bordô para ocasiões muito especiais. Acabamento impecável e design exclusivo.', features: ['Tom bordô','Acabamento impecável','Design exclusivo','Muito especial'], image: '/images/Generated Image June 15, 2025 - 2_25AM.jpeg', is_featured: true },
]

async function migrate() {
  console.log('🚀 Iniciando migração para Supabase...\n')

  let success = 0
  let failed = 0

  for (const p of PRODUCTS) {
    const slug = slugify(p.name) + '-' + Math.random().toString(36).slice(2, 6)

    // Inserir produto
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        category: p.category,
        occasion: p.occasion,
        features: p.features,
        rating: p.rating,
        review_count: p.review_count,
        is_active: true,
        is_featured: p.is_featured,
      })
      .select()
      .single()

    if (productError) {
      console.error(`❌ ${p.name}: ${productError.message}`)
      failed++
      continue
    }

    // Inserir variantes (tamanhos)
    const variants = p.sizes.map(size => ({
      product_id: product.id,
      size,
      stock_qty: 10,
    }))

    const { error: variantError } = await supabase.from('product_variants').insert(variants)
    if (variantError) {
      console.warn(`⚠️  ${p.name}: erro ao inserir variantes: ${variantError.message}`)
    }

    // Inserir imagem (URL pública local — depois substituir pelo Supabase Storage)
    const imageUrl = `${SUPABASE_URL.replace('.supabase.co', '')}/storage/v1/object/public/product-images${p.image}`
    const { error: imageError } = await supabase.from('product_images').insert({
      product_id: product.id,
      storage_path: `products/${product.id}/migrated${p.image.split('/').pop()}`,
      public_url: p.image, // usar caminho local temporariamente
      is_primary: true,
      sort_order: 0,
    })
    if (imageError) {
      console.warn(`⚠️  ${p.name}: erro ao inserir imagem: ${imageError.message}`)
    }

    // Inserir registro de publicação
    await supabase.from('product_publications').insert({
      product_id: product.id,
      status: 'vitrine',
    })

    console.log(`✅ ${p.name} (${p.sizes.length} tamanhos)`)
    success++
  }

  console.log(`\n📊 Resultado: ${success} produtos migrados, ${failed} erros`)
  console.log('\n⚠️  PRÓXIMO PASSO: Faça upload das imagens no painel admin → Editar Produto → Fotos')
  console.log('   As imagens locais em /public/images/ funcionam em desenvolvimento,')
  console.log('   mas em produção precisam ser enviadas para o Supabase Storage.\n')
}

migrate().catch(console.error)
