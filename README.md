# EASE Frontend

Aplicacao web do EASE para autenticacao, onboarding e dashboard de apoio ao MEI.

## Visao Geral

Este projeto foi desenvolvido em React com Vite e possui:

1. Pagina inicial institucional.
2. Fluxo de login e cadastro.
3. Dashboard com visoes de lancamentos, planejamento, documentos e central MEI.
4. Integracao com API backend para autenticacao e dados financeiros.

## Tecnologias Utilizadas

1. React 19
2. Vite 7
3. JavaScript (JSX)
4. ESLint para padrao de codigo

## Requisitos

1. Node.js 18+
2. npm 9+
3. Backend da API rodando (padrao em http://localhost:8080)

## Configuracao do Ambiente

1. Instale as dependencias:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_API_BASE=http://localhost:8080
```

Observacao: existe o arquivo `.env.example` como referencia.

## Como Executar

### Desenvolvimento

```bash
npm run dev
```

### Build de Producao

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

## Scripts Disponiveis

1. `npm run dev`: inicia ambiente de desenvolvimento com HMR.
2. `npm run build`: gera build de producao.
3. `npm run preview`: sobe servidor local para validar build.
4. `npm run lint`: valida padroes de codigo.

## Estrutura Principal

```text
src/
	main.jsx                 # ponto de entrada da aplicacao
	ease-v3-frontend.jsx     # pagina principal e fluxo de navegacao
	dashboard-module.jsx     # dashboard modular com regras e estados
	App.jsx                  # componente padrao do template (nao utilizado no fluxo principal)
	App.css
	index.css
public/
index.html
vite.config.js
eslint.config.js
```

## Fluxo de Navegacao

1. Usuario entra na tela inicial.
2. Pode seguir para login ou cadastro.
3. Ao autenticar/cadastrar com sucesso, o token e dados basicos do usuario sao armazenados no `localStorage`.
4. Dashboard busca dados financeiros na API conforme a aba ativa.

## Integracao com API

Base URL configuravel por `VITE_API_BASE`.

Endpoints utilizados no frontend:

1. `POST /auth/login`
2. `POST /auth/register`
3. `GET /usuarios/{id}/receitas`
4. `GET /usuarios/{id}/despesas`

Importante:

1. Rotas de login e cadastro sao chamadas sem token de autorizacao.
2. Demais rotas usam `Authorization: Bearer <token>` quando houver token salvo.

## Solucao de Problemas

### 403 em cadastro ou login

Verifique:

1. Se o backend permite acesso anonimo para `/auth/login` e `/auth/register`.
2. Se o `VITE_API_BASE` aponta para a API correta.
3. Se CORS esta liberado para o host do frontend.

### Comportamento estranho apos alteracoes

1. Limpe cache/localStorage do navegador para remover sessao antiga.
2. Reinicie o frontend com `npm run dev`.

### PowerShell bloqueando npm.ps1

Em ambiente Windows/PowerShell, use:

```powershell
npm.cmd run dev
```


