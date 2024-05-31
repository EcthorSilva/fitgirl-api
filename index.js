const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Função para buscar dados do site FitGirl Repacks para uma página específica
async function fetchFitGirlPage(pageNumber) {
   try {
      console.log(`Buscando dados da página ${pageNumber}...`);
      const response = await axios.get(`https://fitgirl-repacks.site/page/${pageNumber}/`);
      const html = response.data;
      const $ = cheerio.load(html);

      // Array para armazenar os resultados desta página
      let results = [];

      // Buscando posts
      $('article').each((index, element) => {
         const title = $(element).find('.entry-title a').text();
         const link = $(element).find('.entry-title a').attr('href');
         const magnetLink = $(element).find('a[href^="magnet:?"]').attr('href');
         const postDate = $(element).find('.entry-date time').attr('datetime');

         // Incluir posts e adicionar link ao título se todos os dados estiverem presentes
         if (title && magnetLink && postDate) {
            results.push({ title, link, magnetLink });
         }
      });

      return results; // Retorna os resultados da página
   } catch (error) {
      console.error('Erro ao buscar dados da página:', error.message);
      return []; // Retorna um array vazio em caso de erro
   }
}

// Função para buscar dados do site FitGirl Repacks
async function fetchFitGirlData(searchTerm = '') {
   try {
      const maxPages = 100; // Limite de 100 páginas
      let currentPage = 1;
      let found = false;
      let results = [];

      // Função para buscar uma página e verificar se contém o termo de busca
      async function fetchPageAndSearch(pageNumber) {
         const response = await fetchFitGirlPage(pageNumber);
         for (const post of response) {
            if (post.title.toLowerCase().includes(searchTerm.toLowerCase())) {
               results.push(post);
               found = true;
               break; // Para a busca se encontrar o termo
            }
         }
      }

      const fetchPromises = [];
      // Loop para buscar várias páginas até encontrar o termo ou atingir o limite
      while (currentPage <= maxPages && !found) {
         fetchPromises.push(fetchPageAndSearch(currentPage));
         currentPage++;
      }

      // Espera todas as promessas resolverem, mas para se encontrado
      await Promise.all(fetchPromises);

      return results; // Retorna os resultados da busca
   } catch (error) {
      console.error('Erro ao buscar dados:', error.message);
      return []; // Retorna um array vazio em caso de erro
   }
}

// Rota para obter dados de uma página específica
app.get('/', async (req, res) => {
   const pageNumber = req.query.p; // Número da página a partir do parâmetro de consulta
   if (pageNumber) {
      const data = await fetchFitGirlPage(pageNumber);
      if (data) {
         res.json(data); // Retorna os dados como JSON
      } else {
         res.status(500).json({ error: 'Falha ao buscar dados' }); // Retorna um erro HTTP 500 em caso de falha
      }
   } else {
      const searchTerm = req.query.q; // Termo de busca a partir do parâmetro de consulta
      const data = await fetchFitGirlData(searchTerm);
      if (data) {
         res.json(data); // Retorna os dados como JSON
      } else {
         res.status(500).json({ error: 'Falha ao buscar dados' }); // Retorna um erro HTTP 500 em caso de falha
      }
   }
});

// Iniciando o servidor
app.listen(PORT, () => {
   console.log(`Servidor rodando na porta ${PORT}`); // Indica a porta onde o servidor está rodando
});