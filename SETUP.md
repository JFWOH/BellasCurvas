# Bella Curvas — Guia de Configuração Completo

## Visão Geral da Arquitetura

```
Site Público (React + Vite)
  ↓ busca produtos
Supabase (PostgreSQL + Storage + Auth)
  ↓ Edge Functions disparam para
Evolution API (WhatsApp grupos) + Meta Graph API (Instagram/Facebook)
```

---

## FASE 1 — Configuração do Supabase (obrigatório)

### 1.1 Criar conta e projeto

1. Acesse [supabase.com](https://supabase.com) → **New Project**
2. Escolha a região **South America (São Paulo)** — sa-east-1
3. Anote a senha do banco (salve com segurança)

### 1.2 Criar tabelas

No painel Supabase → **SQL Editor** → cole e execute o conteúdo de:
```
supabase/schema.sql
```

### 1.3 Criar bucket de imagens

No painel Supabase → **Storage** → **New bucket**:
- Nome: `product-images`
- **Public bucket**: ✅ (marcar como público)

### 1.4 Configurar variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.local.example .env.local

# Edite com suas credenciais do Supabase
# Painel Supabase → Settings → API
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 1.5 Migrar produtos existentes

```bash
# Adicione também ao .env.local:
# SUPABASE_SERVICE_ROLE_KEY=eyJ... (Settings → API → service_role)

node scripts/migrate-to-supabase.js
```

### 1.6 Criar usuário administrador

No painel Supabase → **Authentication** → **Users** → **Invite user**:
- Informe o e-mail da administradora
- Ela receberá um e-mail para definir a senha

### 1.7 Iniciar o site em desenvolvimento

```bash
npm install
npm run dev
# Acesse http://localhost:5173
# Painel admin: http://localhost:5173/admin
```

---

## FASE 2 — Integração WhatsApp (Evolution API)

### 2.1 Contratar VPS

Recomendado: **Hetzner CX22** (~R$ 40/mês)
- [hetzner.com](https://www.hetzner.com/cloud) → Create Server → CX22 → Ubuntu 22.04

### 2.2 Instalar Docker e Evolution API

```bash
# SSH no VPS
ssh root@SEU_IP_VPS

# Instalar Docker
curl -fsSL https://get.docker.com | sh

# Criar docker-compose.yml
mkdir ~/evolution && cd ~/evolution
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  evolution-api:
    image: atendai/evolution-api:latest
    ports:
      - "8080:8080"
    environment:
      - SERVER_URL=https://SEU_IP_VPS:8080
      - AUTHENTICATION_API_KEY=SUA_CHAVE_SECRETA_AQUI
      - AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true
      - DEL_INSTANCE=false
    restart: unless-stopped
EOF

docker-compose up -d
```

### 2.3 Conectar número WhatsApp

1. Acesse `http://SEU_IP_VPS:8080` → Swagger UI
2. `POST /instance/create` com `instanceName: "bella-curvas"`
3. `GET /instance/qrcode/bella-curvas` → escanear QR com o WhatsApp Business

### 2.4 Configurar no painel admin

- Acesse `/admin/configuracoes`
- Preencha: URL da API, Chave de API, Nome da instância
- Acesse `/admin/whatsapp` → Adicionar grupos

### 2.5 Deploy das Edge Functions

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Vincular ao projeto
supabase link --project-ref SEU_PROJECT_ID

# Configurar secrets (Settings → Edge Functions → Secrets)
supabase secrets set EVOLUTION_API_URL=https://SEU_IP_VPS:8080
supabase secrets set EVOLUTION_API_KEY=SUA_CHAVE_SECRETA
supabase secrets set EVOLUTION_INSTANCE_NAME=bella-curvas

# Deploy
supabase functions deploy whatsapp-publisher
supabase functions deploy social-publisher
supabase functions deploy process-scheduled-publications
```

---

## FASE 3 — Integração Redes Sociais (Instagram + Facebook)

### 3.1 Pré-requisitos

- Conta **Instagram Business** (não pessoal)
- **Página do Facebook** vinculada à conta Instagram

### 3.2 Criar App no Meta

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. **Create App** → Business → preencha informações
3. Adicionar produtos: **Instagram Graph API** e **Facebook Login**
4. Permissões necessárias:
   - `instagram_content_publish`
   - `pages_manage_posts`
   - `pages_read_engagement`

### 3.3 Obter tokens de longa duração

```bash
# Troque pelo seu App ID, App Secret e User Token de curta duração:
curl "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_TOKEN"
```

### 3.4 Configurar no painel admin

- Acesse `/admin/redes-sociais`
- Preencha: Instagram User ID, Token, Facebook Page ID, Token da Página

### 3.5 Secrets do Supabase para redes sociais

```bash
supabase secrets set INSTAGRAM_ACCESS_TOKEN=SEU_TOKEN
supabase secrets set INSTAGRAM_USER_ID=SEU_USER_ID
supabase secrets set FACEBOOK_PAGE_ID=SUA_PAGE_ID
supabase secrets set FACEBOOK_ACCESS_TOKEN=SEU_PAGE_TOKEN
```

---

## FASE 4 — Checkout com MercadoPago

### 4.1 Criar conta MercadoPago

1. Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Criar aplicação → obter credenciais (Test e Produção)

### 4.2 Instalar SDK e criar páginas de checkout

```bash
npm install @mercadopago/sdk-react
```

As páginas de checkout serão implementadas na Fase 4:
- `src/pages/Checkout.jsx`
- `src/pages/CheckoutSuccess.jsx`
- `src/pages/CheckoutFailure.jsx`

### 4.3 Configurar webhook

No painel MercadoPago → Webhooks:
- URL: `https://SEU_PROJECT_ID.supabase.co/functions/v1/payment-webhook`
- Eventos: `payment`

---

## Como Usar o Painel Admin

### Fluxo de upload de produto novo

1. Acesse `/admin/produtos/novo`
2. Preencha: nome, descrição, preço, categoria, tamanhos e estoque
3. Salve o produto (botão **Salvar Produto**)
4. Após salvar, a seção de **Fotos** é liberada — arraste ou clique para upload
5. Na seção **Publicação** (à direita):
   - **Enviar para WhatsApp agora** → clique no botão da seção WhatsApp
   - **Postar no Instagram** → clique no botão da seção Instagram
   - **Aparecer na vitrine do site** → marque **Exibir na Vitrine** nas configurações
   - Ou **agende** uma data/hora para cada canal

### Controle de visibilidade

| Estado | Site | WhatsApp | Instagram/Facebook |
|--------|------|----------|--------------------|
| Rascunho | ❌ | ❌ | ❌ |
| WhatsApp apenas | ❌ | ✅ | ❌ |
| Redes Sociais apenas | ❌ | ❌ | ✅ |
| Vitrine | ✅ | ❌ | ❌ |
| Publicado Todos | ✅ | ✅ | ✅ |

---

## Deploy para Produção

### Opção A: Vercel (recomendado)

```bash
npm install -g vercel
vercel --prod
# Configure as env vars no painel Vercel:
# VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
```

### Opção B: Netlify

```bash
npm run build
# Arraste a pasta dist/ para app.netlify.com
# Ou conecte o repositório GitHub
```

### Variáveis de ambiente em produção

Configure **somente** estas no painel do serviço de hospedagem:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Os tokens secretos ficam **apenas** nos Supabase Secrets (nunca no frontend).

---

## Custos Mensais Estimados

| Serviço | Plano | Custo |
|---------|-------|-------|
| Supabase | Free (até 500MB) | R$ 0 |
| Vercel/Netlify | Hobby | R$ 0 |
| VPS Hetzner (Evolution API) | CX22 | ~R$ 40 |
| Resend (e-mails — Fase 4) | Free (3k/mês) | R$ 0 |
| MercadoPago | % sobre vendas | 0,99–4,99% |
| **Total fixo** | | **~R$ 40/mês** |

---

## Suporte e Próximos Passos

Para implementar as Fases 4 e 5 (checkout, SEO, analytics, conta do cliente):
consulte o arquivo `C:\Users\jefer\.claude\plans\fa-a-uma-an-lise-detalhada-serialized-pie.md`
