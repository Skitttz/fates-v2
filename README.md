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

Fates é uma vitrine de streetwear feita com Next.js 15 (App Router) para aplicar Clean Architecture no front-end. Catálogo, login e pedidos podem usar a API do projeto ou um mock local, sem backend. Nenhuma compra é real e não há pagamento.

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
| `main`         | Composition root: monta as dependências e entrega para a apresentação. Também guarda decorators.                               | `makeLoadProducts`, `AuthorizeHttpClientDecorator`       |
| `app`          | Rotas do Next. Arquivos finos que só chamam as factories.                                                                      | `app/(store)/products/page.tsx`                                |

Algumas decisões:

- **Server Components injetados.** As páginas de catálogo e produto são Server Components assíncronos que recebem `LoadProducts`/`LoadProductBySlug` da factory. Páginas interativas (carrinho e login) usam factories `'use client'`, porque instâncias de classe não atravessam a fronteira servidor → cliente.
- **Decorator de autorização.** O `RemotePlaceOrder` não sabe nada de token. O `AuthorizeHttpClientDecorator` lê a conta salva e adiciona `Authorization: Bearer <token>` antes de delegar ao `HttpClient` real.
- **Adapters de API.** A API responde no envelope `{ status, data }`, com imagens em caminhos relativos e o pedido usando `clothingId`. O `data` desembrulha, resolve as URLs e traduz os nomes, então o resto da aplicação nunca vê o formato remoto.
- **API com mock.** As factories em `main` selecionam implementações locais dos contratos de domínio quando `NEXT_PUBLIC_DEMO_MODE=true`. Os casos de uso `MockAuthentication`, `MockLoadProducts`, `MockLoadProductBySlug` e `MockPlaceOrder` ficam em `data`, recebem os dados por injeção e retornam modelos e erros do domínio. Os dados de exemplo ficam em `main/mocks`; o cliente HTTP continua exclusivo da integração com a API.

### API

| Método | Rota (`/api/v1`)          | Uso no front                                          |
| ------ | ------------------------- | ----------------------------------------------------- |
| GET    | `/clothings?q=&category=` | Home e catálogo (busca e filtro)                      |
| GET    | `/clothings/:slug`        | Página do produto (404 vira a página "Perdeu o rolê") |
| POST   | `/auth/login`             | Login                                                 |
| POST   | `/orders`                 | Checkout (exige `Authorization: Bearer`)              |

Conta para testar com o mock: **demo@fates.com** / **fates123**

<a id="como-executar"></a>

## 🚀 Como Executar

### Pré-requisitos

- `Node.js` 22.12+
- `npm`

### Rodar com mock (sem backend)

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3001`. O arquivo de exemplo ativa o mock com `NEXT_PUBLIC_DEMO_MODE=true`: catálogo com três produtos e imagens locais, busca, filtros, detalhes, carrinho, login e checkout funcionam sem API ou banco de dados.

Use **demo@fates.com** / **fates123** para entrar. Os pedidos são simulados, recebem um código `FTS-DEMO-...` e não são persistidos. O carrinho e a conta continuam salvos no navegador. O mock implementa os contratos dos casos de uso com dados locais, sem simular rotas HTTP ou realizar autenticação real. As imagens dos produtos são ilustrações incluídas no projeto para os testes.

### Rodar com uma API

Em `.env.local`, configure:

```dotenv
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

Reinicie o servidor após alterar essas variáveis. Sem `NEXT_PUBLIC_DEMO_MODE=true`, a aplicação usa a API configurada; falhas de conexão não ativam o mock automaticamente. Ao alternar entre mock e API, saia da conta e limpe o carrinho, pois as sessões e os produtos são diferentes.

### Build e produção

A escolha entre mock e API é definida no momento do build. Use `NEXT_PUBLIC_DEMO_MODE=true` para rodar com mock ou `false` para conectar à API configurada.

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

Testes E2E com Cypress (com o mock ativo ou uma API compatível e o front em `localhost:3001`):

```bash
npm run build && npm run start
npm run cypress:run -- --browser chrome  # headless, com Google Chrome instalado
npm run cypress:open   # interface
```

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
