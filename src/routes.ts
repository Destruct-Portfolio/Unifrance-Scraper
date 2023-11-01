import {
    KeyValueStore,
    Dataset,
    RequestQueue,
    createPuppeteerRouter,
} from "crawlee";
import { EnhancedPuppeteerForCrawlee } from "@destruct/puppeteer-wrapper";

import dotenv from "dotenv";
import { UnifranceDataExtractor } from "./extractor.js";
import { FilmInfo } from "./types.js";
dotenv.config();

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ enqueueLinks, log, page, request }) => {
    const page_title = await page.title();
    const page_url = request.loadedUrl;

    log.info(`${page_title}`, { url: page_url });
    const _ = UnifranceDataExtractor;
    const $ = new EnhancedPuppeteerForCrawlee({
        page: page,
        logger: log,
    });

    const page_index =
        UnifranceDataExtractor.search_url.searchParams.get("page");
    if (page_index === "1") {
        log.info("Added all the pages to default queue.");
        const max_pages =
            Number(await $.getText({ selector: _.max_pages })) || 1;
        const all_pages = [...Array(max_pages).keys()]
            .map((i) => i + 1)
            .map((index) => {
                UnifranceDataExtractor.search_url.searchParams.set(
                    "page",
                    index.toString(),
                );
                return UnifranceDataExtractor.search_url.href;
            });

        await enqueueLinks({
            urls: all_pages,
        });
    }

    await enqueueLinks({
        globs: ["https://www.unifrance.org/film/*([0-9])/*"],
        label: "detail",
    });
});

router.addHandler("detail", async ({ request, page, log }) => {
    const _ = UnifranceDataExtractor;

    const page_title = await page.title();
    const page_url = request.loadedUrl;
    log.info(`${page_title}`, { url: page_url });

    const info = await page.evaluate((selectors) => {
        let info: FilmInfo = {
            year:null,
            url: null,
            title: null,
            realization: null,
            genre: null,
            subgenre:  null,
            production: null,
            coproduction: null,
            type: null,
            theme: null,
        };

        info.url = document.location.href;

        info.title = document.querySelector(selectors.title)?.textContent!;
        
        info.production = document.querySelector(selectors.production)
            ?.textContent!;
info.year = document.querySelector('#main-content > div.jumbotron.uni-banner.text-white.bg-black > div.jumbotron-inner > div:nth-child(3) > div > div > div:nth-child(3) > strong') ? document.querySelector('#main-content > div.jumbotron.uni-banner.text-white.bg-black > div.jumbotron-inner > div:nth-child(3) > div > div > div:nth-child(3) > strong')!.textContent : null;
        document.querySelectorAll(selectors.sections).forEach((section) => {
            const title = section
                .querySelector(selectors.section_title)!
                .textContent!.trim();
            if (title === "Mentions techniques") {
                section.querySelectorAll("div > ul > li").forEach((detail) => {
                    if (detail.textContent!.includes("Genre")) {
                        info.genre =
                            detail.querySelector("strong")!.textContent!;
                    }
                    if (detail.textContent!.includes("Sous-genre")) {
                        info.subgenre =
                            detail.querySelector("strong")!.textContent!;
                    }
                    if (detail.textContent!.includes("Type")) {
                        info.type =
                            detail.querySelector("strong")!.textContent!;
                    }
                    if (detail.textContent!.includes("Thèmes")) {
                        info.theme =
                            detail.querySelector("strong")!.textContent!;
                    }
                });
            }
            if (title === "Générique") {
                section
                    .querySelectorAll("div.collapse-wrapper > div ~ div > ul")
                    .forEach((detail) => {
                        if (detail.textContent!.includes("Coproduction")) {
                            info.coproduction =
                                detail.querySelector(
                                    "li > strong",
                                )!.textContent!;
                        }
                    });

                section
                    .querySelectorAll(
                        "div.page-sheet-inner > div.collapse-wrapper > div.collapse > ul > li.card-director",
                    )
                    .forEach((el) => {
                        const realization = el.querySelector(
                            "div.card-director__text.order-2.d-flex > div > h4",
                        )!.textContent!;

                        if (!info.realization) {
                            info.realization = realization;
                        } else {
                            info.realization += ", " + realization;
                        }
                    });
            }
        });
        return info;
    }, _.data_locators);

    console.log(info);
    const content = await KeyValueStore.getValue<Array<typeof info>>("movies");
    await KeyValueStore.setValue("movies", [...content!, info]);

    await Dataset.pushData(info!);
});
