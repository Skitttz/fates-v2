<div id="user-content-toc" align="center"><ul align="center" style="list-style: none;"><img width="20%" src="https://i.ibb.co/VMNdP7w/icon.png"><summary></summary></img></ul>
</div>

<div align="center" >
</div>

<p align="center">
  <a href="#visao-geral">Visao Geral</a>&nbsp;&nbsp;&nbsp;┋&nbsp;&nbsp;&nbsp;
  <a href="#como-executar">Como Executar</a>&nbsp;&nbsp;&nbsp;┋&nbsp;&nbsp;&nbsp;
  <a href="#demonstracao">Demonstração</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

</p>

<div align="center">
</div>

<a id="visao-geral"></a>

## 📝 Visao Geral

Fates e um showcase de roupas desenvolvido com Next.js 14, com foco em performance, escalabilidade e organização por camadas.

O projeto segue uma estrutura inspirada em Clean Architecture, separando responsabilidades entre:

- `domain`: regras de negocio, modelos e casos de uso
- `data`: implementação dos casos de uso e contratos de acesso a dados
- `infra`: detalhes de infraestrutura (HTTP client)
- `main`: composição de factories e injeção de dependencies
- `presentation`: componentes, layouts, hooks e paginas

Objetivos principais:

- Apresentar produtos com interface moderna e responsiva
- Manter código desacoplado e fácil de evoluir
- Permitir crescimento para integração com API real

<a id="como-executar"></a>

## 🚀 Como Executar

### Pre-requisitos

- `Node.js` 18+
- `npm`

### Instalação

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000` no navegador.

### Build e execução em produção

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

### Cypress (E2E)

```bash
npm run cypress:open
```

## 📁 Estrutura do Projeto

```text
src/
  app/
  core/
  data/
  domain/
  infra/
  main/
  presentation/
  styles/
```

<a id="demonstracao"></a>

## 🚪🚶 Demonstração

[Acessar demo](https://test.com.br)
