/**
 * This template is a production ready boilerplate for developing with `CheerioCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

// For more information, see https://docs.apify.com/sdk/js
import { Actor } from 'apify';
// For more information, see https://crawlee.dev
import { KeyValueStore, PuppeteerCrawler } from 'crawlee';

import dotenv from 'dotenv';
dotenv.config()

// this is ESM project, and as such, it requires you to specify extensions in your relative imports
// read more about this here: https://nodejs.org/docs/latest-v18.x/api/esm.html#mandatory-file-extensions
// note that we need to use `.js` even when inside TS files
import { router } from './routes.js';
import { UnifranceDataExtractor } from './extractor.js';
import { getCurrentDate, subtractYears } from './utils.js';

// Initialize the Apify SDK
await Actor.init();

UnifranceDataExtractor.search_url.searchParams.set('sortieFranceDebut', subtractYears(getCurrentDate(), Number(process.env.YEARS_AGO!)))
const startUrls = [UnifranceDataExtractor.search_url.href];

const crawler = new PuppeteerCrawler({
    requestHandler: router,
    launchContext: {
        launchOptions: {
            executablePath: '/usr/bin/chromium-browser',
            headless: true
        },
    },
});

await KeyValueStore.setValue('movies', [])
await crawler.run(startUrls);

// Exit successfully
await Actor.exit();
