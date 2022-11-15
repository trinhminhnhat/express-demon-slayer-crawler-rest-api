# Crawler Rest API - Demon Slayer

Using `cheerio` library to crawl the website `https://kimetsu-no-yaiba.fandom.com/wiki/Kimetsu_no_Yaiba_Wik`

## Website

Link: [**https://demon-slayer-crawler-rest-api.onrender.com**](https://demon-slayer-crawler-rest-api.onrender.com)

## Technologies Used

- Express 4.18.x
- Cheerio 1.0.0-rc.12

## API list

`GET /characters`

```bash
curl -i -H 'Accept: application/json' http://localhost:3000/characters
```

`GET /characters/:name`

```bash
curl -i -H 'Accept: application/json' http://localhost:3000/characters/Tanjiro_Kamado
```

## How to use

```bash
> cd project
> cp .env.example .env
> yarn install
> yarn start
```

## Author

[**Trịnh Minh Nhật**](https://github.com/trinhminhnhat)
