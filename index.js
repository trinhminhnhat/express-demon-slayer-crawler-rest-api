const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 3000;

const app = express();

dotenv.config();
app.use(morgan('common'));
app.use(cors());

// body-parser
app.use(
    express.json({
        limit: '50mb',
    }),
);
app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
    }),
);

// routes
app.get('/', (req, res) => {
    return res.status(200).json({
        title: 'Welcome to Demon Slayer API',
        api_links: {
            get_all_characters: `${process.env.HOST_URL}/characters`,
            character_detail: `${process.env.HOST_URL}/characters/:name`,
        },
    });
});

app.get('/characters', (req, res) => {
    try {
        const data = [];
        const limit = Number(req.query.limit);
        const url = process.env.WEB_CRAWL_URL + '/Kimetsu_no_Yaiba_Wiki';

        axios(url)
            .then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);

                $('.wds-tabber .portal').each(function () {
                    const name = $(this).find('a').attr('title');
                    const url = $(this).find('a').attr('href');
                    const image = $(this).find('a > img').attr('data-src');

                    data.push({
                        name,
                        image,
                        detail_url: process.env.HOST_URL + '/character' + url.split('/wiki')[1],
                    });
                });

                if (limit && limit > 0) {
                    data = data.slice(0, limit);
                }

                return res.status(200).json({
                    status: 200,
                    data,
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    status: 500,
                    message: 'API error: ' + err.message,
                });
            });
    } catch (error) {
        return res.status(500).json(error);
    }
});

app.get('/characters/:name', (req, res) => {
    try {
        const data = {};
        const url = `${process.env.WEB_CRAWL_URL}/${req.params.name}`;

        axios(url)
            .then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);
                const infoElement = $('aside.portable-infobox');
                const galleries = [];

                data['name'] = infoElement.find('h2.pi-title').text();
                data['thumbnail'] = infoElement.find('figure.pi-image img').attr('src');

                // get detail of the character
                infoElement.find('section.pi-item').each(function () {
                    const header = $(this).find('h2').text().toLowerCase().replace(' ', '_');
                    const itemInfo = {};

                    $(this)
                        .find('.pi-data')
                        .each(function () {
                            const label = $(this).find('.pi-data-label').text().toLowerCase().replace(' ', '_');
                            const value = $(this).find('.pi-data-value').text();

                            itemInfo[label] = value;
                        });

                    data[header] = itemInfo;
                });

                // get gallery of the character
                $('.wikia-gallery .wikia-gallery-item').each(function () {
                    const image = $(this).find('.image img').attr('data-src');

                    galleries.push(image);
                });

                data['galleries'] = galleries;

                return res.status(200).json({
                    status: 200,
                    data,
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    status: 500,
                    message: 'API error: ' + err.message,
                });
            });
    } catch (error) {
        return res.status(500).json(error);
    }
});

app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Not Found',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running port ${PORT}`);
});
