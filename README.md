# NexByte

Site da NexByte — agência web em Portugal. Websites, landing pages,
identidade visual, SEO e Google Business.

**Live app**: https://nexbytee.lovable.app

Construído com [Lovable](https://lovable.dev) sobre TanStack Start (React + Vite).

## Publicação

Esta app tem **renderização no servidor** (SSR) e rotas de servidor (`/mcp`,
`/.well-known/...`). O `vite build` produz um Worker em `.output/server`, não
uma pasta de ficheiros estáticos.

> **Por isso o GitHub Pages não serve este site.** O Pages só entrega
> ficheiros estáticos; sem `index.html` na raiz, mostra o `README.md`
> renderizado. Não é um erro do build — é o host errado para o tipo de app.

Destinos que funcionam:

- **Lovable** — publica automaticamente a partir de `main`, sem configuração.
- **Cloudflare Workers** — via `.github/workflows/deploy.yml`, em cada push
  para `main`. O `wrangler.json` é gerado pelo nitro durante o build.

### Configurar o deploy na Cloudflare

Em **Settings → Secrets and variables → Actions**, adiciona:

| Secret                  | Onde obter                                                       |
| ----------------------- | ---------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare → My Profile → API Tokens → _Edit Cloudflare Workers_ |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare → Workers & Pages → barra lateral                     |

Depois, cada push para `main` publica automaticamente. Também podes correr o
workflow à mão em **Actions → Deploy → Run workflow**.

## Desenvolvimento

Precisas de Node.js e npm — [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <url-deste-repositorio>
cd nexbytee
npm i
npm run dev
```

| Comando         | O que faz                         |
| --------------- | --------------------------------- |
| `npm run dev`   | Servidor de desenvolvimento       |
| `npm run build` | Build de produção para `.output/` |
| `npm run lint`  | ESLint + Prettier                 |

## Continuar no Lovable

Continua a desenvolver no [editor Lovable](https://lovable.dev/projects/eee20e53-560f-458a-bd7b-f993433e45b4).
Alterações feitas no Lovable são commitadas neste repositório, e o que
enviares para `main` sincroniza de volta para o Lovable.
