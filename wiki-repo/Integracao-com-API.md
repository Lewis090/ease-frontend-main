# Integracao com API

## Configuracao

Base URL configuravel por VITE_API_BASE.

## Endpoints Utilizados

1. POST /auth/login
2. POST /auth/register
3. GET /usuarios/{id}/receitas
4. GET /usuarios/{id}/despesas

## Regras de Autenticacao

1. Rotas de login e cadastro sao chamadas sem token de autorizacao.
2. Demais rotas usam Authorization: Bearer <token> quando houver token salvo.
