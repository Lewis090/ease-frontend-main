# Requisitos

## Objetivo
Definir os requisitos funcionais (RF) e nao funcionais (RNF) da aplicacao EASE para apoio ao MEI.

## Requisitos Funcionais (RF)

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | O sistema deve permitir cadastro de usuario com dados basicos de autenticacao. | Alta |
| RF02 | O sistema deve permitir login de usuario com credenciais validas. | Alta |
| RF03 | O sistema deve armazenar token e dados basicos da sessao apos autenticacao bem-sucedida. | Alta |
| RF04 | O sistema deve exibir dashboard com visoes de receitas e despesas do usuario autenticado. | Alta |
| RF05 | O sistema deve consultar receitas do usuario por meio do endpoint GET /usuarios/{id}/receitas. | Alta |
| RF06 | O sistema deve consultar despesas do usuario por meio do endpoint GET /usuarios/{id}/despesas. | Alta |
| RF07 | O sistema deve exibir area de planejamento e documentos na interface de dashboard. | Media |
| RF08 | O sistema deve permitir logout e encerramento de sessao do usuario. | Media |

## Requisitos Nao Funcionais (RNF)

| ID | Requisito | Prioridade |
|---|---|---|
| RNF01 | A aplicacao deve ser desenvolvida em React com Vite para execucao em navegadores modernos. | Alta |
| RNF02 | A aplicacao deve ser responsiva para uso em desktop e mobile. | Alta |
| RNF03 | A comunicacao com backend deve usar HTTP/JSON e header Authorization Bearer nas rotas protegidas. | Alta |
| RNF04 | O endpoint base da API deve ser configuravel via variavel de ambiente VITE_API_BASE. | Alta |
| RNF05 | O tempo de carregamento inicial da interface deve ser adequado para uso em redes comuns de banda larga. | Media |
| RNF06 | O codigo deve seguir padrao de qualidade com validacao por ESLint. | Media |
| RNF07 | O sistema deve preservar dados de sessao local para continuidade de uso ate logout ou expiracao. | Media |
| RNF08 | O projeto deve manter documentacao minima de execucao e estrutura no repositorio. | Media |
