//
import puppeteer from "puppeteer-extra";
import { Page, Browser, executablePath } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

import { EnhancedPuppeteer } from "@destruct/puppeteer-wrapper";
import { Logger } from "@destruct/logger";

import dotenv from "dotenv";
dotenv.config();

export default class PuppeteerWrapper {
  protected $page: Page | null;
  private _browser: Browser | null;

  constructor() {
    this.$page = null;
    this._browser = null;
  }

  public get page() {
    return this.$page;
  }

  public async setup() {
    this._browser = await puppeteer.launch({
      headless: process.env.HEADLESS! === "true" ? true : false,
      executablePath: process.env.BROWSER_PATH! || executablePath(),
    });

    this.$page = await this._browser!.newPage();
    if (this.$page)
      await this.$page.setViewport({
        height: 1200,
        width: 1500,
      });
  }

  public async cleanup() {
    if (this.$page && this._browser) {
      await this.$page.close();
      this.$page = null;
      await this._browser.close();
      this._browser = null;
    }
  }

  public async restart() {
    await this.cleanup();
    await this.setup();
  }
}

export class UnifranceDataExtractor {
  private static search_url = new URL(
    "https://www.unifrance.org/recherche/film?sortieFranceDebut=09%2F04%2F2018&sort=pertinence&page=1",
  );

  private static film_locator =
    "#results-data > article:nth-child(1) > div > div.search-article__content > div.search-article__like-link > span";

  private static listing_locator = "#results-data > article";

  private static data_locators = {
    title:
      "#main-content > div.jumbotron.uni-banner.text-white.bg-black > div.jumbotron-inner > div:nth-child(3) > div > h1",
    realization: "",
    production: "#collapse-id-3 > ul:nth-child(1) > li > strong > span > a", // query all
    coproduction: "#collapse-id-3 > ul:nth-child(2) > li > strong > span > a",
    genre:
      "#main-content > div.container.page-sheet > div > div.col-lg-8.ps-xl-0 > div > div > div:nth-child(5) > div.page-sheet-inner > div > ul > li:nth-child(2) > strong",
    subgenre:
      "#main-content > div.container.page-sheet > div > div.col-lg-8.ps-xl-0 > div > div > div:nth-child(5) > div.page-sheet-inner > div > ul > li:nth-child(3) > strong",
    theme: "",
  };

  private static handle = new PuppeteerWrapper();
  private static logger = new Logger(UnifranceDataExtractor.name, "main");

  public static async launch() {
    const _ = UnifranceDataExtractor;
    await _.handle.setup();
    const $ = new EnhancedPuppeteer({ page: _.handle.page!, logger: _.logger });
    await $.navigate(_.search_url.href);
    await $.click({ selector: _.film_locator });
    const title = await $.getText({ selector: _.data_locators.title });
    const genre = await $.getText({ selector: _.data_locators.production });

    $.logger.info(`${title} | ${genre}`);
    await $.page.goBack();

    //await  _.handle.cleanup();
  }
}
