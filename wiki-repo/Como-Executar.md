# Como Executar

## Configuracao do Ambiente

1. Instalar dependencias com npm install.
2. Criar arquivo .env na raiz do projeto.
3. Definir VITE_API_BASE=http://localhost:8080.

Observacao: existe o arquivo .env.example como referencia.

## Execucao

1. Desenvolvimento: npm run dev
2. Build de producao: npm run build
3. Preview do build: npm run preview
4. Lint: npm run lint

## Solucao de Problemas

### 403 em cadastro ou login

1. Verificar se o backend permite acesso anonimo para /auth/login e /auth/register.
2. Verificar se VITE_API_BASE aponta para a API correta.
3. Verificar se CORS esta liberado para o host do frontend.

### Comportamento estranho apos alteracoes

1. Limpar cache/localStorage do navegador para remover sessao antiga.
2. Reiniciar o frontend com npm run dev.

### PowerShell bloqueando npm.ps1

Usar: npm.cmd run dev
