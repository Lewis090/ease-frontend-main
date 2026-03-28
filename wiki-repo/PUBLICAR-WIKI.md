# Publicar Wiki no GitHub

## Pre-requisito

1. Habilitar Wikis no repositorio: Settings > Features > Wikis.

## Publicacao via Git (Windows PowerShell)

1. No GitHub, copie a URL da Wiki do repositorio.
   Exemplo de formato: https://github.com/ORGANIZACAO/REPOSITORIO.wiki.git

2. Execute os comandos abaixo na raiz do projeto:

- cd wiki-repo
- git init
- git add .
- git commit -m "docs: cria wiki inicial da sprint 1"
- git branch -M master
- git remote add origin URL_DA_WIKI
- git push -u origin master

Observacao:

- Em alguns repositorios, a wiki pode usar outro branch padrao. Se necessario, publique o HEAD local explicitamente para master com: git push -u origin HEAD:master

## Resultado Esperado

1. A pagina Home sera exibida como pagina inicial da Wiki.
2. As paginas Requisitos, Visao-Geral, Tecnologias, Integracao-com-API e Como-Executar ficarao disponiveis no menu lateral.
