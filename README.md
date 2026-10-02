<div id="user-content-toc" align="center"><ul align="center" style="list-style: none;"><img width="20%" src="https://i.ibb.co/VMNdP7w/icon.png"><summary></summary></img></ul>
</div>

<div align="center" >
</div>

<p align="center">
  <a href="#visao-geral">Visao Geral</a>&nbsp;&nbsp;&nbsp;┋&nbsp;&nbsp;&nbsp;
  <a href="#arquitetura">Arquitetura</a>&nbsp;&nbsp;&nbsp;┋&nbsp;&nbsp;&nbsp;
  <a href="#como-executar">Como Executar</a>&nbsp;&nbsp;&nbsp;┋&nbsp;&nbsp;&nbsp;
  <a href="#testes">Testes</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

</p>

<div align="center">
</div>

<a id="visao-geral"></a>

## 📝 Visao Geral

Fates é uma vitrine de streetwear feita com Next.js 15 (App Router) para aplicar Clean Architecture no front-end. Catálogo, login e pedidos vêm da [fates-v2-api](https://github.com/Skitttz/fates-v2-api) (Bun + Elysia + Prisma). Nenhuma compra é real: o pedido é registrado, mas não há pagamento.

Funcionalidades:

- Home com hero, fitas de marquee, produtos em destaque, banner do drop e a seção "Pela cidade"
- Catálogo com busca (`?q=`) e filtro por categoria (`?category=`), funcionando sem JavaScript
- Página de produto com galeria, escolha de cor/tamanho/quantidade e adição ao carrinho
- Carrinho persistido no `localStorage`
- Login com JWT da API e validação de formulário
- Checkout autenticado: a API valida os itens, calcula o total e devolve o código do pedido
- Transições entre páginas com a View Transitions API e rolagem suave nas âncoras
- Animações com cara de rua: glitch RGB, grão de filme, ken burns, marquee, stickers, carimbo de pedido e revelação ao rolar. Todas respeitam `prefers-reduced-motion`.

<a id="arquitetura"></a>

## 🧱 Arquitetura

As dependências apontam sempre para dentro, para o `domain`. Regras de `no-restricted-imports` no `.eslintrc.json` impedem que uma camada importe outra que ela não deveria conhecer.

```text
                  ┌──────────────┐
                  │     main     │  composition root: factories e injeção
                  └──────┬───────┘
         ┌───────────────┼────────────────┬──────────────┐
         ▼               ▼                ▼              ▼
  ┌────────────┐  ┌────────────┐  ┌──────────────┐ ┌────────────┐
  │presentation│  │   infra    │  │  validation  │ │    data    │
  └─────┬──────┘  └─────┬──────┘  └──────┬───────┘ └─────┬──────┘
        │               │ implementa     │ implementa    │
        │               ▼ protocols      ▼ Validation    │
        │          (data/protocols) (presentation/protocols)
        │                                                │
        └──────────────────────►  domain  ◄──────────────┘
```

| Camada         | Responsabilidade                                                                                                               | Exemplos                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `domain`       | Modelos, erros e contratos dos casos de uso. Sem framework.                                                                    | `ProductModel`, `LoadProducts`, `PlaceOrder`, `NotFoundError`  |
| `data`         | Implementação dos casos de uso e protocolos (`HttpClient`, `GetStorage`/`SetStorage`). Adapta o formato da API para o domínio. | `RemoteLoadProducts`, `RemoteAuthentication`, `LocalAddToCart` |
| `infra`        | Detalhes técnicos que implementam os protocolos de `data`.                                                                     | `FetchHttpClient`, `LocalStorageAdapter`                       |
| `validation`   | Validadores que implementam o protocolo `Validation` da apresentação.                                                          | `ValidationBuilder.field('email').required().email()`          |
| `presentation` | Componentes, páginas e contextos React. Recebe os casos de uso por props e só conhece as interfaces do `domain`.               | `Store`, `Login`, `CartProvider`                               |
| `main`         | Composition root: monta as dependências e entrega para a apresentação. Também guarda decorators.                               | `makeRemoteLoadProducts`, `AuthorizeHttpClientDecorator`       |
| `app`          | Rotas do Next. Arquivos finos que só chamam as factories.                                                                      | `app/(store)/products/page.tsx`                                |

Algumas decisões:

- **Server Components injetados.** As páginas de catálogo e produto são Server Components assíncronos que recebem `LoadProducts`/`LoadProductBySlug` da factory. Páginas interativas (carrinho e login) usam factories `'use client'`, porque instâncias de classe não atravessam a fronteira servidor → cliente.
- **Decorator de autorização.** O `RemotePlaceOrder` não sabe nada de token. O `AuthorizeHttpClientDecorator` lê a conta salva e adiciona `Authorization: Bearer <token>` antes de delegar ao `HttpClient` real.
- **Adapters de API.** A API responde no envelope `{ status, data }`, com imagens em caminhos relativos e o pedido usando `clothingId`. O `data` desembrulha, resolve as URLs e traduz os nomes, então o resto da aplicação nunca vê o formato remoto.
- **Trocar a fonte de dados** exige mudar só a factory (ou definir `NEXT_PUBLIC_API_URL` para uma API real com o mesmo contrato).

### API

| Método | Rota (`/api/v1`)          | Uso no front                                          |
| ------ | ------------------------- | ----------------------------------------------------- |
| GET    | `/clothings?q=&category=` | Home e catálogo (busca e filtro)                      |
| GET    | `/clothings/:slug`        | Página do produto (404 vira a página "Perdeu o rolê") |
| POST   | `/auth/login`             | Login                                                 |
| POST   | `/orders`                 | Checkout (exige `Authorization: Bearer`)              |

Conta demo criada pelo seed da API: **demo@fates.com** / **fates123**

<a id="como-executar"></a>

## 🚀 Como Executar

### Pré-requisitos

- `Node.js` 22.12+
- `npm`
- A [fates-v2-api](https://github.com/Skitttz/fates-v2-api) rodando (por padrão em `http://localhost:3000`)

### Subindo a API

No repositório da API:

```bash
docker compose up --build
```

Isso sobe o Postgres, aplica as migrations, roda o seed (3 roupas + usuário demo) e inicia a API na porta 3000.

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3001` (a 3000 fica com a API). Para apontar para outra API, defina `NEXT_PUBLIC_API_URL` (veja `.env.example`).

### Build e produção

```bash
npm run build
npm run start
```

### Lint e formatação

```bash
npm run lint
npm run format
```

<a id="testes"></a>

## 🧪 Testes

Testes unitários e de integração com Vitest + Testing Library. Os casos de uso são testados com spies (`HttpClientSpy`, `StorageSpy`) e a apresentação com fakes em memória dos casos de uso.

```bash
npm test               # roda uma vez
npm run test:watch     # modo watch
```

Testes E2E com Cypress (com a API rodando e o front em `localhost:3001`):

```bash
npm run build && npm run start
npm run cypress:run    # headless
npm run cypress:open   # interface
```

## ☁️ Deploy

1. Faça o deploy da API no Render pelo Blueprint (`render.yaml` no repositório da API).
2. Faça o deploy do front (Vercel, por exemplo) com `NEXT_PUBLIC_API_URL=https://<sua-api>.onrender.com/api/v1`.
3. Na API, defina `CORS_ORIGIN` com a URL do front.

`NEXT_PUBLIC_API_URL` também libera o domínio da API no `next/image` (veja `next.config.mjs`), por isso precisa estar definido no momento do build.

## 📁 Estrutura do Projeto

```text
src/
  app/             rotas do Next
  core/            tipos compartilhados
  domain/          models, errors, usecases (contratos)
  data/            usecases (implementações), protocols, models remotos, adapters
  infra/           http (fetch), cache (localStorage)
  validation/      validators + builder
  main/            factories (http, cache, usecases, pages, providers), config, decorators
  presentation/    components, pages, contexts, hooks, helpers, protocols
  styles/          globals.css (tema, glitch, grão)
cypress/           testes E2E
```

Cada componente e página fica numa pasta com `index.tsx`, `types.ts` e, quando houver, `constants.ts`. As páginas seguem o par `index.tsx` (container: dados e estado) + `layout.tsx` (view).

## Segurança

O rate limit é aplicado na [API](https://github.com/Skitttz/fates-v2-api), inclusive para chamadas diretas: login por IP/conta, limite geral e criação de pedidos por usuário. O frontend mostra uma mensagem de espera ao receber HTTP 429. Não há cadastro público na API após a atualização de segurança.

O redirecionamento após login aceita apenas caminhos internos e bloqueia barras invertidas e caracteres de controle. As respostas incluem headers contra interpretação incorreta de conteúdo e incorporação em iframes. Next.js foi atualizado para 15.5.27; `params` e `searchParams` usam o contrato assíncrono dessa versão. As ferramentas de teste e os patches transitivos de PostCSS/brace-expansion também foram atualizados; os overrides podem ser removidos quando as dependências incorporarem esses patches.

Os tokens continuam no localStorage e, portanto, ficam acessíveis a JavaScript da mesma origem. Uma migração para cookies HttpOnly exige mudanças coordenadas na autenticação; a API agora emite tokens com duração de uma hora. A conta demo é pública e não deve guardar dados pessoais. Consulte o README da API para os limites, confiança em proxies e operação com múltiplas instâncias.
