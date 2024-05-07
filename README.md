# Unifrance Scraper

## Description

The Unifrance Scraper project is designed to extract valuable information about Movies and Tvshows listed [unifrace](https://www.unifrance.org/). This tool aims to automate the process of data collection, providing users with a comprehensive dataset that can be used for various purposes such as market research, competitor analysis, and customer targeting.


## How to install

```shell
    npm install
```

## How to use

Start the scrapper using `npm start`. You can find the results of your scraping session at `./storage/key_value_stores/default/movies.json`.

There is a config file `.env` that you can use to change how many years ago you want the search to be.

Data output can be converted from JSON to csv by using

```shell
    npm run convert
```

![Scraper at work](./.reposorce/unifrance-ezgif.com-video-to-gif-converter.gif)

## Tools

Language: typescript
Technologies: Apify, Puppeteer
Storage system: CSV, JSON
