# Visao Geral

Aplicacao web do EASE para autenticacao, onboarding e dashboard de apoio ao MEI.

## Funcionalidades Principais

1. Pagina inicial institucional.
2. Fluxo de login e cadastro.
3. Dashboard com visoes de lancamentos, planejamento, documentos e central MEI.
4. Integracao com API backend para autenticacao e dados financeiros.

## Fluxo de Navegacao

1. Usuario entra na tela inicial.
2. Pode seguir para login ou cadastro.
3. Ao autenticar/cadastrar com sucesso, o token e dados basicos do usuario sao armazenados no localStorage.
4. Dashboard busca dados financeiros na API conforme a aba ativa.
