export class UnifranceDataExtractor {
    public static search_url = new URL(
        "https://www.unifrance.org/recherche/film?sortieFranceDebut=09%2F04%2F2018&sort=pertinence&page=1",
    );
    public static film_locator =
        "#results-data > article:nth-child(1) > div > div.search-article__content > div.search-article__title > h3 > a";

    public static max_pages =
        "#main-content > div.container > div > div.col-lg-8.ps-xl-0 > div.search-results > div.pagination > div > div > div > span:nth-child(2)";

    public static data_locators = {
        title: "#main-content > div.jumbotron.uni-banner.text-white.bg-black > div.jumbotron-inner > div:nth-child(3) > div > h1",
        realization: "#collapse-id-1 > ul > li",
        production: "#collapse-id-3 > ul:nth-child(1) > li > strong > span > a",
        sections:
            "#main-content > div.container.page-sheet > div > div.col-lg-8.ps-xl-0 > div > div > div",
        section_title: "div.title-h2.title-h2--oneIcone > h2 > span.title-text",
        year: "#main-content > div.jumbotron.uni-banner.text-white.bg-black > div.jumbotron-inner > div:nth-child(3) > div > div > div:nth-child(3) > strong",
    };
}
