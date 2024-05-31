
# FitGirl Repacks Scraper API

## Descrição
Este projeto é uma aplicação Node.js que utiliza Express, Axios, Cheerio e Moment para buscar e extrair dados do site FitGirl Repacks. O objetivo é permitir a pesquisa de posts específicos e recuperação de informações como título, link, link magnet e data de publicação de jogos compactados.

## Funcionalidades
- Buscar dados de uma página específica: Busca os dados da página informada através de um parâmetro de consulta e retorna uma lista de posts contendo título, link, link magnet e data de publicação.
- Pesquisar por um termo específico: Pesquisa posts que contenham um termo específico no título, retornando os resultados correspondentes. A pesquisa percorre até 50 páginas para encontrar a correspondência.

## Dependências
- **express:** Framework web para Node.js;
- **axios:** Cliente HTTP para realizar requisições;
- **cheerio:** Biblioteca de parsing HTML para extrair informações;
- **moment:** Biblioteca para manipulação de datas.

## Como usar

1. Clone o repositório:

```bash
 git clone https://github.com/yourusername/fitgirl-repacks-scraper.git
```

2. Navegue até o diretório do projeto:
```bash
 cd fitgirl-repacks-scraper

```
3. Instale as dependências:
```bash
 npm install
```
4. Inicie o servidor:
```bash
 node .
```

5. Acesse o servidor no navegador ou postman

- Para buscar dados de uma página específica:

```bash
 http://localhost:3000/?p=NUMERO_DA_PAGINA
```

- Para pesquisar por um termo específico:
```bash
 http://localhost:3000/?q=TERMO_DE_BUSCA
```

## Exemplo de Resposta JSON

```json
[
  {
    "title": "Título do Jogo",
    "link": "https://link_do_post.com",
    "magnetLink": "magnet:?link_do_magnet",
    "postDate": "2024-05-31T00:00:00Z"
  }
]
```

## Observações
A aplicação está configurada para buscar dados de até 50 páginas do site.