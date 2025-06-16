# 🚀 Guia de Deploy - Bella Curvas

## Opções de Deploy Gratuitas

### 1. Vercel (Recomendado)

**Vantagens**: Deploy automático, CDN global, SSL gratuito

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. No diretório do projeto
cd moda-plus-size

# 3. Fazer login
vercel login

# 4. Deploy
vercel --prod
```

**Configurações no painel Vercel**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2. Netlify

**Vantagens**: Interface amigável, formulários gratuitos

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. No diretório do projeto
cd moda-plus-size

# 3. Build do projeto
npm run build

# 4. Deploy
netlify deploy --prod --dir=dist
```

**Via Interface Web**:
1. Acesse [netlify.com](https://netlify.com)
2. Conecte seu repositório GitHub
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 3. GitHub Pages

**Vantagens**: Integração com GitHub, gratuito

```bash
# 1. Instalar gh-pages
npm install --save-dev gh-pages

# 2. Adicionar ao package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# 3. Build e deploy
npm run build
npm run deploy
```

### 4. Firebase Hosting

**Vantagens**: Google Cloud, rápido, SSL automático

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar
firebase init hosting

# 4. Build
npm run build

# 5. Deploy
firebase deploy
```

## Deploy via Upload Manual

### Para hospedagens tradicionais (cPanel, etc.)

1. **Build do projeto**:
```bash
npm run build
```

2. **Upload da pasta `dist`**:
   - Compacte a pasta `dist`
   - Faça upload via FTP/cPanel
   - Extraia no diretório público (public_html)

3. **Configuração do servidor**:
   - Configure redirects para SPA
   - Habilite compressão gzip
   - Configure cache headers

## Configurações Importantes

### 1. Variáveis de Ambiente

Crie arquivo `.env` na raiz:
```env
VITE_APP_NAME=Bella Curvas
VITE_API_URL=https://sua-api.com
VITE_ANALYTICS_ID=GA_TRACKING_ID
```

### 2. Configuração SPA

Para roteamento funcionar, configure redirects:

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify** (`_redirects`):
```
/*    /index.html   200
```

### 3. Otimizações de Performance

**Headers de Cache** (`.htaccess`):
```apache
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## Domínio Personalizado

### 1. Configurar DNS

Aponte seu domínio para o serviço:
- **Vercel**: CNAME para `cname.vercel-dns.com`
- **Netlify**: CNAME para `seu-site.netlify.app`
- **GitHub Pages**: CNAME para `username.github.io`

### 2. SSL Automático

Todos os serviços mencionados oferecem SSL gratuito via Let's Encrypt.

## Monitoramento

### 1. Google Analytics

Adicione no `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### 2. Google Search Console

1. Verifique propriedade do site
2. Envie sitemap: `https://seusite.com/sitemap.xml`
3. Monitore indexação

## Backup e Versionamento

### 1. Git Repository

```bash
# Inicializar repositório
git init
git add .
git commit -m "Initial commit"

# Conectar ao GitHub
git remote add origin https://github.com/usuario/bella-curvas.git
git push -u origin main
```

### 2. Backup Automático

Configure backups automáticos no seu provedor de hospedagem.

## Troubleshooting

### Problemas Comuns

1. **Roteamento não funciona**:
   - Configure redirects para SPA
   - Verifique configuração do servidor

2. **Imagens não carregam**:
   - Verifique caminhos relativos
   - Configure CORS se necessário

3. **Build falha**:
   - Verifique versão do Node.js (18+)
   - Limpe cache: `npm ci`

### Logs e Debug

```bash
# Verificar build local
npm run build
npm run preview

# Debug de produção
vercel logs
netlify logs
```

## Checklist de Deploy

- [ ] Build local funciona
- [ ] Todas as páginas carregam
- [ ] Imagens aparecem corretamente
- [ ] Carrinho funciona
- [ ] Site é responsivo
- [ ] SSL configurado
- [ ] Analytics configurado
- [ ] Domínio personalizado (opcional)
- [ ] Backup configurado

---

**Sucesso no seu deploy! 🎉**

