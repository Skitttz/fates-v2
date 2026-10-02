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

Fates é uma vitrine fictícia de streetwear feita com Next.js 14 (App Router) para aplicar Clean Architecture no front-end. Nenhuma compra é real: catálogo, login e pedidos são servidos por uma API mock dentro do próprio projeto.

Funcionalidades:

- Home com hero, fitas de marquee, produtos em destaque, banner do drop e lookbook
- Catálogo com busca (`?q=`) e filtro por categoria (`?category=`), funcionando sem JavaScript
- Página de produto com galeria, escolha de cor/tamanho/quantidade e adição ao carrinho
- Carrinho persistido no `localStorage`
- Login fictício com validação de formulário
- Checkout fictício autenticado (gera um código de pedido)
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
| `app`          | Rotas do Next. Arquivos finos que só chamam as factories, mais a API mock em `app/api`.                                        | `app/(store)/products/page.tsx`                                |

Algumas decisões:

- **Server Components injetados.** As páginas de catálogo e produto são Server Components assíncronos que recebem `LoadProducts`/`LoadProductBySlug` da factory. Páginas interativas (carrinho e login) usam factories `'use client'`, porque instâncias de classe não atravessam a fronteira servidor → cliente.
- **Decorator de autorização.** O `RemotePlaceOrder` não sabe nada de token. O `AuthorizeHttpClientDecorator` lê a conta salva e adiciona o header `x-access-token` antes de delegar ao `HttpClient` real.
- **Adapters de API.** A API devolve `price_in_cents` e `access_token`. O `data` converte isso para `price` e `accessToken`, e o resto da aplicação nunca vê o formato remoto.
- **Trocar a fonte de dados** exige mudar só a factory (ou definir `NEXT_PUBLIC_API_URL` para uma API real com o mesmo contrato).

### API mock

| Método | Rota                  | Descrição                                                |
| ------ | --------------------- | -------------------------------------------------------- |
| GET    | `/api/products`       | Lista produtos. Aceita `?q=` e `?category=`              |
| GET    | `/api/products/:slug` | Detalhe do produto (404 se não existir)                  |
| POST   | `/api/login`          | Autentica `{ email, password }` (401 se inválido)        |
| POST   | `/api/orders`         | Cria pedido. Exige header `x-access-token` (401 sem ele) |

Conta demo: **demo@fates.com** / **fates123**

<a id="como-executar"></a>

## 🚀 Como Executar

### Pré-requisitos

- `Node.js` 18.17+
- `npm`

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`. Variáveis de ambiente são opcionais (veja `.env.example`).

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

Testes E2E com Cypress (com a aplicação rodando em `localhost:3000`):

```bash
npm run build && npm run start
npm run cypress:run    # headless
npm run cypress:open   # interface
```

## 📁 Estrutura do Projeto

```text
src/
  app/             rotas do Next + API mock (app/api)
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
