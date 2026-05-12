-- ============================================================
-- Bella Curvas — Schema Supabase (PostgreSQL)
-- Execute no SQL Editor do painel Supabase
-- ============================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ============================================================
-- ENUM de status de publicação
-- ============================================================
CREATE TYPE publication_status AS ENUM (
  'rascunho',
  'whatsapp_apenas',
  'social_apenas',
  'vitrine',
  'publicado_todos'
);

-- ============================================================
-- PRODUTOS
-- ============================================================
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  price           NUMERIC(10,2) NOT NULL,
  original_price  NUMERIC(10,2),
  category        TEXT NOT NULL,
  occasion        TEXT,
  features        TEXT[],
  rating          NUMERIC(3,2) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT false,
  is_featured     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- VARIANTES (tamanho × cor × estoque)
-- ============================================================
CREATE TABLE product_variants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  size        TEXT NOT NULL,
  color       TEXT,
  color_hex   TEXT,
  stock_qty   INTEGER DEFAULT 0,
  sku         TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- IMAGENS
-- ============================================================
CREATE TABLE product_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID REFERENCES products(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL,
  public_url    TEXT NOT NULL,
  alt_text      TEXT,
  is_primary    BOOLEAN DEFAULT false,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PUBLICAÇÕES (controle de visibilidade por canal)
-- ============================================================
CREATE TABLE product_publications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          UUID REFERENCES products(id) ON DELETE CASCADE UNIQUE,
  status              publication_status DEFAULT 'rascunho',
  publish_vitrine_at  TIMESTAMPTZ,
  publish_whatsapp_at TIMESTAMPTZ,
  publish_social_at   TIMESTAMPTZ,
  whatsapp_sent_at    TIMESTAMPTZ,
  instagram_post_id   TEXT,
  facebook_post_id    TEXT,
  whatsapp_message_id TEXT,
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- GRUPOS DE WHATSAPP
-- ============================================================
CREATE TABLE whatsapp_groups (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  group_id   TEXT NOT NULL,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- LOG DE ENVIOS WHATSAPP
-- ============================================================
CREATE TABLE whatsapp_send_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  group_id   UUID REFERENCES whatsapp_groups(id),
  status     TEXT,
  error_msg  TEXT,
  sent_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PEDIDOS
-- ============================================================
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT,
  customer_cpf     TEXT,
  shipping_address JSONB,
  items            JSONB NOT NULL,
  subtotal         NUMERIC(10,2),
  shipping_cost    NUMERIC(10,2) DEFAULT 0,
  total            NUMERIC(10,2),
  status           TEXT DEFAULT 'pending',
  payment_method   TEXT,
  payment_id       TEXT,
  payment_status   TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CONFIGURAÇÕES DA APLICAÇÃO (tokens de API)
-- ============================================================
CREATE TABLE app_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir chaves iniciais (valores preenchidos via painel admin)
INSERT INTO app_settings (key) VALUES
  ('instagram_access_token'),
  ('instagram_user_id'),
  ('facebook_page_id'),
  ('facebook_access_token'),
  ('evolution_api_url'),
  ('evolution_api_key'),
  ('evolution_instance_name'),
  ('store_whatsapp_phone'),
  ('store_name'),
  ('store_url');

-- ============================================================
-- NEWSLETTER
-- ============================================================
CREATE TABLE newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  subscribed  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TRIGGERS — updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER product_publications_updated_at
  BEFORE UPDATE ON product_publications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_send_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- PRODUTOS: leitura pública apenas para produtos ativos
CREATE POLICY "products_public_read"
  ON products FOR SELECT
  USING (is_active = true);

-- PRODUTOS: admin pode fazer tudo
CREATE POLICY "products_admin_all"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- VARIANTES: leitura pública vinculada a produtos ativos
CREATE POLICY "variants_public_read"
  ON product_variants FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products p
    WHERE p.id = product_id AND p.is_active = true
  ));

CREATE POLICY "variants_admin_all"
  ON product_variants FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- IMAGENS: leitura pública vinculada a produtos ativos
CREATE POLICY "images_public_read"
  ON product_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products p
    WHERE p.id = product_id AND p.is_active = true
  ));

CREATE POLICY "images_admin_all"
  ON product_images FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- PUBLICAÇÕES: somente admin
CREATE POLICY "publications_admin_all"
  ON product_publications FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- GRUPOS WHATSAPP: somente admin
CREATE POLICY "whatsapp_groups_admin_all"
  ON whatsapp_groups FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- LOG WHATSAPP: somente admin
CREATE POLICY "whatsapp_log_admin_all"
  ON whatsapp_send_log FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- PEDIDOS: admin vê todos; cliente vê apenas os seus (via email)
CREATE POLICY "orders_admin_all"
  ON orders FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CONFIGURAÇÕES: somente service_role (Edge Functions)
-- (nenhuma policy pública — service_role bypassa RLS)

-- NEWSLETTER: inserção pública (para signup); leitura/gestão somente admin
CREATE POLICY "newsletter_public_insert"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "newsletter_admin_read"
  ON newsletter_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- AGENDAMENTO — verificar publicações agendadas a cada 5 min
-- (requer pg_cron habilitado no Supabase Pro)
-- ============================================================
-- SELECT cron.schedule(
--   'check-scheduled-publications',
--   '*/5 * * * *',
--   $$
--   SELECT net.http_post(
--     url := current_setting('app.supabase_url') || '/functions/v1/process-scheduled-publications',
--     headers := json_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))::jsonb,
--     body := '{}'::jsonb
--   )
--   $$
-- );
