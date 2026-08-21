# NexByte

Site da NexByte — agência web em Portugal. Websites, landing pages,
identidade visual, SEO e Google Business.

**Live app**: https://nexbytee.lovable.app

Construído com [Lovable](https://lovable.dev) sobre TanStack Start (React + Vite).

## Publicação

Esta app tem **renderização no servidor** (SSR) e rotas de servidor (`/mcp`,
`/.well-known/...`). O build não produz uma pasta de ficheiros estáticos: gera
os assets em `dist/` e uma função que renderiza as páginas.

> **Por isso o GitHub Pages não serve este site.** O Pages só entrega
> ficheiros estáticos; sem `index.html` na raiz, mostra o `README.md`
> renderizado. Não é um erro do build — é o host errado para o tipo de app.

### Netlify

Já configurado em `netlify.toml`. Para ligar:

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an
   existing project** → GitHub → escolhe `nexbytee`.
2. Não mexas nas definições de build — o Netlify lê o `netlify.toml`
   (comando `npm run build`, publish `dist`, `NITRO_PRESET=netlify`).
3. **Deploy site**.

A partir daí, cada push para `main` publica automaticamente. A função SSR é
detetada em `.netlify/functions-internal/` e declara `path = "/*"` com
`preferStatic`, por isso os assets são servidos primeiro e o resto vai para o
servidor — não é preciso `_redirects`.

### Lovable

Continua a publicar a partir de `main` em https://nexbytee.lovable.app, sem
configuração. O `NITRO_PRESET` do `netlify.toml` não o afeta: o ambiente de
build do Lovable força sempre o seu próprio alvo.

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
