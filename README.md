# EASE Frontend

Aplicação web do EASE para autenticação, onboarding e dashboard de apoio ao MEI.

## Visão Geral

Este projeto foi desenvolvido com React e Vite e oferece:

1. Página inicial institucional.
2. Fluxo de login e cadastro.
3. Dashboard com visões de lançamentos, planejamento, documentos e central MEI.
4. Integração com API backend para autenticação e dados financeiros.

## Comece Por Aqui

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE=http://localhost:8080
```

3. Rode em desenvolvimento:

```bash
npm run dev
```

Observação: existe o arquivo `.env.example` como referência.

## Tecnologias Utilizadas

1. React 19
2. Vite 7
3. JavaScript (JSX)
4. ESLint para padrão de código

## Requisitos

1. Node.js 18+
2. npm 9+
3. Backend da API rodando (padrão em http://localhost:8080)

## Como Executar

### Desenvolvimento

```bash
npm run dev
```

### Build de Produção

```bash
npm run build
```

### Preview do Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Scripts Disponíveis

1. `npm run dev`: inicia ambiente de desenvolvimento com HMR.
2. `npm run build`: gera build de produção.
3. `npm run preview`: sobe servidor local para validar build.
4. `npm run lint`: valida padrões de código.

## Estrutura Principal

```text
src/
  main.jsx                 # ponto de entrada da aplicação
  ease-v3-frontend.jsx     # composição principal e roteamento interno por estado
  index.css                # estilos globais complementares
  App.jsx                  # componente padrão do template (referência)
  App.css

  components/              # componentes compartilhados de UI
    AnimatedCard.jsx
    FAQAccordion.jsx
    Footer.jsx
    Logo.jsx
    Nav.jsx
    Toast.jsx
    index.js

  dashboard/               # telas e módulos da área autenticada
    DashboardPage.jsx
    DashOverview.jsx
    DashLancamentos.jsx
    DashDocumentos.jsx
    DashNotificacoes.jsx
    index.js

  pages/                   # páginas públicas e de autenticação
    HomePage.jsx
    AboutPage.jsx
    ContactPage.jsx
    LoginPage.jsx
    SignupPage.jsx
    TermsPage.jsx
    index.js

  hooks/                   # hooks reutilizáveis
    useViewportFlags.js
    index.js

  services/                # integração com API
    api.js
    index.js

  styles/                  # tema e estilos globais da aplicação
    theme.js
    index.js

public/
index.html
vite.config.js
eslint.config.js
```

## Fluxo de Navegação

1. Usuário entra na tela inicial.
2. Pode seguir para login ou cadastro.
3. Ao autenticar/cadastrar com sucesso, o token e dados básicos do usuário são armazenados no `localStorage`.
4. O dashboard busca dados financeiros na API conforme a aba ativa.

## Integração com API

Base URL configurável por `VITE_API_BASE`.

Endpoints utilizados no frontend:

1. `POST /auth/login`
2. `POST /auth/register`
3. `GET /usuarios/{id}/receitas`
4. `GET /usuarios/{id}/despesas`

Importante:

1. Rotas de login e cadastro são chamadas sem token de autorização.
2. Demais rotas usam `Authorization: Bearer <token>` quando houver token salvo.

## Solução de Problemas

### 403 em cadastro ou login

Verifique:

1. Se o backend permite acesso anônimo para `/auth/login` e `/auth/register`.
2. Se o `VITE_API_BASE` aponta para a API correta.
3. Se CORS está liberado para o host do frontend.

### Comportamento estranho após alterações

1. Limpe cache/localStorage do navegador para remover sessão antiga.
2. Reinicie o frontend com `npm run dev`.

### PowerShell bloqueando npm.ps1

Em ambiente Windows/PowerShell, use:

```powershell
npm.cmd run dev
```


