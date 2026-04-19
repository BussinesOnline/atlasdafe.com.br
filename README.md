# Atlas da Fé — atlasdafe.com.br

Landing page de venda direta do **Manual Prático da Bíblia** (R$ 29,90 via Hotmart).  
Site estático hospedado na **Vercel**, com função serverless para captura de leads via **Brevo**.

---

## Estrutura de arquivos

```
/
├── index.html                    # Página principal (landing page)
├── obrigado.html                 # Página pós-compra (noindex)
├── politica-de-privacidade.html  # Política de Privacidade (LGPD)
├── termos-de-uso.html            # Termos de Uso (CDC + LGPD)
├── favicon.png                   # Ícone do site
├── logo.png                      # Logo para Schema.org / Google
├── og-image.jpg                  # Imagem para compartilhamento social (1200x630)
├── robots.txt                    # Diretivas para crawlers
├── sitemap.xml                   # Mapa do site para SEO
├── vercel.json                   # Configuração de deploy, cache e headers
└── api/
    └── subscribe.js              # Serverless function — integração Brevo
```

---

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| HTML/CSS/JS inline | Estrutura e estilo do site |
| Tailwind CSS CDN | Utilitários de CSS |
| GSAP + ScrollTrigger | Animações de scroll |
| Vercel | Hospedagem e serverless functions |
| Brevo (ex-Sendinblue) | Captura e envio de e-mails |
| Hotmart | Pagamento e entrega do produto digital |
| Meta Pixel | Rastreamento e otimização de anúncios |

---

## Variáveis de ambiente (Vercel)

Configure em **Vercel → Settings → Environment Variables**:

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `BREVO_API_KEY` | Chave de API do Brevo para captura de leads | ✅ Sim |

> **Sem essa variável, o popup de captura de leads não funcionará em produção.**

---

## Como funciona a captura de leads

1. O usuário preenche nome + e-mail no popup do site
2. O frontend faz `POST /api/subscribe` com os dados
3. A função serverless (`api/subscribe.js`) recebe os dados e chama a API do Brevo
4. O contato é adicionado à lista **"Sua primeira lista"** (ID: 2) no Brevo
5. O usuário recebe feedback inline (sem `alert()`) e o PDF é aberto automaticamente

---

## Rastreamento de conversões (Meta Pixel)

- **index.html**: dispara `PageView` e `Purchase` **apenas após consentimento de cookies** (LGPD)
- **obrigado.html**: dispara `PageView` + `Purchase` (valor: R$ 29,90, moeda: BRL)

O pixel ID é: `1635893094267391`

> O Meta Pixel é inicializado via função `initMetaPixel()`, chamada somente quando o usuário aceita cookies no banner de consentimento. A escolha é armazenada em `localStorage` com a chave `atlasCookieConsent`.

---

## Páginas legais (LGPD)

| Página | URL | Descrição |
|--------|-----|-----------|
| Política de Privacidade | `/politica-de-privacidade` | LGPD compliant — coleta, uso e direitos dos dados |
| Termos de Uso | `/termos-de-uso` | CDC + LGPD — condições, reembolso, propriedade intelectual |

Ambas estão linkadas no footer do `index.html`.

---

## Deploy

O deploy é automático via Vercel a cada push na branch `main`.

```bash
git add .
git commit -m "descrição das mudanças"
git push origin main
```

Após o push, a Vercel faz o build e publica automaticamente em `atlasdafe.com.br`.

---

## Histórico de correções

### 19/04/2026 — Sessão 1: Bugs críticos

- **Meta Pixel ausente no obrigado.html** — evento `Purchase` adicionado para rastreamento de conversões no Facebook Ads
- **Captura de leads não funcionava** — integrado com Brevo via serverless function; leads agora são salvos de verdade
- **Política de Privacidade e Termos de Uso inexistentes** — páginas criadas em conformidade com LGPD e CDC
- **logo.png referenciado no Schema.org mas arquivo inexistente** — arquivo criado, elimina erro 404 para o Google
- **Links do footer apontavam para `href="#"`** — corrigidos para `/termos-de-uso`, `/politica-de-privacidade` e `/`
- Botão de submit do popup com estado de loading ("Enviando…") e feedback inline (sem `alert()`)
- Validação de e-mail com regex e validação de nome adicionada

### 19/04/2026 — Sessão 3: Performance — Tailwind build local

- **Tailwind CDN removido de todos os HTMLs** — substituído por `styles.css` gerado via Tailwind CLI
- CSS reduzido de ~1MB (CDN de desenvolvimento) para **22KB** (apenas classes usadas, minificado)
- `package.json` criado com script `build` e `dev`
- `tailwind.config.js` criado com cores e fontes customizadas do projeto
- `vercel.json` atualizado: `buildCommand` agora roda `npm run build` de verdade
- `.gitignore` criado para excluir `node_modules/`
- Para desenvolver localmente: `npm run dev` (modo watch)

### 19/04/2026 — Sessão 2: Alta prioridade (acessibilidade, LGPD, JS)

- **Banner de consentimento de cookies** — Meta Pixel só dispara após o usuário aceitar (conformidade LGPD)
- **Bug GSAP/defer** — todo código de animação movido para dentro de `window.addEventListener('load')`; elimina `ReferenceError` em conexões lentas
- **`<main>` semântico** — tag `<main>` adicionada ao documento; `role="main"` removido da `<section>` incorreta
- **`aria-labelledby` quebrado** — `id="diferenciais-title"` adicionado ao `<h2>` da seção de diferenciais
- **Botões sem nome acessível** — `aria-label` adicionado ao hamburguer, fechar menu, fechar popup e link do WhatsApp
- **`aria-expanded` no menu mobile** — atualizado dinamicamente ao abrir/fechar
- **Labels nos inputs do popup** — `<label class="sr-only">` adicionado para leitores de tela
- **`window.pageYOffset` depreciado** — substituído por `window.scrollY`
- **Logo no header** — `href="#"` corrigido para `href="/"`

---

## Melhorias pendentes (próximas sprints)

### Alta prioridade
- [x] ~~Migrar Tailwind CDN para build local~~ — **concluído** (22KB gerado vs ~1MB do CDN)

### Média prioridade
- [ ] Adicionar Schema JSON-LD do tipo `FAQPage` para rich snippets no Google
- [ ] Remover URLs com âncoras (`#sobre`, `#depoimentos`) do sitemap.xml
- [ ] Adicionar `integrity` (SRI) nos scripts externos (GSAP, Tailwind, fontes)
- [ ] Adicionar `Content-Security-Policy` no vercel.json
- [ ] Adicionar `Permissions-Policy` no vercel.json
- [ ] Unificar os números exibidos no site (847, 12.500, +12K — inconsistentes entre si)

### Baixa prioridade
- [ ] Substituir SVG placeholder do produto e do fundador por imagens reais
- [ ] Mover arquivos `.md` de documentação para fora da raiz pública (criar `.vercelignore`)
- [ ] Substituir `window.pageYOffset` por `window.scrollY` (depreciado)
- [ ] Adicionar efeito real quando o countdown de urgência chegar a zero
- [ ] Adicionar controle de pausa na animação marquee (WCAG 2.2.2)
- [ ] Automatizar o copyright para não ficar desatualizado (`new Date().getFullYear()`)

---

## Contato

**E-mail:** contato@atlasdafe.com.br  
**Instagram:** [@atlasdafe](https://www.instagram.com/atlasdafe)  
**TikTok:** [@atlasdafe](https://www.tiktok.com/@atlasdafe)
