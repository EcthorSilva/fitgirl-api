const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

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

            // Log dos dados buscados
            console.log(`Título: ${title}, Link: ${link}, Link Magnet: ${magnetLink}, Data do Post: ${postDate}`);

            // Incluir posts e adicionar link ao título
            if (title && magnetLink && postDate) {
                results.push({ title, link, magnetLink });
            }
        });

        console.log(`Resultados da página ${pageNumber}:`, results);
        return results;
    } catch (error) {
        console.error('Erro ao buscar dados da página:', error.message);
        return [];
    }
}

// Função para buscar dados do site FitGirl Repacks
async function fetchFitGirlData(searchTerm = '') {
    try {
        let currentPage = 1;
        let found = false;
        let results = [];

        while (!found && currentPage <= 50) { // Limitando a 10 páginas
            console.log(`Procurando na página ${currentPage}...`);
            const response = await axios.get(`https://fitgirl-repacks.site/page/${currentPage}/`);
            const html = response.data;
            const $ = cheerio.load(html);

            // Buscando posts
            $('article').each((index, element) => {
                const title = $(element).find('.entry-title a').text();
                const link = $(element).find('.entry-title a').attr('href');
                const magnetLink = $(element).find('a[href^="magnet:?"]').attr('href');
                const postDate = $(element).find('.entry-date time').attr('datetime');

                // Log dos dados buscados
                console.log(`Título: ${title}, Link: ${link}, Link Magnet: ${magnetLink}, Data do Post: ${postDate}`);

                // Incluir posts e adicionar link ao título
                if (title && magnetLink && postDate) {
                    // Verificar se o título contém o termo de busca (case insensitive)
                    if (title.toLowerCase().includes(searchTerm.toLowerCase())) {
                        results.push({ title, link, magnetLink });
                        found = true; // Resultado encontrado, parar a busca
                    }
                }
            });

            // Ir para a próxima página
            currentPage++;

            // Parar a busca se chegar ao fim dos resultados ou não encontrar correspondência
            if ($('article').length === 0 || found) {
                break;
            }
        }

        console.log(`Resultados da busca pelo termo "${searchTerm}":`, results);
        return results;
    } catch (error) {
        console.error('Erro ao buscar dados:', error.message);
        return [];
    }
}

// Rota para obter dados de uma página específica
app.get('/', async (req, res) => {
    const pageNumber = req.query.p; // Número da página a partir do parâmetro de consulta
    if (pageNumber) {
        const data = await fetchFitGirlPage(pageNumber);
        if (data) {
            res.json(data);
        } else {
            res.status(500).json({ error: 'Falha ao buscar dados' });
        }
    } else {
        const searchTerm = req.query.q; // Termo de busca a partir do parâmetro de consulta
        const data = await fetchFitGirlData(searchTerm);
        if (data) {
            res.json(data);
        } else {
            res.status(500).json({ error: 'Falha ao buscar dados' });
        }
    }
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});