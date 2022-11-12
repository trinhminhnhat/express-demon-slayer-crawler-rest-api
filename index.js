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

app.get('/', (req, res) => {
    return res.json({
        name: 'app',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running port ${PORT}`);
});
